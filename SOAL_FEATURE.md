# Issue: Menampilkan Daftar Soal pada Halaman Detail Bank Soal

## 📋 Deskripsi Fitur

Pada halaman detail bank soal (SoalDetail.vue), tambahkan section yang menampilkan daftar soal yang termasuk dalam bank soal tersebut. Section "Informasi Sistem" (created_at, updated_at) akan dihapus dan diganti dengan section soal.

**Endpoint Referensi:** `GET /api/soal/bank/:bank_soal_id` (lihat SOAL_API.md line 75-129)

---

## 🎯 Requirements

### Functional Requirements
1. ✅ Hapus section "Informasi Sistem" dari halaman detail bank soal
2. ✅ Tambahkan section baru "Daftar Soal" di bawah info grid
3. ✅ Tampilkan soal-soal yang termasuk dalam bank soal menggunakan API GET /api/soal/bank/:bank_soal_id
4. ✅ Implementasi pagination untuk soal (10 item per halaman)
5. ✅ Tampilkan informasi soal: pertanyaan (soal), opsi A-E, dan kunci jawaban
6. ✅ Tambahkan loading state saat fetch data soal
7. ✅ Tambahkan empty state jika tidak ada soal dalam bank soal

### Non-Functional Requirements
1. ✅ Responsive design (mobile, tablet, desktop)
2. ✅ Consistent dengan design system yang ada
3. ✅ Performance: pagination untuk menghindari loading banyak data sekaligus
4. ✅ Error handling: tampilkan pesan error jika fetch soal gagal

---

## 🔧 Tahapan Implementasi

### Tahap 1: Setup Service Layer (10 menit)

**File:** `src/services/soalService.js` (buat file baru)

**Task:**
Buat service untuk API soal dengan function `getSoalByBankId()` yang akan fetch soal berdasarkan bank_soal_id.

