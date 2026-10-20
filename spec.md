# Portfolio UI Enhancement Spec

Status: portfolio implemented, including certification marquee and footer signoff; browser visual QA pending
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
- Tidak perlu foto stok, ilustrasi 3D, video latar, parallax, custom cursor, atau animasi teks per huruf. Karakter visual datang dari skala tipografi, bidang warna, whitespace, dan garis editorial tipis.
- Entrance motion, jika dipakai, hanya opacity/translate pendek pada kelompok konten; durasi sekitar `300–450ms` dan dimatikan pada `prefers-reduced-motion: reduce`.
- Semua teks, link, dan tombol harus tetap terbaca pada kondisi tanpa efek/animasi. CTA minimum `44px` tinggi, fokus keyboard jelas, dan kontras teks sesuai WCAG 2.2 AA.

Acuan hierarki: [Material Design 3 typography](https://m3.material.io/styles/typography/applying-type) untuk display type dan [USWDS button guidance](https://designsystem.digital.gov/components/button/) untuk satu aksi utama yang mudah dikenali.

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
2. Hero editorial gelap: nama dominan, positioning spesifik, CTA ke Selected Work, CTA kontak sekunder, dan availability ringkas.
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
- Carousel Selected Work memakai CSS `scroll-snap`, `transform`/`opacity` seperlunya, dan JavaScript tanpa dependency; hindari blur/filter animasi, shadow besar yang bergerak, dan cloning slide.
- Gambar slide pertama diberi prioritas muat; gambar slide lain `loading="lazy"`. Video tetap `preload="metadata"` atau `none` dan tidak otomatis diputar.
- Pertahankan progressive enhancement dan native browser APIs.
- Hindari autoplay video dan background animation berat.
- Font maksimal dua family dan sesedikit mungkin weight file.
- Target Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- Tidak boleh ada layout shift yang terlihat dari image, video, atau font loading.

## 9. Acceptance Criteria

- Visual baru tetap dikenali sebagai portfolio Yogi, bukan template generik.
- Hero punya satu fokus tipografi pada nama dan satu kalimat positioning; CTA primer langsung menuju Selected Work, sedangkan kontak/CV tetap dapat ditemukan tanpa memenuhi baris utama.
- Hero tetap terbaca dan tidak overflow pada `320px`; saat zoom browser `200%`, urutan konten dan fokus keyboard tetap logis.
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

## 12. Implementation Notes

- Hero editorial gelap, Selected Work carousel, impact strip, Capabilities editorial index, Background credential index, marquee sertifikasi, floating navigation, selected writing, dan footer signoff sudah diterapkan. Marquee memakai empat aset WebP dari PDF dan dua wordmark teks.
- CTA kontak berulang dan counter publik sudah dihapus dari footer; konfigurasi Google Analytics dan GoatCounter tetap utuh.
- View Transition API digunakan sebagai progressive enhancement pada showcase dan pergantian tab. Transisi project ke halaman detail belum relevan karena portfolio saat ini belum memiliki halaman detail project.
- Target Lighthouse dan visual QA pada browser nyata masih perlu diukur di lingkungan dengan browser tersedia.
