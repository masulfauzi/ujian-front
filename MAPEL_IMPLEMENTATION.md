# 📋 ISSUE: Implementasi Menu Mapel (Subject Management) untuk Admin

## 🎯 Deskripsi Fitur

Membuat fitur manajemen mata pelajaran (Mapel) yang dapat diakses oleh admin. Admin dapat melakukan operasi CRUD (Create, Read, Update, Delete) untuk mengelola mata pelajaran dalam sistem ujian.

---

## 📦 Komponen yang Perlu Dibuat

1. **Service untuk API Mapel** → `src/services/mapelService.js`
2. **Pinia Store untuk State Management** → `src/stores/mapel.js`
3. **View Component - List Mapel** → `src/modules/mapel/views/MapelList.vue`
4. **View Component - Create Mapel** → `src/modules/mapel/views/MapelCreate.vue`
5. **View Component - Edit Mapel** → `src/modules/mapel/views/MapelEdit.vue`
6. **View Component - Detail Mapel** → `src/modules/mapel/views/MapelDetail.vue`
7. **Router Configuration** → `src/modules/mapel/routes/index.js`
8. **Reusable Components**:
   - Form Input Component
   - Pagination Component
   - Status Badge Component
   - Delete Confirmation Dialog Component

---

## 🔄 Tahapan Implementasi

### **TAHAP 1: Setup Service & Store**

#### 1.1 Buat Service untuk API Mapel (`src/services/mapelService.js`)

**Tujuan:** Menangani komunikasi dengan backend API mapel

**Langkah:**
- Import axios atau instance API yang sudah ada
- Buat function untuk setiap endpoint:
  - `getMapelList(page = 1, pageSize = 10)` → GET /api/mapel
  - `getMapelById(id)` → GET /api/mapel/:id
  - `createMapel(data)` → POST /api/mapel
  - `updateMapel(id, data)` → PUT /api/mapel/:id
  - `deleteMapel(id)` → DELETE /api/mapel/:id
  - `restoreMapel(id)` → PATCH /api/mapel/:id/restore

**Catatan Penting:**
- POST, PUT, DELETE memerlukan JWT token (Authorization header)
- GET adalah public endpoint (tidak perlu auth)
- Gunakan error handling yang proper untuk setiap request
- Return response.data dari API

**Contoh struktur:**
```javascript
export const mapelService = {
  getMapelList: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/api/mapel', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  createMapel: async (payload) => {
    // POST request dengan JWT token
  },
  // ... other functions
}
```

---

#### 1.2 Buat Pinia Store untuk Mapel (`src/stores/mapel.js`)

**Tujuan:** Manage state untuk data mapel di level aplikasi

**State yang diperlukan:**
```javascript
state: {
  mapels: [],           // Array of mapel objects
  totalMapels: 0,       // Total count
  currentPage: 1,       // Current page for pagination
  pageSize: 10,         // Items per page
  selectedMapel: null,  // Detail mapel yang sedang dilihat/diedit
  isLoading: false,     // Loading state
  error: null,          // Error message
  success: null,        // Success message
}
```

**Getters yang diperlukan:**
- `hasMapels` → Check if mapels array has data
- `mapelCount` → Total count of mapels
- `totalPages` → Calculate total pages
- `mapelById` → Get mapel by ID (for detail view)

**Actions yang diperlukan:**
- `fetchMapelList(page)` → Fetch mapel dengan pagination
- `fetchMapelById(id)` → Fetch detail mapel
- `createMapel(payload)` → Create new mapel
- `updateMapel(id, payload)` → Update existing mapel
- `deleteMapel(id)` → Soft delete mapel
- `restoreMapel(id)` → Restore deleted mapel
- `clearError()` → Clear error state
- `clearSuccess()` → Clear success state

**Catatan:**
- Set `isLoading = true` saat fetch dimulai
- Set `isLoading = false` di finally block
- Gunakan try-catch untuk error handling
- Update state dengan data dari response API
- Export store dengan `useMapelStore = defineStore('mapel', {...})`

---

### **TAHAP 2: Buat Router dan Route Guard**

#### 2.1 Buat Router Configuration (`src/modules/mapel/routes/index.js`)

**Tujuan:** Define routes untuk mapel management

**Routes yang diperlukan:**
```javascript
mapelRoutes = [
  {
    path: '/admin/mapel',
    name: 'mapel.list',
    component: MapelList,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/mapel/create',
    name: 'mapel.create',
    component: MapelCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/mapel/:id',
    name: 'mapel.detail',
    component: MapelDetail,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/mapel/:id/edit',
    name: 'mapel.edit',
    component: MapelEdit,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]
```

