# Portfolio UI Enhancement Spec

Status: portfolio UI, compact hero identity stamp, and repo-side SEO implemented; browser visual QA, Search Console setup, deployment, and live verification pending
Tanggal: 22 Oktober 2026

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
- Canvas desktop sekitar `1160px`; hero kini memakai bidang dark forest green dengan nama dominan dan hierarki CTA yang jelas.
- Konten utama sudah kuat: intro, availability, selected work, highlights, skills, background, dan project showcase.
- Showcase berbentuk native `<dialog>` drawer dan sudah memiliki tab keyboard-friendly.
- Dukungan `prefers-reduced-motion` sudah tersedia dan wajib dipertahankan.

## 3. Arah Visual

### 3.1 Hero — Editorial Statement

Ubah **hanya area hero**, dari eyebrow `Software Engineer · Balikpapan, Indonesia` sampai kumpulan CTA/profil. Navigasi mengambang, Selected Work, dan section lain tetap di luar cakupan perubahan ini.

- Jadikan hero satu bidang **dark forest green** dengan teks terang, kontras kuat, dan aksen hijau terang atau warm orange yang dipakai hemat. Bidang dapat melebar ke tepi viewport; isi tetap sejajar dengan canvas utama `1120–1200px`.
- Nama `Yogi Arif Widodo` tetap menjadi satu-satunya `<h1>` dan elemen terbesar. Pada desktop pecah secara visual menjadi dua baris (`Yogi Arif` / `Widodo`); pada mobile biarkan membungkus alami tanpa memotong nama.
- Di atas nama, eyebrow kecil berisi peran dan lokasi. Di samping/di bawah nama, tampilkan satu kalimat positioning yang lebih spesifik. Hindari dua headline besar yang saling bersaing.
- Copy yang disarankan:

  > I build products people use and systems teams can rely on.

  Deskripsi pendukung maksimal dua kalimat: `From web and mobile products to legacy modernization and cloud operations, I work across the stack with teams in Indonesia and abroad.` Klaim `9+ years` tetap boleh muncul sebagai metadata kecil, tetapi jangan mengulang impact strip di section berikutnya.
- Desktop: komposisi editorial asimetris. Nama dominan di kiri (sekitar 60–65%); positioning, deskripsi, dan CTA membentuk kolom kanan/bawah. Mobile: satu kolom dengan urutan eyebrow → nama → positioning → deskripsi → CTA → availability.
- Hierarki aksi: **Explore selected work** (`#work`) sebagai CTA primer; **Book a call** sebagai CTA sekunder. `Download CV` sebagai tautan utilitas. Email, GitHub, dan LinkedIn masuk ke baris profil kecil berlabel jelas. `Writing` cukup di navigasi atas; tombol `View projects & clients` tetap tersedia dekat Selected Work/showcase, tidak perlu di hero.
- Availability dipadatkan menjadi satu baris/badge yang mudah dipindai, misalnya `Open to engineering and technical leadership opportunities`. Detail peran dapat ditempatkan pada CV atau kontak.
- Tidak perlu foto stok, ilustrasi 3D, video latar, parallax, custom cursor, atau animasi teks per huruf. Foto asli Yogi boleh menjadi aksen identitas sesuai spesifikasi cutout di bawah; karakter utama tetap datang dari skala tipografi, bidang warna, whitespace, dan garis editorial tipis.
- Entrance motion, jika dipakai, hanya opacity/translate pendek pada kelompok konten; durasi sekitar `300–450ms` dan dimatikan pada `prefers-reduced-motion: reduce`.
- Semua teks, link, dan tombol harus tetap terbaca pada kondisi tanpa efek/animasi. CTA minimum `44px` tinggi, fokus keyboard jelas, dan kontras teks sesuai WCAG 2.2 AA.

