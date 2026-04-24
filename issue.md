# Issue: Implementasi Halaman Tambah Soal Baru (Bank Soal)

## Ringkasan
Buat halaman baru untuk menambahkan soal, lalu hubungkan dari tombol **Tambah Soal Baru** di halaman detail bank soal. Halaman baru harus diadaptasi dari `template/code.html`, menggunakan Tailwind, dan tetap memakai layout global aplikasi (sidebar + header).

## Tujuan
- User bisa membuka halaman tambah soal dari detail bank soal.
- UI halaman tambah soal mengikuti referensi template.
- Tidak ada duplikasi layout global di level halaman.

## Scope
### In Scope
- Menambah route halaman tambah soal.
- Menghubungkan tombol navigasi dari halaman detail bank soal.
- Membuat view baru untuk form tambah soal (UI only).
- Implementasi styling dengan Tailwind.

### Out of Scope (jangan dikerjakan di issue ini)
- Integrasi API submit soal.
- Validasi form kompleks.
- Penyimpanan data permanen.
- Fitur edit/hapus soal.

## Referensi File
- Template UI: `template/code.html`
- Halaman detail bank soal: `src/views/bank_soal/BankSoalDetailView.vue`
- Router bank soal: `src/router/modules/bankSoal.js`
- Global shell/layout: `src/App.vue`

## Tahapan Implementasi (untuk junior/AI model murah)

### 1. Tambah route baru
1) Buka `src/router/modules/bankSoal.js`.
2) Tambahkan route baru untuk halaman tambah soal, contoh:
   - path: `/bank-soal/:id/tambah-soal`
   - name: `bank-soal-question-create`
   - component: view baru (dibuat di langkah 3).
3) Pastikan route mengikuti pola modular route yang sudah ada.

**Output langkah ini:** URL halaman tambah soal bisa diakses langsung.

### 2. Hubungkan tombol “Tambah Soal Baru”
1) Buka `src/views/bank_soal/BankSoalDetailView.vue`.
2) Cari tombol **Tambah Soal Baru**.
3) Ubah tombol agar navigasi ke route baru (pakai `RouterLink` atau `router.push`).
4) Pastikan parameter `id` bank soal ikut dikirim saat pindah halaman.

**Output langkah ini:** Klik tombol di halaman detail membuka halaman tambah soal sesuai bank soal aktif.

### 3. Buat view halaman tambah soal
1) Buat file baru, contoh: `src/views/bank_soal/BankSoalQuestionCreateView.vue`.
2) Ambil struktur visual dari `template/code.html`, lalu adaptasi ke konteks “Tambah Soal”.
3) Minimal isi halaman:
   - tombol kembali ke detail bank soal,
   - judul halaman,
   - input pertanyaan,
   - opsi jawaban A–E,
   - pemilihan kunci jawaban,
   - tombol aksi (Batal, Simpan).
4) Gunakan Tailwind class, tanpa CSS custom baru kecuali benar-benar perlu.

**Output langkah ini:** UI halaman tambah soal tampil lengkap sesuai kebutuhan baseline.

### 4. Jaga global layout tetap konsisten
1) Jangan copy-paste sidebar/header ke view baru.
2) Pastikan view baru hanya mengisi area konten utama.
3) Cek spacing/padding agar konsisten dengan halaman lain.

**Output langkah ini:** Halaman baru tetap berada dalam shell global aplikasi (sidebar + header tetap tampil).

### 5. Validasi dasar sebelum dianggap selesai
1) Jalankan aplikasi.
2) Uji alur:
   - buka detail bank soal,
   - klik tombol **Tambah Soal Baru**,
   - pastikan berpindah ke halaman baru,
   - pastikan sidebar + header global tetap ada.
3) Jalankan build check: `npm run build`.

**Output langkah ini:** Fitur baseline siap untuk tahap integrasi backend berikutnya.

## Acceptance Criteria
- [ ] Ada route baru untuk halaman tambah soal.
- [ ] Tombol **Tambah Soal Baru** di halaman detail bank soal mengarah ke route baru.
- [ ] Halaman tambah soal dibuat sebagai view baru.
- [ ] Tampilan mengadaptasi `template/code.html` dan memakai Tailwind.
- [ ] Sidebar + header global tetap tampil (tanpa duplikasi di view).
- [ ] Build berhasil tanpa error.

## Catatan Eksekusi
- Kerjakan berurutan sesuai langkah 1 → 5.
- Jangan tambah fitur di luar scope issue ini.
- Jika ada kebingungan pada detail UI, prioritaskan struktur sederhana yang fungsional dulu (MVP), lalu rapikan.