**Catatan:**
- Semua route memerlukan `requiresAuth: true` dan `requiresAdmin: true`
- Import routes ini di `src/router/index.js` dan daftarkan ke router
- Route guard sudah ada di `src/router/guards.js`, tidak perlu diubah

---

### **TAHAP 3: Buat View Components**

#### 3.1 MapelList.vue (`src/modules/mapel/views/MapelList.vue`)

**Tujuan:** Menampilkan daftar semua mapel dengan fitur CRUD

**UI Elements:**
- **Header Section**: Judul "Manajemen Mapel" + tombol "Buat Mapel Baru"
- **Search/Filter**: Input field untuk cari mapel (optional tapi recommended)
- **Tabel Mapel** dengan kolom:
  - No. (auto increment)
  - Nama Mapel
  - Kode Mapel
  - Deskripsi (truncate jika terlalu panjang)
  - Aksi (View, Edit, Delete)
- **Pagination**: Navigasi ke halaman sebelum/sesudah

**Fitur:**
- Fetch data mapel saat component mounted
- Handle loading state (show spinner)
- Handle error state (show error message)
- Implementasi pagination (prev/next buttons)
- Delete confirmation dialog sebelum menghapus
- Toast notification untuk success/error message

**Setup Script:**
```javascript
<script setup>
import { onMounted, ref, computed } from 'vue'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'

const mapelStore = useMapelStore()
const router = useRouter()
const currentPage = ref(1)

onMounted(async () => {
  await mapelStore.fetchMapelList(currentPage.value)
})

const mapels = computed(() => mapelStore.mapels)
const isLoading = computed(() => mapelStore.isLoading)
const error = computed(() => mapelStore.error)

const handleCreate = () => {
  router.push({ name: 'mapel.create' })
}

const handleView = (id) => {
  router.push({ name: 'mapel.detail', params: { id } })
}

const handleEdit = (id) => {
  router.push({ name: 'mapel.edit', params: { id } })
}

const handleDelete = async (id) => {
  if (confirm('Yakin ingin menghapus mapel ini?')) {
    await mapelStore.deleteMapel(id)
    await mapelStore.fetchMapelList(currentPage.value)
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await mapelStore.fetchMapelList(page)
}
</script>
```

---

#### 3.2 MapelCreate.vue (`src/modules/mapel/views/MapelCreate.vue`)

**Tujuan:** Form untuk membuat mapel baru

**UI Elements:**
- **Form Title**: "Buat Mapel Baru"
- **Form Fields**:
  - `nama_mapel` (text input) - required
  - `kode_mapel` (text input) - required
  - `deskripsi` (textarea) - optional
- **Action Buttons**:
  - Tombol "Simpan" (warna primary)
  - Tombol "Batal" (warna secondary)

**Fitur:**
- Client-side validation:
  - `nama_mapel`: required, max 255 chars
  - `kode_mapel`: required, max 20 chars
  - `deskripsi`: optional
- Show error messages saat validation gagal
- Submit form ke API via store
- Loading state pada tombol saat submit
- Redirect ke MapelList setelah success
- Show error toast jika submit gagal

**Setup Script:**
```javascript
<script setup>
import { reactive, ref } from 'vue'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'

const mapelStore = useMapelStore()
const router = useRouter()
const isSubmitting = ref(false)

const formData = reactive({
  nama_mapel: '',
  kode_mapel: '',
  deskripsi: ''
})

const errors = reactive({
  nama_mapel: '',
  kode_mapel: ''
})

const validateForm = () => {
  // Validate required fields
  // Return true if valid, false otherwise
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  try {
    await mapelStore.createMapel(formData)
    router.push({ name: 'mapel.list' })
  } catch (error) {
    // Handle error
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
```

---

#### 3.3 MapelEdit.vue (`src/modules/mapel/views/MapelEdit.vue`)

**Tujuan:** Form untuk edit mapel yang sudah ada

**UI Elements:**
- **Form Title**: "Edit Mapel" atau "Edit: [Nama Mapel]"
- **Form Fields**: Sama seperti MapelCreate (nama_mapel, kode_mapel, deskripsi)
- **Action Buttons**: "Simpan" dan "Batal"

**Fitur:**
- Fetch detail mapel berdasarkan ID dari route params saat mounted
- Populate form dengan data mapel yang ada
- Client-side validation (sama seperti Create)
- Show loading state saat fetch detail
- Show error jika mapel tidak ditemukan
- Submit form via store dengan ID
- Redirect ke detail view atau list setelah success

