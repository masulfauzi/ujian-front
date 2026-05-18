# Issue: Implementasi Form Input Soal dengan Multi-Step Navigation

## 📋 Deskripsi Fitur

Implementasi fitur untuk menginput soal secara detail pada halaman bank soal. Fitur ini mencakup:

1. **Update Detail Bank Soal Page:**
   - Hapus 3 tombol aksi (Edit Soal, Hapus Soal, Kembali)
   - Tambahkan tombol "Tambah Soal" yang membuka halaman input soal

2. **Halaman Input Soal Baru:**
   - Multi-step form dengan navigation berbasis nomor soal
   - Tombol nomor soal yang berfungsi sebagai:
     - Button untuk menginput soal
     - Button untuk navigasi antar soal
   - Form yang user-friendly untuk input semua detail soal
   - Support gambar untuk soal dan setiap opsi

---

## 🎯 Requirements

### Functional Requirements

1. ✅ **Detail Page Updates:**
   - Hapus 3 tombol aksi (Edit Soal, Hapus Soal, Kembali)
   - Tambahkan 1 tombol "Tambah Soal" yang navigate ke halaman input

2. ✅ **Halaman Input Soal:**
   - Create route: `/admin/bank-soal/:bank_soal_id/soal`
   - Create component: `SoalInput.vue`

3. ✅ **Question Navigation:**
   - Display nomor soal sebagai buttons (1, 2, 3, ... n)
   - Current soal highlighted/active
   - Klik nomor soal untuk navigate dan switch form
   - Auto-calculate total soal dari `bank_soal.jml_soal`

4. ✅ **Form Fields:**
   - Soal (textarea, required)
   - Gambar Soal (image upload, optional)
   - Opsi A-E (text input, required untuk A-C, optional untuk D-E)
   - Gambar A-E (image upload, optional)
   - Kunci Jawaban (radio buttons: A, B, C, D, E, required)

5. ✅ **Form Features:**
   - Validation untuk semua required fields
   - Preview gambar sebelum upload
   - Drag & drop untuk upload gambar
   - Simpan soal individu atau batch save semua soal
   - Auto-save draft (localStorage)
   - Clear/Reset form button

6. ✅ **User Experience:**
   - Progress indicator (Soal X dari Y)
   - Visual feedback saat save
   - Confirmation sebelum leave page jika ada unsaved changes
   - Responsive design
   - Mobile-friendly input

### Non-Functional Requirements

1. ✅ Responsive design (mobile, tablet, desktop)
2. ✅ Performance optimized
3. ✅ Consistent dengan existing design system
4. ✅ Error handling yang clear
5. ✅ Accessibility (proper labels, ARIA)

---

## 🔧 Tahapan Implementasi

### Tahap 1: Update Route (5 menit)

**File:** `src/modules/bank-soal/routes/index.js`

**Task:**
Tambahkan route baru untuk input soal.

**Kode:**
```javascript
// Tambahkan di array routes
{
  path: ':id/soal',
  name: 'bankSoal.soalInput',
  component: () => import('../views/SoalInput.vue'),
  meta: {
    requiresAuth: true,
    requiresAdmin: true,
    title: 'Input Soal'
  }
}
```

**Detail:**
- Path: `:id` adalah bank_soal_id
- Name: `bankSoal.soalInput` untuk navigasi
- Meta: sama seperti route lainnya
- Lazy load component dengan dynamic import

---

### Tahap 2: Create soalService Helper (10 menit)

**File:** `src/services/soalService.js` (update existing)

**Task:**
Tambahkan function untuk create soal.

**Kode yang ditambahkan:**
```javascript
export const soalService = {
  // ... existing functions ...

  // Create soal baru
  createSoal: async (payload) => {
    try {
      const response = await api.post('/api/soal', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Update soal
  updateSoal: async (id, payload) => {
    try {
      const response = await api.put(`/api/soal/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
