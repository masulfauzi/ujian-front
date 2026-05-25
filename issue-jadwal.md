# Issue: Implementasi Halaman Jadwal Ujian

## Deskripsi

Buat halaman untuk menu **Jadwal Ujian** pada aplikasi admin. Fitur ini mencakup tampilan list jadwal, form create, dan form edit. Data jadwal berelasi dengan kelas melalui tabel pivot `jadwal_kelas`.

Referensi API:
- `JADWAL_API.md` — untuk operasi CRUD pada tabel jadwal
- `JADWAL_KELAS_API.md` — untuk operasi penugasan kelas ke jadwal

---

## Struktur File yang Harus Dibuat

Ikuti pola yang sama persis dengan modul `kelas` yang sudah ada di `src/modules/kelas/`.

```
src/
├── modules/
│   └── jadwal/
│       ├── routes/
│       │   └── index.js          ← definisi route
│       └── views/
│           ├── JadwalList.vue    ← halaman list
│           ├── JadwalCreate.vue  ← halaman create
│           └── JadwalEdit.vue    ← halaman edit
├── services/
│   ├── jadwalService.js          ← service API jadwal
│   └── jadwalKelasService.js     ← service API jadwal-kelas
└── stores/
    └── jadwal.js                 ← pinia store
```

---

## Tahapan Implementasi

Ikuti urutan di bawah ini. Jangan melompat step.

---

### Step 1 — Buat Service Layer

#### `src/services/jadwalService.js`

Buat file service untuk komunikasi dengan API `/api/jadwal`. Ikuti pola dari `src/services/kelasService.js`.

```js
import api from './api'

export const jadwalService = {
  getJadwalList: async (page = 1, pageSize = 10) => {
    const params = { page, page_size: pageSize }
    const response = await api.get('/jadwal', { params })
    return response.data
  },

  getJadwalById: async (id) => {
    const response = await api.get(`/jadwal/${id}`)
    return response.data
  },

  createJadwal: async (payload) => {
    // payload: { id_bank_soal, wkt_mulai, wkt_selesai }
    const response = await api.post('/jadwal', payload)
    return response.data
  },

  updateJadwal: async (id, payload) => {
    const response = await api.put(`/jadwal/${id}`, payload)
    return response.data
  },

  deleteJadwal: async (id) => {
    const response = await api.delete(`/jadwal/${id}`)
    return response.data
  },
}
```

#### `src/services/jadwalKelasService.js`

Buat file service untuk komunikasi dengan API `/api/jadwal-kelas`.

```js
import api from './api'

export const jadwalKelasService = {
  getJadwalKelasByJadwalId: async (idJadwal) => {
    const response = await api.get('/jadwal-kelas', {
      params: { id_jadwal: idJadwal, page_size: 100 },
    })
    return response.data
  },

  createJadwalKelas: async (payload) => {
    // payload: { id_jadwal, id_kelas }
    const response = await api.post('/jadwal-kelas', payload)
    return response.data
  },

  deleteJadwalKelas: async (id) => {
    // id = id dari baris jadwal_kelas (bukan id_jadwal)
    const response = await api.delete(`/jadwal-kelas/${id}`)
    return response.data
  },
}
```

---

### Step 2 — Buat Pinia Store

#### `src/stores/jadwal.js`

Ikuti pola dari `src/stores/kelas.js`. Store harus mengelola state untuk:
- Daftar jadwal (`jadwals`)
- Jadwal yang sedang dipilih (`selectedJadwal`)
- Daftar kelas yang ditugaskan ke jadwal terpilih (`jadwalKelas`)
- State loading dan error