**Setup Script:**
```javascript
<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMapelStore } from '@/stores/mapel'

const route = useRoute()
const router = useRouter()
const mapelStore = useMapelStore()
const mapelId = route.params.id
const isLoading = ref(true)
const isSubmitting = ref(false)

const formData = reactive({
  nama_mapel: '',
  kode_mapel: '',
  deskripsi: ''
})

onMounted(async () => {
  try {
    await mapelStore.fetchMapelById(mapelId)
    const mapel = mapelStore.selectedMapel
    
    formData.nama_mapel = mapel.nama_mapel
    formData.kode_mapel = mapel.kode_mapel
    formData.deskripsi = mapel.deskripsi
  } catch (error) {
    // Handle error
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    await mapelStore.updateMapel(mapelId, formData)
    router.push({ name: 'mapel.list' })
  } catch (error) {
    // Handle error
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

---

#### 3.4 MapelDetail.vue (`src/modules/mapel/views/MapelDetail.vue`)

**Tujuan:** Menampilkan detail mapel dalam format read-only

**UI Elements:**
- **Judul**: Nama mapel
- **Detail Cards/Sections**:
  - Kode Mapel
  - Deskripsi
  - Created At
  - Updated At
- **Action Buttons**:
  - Tombol "Edit" (warna primary)
  - Tombol "Delete" (warna red/danger)
  - Tombol "Kembali" (warna secondary)

**Fitur:**
- Fetch detail mapel saat mounted
- Show loading state
- Show error jika mapel tidak ditemukan
- Delete dengan confirmation dialog
- Redirect ke list setelah delete
- Redirect ke edit view saat klik edit

---

### **TAHAP 4: Integrasi ke Admin Menu**

#### 4.1 Update SideBar.vue

**Lokasi:** `src/components/SideBar.vue`

**Perubahan:**
Tambahkan menu item "Mapel" di admin navigation menu:

```vue
<!-- Dalam section "Navigation Menu - Admin" -->
<router-link to="/admin/mapel"
  class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
  <span class="material-symbols-outlined">subject</span>
  <span class="font-label-md text-label-md">Mapel</span>
</router-link>
```

**Material Icon:** `subject` (atau `book` jika lebih sesuai)

---

#### 4.2 Update Router (`src/router/index.js`)

**Perubahan:**
Import dan daftarkan route mapel ke router:

```javascript
import { mapelRoutes } from '@/modules/mapel/routes'

// Dalam router.addRoutes() atau routes array
router.addRoutes([
  ...dashboardRoutes,
  ...mapelRoutes,  // Tambahkan ini
  ...authRoutes
])
```

---

### **TAHAP 5: Styling & Polish**

#### 5.1 Tailwind CSS Styling

**Guidelines:**
- Gunakan design system yang sudah ada (warna, spacing, typography)
- Reference file yang sudah ada: `DashboardAdmin.vue`, `SideBar.vue`
- Konsisten dengan color scheme:
  - Primary: `sky-600`, `sky-50`
  - Danger: `red-600`, `red-50`
  - Success: `green-600`, `green-50`
  - Warning: `yellow-600`, `yellow-50`

#### 5.2 Form Styling

**Reusable Form Components:**
Jika ada waktu, buat reusable components:
- `FormInput.vue` → Text input dengan label dan error handling
- `FormTextarea.vue` → Textarea dengan label dan error handling
- `ConfirmDialog.vue` → Confirmation dialog untuk delete
- `PaginationControl.vue` → Pagination buttons

---

### **TAHAP 6: Testing**

#### 6.1 Manual Testing Checklist

**Pada MapelList:**
- ✅ Buka halaman `/admin/mapel`
- ✅ Verify daftar mapel tampil dengan pagination
- ✅ Click tombol "Buat Mapel Baru" → redirect ke create form
- ✅ Click edit button → redirect ke edit form
- ✅ Click delete button → show confirmation → delete data
- ✅ Pagination buttons working properly

**Pada MapelCreate:**
- ✅ Buka halaman `/admin/mapel/create`
- ✅ Verify form fields ada (nama, kode, deskripsi)
- ✅ Submit dengan data valid → success dan redirect ke list
- ✅ Submit dengan data tidak valid → show error message
- ✅ Click cancel → kembali ke list

**Pada MapelEdit:**
- ✅ Buka halaman `/admin/mapel/:id/edit`
- ✅ Verify form pre-filled dengan data mapel
- ✅ Update data → success dan redirect ke list
- ✅ Error handling ketika mapel tidak ditemukan

**Pada MapelDetail:**
- ✅ Buka halaman `/admin/mapel/:id`
- ✅ Verify semua detail mapel tampil
- ✅ Click edit → redirect ke edit form
- ✅ Click delete → confirmation → success

#### 6.2 API Integration Testing

**Testing dengan cURL (reference dari MAPEL_API.md):**
```bash
# Get token
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@test.com", "password": "password123"}'

