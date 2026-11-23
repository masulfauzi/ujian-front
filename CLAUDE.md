# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repository ini.

## Ringkasan

Frontend sistem ujian online (SMKN 2 Semarang) untuk backend Go di `../ujian-back` (lihat CLAUDE.md di sana untuk API). Stack: Vue 3 (`<script setup>`, JavaScript — tanpa TypeScript), Vite 8, Vue Router 5, Pinia 3, Axios, Tailwind CSS v4 (via `@tailwindcss/postcss`), Quill (editor soal), `@vuepic/vue-datepicker`, `jwt-decode`. Ikon: Material Symbols Outlined (Google Fonts, `<span class="material-symbols-outlined">nama</span>`). Teks UI berbahasa Indonesia.

Dua jenis pengguna:
- **Admin** (`/admin/*`): CRUD mapel, jurusan, kelas, bank soal & soal, peserta, jadwal (+ jadwal kelas, section), token ujian, nilai (lihat + export Excel/ZIP, analisis jawaban, kartu ujian).
- **Peserta** (`/dashboard`, `/schedule`, `/ujian/:id`, `/ujian/:id/pengerjaan`): jadwal ujian hari ini, mulai ujian (token opsional bila `jadwal.wajib_token`), pengerjaan dengan section bergating waktu minimum.

## Perintah

```bash
npm install
npm run dev       # Vite dev server; /api di-proxy ke VITE_API_URL (default http://localhost:3000)
npm run build     # -> dist/
npm run preview
```

Belum ada test, linter, atau formatter. Verifikasi perubahan minimal dengan `npm run build` dan cek manual di browser (backend harus jalan, lihat `../ujian-back`).

`.env` (contoh di `.env.example`): `VITE_API_URL` dipakai oleh proxy di [vite.config.js](vite.config.js). Alias `@` → `src/`.

## Arsitektur

Fitur dikelompokkan per modul di `src/modules/<nama>/`:
- `routes/index.js` — export array `xxxRoutes`, lalu di-spread ke [src/router/index.js](src/router/index.js)
- `views/` — halaman (`XxxList.vue`, `XxxCreate.vue`, `XxxDetail.vue`, `XxxEdit.vue`)

Lapisan bersama:
- `src/services/api.js` — instance axios (`baseURL: '/api'`), interceptor menambahkan `Authorization: Bearer <token>`.
- `src/services/xxxService.js` — objek `xxxService` berisi fungsi async per endpoint; mengembalikan `response.data` (kecuali download blob yang mengembalikan `response` utuh). Pola `try { ... } catch (error) { throw error }` dipertahankan agar konsisten.
- `src/stores/xxx.js` — Pinia options store (`state/getters/actions`) dengan `isLoading`, `error`, `success`; pesan error diambil dari `err.response?.data?.message`. Tidak semua modul punya store — sebagian view memanggil service langsung (mis. [NilaiList.vue](src/modules/nilai/views/NilaiList.vue)).
- `src/services/token.js` — JWT & nama user di localStorage (`ujian_token`, `ujian_user_name`); `src/stores/auth.js` men-decode JWT, `currentUser.role` (`'admin'` atau lainnya).
- `src/router/guards.js` — guard global: route publik hanya `/login` & `/register`; selain itu wajib login; `meta.requiresAdmin` dicek terhadap `role === 'admin'`. Route tak dikenal → `/dashboard`.
- `src/composables/useDialog.js` + `components/AppDialog.vue` (di-mount sekali di `App.vue`) — pakai `$alert`, `$confirm`, `$prompt` (Promise) alih-alih `alert()/confirm()` bawaan browser.
- `src/utils/download.js` — `downloadBlob(response, defaultFilename, mime)` dan `extractBlobErrorMessage(err, fallback)` untuk endpoint export (`responseType: 'blob'`).
- Komponen: `SideBar.vue` (menu, tambah link baru di sini), `TopAppBar.vue`, `SearchableSelect.vue`, `DateTimePicker.vue`.

## Konvensi

- Halaman admin memakai layout: `<SideBar />`, `<TopAppBar />`, lalu `<main class="lg:ml-64 min-h-screen"><div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">`. Contoh acuan: [MapelList.vue](src/modules/mapel/views/MapelList.vue).
- [App.vue](src/App.vue) menyembunyikan header default untuk path yang diawali `/dashboard`, `/admin`, `/schedule`, `/ujian` — perbarui `isDashboardPage` jika menambah prefix baru.
- Styling dengan utility Tailwind (palet `slate`/`sky`) dan token tema di [src/style.css](src/style.css) (`@theme`, warna Material 3 seperti `bg-surface`, `text-primary`).
- Nama field mengikuti API backend (snake_case: `id_jadwal`, `nama_mapel`, `page_size`). Pagination: param `page` & `page_size`, respons `data.data` + `data.total`.
- Konten soal/jawaban adalah HTML dari Quill dan dirender dengan `v-html`; entitas HTML bisa perlu di-decode (lihat `decodeHtmlEntities` di [SoalDetail.vue](src/modules/bank-soal/views/SoalDetail.vue)).
- File `*_API.md`, `*_IMPLEMENTATION.md`, `issue-*.md` di root adalah dokumentasi/perencanaan fitur — rujuk saat menyentuh modul terkait, tapi kode adalah sumber kebenaran.

## Git

Kerja di branch `feature/<nama>` lalu PR ke `main`. Pesan commit gaya conventional (`feat:`, `fix:`) dalam bahasa Inggris.