```js
import { defineStore } from 'pinia'
import { jadwalService } from '@/services/jadwalService'
import { jadwalKelasService } from '@/services/jadwalKelasService'

export const useJadwalStore = defineStore('jadwal', {
  state: () => ({
    jadwals: [],
    totalJadwal: 0,
    currentPage: 1,
    pageSize: 10,
    selectedJadwal: null,
    jadwalKelas: [],   // kelas yang terdaftar pada jadwal terpilih
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.totalJadwal / state.pageSize),
  },

  actions: {
    async fetchJadwalList(page = 1, pageSize = 10) { /* ... */ },
    async fetchJadwalById(id) { /* ... */ },
    async createJadwal(payload) { /* ... */ },
    async updateJadwal(id, payload) { /* ... */ },
    async deleteJadwal(id) { /* ... */ },
    async fetchJadwalKelas(idJadwal) { /* ... */ },
    async syncJadwalKelas(idJadwal, selectedKelasIds) {
      // Lihat penjelasan di Step 5 — logika edit
    },
  },
})
```

---

### Step 3 — Buat Routes

#### `src/modules/jadwal/routes/index.js`

Ikuti persis pola dari `src/modules/kelas/routes/index.js`. Tidak ada halaman detail, hanya list, create, dan edit.

```js
import JadwalList from '../views/JadwalList.vue'
import JadwalCreate from '../views/JadwalCreate.vue'
import JadwalEdit from '../views/JadwalEdit.vue'

export const jadwalRoutes = [
  {
    path: '/admin/jadwal',
    name: 'jadwal.list',
    component: JadwalList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/create',
    name: 'jadwal.create',
    component: JadwalCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id/edit',
    name: 'jadwal.edit',
    component: JadwalEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
```

---

### Step 4 — Daftarkan Route di Router Utama

Buka `src/router/index.js`. Tambahkan import dan spread `jadwalRoutes` mengikuti pola yang sudah ada (lihat baris import `pesertaRoutes` sebagai contoh).

```js
// Tambahkan import ini di baris import lainnya
import { jadwalRoutes } from '../modules/jadwal/routes'

// Tambahkan di dalam array routes, setelah kelasRoutes
const routes = [
  ...
  ...kelasRoutes,
  ...jadwalRoutes,  // ← tambahkan di sini
  ...authRoutes,
]
```

---

### Step 5 — Buat Halaman JadwalList.vue

**File:** `src/modules/jadwal/views/JadwalList.vue`

Ikuti pola dari `src/modules/kelas/views/KelasList.vue`.

**Tampilan tabel yang harus muncul:**

| Kolom | Field dari API |
|-------|----------------|
| No | nomor urut |
| Nama Bank Soal | `nama_bank_soal` |
| Waktu Mulai | `wkt_mulai` |
| Waktu Selesai | `wkt_selesai` |
| Aksi | tombol Edit dan Hapus |

**Fitur yang harus ada:**
- Pagination (gunakan `totalPages` dari store)
- Tombol "Tambah Jadwal" yang mengarah ke `jadwal.create`
- Tombol Edit mengarah ke `jadwal.edit` dengan param `id`
- Tombol Hapus memanggil `deleteJadwal(id)` kemudian reload list

---

### Step 6 — Buat Halaman JadwalCreate.vue

**File:** `src/modules/jadwal/views/JadwalCreate.vue`

#### Form Fields

**1. Pilih Bank Soal**
- Tipe: `<select>` atau searchable dropdown
- Data: ambil dari API `/api/bank-soal` menggunakan `bankSoalService` yang sudah ada di `src/services/bankSoalService.js`
- Value yang disimpan: `id` dari bank soal
- Tampilkan: `nama` dari bank soal

**2. Waktu Mulai (`wkt_mulai`)**
- Tipe: `<input type="datetime-local">`
- Format yang dikirim ke API: `YYYY-MM-DD HH:MM:SS`
- Konversi dari value datetime-local: ganti karakter `T` dengan spasi
  ```js
  const formatted = form.wkt_mulai.replace('T', ' ') + ':00'
  ```

