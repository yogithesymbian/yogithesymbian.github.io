<?php
declare(strict_types=1);

/*
 * Creates the only directory allowed to be deployed.
 * The artifact is intentionally allowlisted; repository root is never published.
 */
const ROOT = __DIR__ . '/..';
const DIST = ROOT . '/dist';

function fail(string $message): void {
    fwrite(STDERR, "Build failed: {$message}\n");
    exit(1);
}

function remove_tree(string $path): void {
    $realRoot = realpath(ROOT);
    $parent = realpath(dirname($path));
    if ($realRoot === false || $parent !== $realRoot || basename($path) !== 'dist') fail('Refusing to clean an unexpected path.');
    if (!is_dir($path)) return;
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($iterator as $item) $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    rmdir($path);
}

function copy_file_allowlisted(string $relative): void {
    $source = ROOT . '/' . $relative;
    $target = DIST . '/' . $relative;
    if (!is_file($source)) fail("Missing allowlisted file: {$relative}");
    if (!is_dir(dirname($target)) && !mkdir(dirname($target), 0775, true)) fail("Cannot create directory for {$relative}");
    if (!copy($source, $target)) fail("Cannot copy {$relative}");
}

function copy_directory_allowlisted(string $relative): void {
    $source = ROOT . '/' . $relative;
    if (!is_dir($source)) fail("Missing allowlisted directory: {$relative}");
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source, FilesystemIterator::SKIP_DOTS));
    foreach ($iterator as $item) {
        if (!$item->isFile()) continue;
        $child = substr($item->getPathname(), strlen(ROOT) + 1);
        copy_file_allowlisted($child);
    }
}

remove_tree(DIST);
if (!mkdir(DIST, 0775, true)) fail('Cannot create dist directory.');

$publicFiles = [
    'index.html',
    'CNAME',
    'google3e9b2a3f55bcbcc6.html',
    'robots.txt',
    'sitemap.xml',
    '.well-known/security.txt',
    'rendercv_output/Yogi_Arif_Widodo_CV.pdf',
    'assets/frontenddevelopervsfrontendengineer.webp',
    'assets/favicon.svg',
    'assets/yogiarifwidodo-photo-red-cinematic-cutout.webp',
    'assets/certifications/alibaba-cloud.webp',
    'assets/certifications/dicoding.webp',
    'assets/certifications/oracle-academy.webp',
    'assets/certifications/udemy.webp',
    'assets/client_p/astra.webp',
    'assets/client_p/digitalent.webp',
    'assets/client_p/pfsoft.webp',
    'assets/client_p/ptimt.webp',
    'assets/client_p/ptsal.webp',
    'assets/client_p/ptsama.webp',
    'assets/client_p/restuibuhospitalbpn.webp',
    'assets/client_p/scodeid.svg',
    'assets/client_p/partner/polnes.webp',
    'assets/client_p/partner/unmul.webp',
    'assets/client_p/partner/untag.webp',
    'assets/favorite_projects/belanja-malang.jpg',
    'assets/favorite_projects/bi-ngetrol.jpg',
    'assets/favorite_projects/casual-chase.jpg',
    'assets/favorite_projects/flutter-leave-management.jpg',
    'assets/favorite_projects/iot-project.webp',
    'assets/favorite_projects/iot-yogi-solder.webm',
    'assets/favorite_projects/japan-enterprise-platform.jpg',
    'assets/favorite_projects/kulsummarssy.jpg',
    'assets/favorite_projects/realtime-chat-belanja-malang.jpg',
    'assets/favorite_projects/river-jetty-monitoring.jpg',
    'assets/favorite_projects/sal-poster.webp',
    'assets/favorite_projects/sal.webm',
    'assets/favorite_projects/scodeid-attendance.jpg',
    'assets/favorite_projects/security-qr-verification.jpg',
    'assets/favorite_projects/skripsi-management.jpg',
    'assets/favorite_projects/yo-parkir.webp',
    'assets/favorite_projects/yocatetin.com.showcase-3.webp',
];
$publicDirectories = [
    'assets/blog',
    'assets/css',
    'assets/js',
    'writing',
];
foreach ($publicFiles as $file) copy_file_allowlisted($file);
foreach ($publicDirectories as $directory) copy_directory_allowlisted($directory);
file_put_contents(DIST . '/.nojekyll', "");