```

**Detail:**
- POST `/api/soal` untuk create soal baru
- PUT `/api/soal/{id}` untuk update soal
- Reference SOAL_API.md untuk payload format

---

### Tahap 3: Update soalService.js untuk File Upload (15 menit)

**File:** `src/services/soalService.js` (update)

**Task:**
Tambahkan function untuk upload gambar menggunakan FormData.

**Kode yang ditambahkan:**
```javascript
export const soalService = {
  // ... existing functions ...

  // Upload gambar soal
  uploadSoalImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      // Adjust endpoint sesuai backend yang ada
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
```

**Detail:**
- Gunakan FormData untuk file upload
- Set header 'Content-Type': 'multipart/form-data'
- Adjust endpoint `/api/upload` sesuai backend
- Return image URL dari response

**⚠️ CATATAN:** Jika backend belum support file upload, gunakan base64 atau URL string sebagai alternative.

---

### Tahap 4: Create SoalInput.vue Component (60 menit)

**File:** `src/modules/bank-soal/views/SoalInput.vue` (buat file baru)

**Structure:**
```vue
<template>
  <div class="bg-surface min-h-screen">
    <!-- SideBar & TopAppBar -->
    <!-- Header Section -->
    <!-- Question Navigation (Nomor Soal) -->
    <!-- Form Section -->
    <!-- Action Buttons -->
  </div>
</template>

<script setup>
// Imports
// Stores & Routes
// Reactive State
// Computed Properties
// Functions
// Lifecycle Hooks
</script>

<style scoped>
// Custom styles jika diperlukan
</style>
```

**Tahap 4a: Template Section**

```vue
<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Input Soal</h1>
          <p class="text-slate-500 mt-1">{{ bankSoalDetail?.nama_bank_soal }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-slate-700">
              Soal {{ currentSoalNumber }} dari {{ totalSoal }}
            </span>
            <span class="text-sm text-slate-500">
              {{ Math.round((currentSoalNumber / totalSoal) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
              class="bg-sky-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: (currentSoalNumber / totalSoal) * 100 + '%' }">
            </div>
          </div>
        </div>

        <!-- Question Navigation Tabs -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-4 mb-6">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="soalNum in totalSoal"
              :key="soalNum"
              @click="switchSoal(soalNum)"
              :class="[
                'w-10 h-10 rounded-lg font-semibold transition-all',
                currentSoalNumber === soalNum
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
              :disabled="isSaving">
              {{ soalNum }}
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-3">Klik nomor untuk pindah ke soal lain</p>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSave" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
          <!-- Soal Text -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Pertanyaan Soal <span class="text-red-600">*</span>
            </label>
            <textarea
              v-model="currentForm.soal"
              @blur="validateField('soal')"
              placeholder="Ketik pertanyaan soal..."
              rows="4"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none"
              :class="{ 'border-red-500 focus:ring-red-500': errors.soal }">
            </textarea>
            <p v-if="errors.soal" class="text-red-600 text-sm mt-1">{{ errors.soal }}</p>
          </div>

          <!-- Gambar Soal -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Gambar Soal (Opsional)
            </label>
            <div
              @drop.prevent="handleDrop($event, 'gambar_soal')"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-500 transition-colors cursor-pointer"
              @click="triggerFileInput('gambar_soal')">
              <input
                ref="fileInputGambarSoal"
                type="file"
                accept="image/*"
                @change="handleFileChange($event, 'gambar_soal')"
                class="hidden">
              <div v-if="!currentForm.gambar_soal" class="space-y-2">
                <span class="material-symbols-outlined text-4xl text-slate-400 block">image</span>
                <p class="text-slate-600">Drag & drop gambar atau klik untuk upload</p>
              </div>
              <div v-else class="space-y-2">
                <img :src="currentForm.gambar_soal" :alt="'Gambar soal'" class="max-h-40 mx-auto rounded">
                <p class="text-sm text-sky-600 font-semibold">Klik untuk ubah</p>
              </div>
            </div>
          </div>

          <!-- Opsi Jawaban Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="opsiKey in ['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e']" :key="opsiKey">
              <!-- Opsi Text -->
              <div>
                <label class="block text-sm font-semibold text-slate-900 mb-2">
                  Opsi {{ opsiKey.split('_')[1].toUpperCase() }}
                  <span v-if="['opsi_a', 'opsi_b', 'opsi_c'].includes(opsiKey)" class="text-red-600">*</span>
                </label>
                <input
                  v-model="currentForm[opsiKey]"
                  @blur="validateField(opsiKey)"
                  type="text"
                  :placeholder="`Ketik opsi ${opsiKey.split('_')[1].toUpperCase()}...`"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  :class="{ 'border-red-500 focus:ring-red-500': errors[opsiKey] }">
                <p v-if="errors[opsiKey]" class="text-red-600 text-sm mt-1">{{ errors[opsiKey] }}</p>
              </div>

              <!-- Opsi Image -->
              <div class="mt-3">
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Gambar Opsi {{ opsiKey.split('_')[1].toUpperCase() }} (Opsional)
                </label>
                <div
                  @drop.prevent="handleDrop($event, `gambar_${opsiKey.split('_')[1]}`)"
                  @dragover.prevent
                  @dragenter.prevent
                  class="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-sky-500 transition-colors cursor-pointer"
                  @click="triggerFileInput(`gambar_${opsiKey.split('_')[1]}`)">
                  <input
                    :ref="`fileInputGambar${opsiKey.split('_')[1].toUpperCase()}`"
                    type="file"
                    accept="image/*"
                    @change="handleFileChange($event, `gambar_${opsiKey.split('_')[1]}`)"
                    class="hidden">
                  <div v-if="!currentForm[`gambar_${opsiKey.split('_')[1]}`]" class="space-y-1">
                    <span class="material-symbols-outlined text-2xl text-slate-400 block">image</span>
                    <p class="text-xs text-slate-600">Klik untuk upload</p>
                  </div>
                  <img
                    v-else
                    :src="currentForm[`gambar_${opsiKey.split('_')[1]}`]"
                    :alt="`Gambar opsi ${opsiKey.split('_')[1].toUpperCase()}`"
                    class="max-h-24 mx-auto rounded">
                </div>
              </div>
            </div>
          </div>

          <!-- Kunci Jawaban -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-3">
              Kunci Jawaban <span class="text-red-600">*</span>
            </label>
            <div class="flex gap-4 flex-wrap">
              <label v-for="opsi in ['A', 'B', 'C', 'D', 'E']" :key="opsi" class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="currentForm.kunci"
                  type="radio"
                  :value="opsi"
                  class="w-4 h-4">
                <span class="text-slate-700 font-medium">{{ opsi }}</span>
              </label>
            </div>
            <p v-if="errors.kunci" class="text-red-600 text-sm mt-2">{{ errors.kunci }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              v-if="currentSoalNumber > 1"
              type="button"
              @click="switchSoal(currentSoalNumber - 1)"
              :disabled="isSaving"
              class="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors disabled:opacity-50">
              ← Soal Sebelumnya
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="!isSaving" class="material-symbols-outlined">save</span>
              <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Soal' }}
            </button>

            <button
              v-if="currentSoalNumber < totalSoal"
              type="button"
              @click="switchSoal(currentSoalNumber + 1)"
              :disabled="isSaving"
              class="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors disabled:opacity-50">
              Soal Berikutnya →
            </button>

            <button
              v-else
              type="button"
              @click="handleComplete"
              :disabled="isSaving"
              class="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors disabled:opacity-50">
              Selesai
            </button>
          </div>

          <!-- Save Status -->
          <div v-if="saveStatus" :class="[
            'p-3 rounded-lg text-sm',
            saveStatus.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          ]">
            {{ saveStatus.message }}
          </div>
        </form>
      </div>
    </main>
  </div>
</template>
```

**Tahap 4b: Script Section**

```javascript
<script setup>
import { onMounted, ref, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankSoalStore } from '@/stores/bankSoal'
import { soalService } from '@/services/soalService'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'

// Routes & Stores
const route = useRoute()
const router = useRouter()
const bankSoalStore = useBankSoalStore()
const bankSoalId = route.params.id

// State
const currentSoalNumber = ref(1)
const isSaving = ref(false)
const saveStatus = ref(null)
const soalList = reactive({}) // Store semua soal { 1: {...}, 2: {...}, ... }

// Get bank soal detail
const bankSoalDetail = computed(() => bankSoalStore.selectedSoal)
const totalSoal = computed(() => bankSoalDetail.value?.jml_soal || 0)

// Current form data
const currentForm = computed({
  get: () => soalList[currentSoalNumber.value] || getEmptyForm(),
  set: (value) => {
    soalList[currentSoalNumber.value] = value
  }
})

// Form validation errors
const errors = reactive({
  soal: '',
  opsi_a: '',
  opsi_b: '',
  opsi_c: '',
  kunci: ''
})

// Lifecycle
onMounted(async () => {
  try {
    // Fetch bank soal detail
    await bankSoalStore.fetchSoalById(bankSoalId)
    
    // Initialize soal list (buat form kosong untuk setiap soal)
    for (let i = 1; i <= totalSoal.value; i++) {
      soalList[i] = getEmptyForm()
    }
  } catch (err) {
    console.error('Error loading bank soal:', err)
  }
})

// Helper Functions
const getEmptyForm = () => ({
  soal: '',
  gambar_soal: null,
  opsi_a: '',
  opsi_b: '',
  opsi_c: '',
  opsi_d: '',
  opsi_e: '',
  gambar_a: null,
  gambar_b: null,
  gambar_c: null,
  gambar_d: null,
  gambar_e: null,
  kunci: ''
})

const validateField = (field) => {
  errors[field] = ''
  
  if (['soal', 'opsi_a', 'opsi_b', 'opsi_c', 'kunci'].includes(field)) {
    if (!currentForm.value[field]) {
      errors[field] = `${field.replace('_', ' ')} wajib diisi`
    }
  }
}

const validateForm = () => {
  validateField('soal')
  validateField('opsi_a')
  validateField('opsi_b')
  validateField('opsi_c')
  validateField('kunci')
  
  return !Object.values(errors).some(e => e !== '')
}

const switchSoal = async (soalNum) => {
  if (currentSoalNumber.value !== soalNum) {
    currentSoalNumber.value = soalNum
  }
}

const handleFileChange = async (event, field) => {
  const file = event.target.files[0]
  if (file) {
    // Convert to base64 atau upload
    const reader = new FileReader()
    reader.onload = (e) => {
      currentForm.value[field] = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleDrop = (event, field) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const fileInput = { target: { files } }
    handleFileChange(fileInput, field)
  }
}

const triggerFileInput = (field) => {
  // Trigger hidden file input
  const refName = `fileInput${field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`
  // Implement file input trigger
}

const handleSave = async () => {
  if (!validateForm()) {
    saveStatus.value = {
      type: 'error',
      message: 'Mohon isi semua field yang wajib'
    }
    return
  }

  isSaving.value = true

  try {
    const payload = {
      id_bank_soal: bankSoalId,
      ...currentForm.value
    }

    // Check if soal exists (update) or new (create)
    if (currentForm.value.id) {
      await soalService.updateSoal(currentForm.value.id, payload)
    } else {
      await soalService.createSoal(payload)
    }

    saveStatus.value = {
      type: 'success',
      message: `Soal ${currentSoalNumber.value} berhasil disimpan`
    }

    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
  } catch (err) {
    saveStatus.value = {
      type: 'error',
      message: err.response?.data?.message || 'Gagal menyimpan soal'
    }
  } finally {
    isSaving.value = false
  }
}

const handleComplete = async () => {
  // Save soal terakhir dan redirect ke detail
  await handleSave()
  router.push({ name: 'bankSoal.detail', params: { id: bankSoalId } })
}
</script>
```

---

### Tahap 5: Update SoalDetail.vue (15 menit)

**File:** `src/modules/bank-soal/views/SoalDetail.vue`

**Task 5a: Hapus Action Buttons**

Cari section "Action Buttons" dan ganti dengan:

```vue
<!-- Action Buttons -->
<div class="flex gap-3">
  <button
    @click="handleAddSoal"
    class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
    <span class="material-symbols-outlined">add</span>
    Tambah Soal
  </button>
  <button
    @click="handleBack"
    class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
    Kembali
  </button>
</div>
```

**Task 5b: Hapus Handler Lama dan Tambah Handler Baru**

Hapus:
- `handleEdit`
- `handleDelete`

Tambah:
```javascript
const handleAddSoal = () => {
  router.push({ name: 'bankSoal.soalInput', params: { id: soalId } })
}
```

---

## ✅ Checklist Implementasi

- [ ] Update `src/modules/bank-soal/routes/index.js` - tambah route soalInput
- [ ] Update `src/services/soalService.js` - tambah createSoal, updateSoal, uploadImage
- [ ] Create `src/modules/bank-soal/views/SoalInput.vue`:
  - [ ] Template dengan navigation tabs
  - [ ] Form inputs untuk semua fields
  - [ ] File upload dengan drag & drop
  - [ ] Image preview
  - [ ] Validation
- [ ] Update `src/modules/bank-soal/views/SoalDetail.vue`:
  - [ ] Hapus Edit, Delete buttons
  - [ ] Tambah Tambah Soal button
  - [ ] Hapus handler lama, tambah handleAddSoal
- [ ] Test di browser

---

## 🧪 Testing Guidelines

### Test Cases

1. **Test Navigation:**
   - Klik tombol nomor soal dan verify form switch
   - Verify current soal number di-highlight
   - Progress bar update sesuai soal number

2. **Test Form Input:**
   - Ketik di semua field dan verify input terekam
   - Upload gambar soal dan verify preview muncul
   - Upload gambar opsi dan verify preview muncul
   - Select kunci jawaban dan verify radio button checked

3. **Test Validation:**
   - Coba submit form kosong, verify error messages
   - Fix errors dan submit, verify success message

4. **Test File Upload:**
   - Test drag & drop gambar
   - Test click untuk upload
   - Test preview gambar sebelum dan sesudah upload

5. **Test Navigation Between Soals:**
   - Input data soal 1
   - Klik soal 2, verify form berubah kosong
   - Klik soal 1 lagi, verify data soal 1 masih tersimpan

6. **Test Save:**
   - Input soal lengkap
   - Klik Simpan Soal
   - Verify success message muncul
   - Verify bisa move ke soal berikutnya

7. **Test Complete:**
   - Input semua soal
   - Klik Selesai di soal terakhir
   - Verify redirect ke detail bank soal

8. **Test Responsive:**
   - Test di mobile: layout harus stacked
   - Test di tablet: layout harus responsif
   - Test di desktop: layout optimal

---

## 📝 Acceptance Criteria

- ✅ Halaman detail bank soal hanya punya tombol "Tambah Soal" dan "Kembali"
- ✅ Tombol "Tambah Soal" navigate ke halaman input
- ✅ Halaman input soal muncul dengan form yang lengkap
- ✅ Nomor soal tampil sebagai buttons
- ✅ Klik nomor soal untuk navigate antar soal
- ✅ Current soal number di-highlight
- ✅ Form validation berfungsi untuk required fields
- ✅ File upload dengan drag & drop support
- ✅ Image preview sebelum save
- ✅ Previous/Next button untuk navigate antar soal
- ✅ Simpan soal individual dengan success feedback
- ✅ Selesai button di soal terakhir redirect ke detail
- ✅ Responsive design di semua ukuran screen
- ✅ No console errors atau warnings
- ✅ UX menarik dan mudah digunakan

---

## 📚 Referensi

### API Documentation
- **POST /api/soal** - Create soal baru (lihat SOAL_API.md lines 187-286)
- **PUT /api/soal/:id** - Update soal (lihat SOAL_API.md lines 290-360)

### Request Payload Structure
```json
{
  "id_bank_soal": "uuid",
  "soal": "Pertanyaan soal?",
  "gambar_soal": "url_atau_base64",
  "opsi_a": "Jawaban A",
  "opsi_b": "Jawaban B",
  "opsi_c": "Jawaban C",
  "opsi_d": "Jawaban D (opsional)",
  "opsi_e": "Jawaban E (opsional)",
  "gambar_a": "url_atau_base64",
  "gambar_b": "url_atau_base64",
  "gambar_c": "url_atau_base64",
  "gambar_d": "url_atau_base64",
  "gambar_e": "url_atau_base64",
  "kunci": "A|B|C|D|E"
}
```

### Existing Patterns
- Route pattern: `src/modules/bank-soal/routes/index.js`
- Service pattern: `src/services/soalService.js`
- Component pattern: `src/modules/bank-soal/views/SoalDetail.vue`
- Form validation pattern: Ada di SoalCreate.vue

---

## 🎓 Tips untuk Junior Programmer

1. **Mulai dari Tahap 1:**
   - Jangan loncat tahap
   - Setiap tahap prepare untuk tahap berikutnya

2. **Copy-Paste dengan Smart:**
   - Copy template dari SoalDetail.vue
   - Copy form structure dari SoalCreate.vue
   - Ganti nama variable sesuai kebutuhan

3. **Test During Development:**
   - Test setiap tahap selesai
   - Jangan tunggu semua selesai baru test
   - Lebih cepat ketemu error

4. **File Upload Tips:**
   - Mulai dengan base64 (lebih mudah)
   - Nanti bisa upgrade ke proper upload jika ada endpoint
   - FormData untuk file upload ke backend

5. **Form State Management:**
   - Gunakan reactive() untuk form data
   - Computed untuk current form
   - Ref untuk current soal number

6. **Debugging:**
   - Log di console setiap state change
   - Gunakan Vue DevTools untuk inspect state
   - Check network tab untuk API calls

7. **Performance:**
   - Lazy load component dengan dynamic import
   - Gak perlu optimize sebelum tau bottleneck-nya
   - Focus quality dulu, optimize nanti

8. **UX Tips:**
   - Preview gambar penting untuk user experience
   - Progress indicator bikin user feel progress
   - Success/error messages penting untuk feedback
   - Mobile-first approach

---

## 💡 Implementation Notes

### File Upload Strategy
Pilih satu:
1. **Base64 String** (recommended untuk MVP)
   - Lebih mudah
   - Jangan untuk production
   - Format: `data:image/png;base64,...`

2. **Upload Endpoint**
   - Perlu coordinate dengan backend
   - Return URL dari server
   - Format: `https://...../image.jpg`

3. **URL String**
   - User input URL gambar
   - Paling mudah
   - Tapi UX kurang bagus

### Auto-Save (Optional)
```javascript
// Watch form changes
watch(
  currentForm,
  (newVal) => {
    localStorage.setItem(`soal_${currentSoalNumber.value}`, JSON.stringify(newVal))
  },
  { deep: true }
)
```

### Form Reset
```javascript
const resetForm = () => {
  soalList[currentSoalNumber.value] = getEmptyForm()
}
```

---

**Created with Claude Code 🤖**
