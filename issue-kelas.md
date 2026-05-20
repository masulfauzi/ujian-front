# Issue: Implementasi Fitur Manajemen Kelas (CRUD)

## Deskripsi

Tambahkan menu **Kelas** pada sidebar admin dan buat halaman lengkap dengan operasi CRUD (Create, Read, Update, Delete).

**Branch yang digunakan:** `feature/kelas`

---

## Konteks Proyek

- Framework: **Vue 3** dengan Composition API (`<script setup>`)
- State management: **Pinia**
- Routing: **Vue Router**
- Styling: **Tailwind CSS**
- HTTP client: **Axios** (sudah terkonfigurasi di `src/services/api.js`, base URL `/api`, JWT token otomatis di-attach)

**Referensi utama saat implementasi:** modul **Jurusan** yang sudah selesai di `src/modules/jurusan/`. Jadikan semua file di modul Jurusan sebagai template dan sesuaikan untuk Kelas.

---

## Data Model Kelas

Berdasarkan `KELAS_API.md`, objek kelas memiliki struktur berikut:

```json
{
  "id": "uuid",
  "id_jurusan": "uuid",
  "nama_kelas": "X TKJ 1",
  "tingkat": "X",
  "created_at": "2026-05-19 10:00:00",
  "updated_at": "2026-05-19 10:00:00"
}
```

Field yang wajib diisi saat Create/Update:

| Field | Tipe | Validasi |
|---|---|---|
| `id_jurusan` | UUID (string) | Wajib, UUID valid dari tabel jurusan |
| `nama_kelas` | string | Wajib, maksimal 255 karakter |
| `tingkat` | string | Wajib, hanya boleh: `"X"`, `"XI"`, atau `"XII"` |

---

## Daftar File yang Harus Dibuat

### Tahap 1 — `src/services/kelasService.js`

Salin pola dari `src/services/jurusanService.js`. Perbedaan utama: `getKelasList` mendukung parameter filter opsional.

