# 📋 ISSUE: Implementasi Menu Bank Soal (Question Bank) untuk Admin

## 🎯 Deskripsi Fitur

Membuat fitur manajemen bank soal (question bank) yang memungkinkan admin untuk mengelola semua pertanyaan ujian dalam sistem. Admin dapat melakukan operasi CRUD untuk soal, mengkategorikan soal berdasarkan mata pelajaran, dan mengelola pilihan jawaban dengan mudah.

---

## 📦 Komponen yang Perlu Dibuat

1. **Service untuk API Bank Soal** → `src/services/bankSoalService.js`
2. **Pinia Store untuk State Management** → `src/stores/bankSoal.js`
3. **View Component - List Bank Soal** → `src/modules/bank-soal/views/BankSoalList.vue`
4. **View Component - Create Soal** → `src/modules/bank-soal/views/SoalCreate.vue`
5. **View Component - Edit Soal** → `src/modules/bank-soal/views/SoalEdit.vue`
6. **View Component - Detail Soal** → `src/modules/bank-soal/views/SoalDetail.vue`
7. **Router Configuration** → `src/modules/bank-soal/routes/index.js`
8. **Reusable Components**:
   - Form Input Component (sudah ada dari mapel)
   - Textarea Component untuk soal dan pilihan jawaban
   - Radio/Checkbox Component untuk jawaban benar
   - Filter Component untuk mapel dan tipe soal
   - Pagination Component (sudah ada dari mapel)

---

## 📚 Asumsi API Bank Soal

Berdasarkan pola API yang biasa digunakan, berikut adalah struktur API yang diasumsikan:

### Base URL
```
http://localhost:3000/api/bank-soal
```

### Endpoints yang Diharapkan

**GET /api/bank-soal** - List semua soal dengan pagination
- Query params: `page`, `page_size`, `mapel_id` (filter), `tipe` (filter)
- Response: `{ data: [...], total, page, page_size, total_page }`

**GET /api/bank-soal/:id** - Detail soal
- Response: `{ id, mapel_id, tipe_soal, pertanyaan, pilihan_jawaban: [], jawaban_benar, ... }`

**POST /api/bank-soal** - Buat soal baru
- Body: `{ mapel_id, tipe_soal, pertanyaan, pilihan_jawaban, jawaban_benar, tingkat_kesulitan }`
- Response: Created soal dengan ID

**PUT /api/bank-soal/:id** - Update soal
- Body: Same as POST

**DELETE /api/bank-soal/:id** - Soft delete soal

**PATCH /api/bank-soal/:id/restore** - Restore deleted soal

---

## 🔄 Tahapan Implementasi

### **TAHAP 1: Setup Service & Store**

#### 1.1 Buat Service untuk API Bank Soal (`src/services/bankSoalService.js`)

**Tujuan:** Menangani komunikasi dengan backend API bank soal

**Langkah:**
- Import axios atau instance API yang sudah ada
- Buat function untuk setiap endpoint:
  - `getSoalList(page = 1, pageSize = 10, filters = {})` → GET /api/bank-soal
  - `getSoalById(id)` → GET /api/bank-soal/:id
  - `createSoal(data)` → POST /api/bank-soal
  - `updateSoal(id, data)` → PUT /api/bank-soal/:id
  - `deleteSoal(id)` → DELETE /api/bank-soal/:id
  - `restoreSoal(id)` → PATCH /api/bank-soal/:id/restore

**Catatan Penting:**
- POST, PUT, DELETE memerlukan JWT token
- GET adalah public endpoint
- Support filter untuk `mapel_id` dan `tipe_soal`
- Return response.data dari API

**Contoh struktur:**
```javascript
export const bankSoalService = {
  getSoalList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filters
      }
      const response = await api.get('/api/bank-soal', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },
  // ... other functions
}
```

---

#### 1.2 Buat Pinia Store untuk Bank Soal (`src/stores/bankSoal.js`)

**Tujuan:** Manage state untuk data soal di level aplikasi