# List mapel (public)
curl "http://localhost:3000/api/mapel?page=1&page_size=5"

# Create mapel (dengan token)
TOKEN="your_token_here"
curl -X POST "http://localhost:3000/api/mapel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"nama_mapel": "Test Mapel", "kode_mapel": "TST"}'
```

---

## 📚 Reference & Dependencies

### API Documentation
- **File:** `MAPEL_API.md`
- **Base URL:** `http://localhost:3000/api/mapel`
- **Auth:** JWT token required untuk POST, PUT, DELETE

### Existing Code Patterns

**Referensi untuk Service:**
- `src/services/authService.js` → API call pattern

**Referensi untuk Store:**
- `src/stores/admin.js` → Pinia store pattern dengan state, getters, actions

**Referensi untuk Components:**
- `src/modules/dashboard/views/DashboardAdmin.vue` → Grid layout, stats cards
- `src/modules/auth/views/Login.vue` → Form handling, validation, error display

**Referensi untuk Router:**
- `src/modules/dashboard/routes/index.js` → Route structure
- `src/router/guards.js` → Auth guard implementation

---

## 🔧 Development Tips

### 1. Setup API Configuration
Pastikan `src/services/api.js` sudah configured dengan base URL yang benar:
```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
})
```

### 2. Error Handling Pattern
```javascript
try {
  // API call
} catch (error) {
  const message = error.response?.data?.message || 'An error occurred'
  store.error = message
}
```

### 3. Loading & Error States
Selalu gunakan:
```javascript
isLoading = true → during fetch
isLoading = false → in finally block
error = null → clear before request
error = message → set on error
```

### 4. Router Navigation
```javascript
// Push to list after success
router.push({ name: 'mapel.list' })

// Go back to previous page
router.back()

// Navigate with params
router.push({ name: 'mapel.edit', params: { id: mapelId } })
```

### 5. Form Validation
```javascript
// Keep validation simple and reusable
const validateRequired = (value) => value && value.trim().length > 0
const validateMaxLength = (value, max) => value.length <= max
```

---

## 📋 File Structure Overview

```
src/
├── modules/
│   └── mapel/
│       ├── views/
│       │   ├── MapelList.vue ✅ Create
│       │   ├── MapelCreate.vue ✅ Create
│       │   ├── MapelEdit.vue ✅ Create
│       │   └── MapelDetail.vue ✅ Create
│       └── routes/
│           └── index.js ✅ Create
├── services/
│   └── mapelService.js ✅ Create
├── stores/
│   └── mapel.js ✅ Create
└── components/
    └── SideBar.vue 🔄 Update (add menu item)
└── router/
    └── index.js 🔄 Update (register mapel routes)
```

---

## ⏱️ Estimated Timeline

- **Setup Service & Store:** 1-2 jam
- **Router Configuration:** 30 menit
- **MapelList Component:** 1.5-2 jam
- **MapelCreate Component:** 1-1.5 jam
- **MapelEdit Component:** 1-1.5 jam
- **MapelDetail Component:** 1 jam
- **Integration & Styling:** 1-1.5 jam
- **Testing:** 1 jam
- **Total:** 8-10 jam kerja

---

## ✅ Checklist Sebelum Selesai

- [ ] Semua components ter-create dan ter-route dengan benar
- [ ] MapelList menampilkan daftar mapel dengan pagination
- [ ] MapelCreate berfungsi untuk buat mapel baru
- [ ] MapelEdit berfungsi untuk update mapel
- [ ] MapelDetail menampilkan detail mapel
- [ ] Delete mapel dengan confirmation dialog
- [ ] Menu "Mapel" muncul di admin sidebar
- [ ] Semua form memiliki validation
- [ ] Error handling di semua component
- [ ] Loading state ditampilkan dengan proper
- [ ] Navigation antar page berfungsi dengan baik
- [ ] Styling konsisten dengan design system yang ada
- [ ] Semua manual testing checklist tercapai
- [ ] Tidak ada console error
- [ ] Code sudah di-review dan siap di-merge

---

## 💡 Notes untuk Implementer

1. **Jangan overthink:** Ikuti pattern yang sudah ada di project
2. **Reuse code:** Lihat `DashboardAdmin.vue` dan `Login.vue` sebagai referensi
3. **Test frequently:** Jangan tunggu semua selesai baru test
4. **Ask questions:** Jika ada yang tidak jelas, reference ke MAPEL_API.md
5. **Keep it simple:** Prioritas functionality over perfection
6. **Follow conventions:** Gunakan naming yang konsisten (camelCase untuk JS, kebab-case untuk template)

---

**Created:** 2026-05-18  
**Status:** Ready for Implementation  
**Priority:** High
