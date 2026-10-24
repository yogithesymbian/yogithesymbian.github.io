<?php
declare(strict_types=1);

/* Build plain static HTML from Markdown/MDX in /content. */
const ROOT = __DIR__ . '/..';
const CONTENT = ROOT . '/content';
const OUTPUT = ROOT . '/writing';
const SITE_URL = 'https://yogiarifwidodo.my.id';

function escape_html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function front_matter(string $source): array {
    if (!preg_match('/\A---\R(.*?)\R---\R?(.*)\z/s', $source, $match)) return [[], $source];
    $metadata = [];
    foreach (preg_split('/\R/', $match[1]) as $line) {
        if (preg_match('/^([A-Za-z][A-Za-z0-9_-]*):\s*["\']?(.*?)["\']?\s*$/', $line, $pair)) $metadata[$pair[1]] = $pair[2];
    }
    return [$metadata, $match[2]];
}

function inline_markdown(string $text): string {
    $text = escape_html($text);
    $text = preg_replace_callback('/!\[([^]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/', function ($m) {
        $src = $m[2];
        if (substr($src, 0, 14) === './attachments/') return '<span class="missing-media">Attachment not published</span>';
        if (substr($src, 0, 6) === '/blog/') $src = '../assets/blog/' . substr($src, 6);
        elseif (substr($src, 0, 1) === '/') $src = '../assets' . $src;
        return '<img src="' . escape_html($src) . '" alt="' . $m[1] . '" loading="lazy" decoding="async">';
    }, $text);
    $text = preg_replace_callback('/(?<!!)\[([^]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/', function ($m) {
        $url = $m[2];
        $external = substr($url, 0, 4) === 'http';
        if (substr($url, 0, 1) === '/') $url = '..' . $url;
        return '<a href="' . escape_html($url) . '"' . ($external ? ' rel="noopener noreferrer"' : '') . '>' . $m[1] . '</a>';
    }, $text);
    $text = preg_replace('/`([^`]+)`/', '<code>$1</code>', $text);
    $text = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $text);
    return preg_replace('/(?<!\*)\*([^*]+)\*(?!\*)/', '<em>$1</em>', $text);
}

function table_html(array $lines): string {
    $rows = array_map(function ($line) { return array_map('trim', explode('|', trim($line, '|'))); }, $lines);
    if (count($rows) < 2) return '';
    $html = '<div class="table-wrap"><table><thead><tr>';
    foreach ($rows[0] as $cell) $html .= '<th>' . inline_markdown($cell) . '</th>';
    $html .= '</tr></thead><tbody>';
    foreach (array_slice($rows, 2) as $row) {
        $html .= '<tr>';
        foreach ($row as $cell) $html .= '<td>' . inline_markdown($cell) . '</td>';
        $html .= '</tr>';
    }
    return $html . '</tbody></table></div>';
}