**State yang diperlukan:**
```javascript
state: {
  soals: [],              // Array of soal objects
  totalSoals: 0,          // Total count
  currentPage: 1,         // Current page for pagination
  pageSize: 10,           // Items per page
  selectedSoal: null,     // Detail soal yang sedang dilihat/diedit
  filters: {
    mapel_id: null,       // Filter by mapel
    tipe_soal: null,      // Filter by type (pilihan_ganda, uraian, dll)
    tingkat_kesulitan: null
  },
  isLoading: false,       // Loading state
  error: null,            // Error message
  success: null,          // Success message
}
```

**Getters yang diperlukan:**
- `hasSoals` → Check if soals array has data
- `soalCount` → Total count of soals
- `totalPages` → Calculate total pages
- `soalById` → Get soal by ID (for detail view)

**Actions yang diperlukan:**
- `fetchSoalList(page, filters)` → Fetch soal dengan pagination dan filter
- `fetchSoalById(id)` → Fetch detail soal
- `createSoal(payload)` → Create new soal
- `updateSoal(id, payload)` → Update existing soal
- `deleteSoal(id)` → Soft delete soal
- `restoreSoal(id)` → Restore deleted soal
- `setFilters(filters)` → Set filter state
- `clearError()` → Clear error state
- `clearSuccess()` → Clear success state

**Catatan:**
- Set `isLoading = true` saat fetch dimulai
- Set `isLoading = false` di finally block
- Gunakan try-catch untuk error handling
- Update filters state sebelum fetch untuk consistency

---

### **TAHAP 2: Buat Router dan Route Guard**

#### 2.1 Buat Router Configuration (`src/modules/bank-soal/routes/index.js`)

**Tujuan:** Define routes untuk bank soal management

**Routes yang diperlukan:**
```javascript
bankSoalRoutes = [
  {
    path: '/admin/bank-soal',
    name: 'bankSoal.list',
    component: BankSoalList,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bank-soal/create',
    name: 'bankSoal.create',
    component: SoalCreate,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bank-soal/:id',
    name: 'bankSoal.detail',
    component: SoalDetail,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/bank-soal/:id/edit',
    name: 'bankSoal.edit',
    component: SoalEdit,
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

#### 3.1 BankSoalList.vue (`src/modules/bank-soal/views/BankSoalList.vue`)

**Tujuan:** Menampilkan daftar semua soal dengan fitur CRUD dan filter

**UI Elements:**
- **Header Section**: Judul "Bank Soal" + tombol "Buat Soal Baru"
- **Filter Section**:
  - Dropdown untuk filter Mapel (dari data mapel yang sudah ada)
  - Dropdown untuk filter Tipe Soal (pilihan_ganda, uraian, dll)
  - Input search untuk cari pertanyaan
  - Tombol "Reset Filter"
- **Tabel Soal** dengan kolom:
  - No.
  - Mapel
  - Tipe Soal
  - Pertanyaan (preview, truncate)
  - Tingkat Kesulitan (badge: mudah, sedang, sulit)
  - Aksi (View, Edit, Delete)
- **Pagination**: Navigasi ke halaman sebelum/sesudah

**Fitur:**
- Fetch data soal saat component mounted
- Handle loading state (show spinner)
- Handle error state (show error message)
- Implementasi pagination (prev/next buttons)
- Delete confirmation dialog sebelum menghapus
- Toast notification untuk success/error message
- Filter berdasarkan mapel, tipe soal, dan search text
- Show counter: "Menampilkan X hingga Y dari Z soal"

**Setup Script Pattern:**
```javascript
<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useBankSoalStore } from '@/stores/bankSoal'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'

const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const router = useRouter()
const currentPage = ref(1)

onMounted(async () => {
  // Load mapel list untuk filter dropdown
  await mapelStore.fetchMapelList(1, 100)
  // Load soal list
  await bankSoalStore.fetchSoalList(currentPage.value, bankSoalStore.filters)
})

