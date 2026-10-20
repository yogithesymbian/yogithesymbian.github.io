# Portfolio UI Enhancement Spec

Status: implemented; browser visual QA and Lighthouse measurement pending
Tanggal: 20 Oktober 2026

## 1. Tujuan

Meningkatkan portfolio menjadi lebih ekspresif dan modern tanpa menghilangkan karakter minimal, profesional, cepat, dan content-first yang sudah ada.

Kombinasi arah UI:

1. Editorial minimalism
2. Expressive motion
3. Featured project carousel for Selected Work
4. Seamless view transitions
5. Accessible motion and contrast
6. Selective liquid-glass accent

## 2. Kondisi Saat Ini

- Stack tetap static HTML, CSS, dan vanilla JavaScript.
- Identitas visual saat ini: paper white, dark green, muted green, garis tipis.
- Layout utama `760px` membuat tiga kartu project terasa sempit pada desktop.
- Konten utama sudah kuat: intro, availability, selected work, highlights, skills, background, dan project showcase.
- Showcase berbentuk native `<dialog>` drawer dan sudah memiliki tab keyboard-friendly.
- Dukungan `prefers-reduced-motion` sudah tersedia dan wajib dipertahankan.

## 3. Arah Visual

### 3.1 Editorial Minimalism — prioritas utama

- Gunakan headline hero yang lebih dominan dengan ukuran responsif `clamp()` dan line-height rapat.
- Lebarkan canvas desktop ke kisaran `1120–1200px`; teks panjang tetap dibatasi sekitar `60–70ch`.
- Pertahankan palet hijau saat ini sebagai identitas; tambahkan maksimal satu warna aksen hangat.
- Gunakan whitespace besar, divider tipis, dan hierarchy tipografi yang jelas.
- Gunakan variable font lokal atau self-hosted bila aset tersedia; fallback system font wajib ada.

### 3.2 Selected Work — Featured Project Carousel

Referensi visual: gambar yang diberikan pemilik portfolio pada percakapan ini. Ambil pola komposisi dan interaksinya saja; tetap gunakan identitas warna, tipografi, serta konten portfolio Yogi.

- Ganti **hanya bagian Selected Work** dari bento grid saat ini menjadi carousel horizontal.
- Tampilkan satu project aktif sebagai fokus utama dalam frame besar bergaya jendela browser: permukaan putih, sudut membulat, tiga titik kecil di kiri atas, dan bingkai luar gelap dengan aksen warna halus.
- Project sebelum/sesudahnya terlihat sebagian di tepi viewport sebagai petunjuk bahwa carousel dapat digeser. Preview tetangga lebih redup, tetapi judul dan tombolnya tetap terbaca saat menjadi aktif.
- Dalam frame: media project di atas; kategori, judul, deskripsi singkat, kontribusi/hasil, dan satu CTA di bawah. Gunakan konten dan aset project yang sudah ada; jangan mengarang hasil baru.
- Tampilkan navigasi di bawah: tombol sebelumnya/berikutnya dan indikator posisi. Status aktif harus jelas tanpa bergantung pada warna saja.
- Tombol `View all projects` tetap membuka showcase yang sudah ada. Carousel hanya untuk project pilihan, bukan seluruh arsip.
- Tidak ada autoplay, looping paksa, parallax, video autoplay, atau efek blur berat pada setiap slide.
- Interaksi: tombol, keyboard, touch swipe, dan trackpad/horizontal scroll. Klik CTA project tidak boleh menggeser slide.
- Gunakan native horizontal scrolling dengan CSS `scroll-snap` dan vanilla JavaScript kecil untuk sinkronisasi tombol serta indikator. Jangan tambah library carousel.
- Saat navigasi lewat tombol, perpindahan terasa halus dan berhenti tepat pada slide; pengguna masih dapat scroll manual secara natural.

### 3.3 Capabilities — Editorial Index

Ubah **hanya section Capabilities**. Arah visualnya editorial dan tegas, agar berbeda dari carousel Selected Work dan strip angka di atasnya.

- Ganti headline `Across the stack, from idea to operation.` dengan **`Build. Modernize. Keep it running.`**. Tiga frasa ini mewakili pekerjaan Yogi dari produk sampai operasi; tonjolkan `Modernize.` dengan warna hijau aksen.
- Desktop: komposisi dua kolom sekitar `40/60`. Kiri berisi eyebrow `Capabilities`, headline besar bertumpuk tiga baris, dan satu kalimat positioning singkat. Kanan berisi empat baris capability tanpa kartu putih.
- Setiap baris memiliki nomor kecil, nama capability yang jelas, deskripsi satu kalimat, dan contoh nyata sebagai metadata sekunder:
  1. `Product engineering` — web/mobile products; contoh `YoCatetin`.
  2. `System modernization` — legacy to web; contoh `Japan enterprise platform`.
  3. `Cloud & infrastructure` — deployment and operations; contoh `Maritime operations` bila kontribusinya memang relevan, atau tanpa nama project jika belum dapat diverifikasi.
  4. `Applied AI` — AI in product workflows; contoh `YoClipper`.
