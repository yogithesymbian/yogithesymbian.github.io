# Requirements — Portfolio Experience Remake

Status: Draft for approval  
Owner: Yogi Arif Widodo  
Last updated: 25 October 2026  
Target: `yogiarifwidodo.my.id`

## 1. Intent

Merombak pengalaman portfolio secara menyeluruh agar terasa lebih tegas, premium, dan meyakinkan seperti kualitas presentasi situs CrowdStrike, tanpa menyalin merek, aset, copy, atau membuat Yogi terlihat sebagai perusahaan cybersecurity.

Remake ini harus mengubah cara pengunjung memahami Yogi: dari kumpulan section portfolio menjadi narasi yang cepat menjawab empat pertanyaan:

1. Siapa Yogi dan masalah apa yang bisa ia selesaikan?
2. Apa bukti kerja terbaiknya?
3. Seberapa luas dan dalam kapabilitasnya?
4. Apa langkah selanjutnya untuk menghubungi atau mengevaluasinya?

## 2. Product goals

- Membuat value proposition dapat dipahami dalam 8 detik pertama.
- Mengangkat project dan outcome sebagai bukti utama, bukan dekorasi atau daftar teknologi.
- Memberikan dua jalur eksplorasi: recruiter/hiring manager yang ingin cepat dan technical peer/client yang ingin mendalam.
- Menyatukan homepage, work archive, writing index, dan article page dalam satu pengalaman visual.
- Mempertahankan stack statis yang ringan, cepat, dan mudah dirawat.

## 3. Non-goals

- Bukan clone pixel-perfect CrowdStrike.
- Bukan rebrand menjadi cybersecurity engineer atau security company.
- Bukan migrasi ke framework, CMS, atau backend baru.
- Bukan penambahan akun, database, dashboard admin, atau personalisasi pengunjung.
- Bukan penciptaan testimonial, statistik, klien, penghargaan, atau outcome yang tidak dapat diverifikasi.
- Bukan redesign CV PDF atau pembuatan case study panjang yang datanya belum tersedia.

## 4. Audiences and jobs to be done

### A1 — Recruiter / hiring manager

Ingin mengetahui senioritas, fokus, bukti dampak, lokasi, availability, dan cara menghubungi Yogi dalam waktu singkat.

### A2 — Engineering leader / prospective client

Ingin menilai bagaimana Yogi memecahkan masalah, cakupan kontribusi, jenis sistem yang pernah dikerjakan, dan apakah pengalamannya relevan.

### A3 — Technical peer

Ingin menjelajahi detail project, open-source work, dan tulisan teknis tanpa mengganggu alur utama homepage.

## 5. Glossary

- **Site**: seluruh portfolio, termasuk homepage, writing index, article pages, dan work archive.
- **Work archive**: pengalaman untuk melihat seluruh project, client, dan open-source work.
- **Proof point**: klaim terverifikasi seperti 9+ tahun, 10+ produk, pertumbuhan tim 2→11, atau modernisasi sistem 20 tahun.
- **Signal red**: warna aksen utama untuk aksi dan state penting; bukan warna dekoratif di semua tempat.
- **Command module**: blok visual terstruktur yang menggabungkan label, headline, metadata, media, dan aksi dalam satu komposisi tegas.
- **Primary CTA**: aksi utama halaman, yaitu menjelajahi selected work.
- **Conversion CTA**: aksi menuju email atau booking call.
- **Public artifact**: kumpulan file minimum yang memang dimaksudkan untuk diakses pengunjung setelah deployment.
- **AI crawler control**: aturan deklaratif untuk bot AI yang patuh; bukan access control dan tidak dapat mencegah pengambilan manual.
- **Content provenance**: informasi yang membantu menunjukkan sumber, kepemilikan, dan versi resmi sebuah aset/konten.

## 6. Functional requirements

### Requirement 1 — Immediate positioning

**User story:** Sebagai recruiter, saya ingin memahami identitas dan nilai Yogi dalam satu viewport agar dapat memutuskan apakah saya perlu melihat pekerjaannya lebih jauh.

#### Acceptance criteria