const soals = computed(() => bankSoalStore.soals)
const mapels = computed(() => mapelStore.mapels)
const isLoading = computed(() => bankSoalStore.isLoading)
// ... other computed properties
</script>
```

---

#### 3.2 SoalCreate.vue (`src/modules/bank-soal/views/SoalCreate.vue`)

**Tujuan:** Form untuk membuat soal baru dengan pilihan jawaban

**UI Elements:**
- **Form Title**: "Buat Soal Baru"
- **Form Fields**:
  - `mapel_id` (dropdown) - required
  - `tipe_soal` (dropdown: pilihan_ganda, uraian, benar_salah) - required
  - `pertanyaan` (textarea) - required
  - `tingkat_kesulitan` (radio: mudah, sedang, sulit) - required
  - **Pilihan Jawaban Section** (untuk pilihan_ganda):
    - Dynamic input untuk A, B, C, D, E (minimal 2)
    - Tombol "Tambah Pilihan" untuk opsi lebih
    - Radio button untuk pilih "Jawaban Benar"
  - **Untuk Uraian**:
    - Textarea untuk kunci jawaban
    - Input untuk rubrik penilaian (optional)
- **Action Buttons**:
  - Tombol "Simpan" (warna primary)
  - Tombol "Batal" (warna secondary)

**Fitur:**
- Client-side validation:
  - `pertanyaan`: required, min 10 chars
  - `mapel_id`: required
  - `tipe_soal`: required
  - Untuk pilihan_ganda: minimal 2 pilihan, ada jawaban benar
- Show error messages saat validation gagal
- Dynamic form based on soal type (pilihan_ganda vs uraian)
- Submit form ke API via store
- Loading state pada tombol saat submit
- Redirect ke BankSoalList setelah success

---

#### 3.3 SoalEdit.vue (`src/modules/bank-soal/views/SoalEdit.vue`)

**Tujuan:** Form untuk edit soal yang sudah ada

**UI Elements:**
- Sama seperti SoalCreate
- Form title: "Edit Soal"
- Pre-filled dengan data soal yang sudah ada

**Fitur:**
- Fetch detail soal berdasarkan ID dari route params saat mounted
- Populate form dengan data soal yang ada
- Client-side validation (sama seperti Create)
- Show loading state saat fetch detail
- Show error jika soal tidak ditemukan
- Submit form via store dengan ID
- Redirect ke detail view atau list setelah success

---

#### 3.4 SoalDetail.vue (`src/modules/bank-soal/views/SoalDetail.vue`)

**Tujuan:** Menampilkan detail soal dalam format read-only

**UI Elements:**
- **Soal Section**:
  - Pertanyaan (display full text)
  - Mapel badge
  - Tipe Soal badge
  - Tingkat Kesulitan badge
- **Jawaban Section**:
  - Untuk pilihan_ganda: tampilkan A, B, C, D, E dengan highlight jawaban benar
  - Untuk uraian: tampilkan kunci jawaban
- **Metadata Section**:
  - Created at
  - Updated at
- **Action Buttons**:
  - Tombol "Edit" (warna primary)
  - Tombol "Delete" (warna red/danger)
  - Tombol "Kembali" (warna secondary)

**Fitur:**
- Fetch detail soal saat mounted
- Show loading state
- Show error jika soal tidak ditemukan
- Delete dengan confirmation dialog
- Redirect ke list setelah delete
- Redirect ke edit view saat klik edit

---

### **TAHAP 4: Integrasi ke Admin Menu**

#### 4.1 Update SideBar.vue

**Lokasi:** `src/components/SideBar.vue`

**Catatan:** Menu "Bank Soal" sudah ada di sidebar (dilihat dari SideBar.vue), tetapi pastikan:
- Route ke `/admin/bank-soal` sudah benar
- Menu item ter-highlight saat di halaman bank-soal
- Icon yang digunakan sudah sesuai (material icon: `database` atau `help`)

**Jika belum ada, tambahkan:**
```vue
<router-link to="/admin/bank-soal"
  :class="[
    'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
    isActivePath('/admin/bank-soal')
      ? 'bg-sky-50 text-sky-600'
      : 'text-slate-600 hover:bg-slate-50 transition-all'
  ]">
  <span class="material-symbols-outlined">database</span>
  <span class="font-label-md text-label-md">Bank Soal</span>
</router-link>
```

---

#### 4.2 Update Router (`src/router/index.js`)

**Perubahan:**
Import dan daftarkan route bank soal ke router:

```javascript
import { bankSoalRoutes } from '@/modules/bank-soal/routes'

