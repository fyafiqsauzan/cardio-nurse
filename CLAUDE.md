# Cardio-Nurse (Diana Amalia)

Konteks proyek untuk melanjutkan pekerjaan di Claude Code.

## Tentang proyek

- Web app untuk skripsi keperawatan Diana Amalia: *Pengembangan dan Uji Kegunaan Media Edukasi Digital Cardio Nurse Berbasis Kebutuhan Pasien Gagal Jantung untuk Mendukung Perawatan Mandiri*.
- Syafiq yang membangun app-nya. Pemilik skripsi yang menentukan isi, materi, dan keputusan penelitian.
- App akan diuji kegunaannya (SUS versi Indonesia + skenario tugas) ke pasien gagal jantung, yang banyak di antaranya lansia, dan ke tenaga kesehatan.
- Fitur dipetakan ke teori self-care gagal jantung Riegel: maintenance (edukasi, obat), symptom perception (catatan harian), management (tanda bahaya → hubungi perawat/119).

## Status (23 Nov 2026)

Prototipe v0.1 sudah jadi di `main`: persetujuan penelitian, masuk kode responden + PIN, perkenalan, kenalan, beranda ("Kartu hari ini"), 6 modul + kuis, catatan harian + aturan tanda bahaya, jadwal obat (gaya etiket apotek), bantuan, pengaturan ukuran huruf. Data hanya di localStorage, belum ada server. Login demo: CN-001 / 123456.

Semua ini masih CONTOH dan menunggu jawaban pemilik skripsi:
- `src/content.js`: naskah modul, kuis, FAQ, nomor kontak, contoh obat, angka ambang
- `src/store.jsx` → `evaluateLog`: aturan tanda bahaya (wajib divalidasi klinisi)
- `src/screens/Onboarding.jsx` → `Consent`: teks persetujuan dari kaji etik

Daftar pertanyaan untuk pemilik skripsi ada di Claude Sheet "To-do pemilik skripsi — Cardio Nurse", tab "Kebutuhan app" (36 pertanyaan: isi app, tampilan, alur, login, lansia friendly, teknis). Tab "Tahapan skripsi" berisi tahapan penelitiannya.

Keputusan yang masih terbuka: ada/tidaknya panel nakes, kebijakan data (server atau HP saja), login sungguhan, notifikasi pengingat, apakah SUS diisi di dalam web.

## Aturan desain (jangan dilanggar)

Syafiq minta tampilannya sama sekali tidak terlihat seperti hasil generate AI. Font, ikon, dan referensi lain diambil dari luar.

- Font: Atkinson Hyperlegible Next (Braille Institute) saja, lewat `@fontsource`. Jangan ganti ke Inter, Roboto, atau font default lain.
- Ikon: Phosphor (`@phosphor-icons/react`, pakai nama `XxxIcon`), weight duotone atau bold. Lapisan duotone diwarnai kunyit lewat kelas `.duo`. Jangan pakai Lucide atau Tabler.
- Warna: indigo `#1f2a6b` + kunyit `#f2b705`, putih sebagai latar. Merah `#b3261e` HANYA untuk tanda bahaya.
- Motif: etiket apotek (jadwal obat) dan kartu kontrol dengan garis titik-titik (beranda).
- Hindari: latar krem + aksen terakota, label ALL CAPS di atas judul, tanda → di tombol, string meta dengan titik tengah, kartu seragam dengan bayangan abu-abu, gradien dekoratif.
- Lansia friendly: huruf dasar 18 px (`data-size` normal/besar/sangat), area sentuh minimal 56 px, satu tujuan per layar, tombol "Kembali" selalu bertulisan, tanpa gerakan geser tersembunyi. Header dan navigasi bawah memakai px supaya tetap rapi di huruf besar.
- Bahasa: Indonesia sederhana, sapaan Bapak/Ibu, sentence case, istilah medis selalu dijelaskan.

## Perintah

```bash
npm install
npm run dev
npm run build
```

Deploy: GitHub Pages lewat `.github/workflows/deploy.yml` (aktifkan Settings → Pages → Source: GitHub Actions).