1. WHEN homepage dibuka, THE SITE SHALL menampilkan nama, role, lokasi, value proposition, availability, primary CTA, dan conversion CTA tanpa membutuhkan interaksi.
2. THE SITE SHALL menggunakan tepat satu `h1` yang berisi nama Yogi.
3. THE SITE SHALL memprioritaskan pesan `I build products people use and systems teams can rely on.` atau versi final yang setara secara makna.
4. WHEN viewport desktop memiliki tinggi minimal 720px, THE SITE SHALL menampilkan primary CTA di initial viewport.
5. THE SITE SHALL menampilkan portrait asli Yogi sebagai identitas pendukung, bukan sebagai kartu profil yang bersaing dengan headline.
6. THE SITE SHALL mempertahankan tautan Email, GitHub, LinkedIn, Download CV, dan Book a call.
7. THE SITE SHALL NOT menampilkan klaim atau jargon cybersecurity hanya karena referensi visual berasal dari CrowdStrike.

### Requirement 2 — Proof-led narrative

**User story:** Sebagai engineering leader, saya ingin melihat bukti yang relevan sebelum daftar skill agar saya dapat menilai kemampuan berdasarkan pekerjaan nyata.

#### Acceptance criteria

1. WHEN pengguna bergerak melewati hero, THE SITE SHALL menampilkan selected work sebelum daftar capabilities dan credentials.
2. THE SITE SHALL menampilkan hanya proof point yang dapat dilacak ke konten repository atau CV yang tersedia.
3. THE SITE SHALL memisahkan angka dari konteksnya sehingga setiap angka tetap bermakna bagi screen reader dan pembaca visual.
4. THE SITE SHALL NOT menggunakan logo klien sebagai pengganti penjelasan kontribusi.
5. IF outcome kuantitatif tidak tersedia, THEN THE SITE SHALL menggunakan scope, complexity, atau responsibility yang terverifikasi sebagai bukti.

### Requirement 3 — Selected work as case snapshots

**User story:** Sebagai calon klien atau employer, saya ingin memahami context, contribution, dan outcome dari project utama tanpa membuka modal terlebih dahulu.

#### Acceptance criteria

1. THE SITE SHALL menampilkan 3–4 selected projects sebagai case snapshots yang berbeda secara komposisi tetapi konsisten secara struktur.
2. EACH case snapshot SHALL memuat category, title, context, contribution, outcome/scope, stack sekunder, visual asli, dan CTA jika tersedia.
3. THE SITE SHALL memprioritaskan YoCateTin, Japan enterprise platform, dan SAL maritime operations; YoClipper dapat menjadi project keempat jika narasinya tidak menduplikasi YoCateTin.
4. WHEN JavaScript tidak tersedia, THE SITE SHALL tetap menampilkan seluruh selected work dalam urutan baca yang benar.
5. THE SITE SHALL NOT membutuhkan carousel untuk memahami selected work.
6. IF horizontal interaction tetap digunakan untuk media gallery, THEN THE SITE SHALL menyediakan kontrol eksplisit, keyboard support, dan tanpa autoplay.
7. THE SITE SHALL menghindari chrome browser generik, traffic-light dots, atau mockup dekoratif yang membuat semua project tampak sama.

### Requirement 4 — Work archive discovery

**User story:** Sebagai technical peer, saya ingin menelusuri semua project, clients, dan open-source work tanpa kehilangan posisi saya di homepage.

#### Acceptance criteria

1. WHEN pengguna memilih `Explore all work`, THE SITE SHALL membuka work archive yang memiliki kategori Projects, Clients, dan Open Source.
2. THE WORK ARCHIVE SHALL mendukung keyboard, Escape-to-close, focus containment, dan focus return jika menggunakan native dialog.
3. THE WORK ARCHIVE SHALL memiliki URL/state yang dapat dipahami atau setidaknya progressive enhancement yang tidak menghilangkan konten inti.
4. WHEN item project dipilih, THE SITE SHALL menampilkan informasi yang lebih kaya daripada card homepage dan tidak sekadar mengulang title + stack.
5. THE WORK ARCHIVE SHALL menyediakan filter atau grouped index yang dapat dipindai; filter tidak boleh menjadi syarat untuk melihat semua item.
6. IF JavaScript gagal, THEN THE SITE SHALL menyediakan fallback link/section menuju daftar project yang dapat dibaca.

