# Issue: Halaman Nilai — Filter Jadwal, Tampil Data, & Export

## Ringkasan

Buat halaman baru `/admin/nilai` untuk menampilkan nilai peserta ujian berdasarkan jadwal yang dipilih,
dilengkapi fitur export ke ZIP Excel menggunakan endpoint `GET /api/nilai/export/:id_jadwal`.

> Sidebar sudah mengarah ke `/admin/nilai` — menu item "Nilai" sudah ada di
> [src/components/SideBar.vue](src/components/SideBar.vue) baris 112–120.
> Router belum mendaftarkan route-nya, sehingga saat ini semua klik diarahkan ke dashboard (fallback).

---

## Struktur File Yang Harus Dibuat/Diubah

```
src/
├── modules/
│   └── nilai/                          ← buat folder baru
│       ├── routes/
│       │   └── index.js                ← buat baru
│       └── views/
│           └── NilaiList.vue           ← buat baru
├── services/
│   └── nilaiService.js                 ← tambah 2 method baru (file sudah ada)
└── router/
    └── index.js                        ← daftarkan nilaiRoutes (file sudah ada)
```

---

## Tahapan Implementasi

### Tahap 1 — Tambah Method ke nilaiService.js

File: [src/services/nilaiService.js](src/services/nilaiService.js)

File ini sudah ada. Tambahkan **dua method baru** di dalam objek `nilaiService`:

```js
// Ambil daftar nilai berdasarkan id_jadwal
getNilaiByJadwal: async (idJadwal) => {
  try {
    const response = await api.get(`/nilai/jadwal/${idJadwal}`)
    return response.data
  } catch (error) {
    throw error
  }
},

// Export nilai ke ZIP — responseType blob karena responnya file binary
exportNilai: async (idJadwal) => {
  try {
    const response = await api.get(`/nilai/export/${idJadwal}`, {
      responseType: 'blob',
    })
    return response
  } catch (error) {
    throw error
  }
},
```

> **Catatan penting:** `api.js` sudah menambahkan `Authorization: Bearer <token>` otomatis lewat
> interceptor ([src/services/api.js](src/services/api.js) baris 11–17).
> Tidak perlu menambahkan header auth secara manual.
> Untuk export, `responseType: 'blob'` **wajib** agar Axios tidak salah parsing binary sebagai string.

---

### Tahap 2 — Buat Route Module

Buat file baru: `src/modules/nilai/routes/index.js`

Ikuti persis pola yang sama dengan modul lain, contoh:
[src/modules/jadwal/routes/index.js](src/modules/jadwal/routes/index.js)

```js
import NilaiList from '../views/NilaiList.vue'

export const nilaiRoutes = [
  {
    path: '/admin/nilai',
    name: 'nilai.list',
    component: NilaiList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
```

---

### Tahap 3 — Daftarkan Route di Router

File: [src/router/index.js](src/router/index.js)

Tambahkan import dan spread `nilaiRoutes` ke dalam array `routes`:

```js
// Tambahkan import ini (urutan bersama import modul lainnya)
import { nilaiRoutes } from '../modules/nilai/routes'

// Tambahkan di dalam array routes (sebelum authRoutes)
const routes = [
    { path: '/', redirect: '/login' },
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...mapelRoutes,
    ...jurusanRoutes,
    ...kelasRoutes,
    ...pesertaRoutes,
    ...jadwalRoutes,
    ...jadwalPesertaRoutes,
    ...nilaiRoutes,   // ← tambahkan di sini
    ...authRoutes,
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]
```

---

### Tahap 4 — Buat View NilaiList.vue

Buat file baru: `src/modules/nilai/views/NilaiList.vue`

Ikuti struktur layout yang sama persis dengan halaman lain, contoh:
[src/modules/jadwal/views/JadwalList.vue](src/modules/jadwal/views/JadwalList.vue)

Layout terdiri dari:
- `<SideBar />` dan `<TopAppBar />`
- Container `<main class="lg:ml-64 min-h-screen">`
- Di dalam container: heading, filter, tabel data, tombol export

#### 4a. Filter Jadwal

Tampilkan `<select>` berisi semua jadwal yang diambil dari `GET /api/jadwal`.
Gunakan `jadwalService.getJadwalList()` yang **sudah ada** di
[src/services/jadwalService.js](src/services/jadwalService.js).

Saat jadwal dipilih, panggil `nilaiService.getNilaiByJadwal(idJadwal)` dan tampilkan hasilnya.

```vue
<select v-model="selectedJadwalId" @change="loadNilai"
        class="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500">
  <option value="">-- Pilih Jadwal --</option>
  <option v-for="jadwal in jadwalList" :key="jadwal.id" :value="jadwal.id">
    {{ jadwal.nama_ujian }}
  </option>
</select>
```

#### 4b. Tabel Nilai

Tampilkan data nilai dalam tabel setelah jadwal dipilih.
Gunakan pola tabel yang sama dengan `JadwalList.vue` (thead, tbody, loading state, empty state).