**Kode Template:**
```javascript
import api from './api'

export const soalService = {
  // Fetch soal by bank soal id dengan pagination
  getSoalByBankId: async (bankSoalId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/api/soal/bank/${bankSoalId}`, {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
```

**Detail:**
- Gunakan axios instance yang sudah ada di `./api`
- Path: `/api/soal/bank/{bankSoalId}`
- Query params: `page` dan `page_size`
- Return format mengikuti SOAL_API.md (success, message, data dengan array soal)

---

### Tahap 2: Setup Pinia Store (15 menit)

**File:** `src/stores/soal.js` (buat file baru)

**Task:**
Buat store untuk manage state soal dengan actions untuk fetch data.

**Kode Template:**
```javascript
import { defineStore } from 'pinia'
import { soalService } from '@/services/soalService'

export const useSoalStore = defineStore('soal', {
  state: () => ({
    soals: [],
    totalSoals: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null
  }),

  getters: {
    hasSoals: (state) => state.soals.length > 0,
    soalCount: (state) => state.soals.length,
    totalPages: (state) => Math.ceil(state.totalSoals / state.pageSize)
  },

  actions: {
    async fetchSoalByBankId(bankSoalId, page = 1) {
      this.isLoading = true
      this.error = null

      try {
        const response = await soalService.getSoalByBankId(bankSoalId, page, this.pageSize)
        this.soals = response.data.data || []
        this.totalSoals = response.data.total || 0
        this.currentPage = page
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
```

**Detail:**
- State: soals (array), totalSoals, currentPage, pageSize, isLoading, error
- Action fetchSoalByBankId menerima bankSoalId dan page number
- Handle loading state dan error state
- Return response.data untuk consistency

---

### Tahap 3: Export Store di Index (5 menit)

**File:** `src/stores/index.js`

**Task:**
Tambahkan export untuk soal store.

**Kode:**
```javascript
export { useAuthStore } from './auth'
export { useAdminStore } from './admin'
export { useMapelStore } from './mapel'
export { useBankSoalStore } from './bankSoal'
export { useSoalStore } from './soal'  // ← TAMBAHKAN BARIS INI
```

---

### Tahap 4: Update Component SoalDetail.vue (30 menit)

**File:** `src/modules/bank-soal/views/SoalDetail.vue`

**Task 4a: Hapus Metadata Section**
Hapus section "Informasi Sistem" (dibawah Bank Soal Info Section) yang menampilkan created_at dan updated_at.

**Lines to Delete:** Lines 49-64 (<!-- Metadata Section --> sampai closing div)

**Task 4b: Tambah Script Setup**
Di bagian `<script setup>` tambahkan import dan reactive state untuk soal.

**Kode yang ditambahkan:**
```javascript
// Tambahkan di import section
import { useSoalStore } from '@/stores/soal'

// Tambahkan di dalam script setup, setelah deklarasi store lainnya
const soalStore = useSoalStore()

// Tambahkan di dalam onMounted, setelah fetch selectedSoal
try {
  await soalStore.fetchSoalByBankId(soalId, 1)
} catch (err) {
  console.error('Error fetching soal:', err)
}

// Tambahkan computed properties baru
const soals = computed(() => soalStore.soals)
const isSoalLoading = computed(() => soalStore.isLoading)
const soalError = computed(() => soalStore.error)
const totalPages = computed(() => soalStore.totalPages)

// Tambahkan method untuk pagination soal
const handleSoalPageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await soalStore.fetchSoalByBankId(soalId, page)
  }
}

// Helper function untuk label opsi (A, B, C, D, E)
const getOpsiLabel = (index) => {
  return String.fromCharCode(65 + index)
}
```

**Task 4c: Tambah Template untuk Section Soal**
Tambahkan section "Daftar Soal" sebelum closing tag `</div>` (sebelum <!-- Action Buttons -->).

**Template:**
```vue
<!-- Daftar Soal Section -->
<div v-if="soals.length > 0 || isSoalLoading" class="bg-white rounded-lg shadow border border-slate-200 p-6">
  <h3 class="text-lg font-semibold text-slate-900 mb-4">Daftar Soal</h3>

  <!-- Loading State -->
  <div v-if="isSoalLoading" class="flex justify-center items-center py-12">
    <div class="text-center">
      <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      <p class="mt-3 text-slate-600">Memuat soal...</p>
    </div>
  </div>

  <!-- Soal List -->
  <div v-else class="space-y-4">
    <div v-for="(soal, index) in soals" :key="soal.id" class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
      <!-- Soal Number -->
      <div class="text-sm font-semibold text-slate-600 mb-2">
        Soal {{ (soalStore.currentPage - 1) * soalStore.pageSize + index + 1 }}
      </div>

      <!-- Pertanyaan -->
      <div class="mb-3">
        <p class="text-slate-900 font-medium">{{ soal.soal }}</p>
        <img v-if="soal.gambar_soal" :src="soal.gambar_soal" :alt="`Gambar soal ${index + 1}`" class="mt-2 max-w-xs max-h-40 rounded">
      </div>

      <!-- Opsi Jawaban -->
      <div class="space-y-2 mb-3">
        <div v-for="(opsi, opsiIndex) in [soal.opsi_a, soal.opsi_b, soal.opsi_c, soal.opsi_d, soal.opsi_e]" 
             v-if="opsi"
             :key="opsiIndex"
             class="flex items-start gap-3 ml-4">
          <!-- Opsi Label -->
          <span class="font-semibold text-slate-700 min-w-fit">{{ getOpsiLabel(opsiIndex) }}.</span>

          <!-- Opsi Text -->
          <div class="flex-1">
            <p class="text-slate-700">{{ opsi }}</p>
            <!-- Opsi Image -->
            <img v-if="opsiIndex === 0 && soal.gambar_a" :src="soal.gambar_a" :alt="'Opsi A'" class="mt-1 max-w-xs max-h-32 rounded">
            <img v-else-if="opsiIndex === 1 && soal.gambar_b" :src="soal.gambar_b" :alt="'Opsi B'" class="mt-1 max-w-xs max-h-32 rounded">
            <img v-else-if="opsiIndex === 2 && soal.gambar_c" :src="soal.gambar_c" :alt="'Opsi C'" class="mt-1 max-w-xs max-h-32 rounded">
            <img v-else-if="opsiIndex === 3 && soal.gambar_d" :src="soal.gambar_d" :alt="'Opsi D'" class="mt-1 max-w-xs max-h-32 rounded">
            <img v-else-if="opsiIndex === 4 && soal.gambar_e" :src="soal.gambar_e" :alt="'Opsi E'" class="mt-1 max-w-xs max-h-32 rounded">
          </div>

          <!-- Kunci Badge -->
          <span v-if="soal.kunci === getOpsiLabel(opsiIndex)" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
            ✓ Kunci
          </span>
        </div>
      </div>

      <!-- Kunci Jawaban Display -->
      <div class="bg-green-50 border border-green-200 rounded p-2 text-sm">
        <span class="font-semibold text-green-700">Kunci Jawaban:</span>
        <span class="text-green-700 ml-2">{{ soal.kunci }}</span>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-if="soalError && !isSoalLoading" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
    {{ soalError }}
  </div>

  <!-- Pagination -->
  <div v-if="soals.length > 0 && totalPages > 1" class="flex items-center justify-between mt-6">
    <p class="text-slate-600 text-sm">
      Menampilkan {{ (soalStore.currentPage - 1) * soalStore.pageSize + 1 }} hingga
      {{ Math.min(soalStore.currentPage * soalStore.pageSize, soalStore.totalSoals) }} dari {{ soalStore.totalSoals }} soal
    </p>
    <div class="flex gap-2">
      <button
        @click="handleSoalPageChange(soalStore.currentPage - 1)"
        :disabled="soalStore.currentPage === 1"
        class="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
        Sebelumnya
      </button>
      <div class="flex items-center gap-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handleSoalPageChange(page)"
          :class="[
            'px-2 py-1 rounded text-sm transition-colors',
            page === soalStore.currentPage
              ? 'bg-sky-600 text-white'
              : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
          ]">
          {{ page }}
        </button>
      </div>
      <button
        @click="handleSoalPageChange(soalStore.currentPage + 1)"
        :disabled="soalStore.currentPage === totalPages"
        class="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
        Berikutnya
      </button>
    </div>
  </div>
</div>

<!-- Empty State -->
<div v-if="!isSoalLoading && soals.length === 0" class="bg-white rounded-lg shadow border border-slate-200 p-6">
  <div class="text-center py-8">
    <span class="material-symbols-outlined text-4xl text-slate-300">quiz</span>
    <p class="text-slate-600 mt-2">Belum ada soal dalam bank soal ini</p>
  </div>
</div>
```

---

## ✅ Checklist Implementasi

- [ ] Buat `src/services/soalService.js` dengan function `getSoalByBankId()`
- [ ] Buat `src/stores/soal.js` dengan state, getters, dan actions
- [ ] Update `src/stores/index.js` untuk export useSoalStore
- [ ] Update `src/modules/bank-soal/views/SoalDetail.vue`:
  - [ ] Tambah imports (useSoalStore)
  - [ ] Hapus "Informasi Sistem" section dari template
  - [ ] Tambah reactive state dan computed properties untuk soal
  - [ ] Update onMounted hook untuk fetch soal
  - [ ] Tambah handler untuk pagination soal
  - [ ] Tambah "Daftar Soal" section dalam template
- [ ] Test di browser untuk verify functionality

---

## 🧪 Testing Guidelines

### Test Cases
1. **Test Fetch Data:**
   - Buka halaman detail bank soal yang memiliki soal
   - Verify loading spinner muncul saat loading
   - Verify daftar soal tampil dengan benar setelah loading selesai

2. **Test Pagination:**
   - Jika ada >10 soal, verify pagination buttons muncul
   - Klik tombol "Berikutnya" dan verify halaman berubah
   - Klik tombol page number dan verify halaman berubah
   - Verify data counter update: "Menampilkan X hingga Y dari Z soal"

3. **Test Empty State:**
   - Buka detail bank soal tanpa soal
   - Verify empty state message muncul: "Belum ada soal dalam bank soal ini"

4. **Test Opsi Display:**
   - Verify opsi A-E tampil dengan benar
   - Verify hanya opsi yang ada yang ditampilkan
   - Verify kunci jawaban di-highlight dengan badge hijau
   - Verify kunci jawaban juga ditampilkan di box bawah

5. **Test Responsive Design:**
   - Test di mobile: grid harus 1 kolom
   - Test di tablet: layout harus responsif
   - Test di desktop: layout harus optimal

6. **Test Error Handling:**
   - Mock API error dan verify error message tampil
   - Verify user bisa retry atau kembali ke halaman sebelumnya

---

## 📝 Acceptance Criteria

- ✅ Section "Informasi Sistem" (created_at, updated_at) sudah dihapus
- ✅ Section "Daftar Soal" muncul dan menampilkan soal dari API
- ✅ Pagination berfungsi dengan benar untuk soal
- ✅ Loading state menampilkan spinner saat fetch
- ✅ Error state menampilkan pesan error jika fetch gagal
- ✅ Empty state menampilkan pesan jika tidak ada soal
- ✅ Design konsisten dengan existing components
- ✅ Responsive di semua ukuran screen
- ✅ Tidak ada console errors atau warnings

---

## 📚 Referensi

### API Documentation
- **Base:** `GET /api/soal/bank/:bank_soal_id`
- **Params:** `page`, `page_size`
- **Response:** Lihat SOAL_API.md lines 75-129

### Response Structure
```json
{
  "success": true,
  "message": "Get soal by bank successfully",
  "data": {
    "data": [
      {
        "id": "abc123",
        "id_bank_soal": "5112e444-25d8-4ca6-859f-3d24099f45ce",
        "soal": "Pertanyaan?",
        "gambar_soal": "url",
        "opsi_a": "Jawaban A",
        "opsi_b": "Jawaban B",
        "opsi_c": "Jawaban C",
        "opsi_d": "Jawaban D",
        "opsi_e": "Jawaban E",
        "gambar_a": "url",
        "gambar_b": "url",
        "gambar_c": "url",
        "gambar_d": "url",
        "gambar_e": "url",
        "kunci": "B",
        "created_at": "2026-05-18 14:00:00",
        "updated_at": "2026-05-18 14:00:00"
      }
    ],
    "total": 20,
    "page": 1,
    "page_size": 10,
    "total_page": 2
  },
  "errors": null
}
```

### Existing Patterns (Copy dari file yang ada)
- Service pattern: `src/services/bankSoalService.js`
- Store pattern: `src/stores/bankSoal.js`
- Component pattern: `src/modules/bank-soal/views/BankSoalList.vue`
- Pagination pattern: Ada di BankSoalList.vue (lihat lines untuk pagination logic)

---

## 🎓 Tips untuk Junior Programmer

1. **Jangan Takut untuk Copy-Paste:**
   - Copy structure dari `bankSoalService.js` untuk `soalService.js`
   - Copy store structure dari `bankSoal.js` untuk `soal.js`
   - Ganti nama variabel sesuai kebutuhan

2. **Test Satu Per Satu:**
   - Test service dulu di console
   - Test store action dulu
   - Test component bagian per bagian

3. **Gunakan Vue DevTools:**
   - Check store state di Vue DevTools
   - Lihat props dan data di Components tab
   - Ini helpful untuk debug

4. **Jika Error:**
   - Baca error message dengan teliti
   - Cek console browser (F12)
   - Cek network tab untuk API response
   - Cek Vue DevTools untuk state

5. **Responsive Design:**
   - Gunakan `md:` untuk responsive class di Tailwind
   - Test dengan DevTools mobile view
   - Jangan abaikan mobile user!

---

**Created with Claude Code 🤖**