function markdown_html(string $markdown): string {
    $lines = preg_split('/\R/', str_replace("\r\n", "\n", $markdown));
    $html = ''; $paragraph = []; $list = []; $table = []; $code = []; $codeLanguage = ''; $inCode = false;
    $flushParagraph = function () use (&$html, &$paragraph): void {
        if ($paragraph) { $html .= '<p>' . inline_markdown(implode("\n", $paragraph)) . '</p>'; $paragraph = []; }
    };
    $flushList = function () use (&$html, &$list): void {
        if ($list) { $html .= '<ul>'; foreach ($list as $item) $html .= '<li>' . inline_markdown($item) . '</li>'; $html .= '</ul>'; $list = []; }
    };
    $flushTable = function () use (&$html, &$table): void { if ($table) { $html .= table_html($table); $table = []; } };

    foreach ($lines as $line) {
        if (preg_match('/^```([^\s]*)\s*$/', $line, $match)) {
            $flushParagraph(); $flushList(); $flushTable();
            if ($inCode) {
                $class = $codeLanguage ? ' class="language-' . escape_html($codeLanguage) . '"' : '';
                $html .= '<pre><code' . $class . '>' . escape_html(implode("\n", $code)) . '</code></pre>';
                $code = []; $inCode = false; $codeLanguage = '';
            } else { $inCode = true; $codeLanguage = $match[1]; }
            continue;
        }
        if ($inCode) { $code[] = $line; continue; }
        if (preg_match('/^\s*\|.*\|\s*$/', $line)) { $flushParagraph(); $flushList(); $table[] = $line; continue; }
        $flushTable();
        if (trim($line) === '') { $flushParagraph(); $flushList(); continue; }
        if (preg_match('/^(#{1,6})\s+(.+)$/', $line, $match)) {
            $flushParagraph(); $flushList(); $level = max(2, strlen($match[1]));
            $html .= '<h' . $level . '>' . inline_markdown($match[2]) . '</h' . $level . '>'; continue;
        }
        if (preg_match('/^\s*(---+|\*\*\*+)\s*$/', $line)) { $flushParagraph(); $flushList(); $html .= '<hr>'; continue; }
        if (preg_match('/^\s*[-*+]\s+(.+)$/', $line, $match)) { $flushParagraph(); $list[] = $match[1]; continue; }
        if (preg_match('/^>\s?(.*)$/', $line, $match)) { $flushParagraph(); $flushList(); $html .= '<blockquote><p>' . inline_markdown($match[1]) . '</p></blockquote>'; continue; }
        $paragraph[] = $line;
    }
    if ($inCode) $html .= '<pre><code>' . escape_html(implode("\n", $code)) . '</code></pre>';
    $flushParagraph(); $flushList(); $flushTable();
    return $html;
}

function article_topic(string $title): string {
    $title = strtolower($title);
    if (strpos($title, 'hypercomputer') !== false || strpos($title, ' ai ') !== false) return 'AI systems';
    if (strpos($title, 'flutter') !== false || strpos($title, 'android') !== false) return 'Mobile engineering';
    if (strpos($title, 'security') !== false || strpos($title, 'firewall') !== false || strpos($title, 'ssl') !== false) return 'Security & infrastructure';
    if (strpos($title, 'cloud') !== false || strpos($title, 'server') !== false || strpos($title, 'database') !== false) return 'Infrastructure';
    if (strpos($title, 'zsh') !== false || strpos($title, 'jira') !== false) return 'Tooling';
    if (strpos($title, 'contract') !== false || strpos($title, 'imposter') !== false || strpos($title, 'project manager') !== false) return 'Work & leadership';
    return 'Engineering';
}

function page_shell(string $title, string $description, string $body, string $canonical, string $lang = 'en'): string {
    return '<!DOCTYPE html>' . "\n" . '<html lang="' . escape_html($lang) . '">' . "\n" . '<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#050505">
  <meta name="description" content="' . escape_html($description) . '">
  <link rel="canonical" href="' . escape_html($canonical) . '">
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/site.css?v=20261025-remake-1">
  <script data-goatcounter="https://yogithesymbian.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
  <title>' . escape_html($title) . ' | Yogi Arif Widodo</title>
</head>
<body class="blog-body">
  <a class="skip-link" href="#article-content">Skip to content</a>
  <header class="blog-masthead">
    <a class="site-mark" href="../" aria-label="YA/W — Yogi Arif Widodo, homepage">YA<span aria-hidden="true">/</span>W</a>
    <span>Engineering notes</span>
    <a class="back-link" href="../#writing">← Portfolio</a>
  </header>
  <main class="blog-page" id="article-content">
' . $body . '
  </main>
</body>
</html>
';
}

if (!is_dir(CONTENT)) { fwrite(STDERR, "Missing content directory.\n"); exit(1); }
if (!is_dir(OUTPUT)) mkdir(OUTPUT, 0775, true);
array_map('unlink', glob(OUTPUT . '/*.html') ?: []);

