# Cardio-Nurse (Diana Amalia)

Konteks proyek untuk melanjutkan pekerjaan di Claude Code.

## Tentang proyek

- Web app untuk skripsi keperawatan Diana Amalia: *Pengembangan dan Uji Kegunaan Media Edukasi Digital Cardio Nurse Berbasis Kebutuhan Pasien Gagal Jantung untuk Mendukung Perawatan Mandiri*.
- Syafiq yang membangun app-nya. Pemilik skripsi yang menentukan isi, materi, dan keputusan penelitian.
- App akan diuji kegunaannya (SUS versi Indonesia + skenario tugas) ke pasien gagal jantung, yang banyak di antaranya lansia, dan ke tenaga kesehatan.
- Fitur dipetakan ke teori self-care gagal jantung Riegel: maintenance (edukasi, obat), symptom perception (catatan harian), management (tanda bahaya → hubungi perawat/119).

## Status (23 Nov 2026)

Prototipe v0.1 sudah jadi di `main`: persetujuan penelitian, masuk kode responden + PIN, perkenalan, kenalan, beranda ("Kartu hari ini"), 6 modul + kuis, catatan harian + aturan tanda bahaya, jadwal obat (gaya etiket apotek), bantuan, pengaturan ukuran huruf. Data hanya di localStorage, belum ada server. Login demo: CN-001 / 123456.

v0.2 (branch dev `claude/sweet-carson-xzvkq9`): tampilan baru bergaya aplikasi kesehatan nasional (lihat Aturan desain), tata letak laptop dengan navigasi samping, `npm run build:single` untuk satu file HTML, dan form yang tetap jalan di pratinjau file (iframe sandbox).

Branch: `main` = production (di-deploy), branch dev = tempat kerja. Perubahan naik ke `main` lewat pull request setelah Syafiq minta.

Semua ini masih CONTOH dan menunggu jawaban pemilik skripsi:
- `src/content.js`: naskah modul, kuis, FAQ, nomor kontak, contoh obat, angka ambang
- `src/store.jsx` → `evaluateLog`: aturan tanda bahaya (wajib divalidasi klinisi)
- `src/screens/Onboarding.jsx` → `Consent`: teks persetujuan dari kaji etik

Daftar pertanyaan terbaru untuk pemilik skripsi (25 Nov 2026): Claude Doc "To-do Diana: kebutuhan app Cardio Nurse" (https://claude.ai/artifact/TBLC6sPTrAY2LELa1xY2RE). Bagian A sampai J dengan kode pertanyaan (A1, B2, dst.) dan lampiran berkas. Jawaban Diana akan merujuk kode-kode itu. A (siapa pemakai: pasien, perawat, atau keduanya; model edukasi mandiri vs alat bantu perawat bertahap seperti kalkulator GRACE) dan B (kerangka penelitian) menentukan bagian lain.

Daftar lama: Claude Sheet "To-do pemilik skripsi — Cardio Nurse", tab "Kebutuhan app" (36 pertanyaan) dan tab "Tahapan skripsi".

Keputusan yang masih terbuka: ada/tidaknya panel nakes, kebijakan data (server atau HP saja), login sungguhan, notifikasi pengingat, apakah SUS diisi di dalam web.

## Aturan desain (jangan dilanggar)

Sejak 23 Nov 2026 Syafiq minta tampilan terinspirasi aplikasi SATUSEHAT (Kemenkes): lebih modern dan menarik, warna mengikuti logonya. Yang diambil HANYA gaya visual. Jangan menyalin isi, fitur, nama, logo, atau ilustrasi SATUSEHAT, dan jangan membuat app terlihat seperti produk resmi Kemenkes. Isi app (materi, fitur baru) belum diputuskan; jangan menambah konten tanpa diminta. App tetap berbasis web dan harus nyaman di ponsel maupun laptop.

- Gaya: latar `#f3f7f8` dengan gradasi toska lembut di bagian atas layar, kartu putih membulat (radius 18 px) dengan bayangan bernuansa toska, ikon di dalam lingkaran (`IconBadge`), daftar berkelompok dengan pemisah (`list-group`), status berupa pill, kondisi kosong berbingkai garis putus-putus, banner gradasi toska untuk "Lanjutkan belajar".
- Warna: toska + limau dari logo SATUSEHAT. Toska `#14b8ad` dan limau `#cddc29` hanya untuk hiasan/isian (kontrasnya terlalu rendah untuk teks). Teks dan tombol memakai toska tua `#0a6f69` (tombol utama) dan `#085e59` (judul aksen, teks di latar toska muda); teks di atas limau memakai `#3b4300`. Teks utama `#1b2a33`. Kuning amber hanya untuk catatan "contoh prototipe" dan peringatan tingkat sedang. Merah `#b3261e` HANYA untuk tanda bahaya. Cek kontras minimal 4,5:1 untuk setiap warna teks baru.
- Font: Atkinson Hyperlegible Next (Braille Institute) saja, lewat `@fontsource`. Jangan ganti ke Inter, Roboto, atau font default lain.
- Ikon: Phosphor (`@phosphor-icons/react`, pakai nama `XxxIcon`), weight duotone atau bold. Lapisan duotone diwarnai limau lewat kelas `.duo`. Jangan pakai Lucide atau Tabler.
- Tata letak: ponsel memakai header + navigasi bawah (4 tab). Lebar ≥ 1000 px memakai navigasi samping (`SideNav`) dan isi dua kolom (`home-grid`); layar persetujuan/masuk memakai panel merek di kiri. Layar baca dan formulir dibatasi lebar (`.narrow`).
- Motif: etiket apotek (jadwal obat, garis isian titik-titik) dan "Kartu hari ini" berisi tiga tugas harian di beranda.
- Hindari: label ALL CAPS di atas judul, tanda → di tombol (pakai ikon caret), string meta dengan titik tengah.
- Lansia friendly: huruf dasar 18 px (`data-size` normal/besar/sangat), area sentuh minimal 56 px, satu tujuan per layar, tombol "Kembali" selalu bertulisan, tanpa gerakan geser tersembunyi. Header, navigasi, dan ikon di baris daftar memakai px supaya tetap rapi di huruf besar. Setiap perubahan tampilan dicek juga di ukuran huruf "Sangat besar".
- Bahasa: Indonesia sederhana, sapaan Bapak/Ibu, sentence case, istilah medis selalu dijelaskan.

## Perintah

```bash
npm install
npm run dev
npm run build
npm run build:single   # satu file HTML: dist-single/cardio-nurse.html
```

Deploy: GitHub Pages lewat `.github/workflows/deploy.yml` (aktifkan Settings → Pages → Source: GitHub Actions).