**3. Waktu Selesai (`wkt_selesai`)**
- Tipe: `<input type="datetime-local">`
- Format sama dengan `wkt_mulai`
- Validasi: `wkt_selesai` harus setelah `wkt_mulai` (tampilkan error jika tidak)

**4. Pilih Angkatan**
- Tipe: `<select>`
- Pilihan: `X`, `XI`, `XII`
- Ini bukan field yang dikirim ke API jadwal — hanya digunakan sebagai filter untuk memuat kelas

**5. Pilih Jurusan**
- Tipe: `<select>`
- Data: ambil dari API `/api/jurusan` menggunakan `jurusanService` yang sudah ada
- Ini bukan field yang dikirim ke API jadwal — hanya digunakan sebagai filter untuk memuat kelas

**6. Pilih Kelas (Checkbox)**
- Muncul setelah angkatan DAN jurusan dipilih
- Data: ambil dari API `/api/kelas` dengan filter `tingkat` (angkatan) dan `id_jurusan`
  ```js
  // Gunakan kelasService yang sudah ada
  kelasService.getKelasList(1, 100, {
    tingkat: selectedAngkatan,   // 'X', 'XI', atau 'XII'
    id_jurusan: selectedJurusan,
  })
  ```
- Tampilkan daftar kelas sebagai checkbox (bisa pilih lebih dari satu)
- Simpan ID kelas yang dipilih ke dalam array `selectedKelasIds`

#### Logika Simpan pada Create

```
1. Validasi semua field wajib terisi
2. Panggil createJadwal({ id_bank_soal, wkt_mulai, wkt_selesai })
3. Ambil id dari response (id jadwal yang baru dibuat)
4. Untuk setiap id kelas dalam selectedKelasIds:
   - Panggil createJadwalKelas({ id_jadwal, id_kelas })
5. Tampilkan pesan sukses
6. Redirect ke jadwal.list
```

---

### Step 7 — Buat Halaman JadwalEdit.vue

**File:** `src/modules/jadwal/views/JadwalEdit.vue`

Tampilan form sama persis dengan `JadwalCreate.vue` (field yang sama, layout yang sama).

#### Perbedaan dari Create

**Saat halaman dibuka (onMounted):**
1. Ambil data jadwal berdasarkan `id` dari route params → isi form `id_bank_soal`, `wkt_mulai`, `wkt_selesai`
2. Ambil semua kelas yang sudah terdaftar pada jadwal ini dari API `GET /api/jadwal-kelas?id_jadwal=:id`
3. Pre-select checkbox kelas yang sudah terdaftar
4. Untuk menampilkan kelas yang sudah dipilih, perlu tahu angkatan dan jurusan kelas tersebut — gunakan field `nama_kelas` untuk menentukan tampilan awal atau load semua kelas tanpa filter terlebih dahulu

#### Logika Simpan pada Edit

**Penting:** Pada proses edit, kelas tidak di-update satu per satu. Caranya adalah:

```
1. Validasi semua field wajib terisi
2. Panggil updateJadwal(id, { id_bank_soal, wkt_mulai, wkt_selesai })
3. Ambil semua jadwal_kelas yang ada untuk id_jadwal ini:
   GET /api/jadwal-kelas?id_jadwal=:id
4. Hapus SEMUA jadwal_kelas yang ada (hard delete, satu per satu berdasarkan id baris jadwal_kelas)
5. Insert ulang kelas yang dipilih di form:
   Untuk setiap id kelas dalam selectedKelasIds:
   - Panggil createJadwalKelas({ id_jadwal, id_kelas })
6. Tampilkan pesan sukses
7. Redirect ke jadwal.list
```

Contoh implementasi action `syncJadwalKelas` di store:

```js
async syncJadwalKelas(idJadwal, selectedKelasIds) {
  // Ambil data jadwal_kelas yang ada saat ini
  const existing = await jadwalKelasService.getJadwalKelasByJadwalId(idJadwal)
  const existingItems = existing.data?.data || []

  // Hapus semua yang ada
  for (const item of existingItems) {
    await jadwalKelasService.deleteJadwalKelas(item.id)
  }

  // Insert ulang yang dipilih
  for (const idKelas of selectedKelasIds) {
    await jadwalKelasService.createJadwalKelas({
      id_jadwal: idJadwal,
      id_kelas: idKelas,
    })
  }
},
```

---

### Step 8 — Tambahkan Menu di Sidebar

Buka `src/components/SideBar.vue`. Tambahkan link menu Jadwal mengikuti pola menu yang sudah ada (Kelas, Jurusan, dll).

---

## Catatan Penting

### Format Datetime

API menerima format: `YYYY-MM-DD HH:MM:SS`

Input HTML `datetime-local` menghasilkan format: `2025-08-01T08:00`

Konversi sebelum dikirim ke API:
```js
function formatDatetime(value) {
  if (!value) return ''
  return value.replace('T', ' ') + ':00'
}
```

Sebaliknya, untuk mengisi form dari data API (mode edit):
```js
function toDatetimeLocal(value) {
  if (!value) return ''
  // "2025-08-01 08:00:00" → "2025-08-01T08:00"
  return value.replace(' ', 'T').slice(0, 16)
}
```

### Validasi Waktu

Sebelum submit, validasi di frontend:
```js
if (new Date(form.wkt_selesai) <= new Date(form.wkt_mulai)) {
  error.value = 'Waktu selesai harus setelah waktu mulai'
  return
}
```

### Kelas Muncul Hanya Setelah Angkatan dan Jurusan Dipilih

Gunakan `watch` atau `computed` untuk memuat kelas setiap kali angkatan atau jurusan berubah:

```js
watch([selectedAngkatan, selectedJurusan], async ([angkatan, jurusan]) => {
  if (angkatan && jurusan) {
    await loadKelas(angkatan, jurusan)
    // Reset pilihan kelas saat filter berubah
    selectedKelasIds.value = []
  }
})
```

### Hard Delete pada Jadwal Kelas

Saat memanggil `DELETE /api/jadwal-kelas/:id`, yang dimaksud `:id` adalah **ID baris di tabel `jadwal_kelas`** (bukan `id_jadwal` dan bukan `id_kelas`). Pastikan menggunakan field `id` dari response GET jadwal-kelas.

---

## Referensi Kode yang Sudah Ada

Gunakan file-file berikut sebagai referensi pola implementasi:

| File | Kegunaan |
|------|----------|
| `src/modules/kelas/views/KelasList.vue` | Pola tampilan list dengan pagination |
| `src/modules/kelas/views/KelasCreate.vue` | Pola form create dengan dropdown |
| `src/modules/kelas/views/KelasEdit.vue` | Pola form edit dengan pre-filled data |
| `src/services/kelasService.js` | Pola service layer |
| `src/stores/kelas.js` | Pola pinia store |
| `src/modules/kelas/routes/index.js` | Pola definisi routes |

---

## Acceptance Criteria

- [ ] Halaman list menampilkan semua jadwal dengan kolom: No, Nama Bank Soal, Waktu Mulai, Waktu Selesai, Aksi
- [ ] Pagination berfungsi
- [ ] Form create memiliki semua field yang disebutkan
- [ ] Kelas hanya muncul setelah angkatan dan jurusan dipilih
- [ ] Kelas bisa dipilih lebih dari satu (checkbox)
- [ ] Data tersimpan dengan benar: jadwal di tabel `jadwal`, kelas di tabel `jadwal_kelas`
- [ ] Form edit pre-fill data dari API
- [ ] Pada edit: semua kelas lama dihapus, kemudian kelas baru di-insert ulang
- [ ] Validasi `wkt_selesai` harus setelah `wkt_mulai`
- [ ] Menu Jadwal muncul di Sidebar