- Pemisah antarbaris memakai garis tipis. Nomor, judul, dan contoh punya hierarki berbeda; jangan pakai empat panel dengan ukuran dan bobot visual seragam.
- Teknologi (`Node.js`, `TypeScript`, dan lain-lain) tetap ada, tetapi dipindah menjadi satu baris metadata kecil di bagian bawah; jangan menjadi fokus utama.
- Gunakan latar hijau tua **hanya jika** kontras teks dan kesinambungan dengan section lain tetap baik. Opsi dasar yang direkomendasikan: latar paper saat ini, judul dark ink, satu aksen hijau, garis pemisah.
- Tidak perlu accordion, hover reveal, ikon dekoratif, atau animasi masuk. Jika ada hover, cukup perubahan warna/garis ringan dan jangan menyembunyikan informasi.
- Mobile: satu kolom; headline di atas, empat baris di bawah, semua teks terlihat tanpa interaksi.

Contoh copy arah visual (final copy boleh dirapikan saat implementasi):

> Build. Modernize. Keep it running.
>
> I connect product thinking, engineering, and operations to make software useful over time.

Alasan desain: tipografi display memberi fokus pada pesan utama; konten berurutan yang harus dibaca satu per satu lebih cocok sebagai daftar daripada kumpulan kartu. Acuan: [Material Design 3 typography](https://m3.material.io/styles/typography/applying-type) dan [USWDS card guidance](https://designsystem.digital.gov/components/card/).

### 3.4 Expressive Motion

- Motion hanya untuk memberi hierarchy dan feedback, bukan dekorasi terus-menerus.
- Hero: staggered reveal ringan saat halaman masuk.
- Selected Work: pergeseran horizontal pendek melalui native scroll; perubahan fokus/opacity antar slide secukupnya.
- Drawer showcase: spring-like entrance yang singkat dan terasa natural.
- Durasi target: interaction `140–220ms`; entrance `300–500ms`.
- Animasi hanya pada `transform`, `opacity`, atau properti compositor-friendly.

### 3.5 Seamless View Transitions

- Terapkan View Transition API secara progressive enhancement untuk membuka/menutup showcase dan perpindahan visual project ke detail.
- UI harus tetap berfungsi penuh jika browser tidak mendukung View Transition API.
- Hindari routing/framework baru hanya untuk efek transisi.

### 3.6 Selective Liquid Glass

- Glass hanya digunakan pada floating navigation/action bar atau controls di atas media.
- Styling target: translucent surface, blur ringan, border putih transparan, shadow lembut, dan radius capsule.
- Jangan gunakan glass pada body, seluruh card, atau area teks panjang.
- Sediakan fallback opaque dengan kontras yang setara ketika `backdrop-filter` tidak tersedia.

### 3.7 Accessibility as Visual Quality

- Target WCAG 2.2 AA.
- Semua interaction harus dapat dipakai dengan keyboard dan memiliki `:focus-visible` yang jelas.
- Text contrast minimal `4.5:1`; UI component/focus indicator minimal `3:1`.
- Target interaktif minimum `24×24px`, dengan target utama idealnya `44×44px`.
- Pada `prefers-reduced-motion: reduce`, hapus pergerakan dan gunakan perubahan opacity instan/ringan.
- Dialog wajib mempertahankan focus management, Escape-to-close, label, dan focus return.
- Hover enhancement wajib memiliki padanan focus/touch.

## 4. Struktur Halaman yang Diusulkan

1. Floating utility navigation: Work, About, Writing, Contact.
2. Hero editorial: nama, positioning, proof singkat, CTA utama, availability.
3. Selected Work featured carousel: 3–5 project terbaik, satu project aktif dan preview slide tetangga.
4. Impact strip: angka/proof seperti 9+ years, 10+ products, 5 countries, team 2→11.
5. Capabilities editorial index: headline kuat di kiri dan empat baris keahlian dengan contoh kerja di kanan.
6. Selected writing: aktifkan kembali maksimal tiga artikel terbaru/terkuat.
7. Background dan compact footer CTA.
8. Full project archive tetap menggunakan showcase dialog yang ditingkatkan.

## 5. Content Rules

- Prioritaskan outcome dan kontribusi, bukan daftar teknologi.
- Format ringkas project: `Context → Contribution → Outcome`.
- Tampilkan stack sebagai metadata sekunder.
- Jangan membuat klaim angka baru tanpa bukti dari konten/CV yang tersedia.
- Maksimal satu CTA primer per section.
- Bahasa utama tetap English agar konsisten dengan portfolio saat ini.

## 6. Design Tokens Awal

```css
:root {
  --canvas: #f8faf7;
  --surface: #ffffff;
  --ink: #14211c;
  --muted: #607068;
  --accent: #28745d;
  --accent-soft: #e7f1ec;
  --warm: #d97745;
  --line: #dce5df;
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --shadow-float: 0 18px 60px rgb(20 35 29 / 12%);
  --content-max: 1160px;
  --reading-max: 68ch;
}
```

Nilai final boleh disesuaikan saat visual QA, tetapi rasio kontras wajib tetap lolos.

## 7. Responsive Behaviour

- Mobile-first; tidak ada horizontal overflow pada viewport `320px`.
- `< 600px`: Selected Work menampilkan satu slide hampir selebar viewport dengan sedikit preview slide berikutnya; kontrol tetap terlihat dan dapat disentuh.
- `600–899px`: satu slide aktif yang lebih lebar, dengan preview tetangga lebih jelas.
- `≥ 900px`: frame utama dominan dan sebagian slide tetangga terlihat seperti referensi; hero tetap editorial.
- Media menggunakan `aspect-ratio`, `object-fit`, ukuran eksplisit, lazy loading, dan format yang sudah dioptimalkan.

## 8. Performance Constraints

- Tidak menambah framework UI atau animation library kecuali ada kebutuhan yang terukur.
- Carousel Selected Work memakai CSS `scroll-snap`, `transform`/`opacity` seperlunya, dan JavaScript tanpa dependency; hindari blur/filter animasi, shadow besar yang bergerak, dan cloning slide.
- Gambar slide pertama diberi prioritas muat; gambar slide lain `loading="lazy"`. Video tetap `preload="metadata"` atau `none` dan tidak otomatis diputar.
- Pertahankan progressive enhancement dan native browser APIs.
- Hindari autoplay video dan background animation berat.
- Font maksimal dua family dan sesedikit mungkin weight file.
- Target Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Tidak boleh ada layout shift yang terlihat dari image, video, atau font loading.

## 9. Acceptance Criteria

- Visual baru tetap dikenali sebagai portfolio Yogi, bukan template generik.
- Selected Work mengikuti komposisi referensi: satu frame project aktif dominan, slide tetangga terlihat sebagian, dan kontrol sebelumnya/berikutnya plus indikator posisi di bawah.
- Capabilities tampil sebagai editorial index; headline dan contoh kerja nyata lebih menonjol daripada daftar teknologi. Tidak ada informasi yang bergantung pada hover.
- Tombol, swipe, trackpad, dan keyboard mengubah slide tanpa tersendat; posisi tombol/indikator selalu sesuai slide yang terlihat setelah scroll manual.
- Pada slide pertama/terakhir, tombol yang tidak bisa dipakai berstatus disabled dan carousel tidak memaksa loop.
- Pada `prefers-reduced-motion: reduce`, perpindahan slide berlangsung tanpa smooth scrolling atau animasi posisi.
- Slide nonaktif tidak menahan fokus keyboard pada CTA yang tidak terlihat; CTA slide aktif tetap mudah dicapai.
- Semua CTA, tabs, dialog, dan links dapat digunakan dengan keyboard.
- Reduced-motion mode tidak mengandung transform movement yang non-esensial.
- View transitions dan glass memiliki fallback yang layak.
- Layout lolos pengecekan pada `320px`, `768px`, `1024px`, dan `1440px`.
- Tidak ada regresi pada Writing pages, SEO metadata, analytics, download CV, atau project data.
- Tidak ada dependency runtime baru tanpa persetujuan.

## 10. Out of Scope

- Migrasi ke React, Next.js, atau framework lain.
- CMS baru.
- Penulisan ulang seluruh isi portfolio.
- Branding/logo baru.
- 3D/WebGL, custom cursor, atau parallax berat.
- Publikasi/deployment sebelum hasil implementasi disetujui.

## 11. Sumber Acuan

- [Material Design 3 — expressive typography, shapes, and motion](https://m3.material.io/get-started)
- [Material Design 3 — motion physics](https://m3.material.io/styles/motion/overview/how-it-works)
- [Apple Human Interface Guidelines — Materials and Liquid Glass](https://developer.apple.com/design/human-interface-guidelines/materials)
- [web.dev — View Transitions baseline availability](https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available)
- [MDN — CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [W3C — WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- [W3C — prefers-reduced-motion technique](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html)

## 12. Implementation Notes

- Editorial hero, Selected Work carousel, impact strip, Capabilities editorial index, floating navigation, dan selected writing sudah diterapkan.
- View Transition API digunakan sebagai progressive enhancement pada showcase dan pergantian tab. Transisi project ke halaman detail belum relevan karena portfolio saat ini belum memiliki halaman detail project.
- Target Lighthouse dan visual QA pada browser nyata masih perlu diukur di lingkungan dengan browser tersedia.