### Requirement 5 — Capability framing

**User story:** Sebagai hiring manager, saya ingin memahami bentuk kontribusi Yogi, bukan hanya teknologi yang ia kuasai.

#### Acceptance criteria

1. THE SITE SHALL mengelompokkan kapabilitas menjadi Product Engineering, System Modernization, Cloud & Infrastructure, dan Applied AI.
2. EACH capability SHALL dihubungkan ke satu contoh pekerjaan atau scope yang terverifikasi.
3. THE SITE SHALL menampilkan tools/technology sebagai metadata sekunder.
4. THE SITE SHALL NOT menggunakan empat kartu identik dengan ikon generik.
5. WHEN capability menerima hover treatment, THE SITE SHALL menyediakan state yang setara untuk focus dan touch.

### Requirement 6 — Trust and background

**User story:** Sebagai recruiter, saya ingin memverifikasi background, learning, dan client exposure tanpa mengalihkan fokus dari pengalaman kerja.

#### Acceptance criteria

1. THE SITE SHALL menampilkan education, English program, dan certifications sebagai trust layer setelah work/capabilities.
2. THE SITE SHALL membedakan course completion, program completion, badge, dan active certification secara akurat.
3. THE SITE SHALL NOT menautkan PDF credential mentah yang mengandung data pribadi.
4. THE SITE SHALL tidak menyebut `TOEFL · ICEE Certificate of Completion` sebagai satu credential karena keduanya berasal dari bukti yang berbeda.
5. WHEN logo client ditampilkan, THE SITE SHALL memberikan konteks relasi yang jujur dan tidak mengimplikasikan endorsement.
6. THE SITE SHALL tidak bergantung pada marquee bergerak untuk memastikan credential terbaca.

### Requirement 7 — Writing as expertise proof

**User story:** Sebagai technical peer, saya ingin menemukan tulisan relevan dan membacanya dengan nyaman di perangkat apa pun.

#### Acceptance criteria

1. THE HOMEPAGE SHALL menampilkan 3 tulisan pilihan dengan tanggal, topic label, title, dan summary.
2. THE WRITING INDEX SHALL mempertahankan seluruh arsip artikel yang ada.
3. THE WRITING INDEX SHALL menyediakan scan pattern yang jelas melalui topic/date/title, tanpa thumbnail dekoratif wajib.
4. EACH ARTICLE PAGE SHALL menggunakan reading column sekitar `68–75ch`, heading hierarchy konsisten, dan style yang lengkap untuk code, table, quote, image, dan links.
5. WHEN article dibuka dari writing index, THE SITE SHALL menyediakan jalur kembali yang jelas ke writing index dan homepage.
6. THE SITE SHALL mempertahankan metadata SEO artikel yang telah ada.

### Requirement 8 — Navigation and conversion

**User story:** Sebagai pengunjung, saya ingin selalu mengetahui lokasi dan tindakan berikutnya tanpa terganggu oleh navigasi yang terlalu kompleks.

#### Acceptance criteria

1. THE SITE SHALL menyediakan navigasi utama untuk Work, Expertise/About, Writing, dan Contact.
2. WHEN pengguna scroll ke bawah, THE SITE SHALL menjaga akses ke navigasi tanpa menutupi heading atau focus target.
3. THE SITE SHALL menggunakan satu signal-red conversion CTA di navigasi desktop.
4. ON mobile, THE SITE SHALL menyediakan menu yang dapat dioperasikan dengan keyboard dan screen reader serta dapat ditutup dengan Escape.
5. THE SITE SHALL menampilkan CTA penutup yang berbeda per konteks: contact pada homepage dan next/back reading pada article pages.
6. THE SITE SHALL NOT mengulang beberapa CTA primer dengan bobot visual yang sama dalam satu viewport.

### Requirement 9 — CrowdStrike-inspired visual language

**User story:** Sebagai pengunjung, saya ingin merasakan kualitas visual yang tegas dan modern agar portfolio tampak kredibel dan memorable.

#### Acceptance criteria