$posts = [];
foreach (array_merge(glob(CONTENT . '/*.mdx'), glob(CONTENT . '/*.md')) as $file) {
    list($metadata, $markdown) = front_matter((string) file_get_contents($file));
    $fallbackTitle = pathinfo($file, PATHINFO_FILENAME);
    if (preg_match('/^#\s+(.+)$/m', $markdown, $heading)) $fallbackTitle = preg_replace('/[*`_]/', '', $heading[1]);
    $posts[] = [
        'slug' => pathinfo($file, PATHINFO_FILENAME),
        'title' => $metadata['title'] ?? $fallbackTitle,
        'date' => $metadata['publishedAt'] ?? '',
        'summary' => $metadata['summary'] ?? '',
        'lang' => $metadata['lang'] ?? 'en',
        'html' => markdown_html($markdown),
    ];
}
usort($posts, function ($a, $b) { return strcmp($b['date'], $a['date']); });

foreach ($posts as $post) {
    $dateLabel = $post['date'] ? '<time datetime="' . escape_html($post['date']) . '">' . escape_html(date('F j, Y', strtotime($post['date']))) . '</time>' : '<span>Undated</span>';
    $summary = $post['summary'] ? '<p class="post-summary">' . escape_html($post['summary']) . '</p>' : '<p class="post-summary">An engineering note from Yogi Arif Widodo.</p>';
    $topic = article_topic($post['title']);
    $body = '    <article class="article-shell">
      <header class="post-header">
        <div><p class="eyebrow">' . escape_html($topic) . ' / ' . $dateLabel . '</p><h1>' . escape_html($post['title']) . '</h1></div>
        ' . $summary . '
      </header>
      <div class="post-content">' . $post['html'] . '</div>
      <footer class="post-footer"><a href="index.html">← All writing</a><a href="../#contact">Start a conversation ↗</a></footer>
    </article>';
    file_put_contents(OUTPUT . '/' . $post['slug'] . '.html', page_shell($post['title'], $post['summary'], $body, SITE_URL . '/writing/' . $post['slug'] . '.html', $post['lang']));
}

$items = '';
foreach ($posts as $post) {
    $date = $post['date'] ? '<time datetime="' . escape_html($post['date']) . '">' . escape_html(date('d M Y', strtotime($post['date']))) . '</time>' : '<span class="article-topic">Undated</span>';
    $summary = $post['summary'] ? '<p>' . escape_html($post['summary']) . '</p>' : '<p>An engineering note from Yogi Arif Widodo.</p>';
    $items .= '      <article class="writing-item">
        <div><span class="article-topic">' . escape_html(article_topic($post['title'])) . '</span><br>' . $date . '</div>
        <h2><a href="' . escape_html($post['slug']) . '.html">' . escape_html($post['title']) . '</a></h2>
        ' . $summary . '
      </article>
';
}
$indexBody = '    <header class="writing-header">
      <p class="eyebrow">Notes from the work / ' . count($posts) . ' entries</p>
      <h1>Writing<span>.</span></h1>
      <p class="intro">Technical notes, engineering reflections, and practical lessons from building software.</p>
    </header>
    <section class="writing-list writing-index" aria-label="Article archive">
' . $items . '    </section>';
file_put_contents(OUTPUT . '/index.html', page_shell('Writing', 'Technical notes, engineering reflections, and practical lessons from building software.', $indexBody, SITE_URL . '/writing/'));

$sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
$sitemap .= '  <url><loc>' . SITE_URL . "/</loc></url>\n";
$sitemap .= '  <url><loc>' . SITE_URL . "/writing/</loc></url>\n";
foreach ($posts as $post) $sitemap .= '  <url><loc>' . SITE_URL . '/writing/' . escape_html($post['slug']) . '.html</loc></url>' . "\n";
$sitemap .= "</urlset>\n";
file_put_contents(ROOT . '/sitemap.xml', $sitemap);

echo 'Built ' . count($posts) . " static articles.\n";
