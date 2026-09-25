<?php
declare(strict_types=1);

/*
 * Builds plain static HTML from the Markdown/MDX source in /content.
 * PHP is used only while building; the published site needs no server-side code.
 */

const ROOT = __DIR__ . '/..';
const CONTENT = ROOT . '/content';
const OUTPUT = ROOT . '/writing';

function escape_html(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function front_matter(string $source): array {
    if (!preg_match('/\A---\R(.*?)\R---\R?(.*)\z/s', $source, $match)) {
        return [[], $source];
    }
    $metadata = [];
    foreach (preg_split('/\R/', $match[1]) as $line) {
        if (preg_match('/^([A-Za-z][A-Za-z0-9_-]*):\s*["\']?(.*?)["\']?\s*$/', $line, $pair)) {
            $metadata[$pair[1]] = $pair[2];
        }
    }
    return [$metadata, $match[2]];
}

function inline_markdown(string $text): string {
    $text = escape_html($text);
    $text = preg_replace_callback('/!\[([^]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/', function ($m) {
        $src = $m[2];
        if (substr($src, 0, 14) === './attachments/') {
            return '<span class="missing-media">Attachment not published</span>';
        }
        if (substr($src, 0, 6) === '/blog/') {
            $src = '../assets/blog/' . substr($src, 6);
        } elseif (substr($src, 0, 1) === '/') {
            $src = '../assets' . $src;
        }
        return '<img src="' . escape_html($src) . '" alt="' . $m[1] . '" loading="lazy" decoding="async">';
    }, $text);
    $text = preg_replace_callback('/(?<!!)\[([^]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/', function ($m) {
        $url = $m[2];
        $external = substr($url, 0, 4) === 'http';
        if (substr($url, 0, 1) === '/') $url = '..' . $url;
        return '<a href="' . escape_html($url) . '"' . ($external ? ' rel="noopener"' : '') . '>' . $m[1] . '</a>';
    }, $text);
    $text = preg_replace('/`([^`]+)`/', '<code>$1</code>', $text);
    $text = preg_replace('/\*\*([^*]+)\*\*/', '<strong>$1</strong>', $text);
    $text = preg_replace('/(?<!\*)\*([^*]+)\*(?!\*)/', '<em>$1</em>', $text);
    return $text;
}

function table_html(array $lines): string {
    $rows = array_map(function ($line) {
        return array_map('trim', explode('|', trim($line, '|')));
    }, $lines);
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
    $html = '';
    $paragraph = [];
    $list = [];
    $table = [];
    $code = [];
    $code_language = '';
    $in_code = false;
    $flush_paragraph = function () use (&$html, &$paragraph): void {
        if ($paragraph) {
            $html .= '<p>' . inline_markdown(implode("\n", $paragraph)) . '</p>';
            $paragraph = [];
        }
    };
    $flush_list = function () use (&$html, &$list): void {
        if ($list) {
            $html .= '<ul>';
            foreach ($list as $item) $html .= '<li>' . inline_markdown($item) . '</li>';
            $html .= '</ul>';
            $list = [];
        }
    };
    $flush_table = function () use (&$html, &$table): void {
        if ($table) { $html .= table_html($table); $table = []; }
    };

    foreach ($lines as $line) {
        if (preg_match('/^```([^\s]*)\s*$/', $line, $match)) {
            $flush_paragraph(); $flush_list(); $flush_table();
            if ($in_code) {
                $class = $code_language ? ' class="language-' . escape_html($code_language) . '"' : '';
                $html .= '<pre><code' . $class . '>' . escape_html(implode("\n", $code)) . '</code></pre>';
                $code = []; $in_code = false; $code_language = '';
            } else {
                $in_code = true; $code_language = $match[1];
            }
            continue;
        }
        if ($in_code) { $code[] = $line; continue; }
        if (preg_match('/^\s*\|.*\|\s*$/', $line)) { $flush_paragraph(); $flush_list(); $table[] = $line; continue; }
        $flush_table();
        if (trim($line) === '') { $flush_paragraph(); $flush_list(); continue; }
        if (preg_match('/^(#{1,6})\s+(.+)$/', $line, $match)) {
            $flush_paragraph(); $flush_list();
            $level = strlen($match[1]);
            $html .= '<h' . $level . '>' . inline_markdown($match[2]) . '</h' . $level . '>';
            continue;
        }
        if (preg_match('/^\s*(---+|\*\*\*+)\s*$/', $line)) { $flush_paragraph(); $flush_list(); $html .= '<hr>'; continue; }
        if (preg_match('/^\s*[-*+]\s+(.+)$/', $line, $match)) { $flush_paragraph(); $list[] = $match[1]; continue; }
        if (preg_match('/^>\s?(.*)$/', $line, $match)) { $flush_paragraph(); $flush_list(); $html .= '<blockquote><p>' . inline_markdown($match[1]) . '</p></blockquote>'; continue; }
        $paragraph[] = $line;
    }
    if ($in_code) $html .= '<pre><code>' . escape_html(implode("\n", $code)) . '</code></pre>';
    $flush_paragraph(); $flush_list(); $flush_table();
    return $html;
}

function page_shell(string $title, string $description, string $body, string $canonical): string {
    return str_replace('\\n', "\n", '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <meta name="description" content="' . escape_html($description) . '">\n  <link rel="canonical" href="' . escape_html($canonical) . '">\n  <link rel="stylesheet" href="../assets/css/site.css">\n  <title>' . escape_html($title) . ' | Yogi Arif Widodo</title>\n</head>\n<body>\n  <main class="blog-page">\n' . $body . '\n  </main>\n</body>\n</html>\n');
}

if (!is_dir(CONTENT)) { fwrite(STDERR, "Missing content directory.\n"); exit(1); }
if (!is_dir(OUTPUT)) mkdir(OUTPUT, 0775, true);
array_map('unlink', glob(OUTPUT . '/*.html') ?: []);

$posts = [];
foreach (array_merge(glob(CONTENT . '/*.mdx'), glob(CONTENT . '/*.md')) as $file) {
    [$metadata, $markdown] = front_matter((string) file_get_contents($file));
    $fallback_title = pathinfo($file, PATHINFO_FILENAME);
    if (preg_match('/^#\s+(.+)$/m', $markdown, $heading)) $fallback_title = preg_replace('/[*`_]/', '', $heading[1]);
    $posts[] = [
        'slug' => pathinfo($file, PATHINFO_FILENAME),
        'title' => $metadata['title'] ?? $fallback_title,
        'date' => $metadata['publishedAt'] ?? '',
        'summary' => $metadata['summary'] ?? '',
        'html' => markdown_html($markdown),
    ];
}
usort($posts, fn ($a, $b) => strcmp($b['date'], $a['date']));

foreach ($posts as $post) {
    $date_label = $post['date'] ? ' · <time datetime="' . escape_html($post['date']) . '">' . escape_html(date('F j, Y', strtotime($post['date']))) . '</time>' : '';
    $summary = $post['summary'] ? '<p class="post-summary">' . escape_html($post['summary']) . '</p>\n      ' : '';
    $body = '    <a class="back-link" href="../#writing">← Home</a>\n    <article class="post">\n      <p class="eyebrow">Writing' . $date_label . '</p>\n      <h1>' . escape_html($post['title']) . '</h1>\n      ' . $summary . '<div class="post-content">' . $post['html'] . '</div>\n    </article>';
    file_put_contents(OUTPUT . '/' . $post['slug'] . '.html', page_shell($post['title'], $post['summary'], $body, 'https://yogithesymbian.github.io/writing/' . $post['slug'] . '.html'));
}

$items = '';
foreach ($posts as $post) {
    $date = $post['date'] ? '<time datetime="' . escape_html($post['date']) . '">' . escape_html(date('F j, Y', strtotime($post['date']))) . '</time>\n        ' : '';
    $summary = $post['summary'] ? '<p>' . escape_html($post['summary']) . '</p>\n        ' : '';
    $items .= '      <article class="writing-item">\n        ' . $date . '<h2><a href="' . escape_html($post['slug']) . '.html">' . escape_html($post['title']) . '</a></h2>\n        ' . $summary . '</article>\n';
}
$index_body = '    <a class="back-link" href="../">← Home</a>\n    <header class="writing-header">\n      <p class="eyebrow">Notes from the work</p>\n      <h1>Writing</h1>\n      <p class="intro">Technical notes, engineering reflections, and practical lessons from building software.</p>\n    </header>\n    <section class="writing-list writing-index">\n' . $items . '    </section>';
file_put_contents(OUTPUT . '/index.html', page_shell('Writing', 'Technical notes, engineering reflections, and practical lessons from building software.', $index_body, 'https://yogithesymbian.github.io/writing/'));

$sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
$sitemap .= "  <url><loc>https://yogithesymbian.github.io/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n";
$sitemap .= "  <url><loc>https://yogithesymbian.github.io/writing/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n";
foreach ($posts as $post) {
    $sitemap .= '  <url><loc>https://yogithesymbian.github.io/writing/' . escape_html($post['slug']) . '.html</loc>';
    if ($post['date']) $sitemap .= '<lastmod>' . escape_html($post['date']) . '</lastmod>';
    $sitemap .= '<changefreq>monthly</changefreq><priority>0.6</priority></url>' . "\n";
}
$sitemap .= "</urlset>\n";
file_put_contents(ROOT . '/sitemap.xml', $sitemap);

echo 'Built ' . count($posts) . " static articles.\n";