1. THE SITE SHALL menggunakan sistem high-contrast berbasis black, off-white, white, dan signal red.
2. THE SITE SHALL menggunakan oversized typography, tight display leading, uppercase metadata, hard rules, dan modular section alternation sebagai elemen karakter utama.
3. THE SITE SHALL menggunakan bentuk square atau corner radius maksimal 8px untuk surfaces utama; pill hanya untuk status/tag yang memang membutuhkan bentuk pill.
4. THE SITE SHALL menggunakan red secara selektif untuk CTA, active state, proof emphasis, atau directional cue.
5. THE SITE SHALL memiliki sekurangnya satu signature composition yang unik milik Yogi: portrait cutout + engineering signal grid/rail.
6. THE SITE SHALL NOT menyalin logo, proprietary typeface, copy, product imagery, falcon motif, threat map, atau layout identik milik CrowdStrike.
7. THE SITE SHALL NOT menggunakan generic glassmorphism, pastel glow, browser-window decoration, atau kumpulan rounded cards sebagai bahasa visual utama.

### Requirement 10 — Motion and interaction feedback

**User story:** Sebagai pengguna, saya ingin interaksi terasa responsif dan terarah tanpa gerakan yang menghambat pembacaan.

#### Acceptance criteria

1. THE SITE SHALL membatasi interaction motion pada kisaran 140–220ms dan entrance motion pada 300–450ms.
2. THE SITE SHALL mengutamakan transform dan opacity untuk animasi.
3. THE SITE SHALL NOT menjalankan carousel, marquee, video, atau text ticker secara otomatis.
4. WHEN `prefers-reduced-motion: reduce` aktif, THE SITE SHALL menonaktifkan smooth scroll, entrance movement, dan decorative motion.
5. WHEN content muncul melalui motion, THE CONTENT SHALL tetap tersedia dan terbaca jika animation tidak berjalan.

### Requirement 11 — Responsive and accessible experience

**User story:** Sebagai pengguna mobile, keyboard, zoom, atau assistive technology, saya ingin mengakses seluruh konten dan aksi tanpa hambatan.

#### Acceptance criteria

1. THE SITE SHALL memenuhi WCAG 2.2 AA untuk contrast, semantics, focus visibility, dan keyboard operation.
2. THE SITE SHALL berfungsi tanpa horizontal page overflow pada 320px, 768px, 1024px, 1440px, dan zoom 200%.
3. THE SITE SHALL memiliki text contrast minimal 4.5:1 dan focus/UI indicator minimal 3:1.
4. THE SITE SHALL memiliki target interaktif minimal 24×24px dan target utama idealnya minimal 44px tinggi.
5. THE SITE SHALL mempertahankan logical heading order, landmarks, alt text, accessible names, dan native semantics.
6. WHEN content disusun ulang secara responsif, THE DOM ORDER SHALL tetap mengikuti urutan baca yang logis.
7. THE SITE SHALL mendukung navigation dan work archive dengan keyboard saja.

### Requirement 12 — Performance, resilience, and maintainability

**User story:** Sebagai pengunjung, saya ingin situs terasa cepat; sebagai maintainer, saya ingin perubahan tetap sederhana untuk dirawat.

#### Acceptance criteria

1. THE SITE SHALL tetap menggunakan static HTML, CSS, dan vanilla JavaScript tanpa runtime framework dependency.
2. THE SITE SHALL mempertahankan content-first experience saat JavaScript tidak tersedia.
3. THE SITE SHALL menggunakan responsive images, explicit dimensions, lazy loading di bawah fold, dan video preload `metadata` atau lebih hemat.
4. THE SITE SHALL menargetkan Lighthouse mobile Performance ≥90 dan Accessibility ≥95 pada build production, dengan hasil dicatat saat QA.
5. THE SITE SHALL menargetkan LCP ≤2.5s, CLS ≤0.1, dan INP ≤200ms pada kondisi pengujian yang disepakati.
6. THE SITE SHALL tidak menambahkan third-party visual library, animation library, atau runtime font dependency.
7. THE SITE SHALL mempertahankan analytics, canonical URL, JSON-LD, `robots.txt`, `sitemap.xml`, dan CNAME yang ada.
8. WHEN data project ditampilkan di lebih dari satu tempat, THE IMPLEMENTATION SHALL menggunakan satu sumber data yang konsisten atau proses build yang mencegah copy divergence.