```js
import api from './api'

export const kelasService = {
  getKelasList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = { page, page_size: pageSize }
      if (filters.id_jurusan) params.id_jurusan = filters.id_jurusan
      if (filters.tingkat) params.tingkat = filters.tingkat
      const response = await api.get('/kelas', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getKelasById: async (id) => {
    try {
      const response = await api.get(`/kelas/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createKelas: async (payload) => {
    // payload: { id_jurusan, nama_kelas, tingkat }
    try {
      const response = await api.post('/kelas', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateKelas: async (id, payload) => {
    // payload: { id_jurusan, nama_kelas, tingkat }
    try {
      const response = await api.put(`/kelas/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteKelas: async (id) => {
    try {
      const response = await api.delete(`/kelas/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreKelas: async (id) => {
    try {
      const response = await api.patch(`/kelas/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
```

---

### Tahap 2 — `src/stores/kelas.js`

Salin pola dari `src/stores/jurusan.js`. Sesuaikan nama state, getter, dan action dari `jurusan` menjadi `kelas`.

State:
```js
state: () => ({
  kelass: [],        // daftar kelas (nama array "kelass" karena "kelas" jamak tidak berubah)
  totalKelas: 0,
  currentPage: 1,
  pageSize: 10,
  selectedKelas: null,
  isLoading: false,
  error: null,
  success: null,
})
```

Getters (ikuti pola jurusan store, ganti nama):
- `hasKelas`, `kelasCount`, `totalPages`, `kelasById`

Actions yang harus ada:
- `fetchKelasList(page, pageSize, filters)` — teruskan `filters` ke service
- `fetchKelasById(id)`
- `createKelas(payload)`
- `updateKelas(id, payload)`
- `deleteKelas(id)`
- `restoreKelas(id)`
- `clearError()`
- `clearSuccess()`

---

### Tahap 3 — `src/modules/kelas/routes/index.js`

Salin persis dari `src/modules/jurusan/routes/index.js`, ganti semua `jurusan`/`Jurusan` menjadi `kelas`/`Kelas`:

```js
import KelasList from '../views/KelasList.vue'
import KelasCreate from '../views/KelasCreate.vue'
import KelasEdit from '../views/KelasEdit.vue'
import KelasDetail from '../views/KelasDetail.vue'

export const kelasRoutes = [
  {
    path: '/admin/kelas',
    name: 'kelas.list',
    component: KelasList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/create',
    name: 'kelas.create',
    component: KelasCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id',
    name: 'kelas.detail',
    component: KelasDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id/edit',
    name: 'kelas.edit',
    component: KelasEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
```

---

### Tahap 4 — `src/modules/kelas/views/KelasList.vue`

Salin dari `src/modules/jurusan/views/JurusanList.vue`. Perbedaan:

**Judul halaman:**
```
Manajemen Kelas
```

**Kolom tabel:** tambahkan kolom Tingkat:
```html
<thead>
  <tr>
    <th>No.</th>
    <th>Nama Kelas</th>
    <th>Tingkat</th>
    <th class="text-center">Aksi</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(kelas, index) in kelass" :key="kelas.id">
    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
    <td>{{ kelas.nama_kelas }}</td>
    <td>{{ kelas.tingkat }}</td>
    <td><!-- tombol aksi --></td>
  </tr>
</tbody>
```

**Filter tingkat** (tambahkan di atas tabel, sebelum tabel/loading state):
```html
<div class="flex items-center gap-4 mb-4">
  <select
    v-model="filterTingkat"
    @change="handleFilter"
    class="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
    <option value="">Semua Tingkat</option>
    <option value="X">X</option>
    <option value="XI">XI</option>
    <option value="XII">XII</option>
  </select>
</div>
```

Di `<script setup>`:
```js
const filterTingkat = ref('')

const handleFilter = async () => {
  currentPage.value = 1
  await kelasStore.fetchKelasList(1, kelasStore.pageSize, { tingkat: filterTingkat.value })
}
```

Pastikan `fetchKelasList` di `onMounted` dan `handlePageChange` juga meneruskan filter yang aktif:
```js
onMounted(async () => {
  await kelasStore.fetchKelasList(1)
})

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await kelasStore.fetchKelasList(page, kelasStore.pageSize, { tingkat: filterTingkat.value })
  }
}
```

---

### Tahap 5 — `src/modules/kelas/views/KelasCreate.vue`

Salin dari `src/modules/jurusan/views/JurusanCreate.vue`. Perbedaan: form punya **3 field** bukan 1.

**Import tambahan yang dibutuhkan:**
```js
import SearchableSelect from '@/components/SearchableSelect.vue'
import { useJurusanStore } from '@/stores/jurusan'
```

**Tambahkan state untuk jurusan di `<script setup>`:**
```js
const jurusanStore = useJurusanStore()

onMounted(async () => {
  await jurusanStore.fetchJurusanList(1, 100) // 100 agar semua jurusan muncul di dropdown
})

const jurusanOptions = computed(() =>
  jurusanStore.jurusans.map(j => ({ value: j.id, label: j.nama_jurusan }))
)
```

**formData** harus berisi 3 field:
```js
const formData = reactive({
  id_jurusan: '',
  nama_kelas: '',
  tingkat: '',
})

const errors = reactive({
  id_jurusan: '',
  nama_kelas: '',
  tingkat: '',
})
```

**Validasi:**
```js
const validateForm = () => {
  errors.id_jurusan = formData.id_jurusan ? '' : 'Jurusan wajib dipilih'
  errors.nama_kelas = !formData.nama_kelas.trim()
    ? 'Nama kelas wajib diisi'
    : formData.nama_kelas.length > 255
      ? 'Nama kelas maksimal 255 karakter'
      : ''
  errors.tingkat = formData.tingkat ? '' : 'Tingkat wajib dipilih'
  return !errors.id_jurusan && !errors.nama_kelas && !errors.tingkat
}
```

**Template form (3 field):**
```html
<form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">

  <!-- Field: Jurusan -->
  <div>
    <label class="block text-sm font-semibold text-slate-900 mb-2">
      Jurusan <span class="text-red-600">*</span>
    </label>
    <SearchableSelect
      v-model="formData.id_jurusan"
      :options="jurusanOptions"
      placeholder="Pilih Jurusan..." />
    <p v-if="errors.id_jurusan" class="text-red-600 text-sm mt-1">{{ errors.id_jurusan }}</p>
  </div>

  <!-- Field: Nama Kelas -->
  <div>
    <label class="block text-sm font-semibold text-slate-900 mb-2">
      Nama Kelas <span class="text-red-600">*</span>
    </label>
    <input
      v-model="formData.nama_kelas"
      type="text"
      placeholder="Contoh: X TKJ 1"
      maxlength="255"
      class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
      :class="{ 'border-red-500 focus:ring-red-500': errors.nama_kelas }">
    <p v-if="errors.nama_kelas" class="text-red-600 text-sm mt-1">{{ errors.nama_kelas }}</p>
    <p class="text-slate-500 text-sm mt-1">{{ formData.nama_kelas.length }} / 255 karakter</p>
  </div>

  <!-- Field: Tingkat -->
  <div>
    <label class="block text-sm font-semibold text-slate-900 mb-2">
      Tingkat <span class="text-red-600">*</span>
    </label>
    <select
      v-model="formData.tingkat"
      class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
      :class="{ 'border-red-500 focus:ring-red-500': errors.tingkat }">
      <option value="" disabled>Pilih Tingkat...</option>
      <option value="X">X (Kelas 10)</option>
      <option value="XI">XI (Kelas 11)</option>
      <option value="XII">XII (Kelas 12)</option>
    </select>
    <p v-if="errors.tingkat" class="text-red-600 text-sm mt-1">{{ errors.tingkat }}</p>
  </div>

  <!-- Action Buttons -->
  <div class="flex gap-3 pt-4">
    <button type="submit" ...>Simpan Kelas</button>
    <button type="button" @click="handleCancel" ...>Batal</button>
  </div>
</form>
```

**handleSubmit:**
```js
const handleSubmit = async () => {
  if (!validateForm()) return
  isSubmitting.value = true
  try {
    await kelasStore.createKelas({
      id_jurusan: formData.id_jurusan,
      nama_kelas: formData.nama_kelas.trim(),
      tingkat: formData.tingkat,
    })
    router.push({ name: 'kelas.list' })
  } catch (err) {
    error.value = kelasStore.error || 'Gagal membuat kelas'
    isSubmitting.value = false
  }
}
```

---

### Tahap 6 — `src/modules/kelas/views/KelasEdit.vue`

Salin dari `src/modules/kelas/views/KelasCreate.vue` (file yang baru dibuat di Tahap 5). Perbedaan:

- Saat `onMounted`, fetch kelas by ID lalu isi form:
  ```js
  const kelasId = route.params.id
  
  onMounted(async () => {
    await jurusanStore.fetchJurusanList(1, 100)
    try {
      await kelasStore.fetchKelasById(kelasId)
      const kelas = kelasStore.selectedKelas
      if (kelas) {
        formData.id_jurusan = kelas.id_jurusan
        formData.nama_kelas = kelas.nama_kelas
        formData.tingkat = kelas.tingkat
      }
    } catch (err) {
      error.value = 'Kelas tidak ditemukan'
    } finally {
      isLoadingDetail.value = false
    }
  })
  ```

- `handleSubmit` memanggil `updateKelas` bukan `createKelas`:
  ```js
  await kelasStore.updateKelas(kelasId, {
    id_jurusan: formData.id_jurusan,
    nama_kelas: formData.nama_kelas.trim(),
    tingkat: formData.tingkat,
  })
  ```

- Judul halaman: `Edit Kelas`

---

### Tahap 7 — `src/modules/kelas/views/KelasDetail.vue`

Salin dari `src/modules/jurusan/views/JurusanDetail.vue`. Perbedaan: tampilkan lebih banyak field.

Field yang ditampilkan:
- `nama_kelas` (judul utama)
- `tingkat` (badge atau text)
- `id_jurusan` (cukup tampilkan UUID-nya saja, tidak perlu resolve nama jurusan)
- `created_at` dan `updated_at` (gunakan fungsi `formatDate` yang sama)

Contoh card untuk field tambahan:
```html
<div class="bg-white rounded-lg shadow border border-slate-200 p-6">
  <h3 class="text-sm font-semibold text-slate-600 uppercase mb-4">Informasi Kelas</h3>
  <div class="space-y-3">
    <div>
      <p class="text-xs text-slate-500 uppercase">Nama Kelas</p>
      <p class="text-slate-900 font-medium">{{ selectedKelas.nama_kelas }}</p>
    </div>
    <div>
      <p class="text-xs text-slate-500 uppercase">Tingkat</p>
      <p class="text-slate-900 font-medium">{{ selectedKelas.tingkat }}</p>
    </div>
    <div>
      <p class="text-xs text-slate-500 uppercase">ID Jurusan</p>
      <p class="text-slate-900 font-medium font-mono text-sm">{{ selectedKelas.id_jurusan }}</p>
    </div>
  </div>
</div>
```

---

## Daftar File yang Harus Dimodifikasi

### 1. `src/router/index.js`

Tambahkan import dan daftarkan `kelasRoutes` (setelah jurusanRoutes):

```js
// Tambahkan import
import { kelasRoutes } from '../modules/kelas/routes'

// Tambahkan di array routes
const routes = [
    { path: '/', redirect: '/login' },
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...mapelRoutes,
    ...jurusanRoutes,
    ...kelasRoutes,   // <-- tambahkan di sini
    ...authRoutes,
]
```

---

### 2. `src/components/SideBar.vue`

Tambahkan link menu Kelas di bagian `<nav v-else>` (Navigation Menu Admin), **letakkan setelah blok `router-link` ke `/admin/jurusan`** (sekitar baris 58–67):

```html
<router-link to="/admin/kelas"
    :class="[
        'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
        isActivePath('/admin/kelas')
            ? 'bg-sky-50 text-sky-600'
            : 'text-slate-600 hover:bg-slate-50 transition-all'
    ]">
    <span class="material-symbols-outlined">meeting_room</span>
    <span class="font-label-md text-label-md">Kelas</span>
</router-link>
```

---

### 3. `src/stores/index.js`

Tambahkan satu baris export:

```js
export { useKelasStore } from './kelas'
```

---

## Struktur Folder yang Diharapkan Setelah Selesai

```
src/
├── modules/
│   └── kelas/
│       ├── routes/
│       │   └── index.js          (BARU)
│       └── views/
│           ├── KelasList.vue     (BARU)
│           ├── KelasCreate.vue   (BARU)
│           ├── KelasEdit.vue     (BARU)
│           └── KelasDetail.vue   (BARU)
├── services/
│   └── kelasService.js           (BARU)
├── stores/
│   ├── index.js                  (EDIT: tambah export kelas)
│   └── kelas.js                  (BARU)
├── components/
│   └── SideBar.vue               (EDIT: tambah menu Kelas)
└── router/
    └── index.js                  (EDIT: daftarkan kelasRoutes)
```

---

## Urutan Pengerjaan yang Disarankan

| Urutan | File | Aksi |
|---|---|---|
| 1 | `src/services/kelasService.js` | Buat |
| 2 | `src/stores/kelas.js` | Buat |
| 3 | `src/stores/index.js` | Edit (tambah export) |
| 4 | `src/modules/kelas/routes/index.js` | Buat |
| 5 | `src/modules/kelas/views/KelasCreate.vue` | Buat |
| 6 | `src/modules/kelas/views/KelasEdit.vue` | Buat |
| 7 | `src/modules/kelas/views/KelasDetail.vue` | Buat |
| 8 | `src/modules/kelas/views/KelasList.vue` | Buat |
| 9 | `src/router/index.js` | Edit (daftarkan routes) |
| 10 | `src/components/SideBar.vue` | Edit (tambah menu) |

---

## Checklist Verifikasi

Setelah implementasi selesai, pastikan semua item berikut berfungsi:

- [ ] Menu "Kelas" muncul di sidebar admin, di antara Jurusan dan Bank Soal
- [ ] Halaman `/admin/kelas` menampilkan daftar kelas dalam tabel dengan kolom No., Nama Kelas, Tingkat, Aksi
- [ ] Dropdown filter tingkat berfungsi dan memfilter tabel
- [ ] Pagination berfungsi
- [ ] Empty state muncul jika tidak ada data
- [ ] Tombol "Buat Kelas Baru" membuka halaman `/admin/kelas/create`
- [ ] Form create menampilkan SearchableSelect untuk memilih Jurusan
- [ ] Form create menampilkan dropdown Tingkat (X, XI, XII)
- [ ] Validasi form berjalan — pesan error muncul jika field kosong
- [ ] Setelah simpan (create), redirect ke list dan data baru muncul
- [ ] Tombol visibility membuka halaman detail `/admin/kelas/:id`
- [ ] Halaman detail menampilkan semua field kelas
- [ ] Tombol edit di detail membuka form edit dengan data yang sudah terisi
- [ ] Setelah update (edit), redirect ke list
- [ ] Tombol hapus menampilkan konfirmasi dialog sebelum menghapus
- [ ] Setelah hapus, data hilang dari daftar
- [ ] Semua halaman hanya bisa diakses admin (protected route)

---

## Catatan Penting

1. **Komponen `SearchableSelect`** sudah ada di `src/components/SearchableSelect.vue`. Jangan buat ulang, cukup import.

2. **Token auth** sudah otomatis di-attach oleh axios interceptor di `src/services/api.js`. Tidak perlu tambahkan header Authorization secara manual.

3. **Pola error/success message:** Gunakan `watch` yang auto-clear setelah 3 detik, sama persis dengan `JurusanList.vue`:
   ```js
   watch(success, (val) => { if (val) setTimeout(() => kelasStore.clearSuccess(), 3000) })
   watch(error, (val) => { if (val) setTimeout(() => kelasStore.clearError(), 3000) })
   ```

4. **Soft delete:** API menggunakan soft delete. Setelah delete berhasil, cukup filter data dari state lokal (ikuti pola `deleteJurusan` di `jurusan.js` store). Fitur restore tidak perlu diimplementasikan di UI untuk saat ini.

5. **Komponen layout:** Setiap file `.vue` di dalam `views/` harus menyertakan `<SideBar />` dan `<TopAppBar />` di dalam template — lihat semua view yang sudah ada sebagai contoh.