// Dalam routes array
const routes = [
  { path: '/', redirect: '/login' },
  ...dashboardRoutes,
  ...mapelRoutes,
  ...bankSoalRoutes,  // Tambahkan ini
  ...authRoutes,
]
```

---

#### 4.3 Update Stores Index (`src/stores/index.js`)

**Perubahan:**
Export bank soal store:

```javascript
export { useBankSoalStore } from './bankSoal'
```

---

### **TAHAP 5: Styling & Polish**

#### 5.1 Tailwind CSS Styling

**Guidelines:**
- Gunakan design system yang sudah ada (warna, spacing, typography)
- Reference: `MapelList.vue`, `DashboardAdmin.vue`
- Konsisten dengan color scheme:
  - Primary: `sky-600`, `sky-50`
  - Danger: `red-600`, `red-50`
  - Success: `green-600`, `green-50`
  - Warning: `yellow-600`, `yellow-50`
  - Info: `blue-600`, `blue-50`

#### 5.2 Badge Styling untuk Tingkat Kesulitan

```vue
<!-- Mudah -->
<span class="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">Mudah</span>

<!-- Sedang -->
<span class="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">Sedang</span>

<!-- Sulit -->
<span class="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">Sulit</span>
```

---

### **TAHAP 6: Testing**

#### 6.1 Manual Testing Checklist

**Pada BankSoalList:**
- ✅ Buka halaman `/admin/bank-soal`
- ✅ Verify daftar soal tampil dengan pagination
- ✅ Filter by Mapel → soal ter-filter dengan benar
- ✅ Filter by Tipe Soal → soal ter-filter dengan benar
- ✅ Search pertanyaan → hasil pencarian akurat
- ✅ Click tombol "Buat Soal Baru" → redirect ke create form
- ✅ Click edit button → redirect ke edit form
- ✅ Click delete button → show confirmation → delete data
- ✅ Pagination buttons working properly

**Pada SoalCreate:**
- ✅ Buka halaman `/admin/bank-soal/create`
- ✅ Verify form fields ada (mapel, tipe, pertanyaan, dll)
- ✅ Select Mapel → display pilihan dari mapel yang ada
- ✅ Select "Pilihan Ganda" → show pilihan jawaban section
- ✅ Select "Uraian" → show kunci jawaban section
- ✅ Submit dengan data valid → success dan redirect ke list
- ✅ Submit dengan data tidak valid → show error message
- ✅ Click cancel → kembali ke list

**Pada SoalEdit:**
- ✅ Buka halaman `/admin/bank-soal/:id/edit`
- ✅ Verify form pre-filled dengan data soal
- ✅ Update data → success dan redirect ke list
- ✅ Error handling ketika soal tidak ditemukan

**Pada SoalDetail:**
- ✅ Buka halaman `/admin/bank-soal/:id`
- ✅ Verify semua detail soal tampil dengan benar
- ✅ Jawaban benar ter-highlight
- ✅ Click edit → redirect ke edit form
- ✅ Click delete → confirmation → success

#### 6.2 API Integration Testing

**Testing dengan cURL:**
```bash
# Get token
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@test.com", "password": "password123"}'

# List soal
curl "http://localhost:3000/api/bank-soal?page=1&page_size=10"

# Create soal
TOKEN="your_token_here"
curl -X POST "http://localhost:3000/api/bank-soal" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mapel_id": "mapel-uuid",
    "tipe_soal": "pilihan_ganda",
    "pertanyaan": "Berapakah hasil 2 + 2?",
    "pilihan_jawaban": ["3", "4", "5", "6"],
    "jawaban_benar": "4",
    "tingkat_kesulitan": "mudah"
  }'