### Requirement 13 — Content integrity and privacy

**User story:** Sebagai pemilik portfolio, saya ingin semua klaim akurat dan data pribadi tidak terekspos.

#### Acceptance criteria

1. THE SITE SHALL hanya menggunakan claims, clients, project scope, dates, links, dan metrics yang dapat diverifikasi dari repository atau dokumen sumber.
2. THE SITE SHALL menandai confidential work tanpa menyebut client atau detail yang dilarang.
3. THE SITE SHALL tidak membuat testimonial, analyst quote, award, customer count, atau availability date tanpa persetujuan pemilik.
4. THE SITE SHALL tidak membuka complete credential PDF ke publik.
5. WHEN copy diperbaiki untuk clarity, THE MEANING SHALL tetap setara dengan fakta sumber.

### Requirement 14 — Application and deployment security

**User story:** Sebagai pemilik portfolio, saya ingin situs dan jalur deployment sulit diubah, disisipi script, atau membocorkan file yang tidak dimaksudkan untuk publik.

#### Acceptance criteria

1. THE DEPLOYMENT SHALL mempublikasikan dedicated public artifact melalui allowlist dan SHALL NOT mengunggah root repository secara langsung.
2. THE PUBLIC ARTIFACT SHALL NOT berisi `.git`, `.github`, `.kiro`, source-only content, build scripts, editor metadata, credential masters, secret files, atau dokumen privat.
3. THE SITE SHALL mengirim Content Security Policy yang membatasi resource ke origin yang benar-benar diperlukan dan SHALL NOT menggunakan `unsafe-eval`.
4. THE SITE SHALL mengirim perlindungan minimum `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, anti-clickjacking melalui CSP `frame-ancestors`, `Referrer-Policy`, dan restrictive `Permissions-Policy` dari HTTP response headers.
5. IF current hosting tidak dapat mengatur response headers, THEN THE DEPLOYMENT SHALL menggunakan CDN/edge layer atau hosting yang mendukungnya sebelum requirement header dianggap terpenuhi; meta tags bukan pengganti lengkap untuk header security.
6. THE SITE SHALL memuat third-party scripts hanya jika dibutuhkan, melalui explicit CSP allowlist, secara asynchronous/deferred, dan dengan data exposure seminimal mungkin.
7. THE SITE SHALL NOT menyimpan API keys, tokens, credentials, private endpoints, atau secrets di HTML, JavaScript, repository, build artifact, maupun client-visible configuration.
8. THE CI WORKFLOW SHALL menerapkan least-privilege permissions, pin third-party actions ke full commit SHA, dan membatasi deployment production ke branch/environment yang disetujui.
9. THE REPOSITORY AND DOMAIN OPERATIONS SHALL menggunakan MFA/passkey, protected production branch/environment, verified custom domain, registrar lock, auto-renew, dan DNSSEC jika registrar/DNS provider mendukungnya.
10. THE SITE SHALL menyediakan `/.well-known/security.txt` dengan security contact, canonical URL, dan expiration date yang valid agar laporan kerentanan memiliki jalur resmi.
11. WHEN outbound link membuka tab baru, THE SITE SHALL mencegah akses ke `window.opener` melalui `rel="noopener noreferrer"` atau proteksi browser yang setara.
12. THE SITE SHALL mempertahankan HTTPS-only access dan tidak memuat active mixed content.

### Requirement 15 — AI scraping, image misuse, and impersonation resistance

**User story:** Sebagai pemilik portfolio, saya ingin mengurangi penggunaan foto dan konten saya untuk training/grounding AI, manipulasi, hotlinking, atau impersonation tanpa merusak aksesibilitas dan discoverability normal.

#### Acceptance criteria

1. THE SITE SHALL tetap dapat diindeks oleh search crawler yang disetujui tetapi SHALL mendeklarasikan opt-out untuk `Google-Extended` dan AI-training crawlers lain yang dipilih melalui `robots.txt`.
2. THE AI CRAWLER POLICY SHALL didokumentasikan sebagai best-effort policy, bukan jaminan teknis atau perlindungan untuk file sensitif.
3. THE SITE SHALL NOT mengandalkan `robots.txt`, `noai` metadata, disabled right-click, transparent overlays, atau JavaScript download blocking sebagai security boundary.
4. THE PUBLIC ARTIFACT SHALL hanya memuat derivative image berukuran web yang diperlukan; original/master portrait beresolusi tinggi SHALL tetap di luar public artifact apabila tidak dibutuhkan.
5. BEFORE publication, PUBLIC PORTRAIT AND PERSONAL IMAGES SHALL dihapus metadata EXIF/IPTC/GPS yang tidak diperlukan.
6. THE SITE SHALL mempertahankan visual quality yang cukup untuk portfolio tetapi SHALL menghindari publikasi source image yang secara material lebih besar daripada ukuran render maksimum.
7. THE SITE SHALL menyediakan copyright/usage notice yang jelas dan stable canonical ownership melalui canonical URL, `Person` structured data, dan tautan profil resmi.
8. IF visible watermark atau signature digunakan, THEN IT SHALL halus, tidak menutupi wajah, tidak mengganggu accessibility, dan tidak diklaim sebagai pencegahan mutlak terhadap AI editing.
9. THE SITE SHALL menyediakan halaman atau blok `Official profiles` agar pengunjung dapat membedakan identitas asli dari akun impersonator.
10. IF CDN/edge protection tersedia, THEN THE DEPLOYMENT SHOULD menerapkan rate limiting/bot mitigation dan optional hotlink protection setelah memastikan search, social preview, dan accessibility tooling tidak rusak.
11. THE SITE SHALL NOT mengumpulkan biometric identifier, hidden fingerprinting data, atau unnecessary visitor data untuk mencoba mencegah penyalahgunaan foto.
12. THE SITE SHALL menyatakan secara eksplisit bahwa pengguna manusia masih dapat menyimpan, screenshot, atau mengunggah konten publik ke layanan AI; mitigasi difokuskan pada pengurangan risiko, provenance, dan respons penyalahgunaan.
13. IF the owner selects a strict AI-minimization policy, THEN THE PUBLIC ARTIFACT SHALL exclude `llms.txt` and SHALL remove the `<link rel="alternate">` that advertises it; `llms.txt` SHALL NOT diperlakukan sebagai security control.

## 7. Success signals

- Pengguna dapat menyebut role, value proposition, satu proof point, dan cara menghubungi Yogi setelah melihat hero + satu section.
- Selected work dapat dipahami tanpa membuka archive/dialog.
- Setiap section memiliki fungsi naratif yang berbeda; tidak ada section filler.
- Halaman terasa sebagai satu sistem, bukan rangkaian template blocks.
- Tidak ada regression pada links, analytics, SEO, keyboard navigation, dan article archive.
- Public deployment hanya berisi file yang memang dimaksudkan untuk publik dan lulus secret/private-file scan.
- Security headers aktif pada response production, bukan hanya tercantum sebagai meta tags.
- Search discoverability tetap berfungsi sementara AI-training crawler policy terdokumentasi dan dapat diverifikasi.

## 8. Open content decisions

Keputusan berikut tidak memblokir design system, tetapi harus diselesaikan sebelum final copy freeze:

- Apakah availability tetap ditampilkan sebagai `Open to opportunities` atau dibuat lebih spesifik.
- Project keempat pada selected work: YoClipper atau project internasional lain.
- Apakah logo clients tetap tampil di homepage atau hanya di work archive.
- Apakah booking call tetap menjadi CTA sekunder atau email menjadi conversion CTA utama.
- Delivery layer yang akan dipakai untuk response security headers: CDN/edge di depan GitHub Pages atau migrasi static hosting.
- Analytics yang dipertahankan: satu provider yang benar-benar dibutuhkan; hindari menjalankan Google Analytics dan GoatCounter tanpa alasan terukur.
- Daftar AI-training crawler tambahan selain `Google-Extended`; default posture adalah strict AI minimization dan menghapus public `llms.txt`.

