<?php
declare(strict_types=1);

const ROOT = __DIR__ . '/..';
const PUBLIC_ROOT = ROOT . '/dist';
$errors = [];
$checkedLinks = 0;

function report_error(string $message): void {
    global $errors;
    $errors[] = $message;
}

function resolve_public_path(string $htmlFile, string $reference): string {
    $path = parse_url($reference, PHP_URL_PATH) ?? '';
    if ($path === '' || $path === '/') return PUBLIC_ROOT . '/index.html';
    if ($path[0] === '/') $candidate = PUBLIC_ROOT . $path;
    else $candidate = dirname($htmlFile) . '/' . $path;
    $parts = [];
    foreach (explode('/', str_replace('\\', '/', $candidate)) as $part) {
        if ($part === '' || $part === '.') continue;
        if ($part === '..') array_pop($parts); else $parts[] = $part;
    }
    $normalized = '/' . implode('/', $parts);
    if (is_dir($normalized)) return rtrim($normalized, '/') . '/index.html';
    return $normalized;
}

if (!is_dir(PUBLIC_ROOT)) {
    fwrite(STDERR, "Missing dist directory. Run build-public.php first.\n");
    exit(1);
}

$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(PUBLIC_ROOT, FilesystemIterator::SKIP_DOTS));
foreach ($iterator as $file) {
    if (!$file->isFile() || strtolower($file->getExtension()) !== 'html') continue;
    $path = $file->getPathname();
    $relative = substr($path, strlen(PUBLIC_ROOT) + 1);
    $document = new DOMDocument();
    libxml_use_internal_errors(true);
    $document->loadHTML((string) file_get_contents($path), LIBXML_NOWARNING | LIBXML_NOERROR);
    libxml_clear_errors();

    $h1Count = $document->getElementsByTagName('h1')->length;
    if ($relative !== 'google3e9b2a3f55bcbcc6.html' && $h1Count !== 1) report_error("{$relative}: expected one h1, found {$h1Count}");

    $ids = [];
    foreach ($document->getElementsByTagName('*') as $node) {
        if ($node->hasAttribute('id')) {
            $id = $node->getAttribute('id');
            if (isset($ids[$id])) report_error("{$relative}: duplicate id #{$id}");
            $ids[$id] = true;
        }
        if ($node->hasAttribute('style')) report_error("{$relative}: inline style is not allowed");
        foreach ($node->attributes ?? [] as $attribute) {
            if (strpos(strtolower($attribute->name), 'on') === 0) report_error("{$relative}: inline event handler {$attribute->name}");
        }
    }

    foreach ($document->getElementsByTagName('img') as $image) {
        if (!$image->hasAttribute('alt')) report_error("{$relative}: image missing alt attribute");
    }

    foreach ($document->getElementsByTagName('a') as $anchor) {
        $href = trim($anchor->getAttribute('href'));
        if ($href === '') report_error("{$relative}: anchor missing href");
        if ($anchor->getAttribute('target') === '_blank') {
            $rel = preg_split('/\s+/', strtolower($anchor->getAttribute('rel')));
            if (!in_array('noopener', $rel, true) || !in_array('noreferrer', $rel, true)) report_error("{$relative}: _blank link missing noopener noreferrer: {$href}");
        }
    }

    foreach ([['a', 'href'], ['link', 'href'], ['script', 'src'], ['img', 'src'], ['source', 'src'], ['video', 'poster']] as $lookup) {
        list($tag, $attribute) = $lookup;
        foreach ($document->getElementsByTagName($tag) as $node) {
            if (!$node->hasAttribute($attribute)) continue;
            $reference = trim($node->getAttribute($attribute));
            if ($reference === '' || $reference[0] === '#' || preg_match('/^(https?:|mailto:|tel:|data:)/i', $reference)) continue;
            $checkedLinks++;
            $target = resolve_public_path($path, $reference);
            if (!is_file($target)) report_error("{$relative}: missing {$attribute} target {$reference}");
        }
    }
}

foreach (['robots.txt', 'sitemap.xml', '.well-known/security.txt', '_headers'] as $required) {
    if (!is_file(PUBLIC_ROOT . '/' . $required)) report_error("Missing required public file: {$required}");
}

$headers = (string) file_get_contents(PUBLIC_ROOT . '/_headers');
if (strpos($headers, "frame-ancestors 'none'") === false) report_error('CSP is missing frame-ancestors protection.');
if (strpos($headers, "'unsafe-inline'") !== false || strpos($headers, "'unsafe-eval'") !== false) report_error('CSP contains an unsafe script directive.');
if (strpos($headers, 'X-Content-Type-Options: nosniff') === false) report_error('Missing nosniff header.');
if (strpos($headers, 'Permissions-Policy:') === false) report_error('Missing Permissions-Policy header.');

$indexHtml = (string) file_get_contents(PUBLIC_ROOT . '/index.html');
if (preg_match_all('/<script\b[^>]*>(.*?)<\/script>/si', $indexHtml, $inlineScripts)) {
    foreach ($inlineScripts[1] as $script) {
        if (trim($script) === '') continue;
        $hash = "sha256-" . base64_encode(hash('sha256', $script, true));
        if (strpos($headers, $hash) === false) report_error("Inline script hash is absent from CSP: {$hash}");
    }
}

$robots = (string) file_get_contents(PUBLIC_ROOT . '/robots.txt');
if (strpos($robots, 'User-agent: Google-Extended') === false || strpos($robots, "Google-Extended\nDisallow: /") === false) report_error('Google-Extended opt-out is missing.');
if (is_file(PUBLIC_ROOT . '/llms.txt')) report_error('Strict AI-minimization policy forbids public llms.txt.');

$securityText = (string) file_get_contents(PUBLIC_ROOT . '/.well-known/security.txt');
if (!preg_match('/^Expires:\s*(.+)$/mi', $securityText, $expiry) || strtotime(trim($expiry[1])) < strtotime('+30 days')) report_error('security.txt expiry is missing or too close.');

if ($errors) {
    foreach ($errors as $error) fwrite(STDERR, "- {$error}\n");
    fwrite(STDERR, count($errors) . " site checks failed.\n");
    exit(1);
}

echo "Site checks passed: {$checkedLinks} local references verified.\n";
