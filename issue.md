# Planning: Halaman Tambah Bank Soal (Tailwind + Global Layout)

## Tujuan
Menambahkan alur dari tombol **Tambah Bank Soal** pada halaman Bank Soal agar membuka halaman baru untuk membuat bank soal, dengan tampilan yang diadaptasi dari `template/code.html` menggunakan Tailwind.

Dokumen ini ditujukan agar implementasi dapat dilakukan oleh junior programmer atau AI model yang lebih murah.

## Requirement Utama
- Pada halaman Bank Soal, tombol **Tambah Bank Soal** harus dapat diklik.
- Klik tombol tersebut membuka halaman baru pembuatan bank soal.
- Halaman baru mengikuti tampilan dari `template/code.html`.
- Halaman baru tetap menampilkan **global sidebar** dan **global header** yang sudah ada di aplikasi.
- Implementasi tampilan menggunakan Tailwind.

## Batasan Scope
- Fokus pada routing, halaman form tambah bank soal, dan integrasi layout global.
- Tidak perlu implementasi submit ke backend pada tahap ini.
- Tidak menambah state management kompleks atau validasi backend.

## Referensi Implementasi
- Template UI: `template/code.html`
- Halaman asal tombol: `src/views/bank_soal/BankSoalListView.vue`
- Routing modular Bank Soal: `src/router/modules/bankSoal.js`
- Global layout: `src/App.vue` (sidebar + header)

## Tahapan Implementasi

### 1) Tambahkan route baru untuk halaman tambah bank soal
- Tambahkan route baru pada modul Bank Soal (contoh: `/bank-soal/tambah`).
- Tetap gunakan pola modular route yang sudah berlaku.

Output:
- Route halaman tambah bank soal tersedia dan bisa diakses.

---

### 2) Hubungkan tombol “Tambah Bank Soal” ke route baru
- Ubah tombol tambah pada `BankSoalListView.vue` agar melakukan navigasi ke route tambah bank soal.
- Gunakan `RouterLink` atau `router.push` agar konsisten dengan Vue Router.

Output:
- Klik tombol langsung membawa user ke halaman tambah bank soal.

---

### 3) Buat view baru untuk form tambah bank soal
- Buat file view baru di modul bank soal (misalnya `src/views/bank_soal/BankSoalCreateView.vue`).
- Adaptasi struktur UI dari `template/code.html`:
  - judul halaman + breadcrumb,
  - form card,
  - field informasi dasar,
  - tombol aksi (batal/simpan),
  - blok info/tips tambahan.
- Terapkan styling dengan class Tailwind.

Output:
- Halaman tambah bank soal tampil sesuai referensi utama template.

---

### 4) Pastikan global sidebar dan global header tetap tampil
- Jangan menambahkan sidebar/header lokal baru di view tambah bank soal.
- Gunakan layout global yang sudah ada di `App.vue`.
- Sesuaikan spacing konten agar tidak bertabrakan dengan sidebar/header global.

Output:
- Halaman baru menyatu dengan layout global aplikasi.

---

### 5) Validasi fungsional dasar
Lakukan pengecekan minimum:
- Dari halaman Bank Soal, tombol tambah bisa membuka halaman tambah bank soal.
- Halaman baru menampilkan layout global (sidebar + header).
- Tampilan form mengikuti struktur template secara visual utama.
- Build project berhasil tanpa error.

Output:
- Fitur siap dipakai sebagai baseline implementasi lanjutan.

## Checklist Implementasi
- [ ] Route tambah bank soal ditambahkan di modul route Bank Soal.
- [ ] Tombol “Tambah Bank Soal” menavigasi ke route baru.
- [ ] View baru untuk create bank soal dibuat di folder modul Bank Soal.
- [ ] UI halaman baru diadaptasi dari `template/code.html` dengan Tailwind.
- [ ] Global sidebar + global header tetap digunakan (tanpa duplikasi lokal).
- [ ] Build/check dasar berhasil.

## Catatan untuk Junior Programmer / AI Model Murah
- Kerjakan berurutan: route → tombol navigasi → halaman baru → rapikan UI.
- Fokus pada struktur halaman dan konsistensi layout global terlebih dahulu.
- Jika detail template terlalu kompleks, pilih versi sederhana yang tetap mirip visual.
- Hindari menambah scope di luar task ini (API submit, validasi kompleks, integrasi backend).