```

---

## 📚 Reference & Dependencies

### Existing Code Patterns

**Referensi untuk Service:**
- `src/services/mapelService.js` → API call pattern

**Referensi untuk Store:**
- `src/stores/mapel.js` → Pinia store dengan filter support

**Referensi untuk Components:**
- `src/modules/mapel/views/MapelList.vue` → List dengan pagination dan filter
- `src/modules/mapel/views/MapelCreate.vue` → Form dengan validation

**Referensi untuk Router:**
- `src/modules/mapel/routes/index.js` → Route structure

---

## 🔧 Development Tips

### 1. Dynamic Form berdasarkan Tipe Soal
```javascript
const selectedTipesoal = ref('pilihan_ganda')
const showPilihanJawaban = computed(() => selectedTipesoal.value === 'pilihan_ganda')
const showKunciJawaban = computed(() => selectedTipesoal.value === 'uraian')
```

### 2. Dynamic Pilihan Jawaban
```javascript
const pilihanJawaban = reactive({
  a: '',
  b: '',
  c: '',
  d: '',
  e: ''
})

const addPilihan = () => {
  // Add new choice input
}

const removePilihan = (key) => {
  // Remove choice input
}
```

### 3. Filter Pattern
```javascript
const applyFilters = async () => {
  const filters = {
    mapel_id: selectedMapel.value,
    tipe_soal: selectedTipeSoal.value,
    search: searchText.value
  }
  await bankSoalStore.setFilters(filters)
  await bankSoalStore.fetchSoalList(1, filters)
}
```

### 4. Badge Helper Function
```javascript
const getTingkatKesulitanColor = (tingkat) => {
  const colors = {
    'mudah': 'bg-green-50 text-green-700',
    'sedang': 'bg-yellow-50 text-yellow-700',
    'sulit': 'bg-red-50 text-red-700'
  }
  return colors[tingkat] || 'bg-gray-50 text-gray-700'
}
```

---

## 📋 File Structure Overview

```
src/
├── modules/
│   └── bank-soal/
│       ├── views/
│       │   ├── BankSoalList.vue ✅ Create
│       │   ├── SoalCreate.vue ✅ Create
│       │   ├── SoalEdit.vue ✅ Create
│       │   └── SoalDetail.vue ✅ Create
│       └── routes/
│           └── index.js ✅ Create
├── services/
│   └── bankSoalService.js ✅ Create
├── stores/
│   └── bankSoal.js ✅ Create
└── router/
    └── index.js 🔄 Update (register bank soal routes)
```

---

## ⏱️ Estimated Timeline

- **Setup Service & Store:** 1-2 jam
- **Router Configuration:** 30 menit
- **BankSoalList Component:** 2-2.5 jam (kompleks, ada filter)
- **SoalCreate Component:** 2-2.5 jam (dynamic form, pilihan jawaban)
- **SoalEdit Component:** 1.5-2 jam
- **SoalDetail Component:** 1-1.5 jam
- **Integration & Styling:** 1-1.5 jam
- **Testing:** 1-1.5 jam
- **Total:** 10-13 jam kerja

---

## ✅ Checklist Sebelum Selesai

- [ ] Semua components ter-create dan ter-route dengan benar
- [ ] BankSoalList menampilkan daftar soal dengan pagination
- [ ] Filter mapel, tipe soal, dan search bekerja dengan baik
- [ ] SoalCreate berfungsi untuk buat soal baru (pilihan_ganda dan uraian)
- [ ] SoalEdit berfungsi untuk update soal
- [ ] SoalDetail menampilkan detail soal dengan jawaban benar ter-highlight
- [ ] Delete soal dengan confirmation dialog
- [ ] Menu "Bank Soal" ter-highlight di sidebar saat di halaman bank soal
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

1. **Reuse dari Mapel**: Banyak pattern sudah ada di mapel module, tinggal di-adapt
2. **kompleksitas Form**: SoalCreate/Edit lebih kompleks dari MapelCreate karena form dinamis
3. **Filter Section**: Bank Soal punya filter, tambahkan lebih banyak UX polish untuk filtering
4. **Validation**: Pertanyaan minimal 10 karakter, minimal 2 pilihan untuk pilihan_ganda
5. **API Call Assumptions**: Jika API beda, sesuaikan dengan endpoint yang sebenarnya
6. **Test Frequently**: Jangan tunggu semua selesai baru test, test per component
7. **Keep it Simple**: Prioritas functionality over perfection

---

**Created:** 2026-05-18  
**Status:** Ready for Implementation  
**Priority:** High  
**Complexity:** Medium-High