/* Hash non-executable inline JSON-LD blocks so the CSP remains strict. */
$hashes = [];
$htmlFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(DIST, FilesystemIterator::SKIP_DOTS));
foreach ($htmlFiles as $file) {
    if (!$file->isFile() || strtolower($file->getExtension()) !== 'html') continue;
    $html = (string) file_get_contents($file->getPathname());
    if (preg_match_all('/<script\b[^>]*>(.*?)<\/script>/si', $html, $matches)) {
        foreach ($matches[1] as $script) {
            if (trim($script) !== '') $hashes[base64_encode(hash('sha256', $script, true))] = true;
        }
    }
}
$hashSources = implode(' ', array_map(function ($hash) { return "'sha256-{$hash}'"; }, array_keys($hashes)));
$scriptPolicy = "script-src 'self' https://gc.zgo.at" . ($hashSources ? " {$hashSources}" : '');
$basePolicy = "default-src 'self'; {$scriptPolicy}; style-src 'self'; img-src 'self' data: https://yogithesymbian.goatcounter.com; media-src 'self'; font-src 'self'; connect-src 'self' https://yogithesymbian.goatcounter.com; object-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests";
$headerPolicy = $basePolicy . "; frame-ancestors 'none'";

/* Meta CSP is a GitHub Pages fallback; the edge header remains authoritative. */
$htmlFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(DIST, FilesystemIterator::SKIP_DOTS));
foreach ($htmlFiles as $file) {
    if (!$file->isFile() || strtolower($file->getExtension()) !== 'html') continue;
    $path = $file->getPathname();
    $html = (string) file_get_contents($path);
    $meta = '  <meta http-equiv="Content-Security-Policy" content="' . htmlspecialchars($basePolicy, ENT_QUOTES) . '">' . "\n";
    $html = preg_replace('/<head>\s*/', "<head>\n{$meta}", $html, 1);
    file_put_contents($path, $html);
}

$headers = "/*\n";
$headers .= "  Content-Security-Policy: {$headerPolicy}\n";
$headers .= "  Strict-Transport-Security: max-age=31536000\n";
$headers .= "  X-Content-Type-Options: nosniff\n";
$headers .= "  X-Frame-Options: DENY\n";
$headers .= "  Referrer-Policy: strict-origin-when-cross-origin\n";
$headers .= "  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()\n";
file_put_contents(DIST . '/_headers', $headers);

/* Fail closed if a forbidden artifact or obvious secret pattern appears. */
$forbiddenName = '/(^|\/)(\.git|\.github|\.kiro|content|scripts)(\/|$)|Zone\.Identifier|Yogi_Arif_Widodo_Complete_Certifications|\.(env|pem|key|p12|pfx)$/i';
$secretPatterns = [
    '/-----BEGIN [A-Z ]*PRIVATE KEY-----/',
    '/\bghp_[A-Za-z0-9]{30,}\b/',
    '/\bgithub_pat_[A-Za-z0-9_]{30,}\b/',
    '/\bAKIA[0-9A-Z]{16}\b/',
];
$artifactFiles = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(DIST, FilesystemIterator::SKIP_DOTS));
$count = 0; $bytes = 0;
foreach ($artifactFiles as $file) {
    if (!$file->isFile()) continue;
    $relative = substr($file->getPathname(), strlen(DIST) + 1);
    if (preg_match($forbiddenName, $relative)) fail("Forbidden artifact path: {$relative}");
    $count++; $bytes += $file->getSize();
    if ($file->getSize() > 5 * 1024 * 1024) continue;
    $contents = (string) file_get_contents($file->getPathname());
    foreach ($secretPatterns as $pattern) if (preg_match($pattern, $contents)) fail("Potential secret in {$relative}");
}

echo "Built secure public artifact: {$count} files, {$bytes} bytes.\n";