Kolom yang ditampilkan (sesuaikan dengan field yang dikembalikan API):
| Kolom | Field |
|---|---|
| No. | index |
| Nama Peserta | `nama_peserta` atau field serupa |
| Nilai | `nilai` atau `skor` |
| Status | `status` (lulus/tidak) |

> Cek struktur response dari `GET /api/nilai/jadwal/:id_jadwal` saat runtime untuk memastikan
> nama field yang benar, karena belum terdokumentasi di QUICK_REFERENCE_EXPORT_NILAI.md.

#### 4c. Tombol Export

Tampilkan tombol export hanya ketika `selectedJadwalId` sudah terisi dan data sudah tampil.
Implementasi fungsi download mengikuti pola React+Axios dari
[QUICK_REFERENCE_EXPORT_NILAI.md](QUICK_REFERENCE_EXPORT_NILAI.md) — diadaptasi ke Vue 3:

```js
const isExporting = ref(false)

const handleExport = async () => {
  if (!selectedJadwalId.value) return
  isExporting.value = true
  try {
    const response = await nilaiService.exportNilai(selectedJadwalId.value)
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const filename =
      response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'export_nilai.zip'
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal mengekspor nilai'
  } finally {
    isExporting.value = false
  }
}
```

Tombol-nya:
```vue
<button
  v-if="nilaiList.length > 0"
  @click="handleExport"
  :disabled="isExporting"
  class="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
  <span class="material-symbols-outlined">download</span>
  {{ isExporting ? 'Mengunduh...' : 'Export Nilai' }}
</button>
```

#### 4d. State Variables (`<script setup>`)

```js
import { ref, onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { jadwalService } from '@/services/jadwalService'
import { nilaiService } from '@/services/nilaiService'

const jadwalList = ref([])
const selectedJadwalId = ref('')
const nilaiList = ref([])
const isLoadingJadwal = ref(false)
const isLoadingNilai = ref(false)
const isExporting = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  isLoadingJadwal.value = true
  try {
    const res = await jadwalService.getJadwalList(1, 100) // ambil banyak untuk dropdown
    jadwalList.value = res.data?.data || []
  } catch {
    errorMsg.value = 'Gagal memuat daftar jadwal'
  } finally {
    isLoadingJadwal.value = false
  }
})

const loadNilai = async () => {
  if (!selectedJadwalId.value) {
    nilaiList.value = []
    return
  }
  isLoadingNilai.value = true
  errorMsg.value = ''
  try {
    const res = await nilaiService.getNilaiByJadwal(selectedJadwalId.value)
    nilaiList.value = res.data || []
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal memuat nilai'
    nilaiList.value = []
  } finally {
    isLoadingNilai.value = false
  }
}
```

---

## Checklist Implementasi

- [ ] **Tahap 1** — Tambah `getNilaiByJadwal` dan `exportNilai` ke `nilaiService.js`
- [ ] **Tahap 2** — Buat `src/modules/nilai/routes/index.js`
- [ ] **Tahap 3** — Daftarkan `nilaiRoutes` di `src/router/index.js`
- [ ] **Tahap 4a** — Buat `NilaiList.vue` dengan dropdown filter jadwal
- [ ] **Tahap 4b** — Tampilkan tabel data nilai setelah jadwal dipilih
- [ ] **Tahap 4c** — Implementasi tombol Export dengan download blob
- [ ] **Tahap 4d** — Pastikan semua state (loading, error, empty state) ditangani

---

## Hal-hal yang Perlu Diperhatikan

1. **Nama field response `/api/nilai/jadwal/:id_jadwal`** belum diketahui pasti.
   Saat runtime, lakukan `console.log(res)` terlebih dahulu untuk memastikan struktur datanya
   sebelum menulis kode tabel.

2. **`responseType: 'blob'` wajib** saat memanggil endpoint export.
   Tanpa ini, Axios akan mencoba parse binary sebagai JSON dan menghasilkan error.

3. **Jangan gunakan Pinia store baru** untuk fitur ini — cukup gunakan `ref` lokal di dalam
   komponen. Fitur ini sederhana dan tidak perlu state yang di-share antar halaman.

4. **Token sudah otomatis** ditambahkan oleh interceptor di `api.js`.
   Tidak perlu `localStorage.getItem('token')` secara manual seperti di contoh vanilla JS
   pada `QUICK_REFERENCE_EXPORT_NILAI.md`.

5. **Dropdown jadwal** perlu pageSize besar (e.g. 100) karena ini untuk filter,
   bukan tampilan tabel yang dipaginasi.

---

## Referensi

- Contoh layout & pola kode: [src/modules/jadwal/views/JadwalList.vue](src/modules/jadwal/views/JadwalList.vue)
- Contoh route module: [src/modules/jadwal/routes/index.js](src/modules/jadwal/routes/index.js)
- Contoh service: [src/services/jadwalService.js](src/services/jadwalService.js)
- Dokumentasi Export API: [QUICK_REFERENCE_EXPORT_NILAI.md](QUICK_REFERENCE_EXPORT_NILAI.md)
- Axios instance (base URL & auth interceptor): [src/services/api.js](src/services/api.js)