Acuan hierarki: [Material Design 3 typography](https://m3.material.io/styles/typography/applying-type) untuk display type dan [USWDS button guidance](https://designsystem.digital.gov/components/button/) untuk satu aksi utama yang mudah dikenali.

### 3.1A Hero Portrait — Compact Identity Stamp (revisi)

Gunakan foto asli `assets/profile-yogiarifwidodo-rounded-12.png` (800×1200) sebagai sumber dan cutout transparan yang sudah tersedia. Arah finalnya **typography-first hero dengan compact identity stamp**. Layout hero sebelum penambahan foto adalah fondasi yang harus dipulihkan; portrait hanya menjadi tanda tangan visual kecil, bukan kolom konten, background besar, atau focal point kedua.

- Buat cutout subjek yang rapi: hapus latar pucat dan bentuk rounded-corner lama hingga transparan; pertahankan wajah, tekstur rambut, bahu, kedua lengan/tangan, dan tepi pakaian. Bersihkan halo terang di rambut/jaket tanpa menghaluskan wajah berlebihan, mengubah ekspresi, atau mengganti pakaian. Periksa hasil di atas latar dark forest green hero pada ukuran 100% dan 200%.
- Simpan hasil master transparan sebagai **`assets/yogiarifwidodo-photo.png`**; jangan sekadar mengganti nama PNG lama karena latarnya masih ada. Pertahankan sumber asli sampai cutout baru lolos review. Jika PNG transparan terlalu besar untuk hero, buat turunan WebP transparan untuk `srcset`/delivery, tetapi nama master PNG tetap sesuai permintaan.
- Pulihkan komposisi hero desktop awal: `.hero-main` kembali menjadi dua kolom sekitar `3fr / 2fr`; nama besar berada di kiri, sedangkan positioning, deskripsi, CTA, dan availability berada di kanan. Portrait **tidak ikut menjadi grid column** dan tidak boleh mengubah ukuran nama, jarak copy, atau tinggi hero secara material.
- Desktop `≥900px`: portrait menjadi cutout editorial sekunder di layer belakang nama, dengan sisi bawah tepat berhenti **di atas garis pemisah profil** dan digeser di antara kolom nama/copy. Lebarnya sekitar `220–300px`; gunakan treatment foto natural seperti versi overlay awal dengan bidang radial hijau lembut, tanpa opacity/fade yang membuat wajah terlihat kusam. Portrait tidak boleh menembus garis, menyentuh sticky navigation, atau mengambil kolom grid tersendiri.
- Pangkas ruang vertikal hero agar headline mulai lebih dekat ke eyebrow. Teks, CTA, dan garis footer hero selalu berada di layer depan; cutout boleh terlihat di belakang nama tetapi tidak di belakang body copy. Tidak ada glow, shadow besar, glass card, atau bidang foto persegi.
- Tablet `600–899px`, termasuk iPad Mini `768px`: cutout tetap bergeser ke kanan agar tidak mengganggu headline dan sisi bawahnya harus menyentuh garis pemisah profil seperti desktop—tanpa gap dan tanpa menembus garis. Anchor portrait harus berasal dari batas bawah `.hero-main`, memakai satu custom property untuk menyamakan `margin-bottom` dan offset portrait; jangan memakai nilai `bottom` tetap yang bergantung pada tinggi `.hero-profiles`. Mobile `<600px`: ubah kembali menjadi avatar sekitar `72–84px` tepat setelah availability; pilih posisi yang tidak memecah nama dan tidak menambah ruang kosong besar.
- Gunakan elemen `<img>` nyata di dalam wrapper yang mengontrol crop: `alt="Portrait of Yogi Arif Widodo"`, `width`/`height` fallback `128×128`, `object-fit: cover`, dan `object-position` diarahkan ke wajah. Gunakan WebP transparan untuk delivery dan PNG sebagai fallback. Foto kecil tidak perlu `fetchpriority="high"`; Selected Work tetap menjadi gambar prioritas utama.
- Target tambahan transfer hero seminimal mungkin: kompres PNG tanpa merusak tepi cutout; bila masih lebih dari kira-kira `300 KB`, gunakan WebP transparan sebagai aset yang dikirim browser. Tidak ada library animasi/background-removal di runtime. Motion opsional hanya reveal opacity/translate pendek, dan harus mati pada `prefers-reduced-motion: reduce`.
- Jangan mengubah copy, link, hierarki CTA, navigasi, atau baris profil yang sudah ada. Foto tidak boleh menjadi alasan untuk mengecilkan `<h1>` atau memindahkan CTA dari posisi hero awal. Pada `320px` dan zoom `200%`, stamp harus kembali ke alur normal bila ruang tidak cukup; tidak boleh ada overlap, overflow horizontal, atau elemen keluar dari bidang hero.

Arah ini mengikuti [Webflow 2026 web design trends](https://webflow.com/blog/web-design-trends-2026) tentang identitas visual yang khas, dan [Webflow hero imagery guidance](https://webflow.com/blog/website-hero-image) yang mengutamakan fotografi asli untuk portfolio. Penempatan spesifik portrait di atas adalah keputusan desain untuk layout Yogi, bukan aturan dari sumber tersebut.

### 3.2 Selected Work — Featured Project Carousel

Referensi visual: gambar yang diberikan pemilik portfolio pada percakapan ini. Ambil pola komposisi dan interaksinya saja; tetap gunakan identitas warna, tipografi, serta konten portfolio Yogi.

- Ganti **hanya bagian Selected Work** dari bento grid saat ini menjadi carousel horizontal.
- Tampilkan satu project aktif sebagai fokus utama dalam frame besar bergaya jendela browser: permukaan putih, sudut membulat, tiga titik kecil di kiri atas, dan bingkai luar gelap dengan aksen warna halus.
- Project sebelum/sesudahnya terlihat sebagian di tepi viewport sebagai petunjuk bahwa carousel dapat digeser. Preview tetangga lebih redup, tetapi judul dan tombolnya tetap terbaca saat menjadi aktif.
- Dalam frame: media project di atas; kategori, judul, deskripsi singkat, kontribusi/hasil, dan satu CTA di bawah. Gunakan konten dan aset project yang sudah ada; jangan mengarang hasil baru.
- Tampilkan navigasi di bawah: tombol sebelumnya/berikutnya dan indikator posisi. Status aktif harus jelas tanpa bergantung pada warna saja.
- Tombol `View projects & clients` tetap membuka showcase yang sudah ada. Carousel hanya untuk project pilihan, bukan seluruh arsip.
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

### 3.4 Background — Compact Credential Index

Ubah hanya section `Background`. Pertahankan dua kredensial yang sudah ada dan tampilkan sebagai dua baris editorial dengan hierarki jelas, bukan dua paragraf polos atau kartu dekoratif.

- Judul `Background.` tetap ringkas, dengan eyebrow kecil `Education & credentials`.
- Baris utama: `Informatics Engineering` sebagai judul paling menonjol, `Politeknik Negeri Samarinda` sebagai institusi, dan `GPA 3.91 / 4.00` sebagai badge yang mudah dipindai.
- Baris kedua perlu koreksi saat implementasi berikutnya: halaman 15 PDF menunjukkan **ICEE one-year English program Certificate of Completion**, sedangkan halaman 22 adalah **TOEFL-equivalent result** dari Politeknik Negeri Samarinda. Jangan gabungkan keduanya menjadi `TOEFL · ICEE Certificate of Completion`. Tampilkan ICEE sebagai program bahasa; hasil tes TOEFL-equivalent opsional sebagai kredensial terpisah.
- Gunakan garis tipis dan ruang yang cukup sebagai pemisah. Desktop: label kecil di kiri, isi utama di tengah, metadata di kanan. Mobile: baris bertumpuk tanpa horizontal overflow.
- Bobot visual section tetap di bawah Hero, Selected Work, dan Capabilities. Tidak perlu animasi, ikon, foto kampus, atau tautan tanpa tujuan yang jelas.
- Semantik: gunakan daftar dua item, heading yang berurutan, dan teks yang tetap terbaca pada zoom `200%`.

Acuan: [Material Design 3 typography](https://m3.material.io/styles/typography/applying-type) untuk hierarki teks dan [USWDS collection guidance](https://designsystem.digital.gov/components/collection/) untuk daftar ringkas dengan metadata.

### 3.5 Certifications & Learning — Lightweight Marquee

Tempatkan section baru **tepat di bawah Background dan sebelum Writing**. Referensi visual: gambar marquee logo yang diberikan pemilik portfolio; ambil kartu logo, potongan kartu di kedua ujung, dan fade halus pada tepi. Judul yang aman: `Certifications & learning.` Hindari `Certified by`, `Trusted by`, atau `Worked with` karena penerbit kursus, mitra program, dan skill badges bukan relasi yang sama.

- Baris bergerak berisi maksimal enam kartu unik: **Dicoding**, **Alibaba Cloud**, **Oracle Academy**, **Udemy**, **ICEE**, dan **Google Skills**. Empat pertama memakai logo WebP yang benar-benar diekstrak dari PDF; ICEE dan Google Skills memakai tipografi teks sampai ada mark yang jelas dari sumbernya.
- Caption kecil wajib membedakan jenis bukti: Dicoding course certificates (PDF halaman 1/3/5/11/12/16–19), Alibaba Cloud course completions (7–9), Oracle Academy Database Foundations course completion (10), Udemy course completions (14/21), ICEE English program completion (15), Google Skills achievements/badges (23–24).
- Logo Alibaba Cloud pada halaman 7–9 adalah bukti penyelesaian historis; sertifikat di halaman 7 menampilkan tanggal validitas yang sudah lewat. Jangan menyebutnya sertifikasi aktif. Google.org/AVPN pada sertifikat Dicoding adalah pendukung/kolaborator program, bukan penerbit sertifikat Yogi.
- Aset siap pakai di `assets/certifications/`: `dicoding.webp` (halaman 1), `alibaba-cloud.webp` (7), `oracle-academy.webp` (10), dan `udemy.webp` (14). Semua hasil crop sumber PDF; sekitar 2–4 KB per file. Sertakan `width`/`height`, alt text nama penerbit, dan `object-fit: contain`.
- Desktop: kartu putih kecil dengan logo di tengah dan caption ringkas, bergerak perlahan dari kanan ke kiri dalam loop mulus. Kedua sisi viewport menampilkan sebagian kartu dengan edge fade tipis; jangan membuat teks aktif menjadi terlalu pudar.
- Gunakan CSS `transform: translateX()` untuk satu track yang bergerak; duplikat item hanya untuk kontinuitas visual dan tandai duplikat `aria-hidden="true"` serta `inert`. Jangan memakai animation library atau timer JavaScript.
- Durasi target sekitar `30–45s` per putaran, linear, tanpa percepatan ketika hover. Pause saat hover dan `focus-within`. Pada `prefers-reduced-motion: reduce`, matikan auto-scroll dan jadikan daftar horizontal yang bisa digeser manual.
- Mobile: tinggi kartu lebih ringkas dan potongan kartu berikutnya tetap terlihat. Jangan memaksa semua kartu masuk satu layar.
- Satu CTA `View credentials` boleh ditambahkan setelah ada dokumen publik yang sudah disunting dari informasi pribadi atau tautan verifikasi individual. PDF sumber 24 halaman memuat tanggal lahir, nomor mahasiswa, nomor sertifikat, dan QR; **jangan tautkan PDF mentah langsung dari portfolio** tanpa review/redaksi.

### 3.6 Expressive Motion

- Motion hanya untuk memberi hierarchy dan feedback, bukan dekorasi terus-menerus.
- Hero: staggered reveal ringan saat halaman masuk.
- Selected Work: pergeseran horizontal pendek melalui native scroll; perubahan fokus/opacity antar slide secukupnya.
- Drawer showcase: spring-like entrance yang singkat dan terasa natural.
- Durasi target: interaction `140–220ms`; entrance `300–500ms`.
- Animasi hanya pada `transform`, `opacity`, atau properti compositor-friendly.

### 3.7 Seamless View Transitions

- Terapkan View Transition API secara progressive enhancement untuk membuka/menutup showcase dan perpindahan visual project ke detail.
- UI harus tetap berfungsi penuh jika browser tidak mendukung View Transition API.
- Hindari routing/framework baru hanya untuk efek transisi.

### 3.8 Selective Liquid Glass

- Glass hanya digunakan pada floating navigation/action bar atau controls di atas media.
- Styling target: translucent surface, blur ringan, border putih transparan, shadow lembut, dan radius capsule.
- Jangan gunakan glass pada body, seluruh card, atau area teks panjang.
- Sediakan fallback opaque dengan kontras yang setara ketika `backdrop-filter` tidak tersedia.

### 3.9 Accessibility as Visual Quality

- Target WCAG 2.2 AA.
- Semua interaction harus dapat dipakai dengan keyboard dan memiliki `:focus-visible` yang jelas.
- Text contrast minimal `4.5:1`; UI component/focus indicator minimal `3:1`.
- Target interaktif minimum `24×24px`, dengan target utama idealnya `44×44px`.
- Pada `prefers-reduced-motion: reduce`, hapus pergerakan dan gunakan perubahan opacity instan/ringan.
- Dialog wajib mempertahankan focus management, Escape-to-close, label, dan focus return.
- Hover enhancement wajib memiliki padanan focus/touch.

### 3.10 Footer — Quiet Signoff

- Ganti kalimat CTA `Have a project or opportunity in mind? Book a call or get in touch by email.` karena jalur kontak sudah jelas di hero dan navigasi.
- Footer menjadi penutup editorial yang ringkas: `Yogi Arif Widodo` dan `Software Engineer · Balikpapan, Indonesia`, dengan satu tautan utilitas `Back to top ↑`.
- Gunakan garis pemisah tipis, ruang napas cukup, dan tipografi yang konsisten; tanpa kartu, animasi dekoratif, atau CTA primer baru.
- Hapus penghitung pengunjung yang terlihat dari footer. Script analytics boleh tetap berjalan; jangan menghapus atau mengubah konfigurasi tracking hanya karena tampilan counter dihapus.
- Di mobile, susun teks dan tautan secara vertikal tanpa overflow; tautan tetap punya focus state yang jelas.

## 4. Struktur Halaman yang Diusulkan

1. Floating utility navigation: Work, About, Writing, Contact.
2. Hero editorial gelap dengan komposisi dua kolom asli: nama dominan, copy/CTA di kanan, serta portrait identity stamp kecil sebagai aksen sekunder.
3. Selected Work featured carousel: 3–5 project terbaik, satu project aktif dan preview slide tetangga.
4. Impact strip: angka/proof seperti 9+ years, 10+ products, 5 countries, team 2→11.
5. Capabilities editorial index: headline kuat di kiri dan empat baris keahlian dengan contoh kerja di kanan.
6. Background sebagai dua baris kredensial editorial.
7. Certifications & learning marquee ringan di bawah Background.
8. Selected writing: maksimal tiga artikel terbaru/terkuat.
9. Footer signoff ringkas dengan tautan kembali ke atas, tanpa CTA kontak berulang atau counter publik; full project archive tetap menggunakan showcase dialog.

## 5. Content Rules

- Prioritaskan outcome dan kontribusi, bukan daftar teknologi.
- Hero menyampaikan siapa Yogi, nilai yang diberikan, dan langkah berikutnya dalam satu pandangan layar desktop; hindari mengulang seluruh daftar keahlian di sana.
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
- Marquee sertifikasi memakai empat logo WebP kecil dari PDF; total aset gambar target di bawah `40 KB`, tanpa memuat halaman PDF sebagai gambar di viewport.
- Portrait hero transparan memakai ukuran intrinsik dan format delivery yang dioptimalkan; jangan menambah library removal atau animasi runtime. Ukur dampaknya pada LCP/mobile sebelum menetapkan prioritas muat tinggi.
- Carousel Selected Work memakai CSS `scroll-snap`, `transform`/`opacity` seperlunya, dan JavaScript tanpa dependency; hindari blur/filter animasi, shadow besar yang bergerak, dan cloning slide.
- Gambar slide pertama diberi prioritas muat; gambar slide lain `loading="lazy"`. Video tetap `preload="metadata"` atau `none` dan tidak otomatis diputar.
- Pertahankan progressive enhancement dan native browser APIs.
- Hindari autoplay video dan background animation berat.
- Font maksimal dua family dan sesedikit mungkin weight file.
- Target Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Tidak boleh ada layout shift yang terlihat dari image, video, atau font loading.

## 8A. SEO & Google Search Discoverability — Implementation Spec

Tujuan: membuat halaman publik mudah ditemukan, dirayapi, dipahami, dan dipantau di Google Search. **Tidak ada jaminan langsung terindeks atau mendapat peringkat tertentu.** Utamakan halaman yang menjawab pencarian nama Yogi, software engineer di Balikpapan, proyek nyata, dan topik artikel; jangan menjejalkan kata kunci.

### P0 — Satu URL utama dan akses crawl

- Gunakan `https://yogiarifwidodo.my.id/` sebagai domain utama: `CNAME` menunjuk ke sana, domain tersebut merespons `200`, sedangkan `https://yogithesymbian.github.io/` mengarah `301` ke domain tersebut (dicek 20 Oktober 2026). Audit ulang sesaat sebelum implementasi/deploy.
- Selaraskan canonical absolut **setiap halaman HTML**, `og:url`, URL pada JSON-LD, `robots.txt`, dan semua `<loc>` dalam `sitemap.xml` ke domain utama. Jangan biarkan canonical menunjuk ke URL GitHub Pages yang redirect.
- Pilih satu URL kanonis untuk Writing index (`/writing/`, bukan sekaligus `/writing/` dan `/writing/index.html` dalam sitemap). Pastikan URL yang disertakan benar-benar merespons `200`, dapat diakses melalui tautan HTML, dan tidak memuat `noindex`.
- Rapikan sitemap menjadi daftar URL kanonis yang memang ingin diindeks. Isi `<lastmod>` hanya dengan tanggal perubahan konten yang benar-benar signifikan; jangan memakai tanggal deploy secara otomatis. Hapus `<priority>` dan `<changefreq>` karena Google mengabaikannya.
- Pertahankan `robots.txt` yang membolehkan crawl halaman publik dan arahkan `Sitemap:` ke domain utama. Jangan mengandalkan `robots.txt` untuk menyembunyikan dokumen pribadi: file sensitif tidak boleh dipublikasikan sama sekali.

### P1 — Konten halaman dan metadata yang relevan

- Audit `<title>` dan meta description yang unik untuk homepage, Writing index, dan setiap artikel. Judul ringkas dan sesuai isi/heading; deskripsi menjelaskan nilai halaman secara alami. Perbaiki deskripsi kosong, generik, rusak, atau sekadar catatan internal pada artikel lama.
- Homepage: tonjolkan nama lengkap, peran, lokasi, pengalaman, dan contoh pekerjaan nyata pada teks HTML yang terlihat. Pertahankan satu `<h1>` jelas. Target istilah pencarian secara natural, misalnya `Yogi Arif Widodo`, `Software Engineer`, `Balikpapan`, `full-stack`, dan `cloud infrastructure`; jangan membuat daftar keyword tersembunyi.
- Artikel: judul, ringkasan, tanggal, heading, dan tautan internal harus mencerminkan isi artikel. Pertahankan bahasa artikel yang sebenarnya pada `lang`/metadata; jangan memaksa artikel Indonesia menjadi title berbahasa Inggris bila kontennya Indonesia.
- Tambahkan tautan HTML kontekstual dari homepage ke artikel unggulan dan dari artikel ke halaman/proyek relevan. Detail proyek dalam `<dialog>` tetap berguna untuk pengunjung, tetapi jika ingin tiap proyek punya peluang ditemukan lewat pencarian spesifik, perlu halaman proyek dengan URL tersendiri; itu keputusan konten terpisah, bukan bagian dari implementasi SEO awal.
- Pertahankan JSON-LD `ProfilePage`/`Person` yang sesuai fakta di halaman; perbarui URL dan tanggal modifikasi secara akurat. Tambahkan `WebSite` structured data hanya bila nilai `name` dan URL sesuai situs. Validasi markup, tetapi jangan menganggap schema menjamin rich result.

### P2 — Verifikasi dan pemantauan setelah deploy

- Buka [Google Search Console](https://search.google.com/search-console) dengan akun pemilik dan cek apakah properti `yogiarifwidodo.my.id` sudah ada; jangan membuat properti duplikat bila sudah terverifikasi. Bila belum ada, tambah **Domain property** `yogiarifwidodo.my.id` (tanpa `https://`), lalu verifikasi melalui record DNS yang diberikan Google. Perubahan DNS perlu akses pengelola domain dan tidak bisa diselesaikan dari repo saja.
- Setelah URL kanonis dan sitemap versi domain utama sudah live, kirim `https://yogiarifwidodo.my.id/sitemap.xml` pada menu Sitemaps. Periksa status `Success` dan apakah URL yang terbaca sesuai daftar halaman publik.
- Gunakan URL Inspection pada homepage, `/writing/`, dan 2–3 artikel representatif: cek `Google-selected canonical`, status index, dan hasil live test. Ajukan `Request Indexing` hanya untuk halaman prioritas yang baru diperbaiki; pengajuan tidak menjamin indeks langsung.
- Ukur status `Indexed`/alasan pengecualian, canonical pilihan Google, jumlah impression dan query di Search Console. Prioritaskan error crawl, canonical, dan halaman bernilai tinggi yang belum terindeks sebelum menambah metadata kosmetik.
- GA4 portfolio **sudah ada**: screenshot pemilik menunjukkan web stream `Yogi Portfolio` untuk `https://yogiarifwidodo.my.id`, measurement ID `G-JZ0XL2F96B`, dan data collection aktif dalam 48 jam terakhir; ID yang sama sudah dipasang di `index.html`. Tidak perlu membuat stream atau tag GA baru. Search Console tetap perlu dipakai karena GA4 mengukur kunjungan, bukan memberi diagnosis crawl/indexing. Menghubungkan GA4 ke Search Console hanya opsional untuk laporan gabungan, bukan syarat indeks.
- Setelah perubahan live, cek HTTP `200`/redirect, source HTML, sitemap, robots, dan structured data. Permintaan indeks ulang boleh dilakukan untuk URL utama yang berubah, tetapi indexing dan ranking tetap keputusan Google.
- Lindungi PDF sertifikat mentah yang berisi informasi pribadi: jangan letakkan/tautkan pada output publik. Bila pernah terpublikasi, evaluasi penghapusan dari hosting dan hasil pencarian secara terpisah; `noindex` atau robots bukan pengganti penghapusan file sensitif.

## 9. Acceptance Criteria

- Visual baru tetap dikenali sebagai portfolio Yogi, bukan template generik.
- Hero punya satu fokus tipografi pada nama dan satu kalimat positioning; CTA primer langsung menuju Selected Work, sedangkan kontak/CV tetap dapat ditemukan tanpa memenuhi baris utama.
- Hero tetap terbaca dan tidak overflow pada `320px`; saat zoom browser `200%`, urutan konten dan fokus keyboard tetap logis.
- Portrait hero memakai cutout transparan sebagai aksen editorial di belakang nama pada desktop/tablet dan avatar `72–84px` pada mobile. Kaki cutout berhenti di atas garis pemisah profil—tidak masuk ke area `9+ years` dan link—serta tidak mengganggu copy/navigation atau menimbulkan scrollbar horizontal.
- Selected Work mengikuti komposisi referensi: satu frame project aktif dominan, slide tetangga terlihat sebagian, dan kontrol sebelumnya/berikutnya plus indikator posisi di bawah.
- Capabilities tampil sebagai editorial index; headline dan contoh kerja nyata lebih menonjol daripada daftar teknologi. Tidak ada informasi yang bergantung pada hover.
- Background menonjolkan bidang studi dan GPA; ICEE completion tidak salah dilabeli sebagai sertifikat TOEFL.
- Marquee menampilkan penerbit/jenis kredensial yang sesuai isi PDF, loop halus tanpa jeda, edge fade di kiri dan kanan, serta mode statis yang dapat digeser saat reduced motion.
- Tidak ada tautan publik ke PDF sumber mentah sebelum informasi pribadi ditinjau dan disunting.
- Footer tidak mengulang ajakan kontak dari hero, tidak menampilkan visitor counter, dan menyediakan `Back to top` yang bisa dipakai dengan keyboard.
- Tombol, swipe, trackpad, dan keyboard mengubah slide tanpa tersendat; posisi tombol/indikator selalu sesuai slide yang terlihat setelah scroll manual.
- Pada slide pertama/terakhir, tombol yang tidak bisa dipakai berstatus disabled dan carousel tidak memaksa loop.
- Pada `prefers-reduced-motion: reduce`, perpindahan slide berlangsung tanpa smooth scrolling atau animasi posisi.
- Slide nonaktif tidak menahan fokus keyboard pada CTA yang tidak terlihat; CTA slide aktif tetap mudah dicapai.
- Semua CTA, tabs, dialog, dan links dapat digunakan dengan keyboard.
- Reduced-motion mode tidak mengandung transform movement yang non-esensial.
- View transitions dan glass memiliki fallback yang layak.
- Layout lolos pengecekan pada `320px`, `768px`, `1024px`, dan `1440px`.
- Tidak ada regresi pada Writing pages, SEO metadata, analytics, download CV, atau project data.
- Setelah SEO diimplementasikan: semua URL kanonis di metadata, JSON-LD, `robots.txt`, dan sitemap memakai domain utama yang sama; sitemap tidak memuat duplikat `/writing/index.html`, dan tidak ada deskripsi artikel yang kosong/rusak.
- Search Console mencatat sitemap berhasil diproses dan URL Inspection untuk halaman prioritas tidak menunjukkan blokir teknis; status indeks/ranking dipantau, bukan dijanjikan.
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
- [USWDS — Footer](https://designsystem.digital.gov/components/footer/)
- [Webflow — 2026 web design trends](https://webflow.com/blog/web-design-trends-2026)
- [Webflow — Hero image best practices](https://webflow.com/blog/website-hero-image)
- [web.dev — Responsive images and fetch priority](https://web.dev/learn/design/responsive-images)
- [Google Search Central — SEO developer guide](https://developers.google.com/search/docs/fundamentals/get-started-developers)
- [Google Search Central — Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)
- [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central — Title links](https://developers.google.com/search/docs/appearance/title-link)
- [Google Search Central — Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [Google Search Console Help — Add a property](https://support.google.com/webmasters/answer/34592)

## 12. Implementation Notes

- Hero editorial gelap, Selected Work carousel, impact strip, Capabilities editorial index, Background credential index, marquee sertifikasi, floating navigation, selected writing, dan footer signoff sudah diterapkan. Marquee memakai empat aset WebP dari PDF dan dua wordmark teks.
- CTA kontak berulang dan counter publik sudah dihapus dari footer; konfigurasi Google Analytics dan GoatCounter tetap utuh.
- View Transition API digunakan sebagai progressive enhancement pada showcase dan pergantian tab. Transisi project ke halaman detail belum relevan karena portfolio saat ini belum memiliki halaman detail project.
- Target Lighthouse dan visual QA pada browser nyata masih perlu diukur di lingkungan dengan browser tersedia.
- SEO repo-side sudah diterapkan: canonical homepage/artikel, `og:url`, JSON-LD, robots, sitemap, serta generator blog kini memakai `yogiarifwidodo.my.id`; entri sitemap `/writing/index.html`, `<priority>`, dan `<changefreq>` dihapus. Deskripsi artikel kosong/generik telah diperbaiki di sumber konten dan HTML hasil build.
- PDF sertifikat mentah dikeluarkan dari Git tracking dan di-ignore, sementara salinan lokal tetap ada. Saat audit 20 Oktober 2026, URL PDF pada situs live masih merespons `200`; file baru hilang dari situs setelah perubahan ini dideploy. Riwayat Git lama dan kemungkinan indeks Google memerlukan penanganan lanjutan terpisah.
- Status properti Search Console belum diverifikasi di akun pemilik; screenshot yang tersedia hanya menunjukkan status GA4, bukan Search Console.
- Master transparan `assets/yogiarifwidodo-photo.png` dan delivery WebP transparan (~83 KB) sudah tersedia. Pada 22 Oktober 2026, layout hero `3fr / 2fr` dipulihkan, ruang vertikal dipadatkan, dan portrait diimplementasikan sebagai cutout editorial di belakang nama. Portrait kini berada di dalam `.hero-main`; custom property `--hero-main-bottom-space` menyatukan margin bawah dan offset portrait agar kaki foto menyentuh garis pemisah secara konsisten, termasuk pada iPad Mini `768px`. Mobile memakai avatar `80px` dalam alur normal setelah copy. Foto diproses dengan built-in imagegen; pemilik tetap perlu mengecek kemiripan wajah dan crop akhir saat visual QA sebelum deploy.
