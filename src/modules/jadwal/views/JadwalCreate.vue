<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Buat Jadwal Ujian Baru</h1>
        <p class="text-slate-500 mt-1">Tambahkan jadwal ujian baru ke sistem</p>
      </div>

      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <div v-if="isSubmitting" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Membuat jadwal...</p>
        </div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Nama Ujian Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama Ujian <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.nama_ujian"
            @blur="validateNamaUjian"
            type="text"
            placeholder="Masukkan nama ujian"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.nama_ujian }">
          <p v-if="errors.nama_ujian" class="text-red-600 text-sm mt-1">{{ errors.nama_ujian }}</p>
        </div>

        <!-- Bank Soal Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Bank Soal <span class="text-red-600">*</span>
          </label>
          <SearchableSelect
            v-model="formData.id_bank_soal"
            :options="bankSoalOptions"
            :hasError="!!errors.id_bank_soal"
            placeholder="Cari dan pilih Bank Soal..." />
          <p v-if="errors.id_bank_soal" class="text-red-600 text-sm mt-1">{{ errors.id_bank_soal }}</p>
        </div>

        <!-- Waktu Mulai Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Waktu Mulai <span class="text-red-600">*</span>
          </label>
          <VueDatePicker
            v-model="formData.wkt_mulai"
            @blur="validateWktMulai"
            datetime
            :enable-time-picker="true"
            placeholder="Pilih tanggal dan waktu"
            :class="{ 'dp-error': errors.wkt_mulai }" />
          <p v-if="errors.wkt_mulai" class="text-red-600 text-sm mt-1">{{ errors.wkt_mulai }}</p>
        </div>

        <!-- Waktu Selesai Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Waktu Selesai <span class="text-red-600">*</span>
          </label>
          <VueDatePicker
            v-model="formData.wkt_selesai"
            @blur="validateWktSelesai"
            datetime
            :enable-time-picker="true"
            placeholder="Pilih tanggal dan waktu"
            :class="{ 'dp-error': errors.wkt_selesai }" />
          <p v-if="errors.wkt_selesai" class="text-red-600 text-sm mt-1">{{ errors.wkt_selesai }}</p>
        </div>

        <!-- Durasi Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Durasi (menit) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="formData.durasi"
            @blur="validateDurasi"
            type="number"
            placeholder="Masukkan durasi ujian dalam menit"
            min="1"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.durasi }">
          <p v-if="errors.durasi" class="text-red-600 text-sm mt-1">{{ errors.durasi }}</p>
        </div>

        <!-- Angkatan Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Angkatan <span class="text-red-600">*</span>
          </label>
          <select
            v-model="formData.angkatan"
            @change="handleAngkatanChange"
            @blur="validateAngkatan"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.angkatan }">
            <option value="" disabled>Pilih Angkatan...</option>
            <option value="X">X</option>
            <option value="XI">XI</option>
            <option value="XII">XII</option>
          </select>
          <p v-if="errors.angkatan" class="text-red-600 text-sm mt-1">{{ errors.angkatan }}</p>
        </div>

        <!-- Jurusan Field (Multiple) -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Jurusan <span class="text-red-600">*</span> <span class="text-slate-500 text-sm font-normal">(Pilih satu atau lebih)</span>
          </label>
          <div v-if="jurusanOptions.length === 0" class="text-slate-600 text-sm py-4">
            Memuat data jurusan...
          </div>
          <div v-else class="space-y-2 border border-slate-300 rounded-lg p-4"
            :class="{ 'border-red-500': errors.id_jurusan }">
            <div v-for="jurusan in jurusanOptions" :key="jurusan.id" class="flex items-center">
              <input
                type="checkbox"
                :id="'jurusan_' + jurusan.id"
                :value="jurusan.id"
                v-model="formData.id_jurusan"
                @change="handleJurusanChange"
                class="w-4 h-4 border border-slate-300 rounded focus:ring-sky-500">
              <label :for="'jurusan_' + jurusan.id" class="ml-3 text-slate-900 cursor-pointer">
                {{ jurusan.label }}
              </label>
            </div>
          </div>
          <p v-if="errors.id_jurusan" class="text-red-600 text-sm mt-1">{{ errors.id_jurusan }}</p>
        </div>

        <!-- Kelas Field (Checkbox) -->
        <div v-if="showKelasOptions">
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Pilih Kelas <span class="text-red-600">*</span>
          </label>
          <div v-if="kelasOptions.length === 0" class="text-slate-600 text-sm py-4">
            Tidak ada kelas yang tersedia untuk pilihan ini
          </div>
          <div v-else class="space-y-3 max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-4">
            <div v-for="kelas in kelasOptions" :key="kelas.id" class="flex items-center">
              <input
                type="checkbox"
                :id="'kelas_' + kelas.id"
                :value="kelas.id"
                v-model="formData.selectedKelasIds"
                class="w-4 h-4 border border-slate-300 rounded focus:ring-sky-500">
              <label :for="'kelas_' + kelas.id" class="ml-3 text-slate-900 cursor-pointer">
                {{ kelas.label }}
              </label>
            </div>
          </div>
          <p v-if="errors.selectedKelasIds" class="text-red-600 text-sm mt-1">{{ errors.selectedKelasIds }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">check</span>
            Simpan Jadwal
          </button>
          <button
            type="button"
            @click="handleCancel"
            class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
            Batal
          </button>
        </div>
      </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SearchableSelect from '@/components/SearchableSelect.vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import api from '@/services/api'
import { useJadwalStore } from '@/stores/jadwal'
import { useJurusanStore } from '@/stores/jurusan'
import { useKelasStore } from '@/stores/kelas'
import { useRouter } from 'vue-router'

const jadwalStore = useJadwalStore()
const jurusanStore = useJurusanStore()
const kelasStore = useKelasStore()
const router = useRouter()

const isSubmitting = ref(false)
const error = ref(null)
const showKelasOptions = ref(false)
const bankSoals = ref([])

const formData = reactive({
  nama_ujian: '',
  id_bank_soal: '',
  wkt_mulai: '',
  wkt_selesai: '',
  durasi: '',
  angkatan: '',
  id_jurusan: [],
  selectedKelasIds: [],
})

const errors = reactive({
  nama_ujian: '',
  id_bank_soal: '',
  wkt_mulai: '',
  wkt_selesai: '',
  durasi: '',
  angkatan: '',
  id_jurusan: '',
  selectedKelasIds: '',
})

onMounted(async () => {
  try {
    const [bankSoalRes, jurusanRes] = await Promise.all([
      api.get('/bank-soal', { params: { page: 1, page_size: 100 } }),
      jurusanStore.fetchJurusanList(1, 100)
    ])

    bankSoals.value = bankSoalRes.data?.data?.data || []
  } catch (err) {
    console.error('Error loading data:', err)
    error.value = 'Gagal memuat data bank soal atau jurusan'
  }
})

const bankSoalOptions = computed(() =>
  bankSoals.value.map(b => ({ id: b.id, label: b.nama_bank_soal }))
)

const jurusanOptions = computed(() =>
  jurusanStore.jurusans.map(j => ({ id: j.id, label: j.nama_jurusan }))
)

const kelasOptions = computed(() =>
  kelasStore.kelass.map(k => ({ id: k.id, label: k.nama_kelas }))
)

const validateNamaUjian = () => {
  errors.nama_ujian = formData.nama_ujian ? '' : 'Nama ujian wajib diisi'
}

const validateBankSoal = () => {
  errors.id_bank_soal = formData.id_bank_soal ? '' : 'Bank soal wajib dipilih'
}

const validateWktMulai = () => {
  errors.wkt_mulai = formData.wkt_mulai ? '' : 'Waktu mulai wajib diisi'
}

const validateWktSelesai = () => {
  errors.wkt_selesai = ''
  if (!formData.wkt_selesai) {
    errors.wkt_selesai = 'Waktu selesai wajib diisi'
  } else if (formData.wkt_mulai && new Date(formData.wkt_selesai) <= new Date(formData.wkt_mulai)) {
    errors.wkt_selesai = 'Waktu selesai harus setelah waktu mulai'
  }
}

const validateDurasi = () => {
  errors.durasi = ''
  if (!formData.durasi) {
    errors.durasi = 'Durasi wajib diisi'
  } else if (formData.durasi < 1) {
    errors.durasi = 'Durasi harus lebih dari 0 menit'
  }
}

const validateAngkatan = () => {
  errors.angkatan = formData.angkatan ? '' : 'Angkatan wajib dipilih'
}

const validateJurusan = () => {
  errors.id_jurusan = formData.id_jurusan.length > 0 ? '' : 'Jurusan wajib dipilih'
}

const handleAngkatanChange = async () => {
  formData.selectedKelasIds = []
  await loadKelas()
}

const handleJurusanChange = async () => {
  formData.selectedKelasIds = []
  await loadKelas()
}

const loadKelas = async () => {
  if (formData.angkatan && formData.id_jurusan.length > 0) {
    try {
      // Load kelas untuk semua jurusan yang dipilih
      const allKelas = new Map()

      for (const jurusanId of formData.id_jurusan) {
        const response = await kelasStore.fetchKelasList(1, 100, {
          tingkat: formData.angkatan,
          id_jurusan: jurusanId,
        })

        // Combine kelas dari semua jurusan (avoid duplicates)
        const kelasList = response.data || []
        kelasList.forEach(k => {
          allKelas.set(k.id, k)
        })
      }

      // Update store dengan combined kelas
      kelasStore.kelass = Array.from(allKelas.values())
      showKelasOptions.value = true
    } catch (err) {
      console.error('Error loading kelas:', err)
      showKelasOptions.value = false
    }
  } else {
    showKelasOptions.value = false
  }
}

const validateForm = () => {
  let isValid = true
  errors.nama_ujian = ''
  errors.id_bank_soal = ''
  errors.wkt_mulai = ''
  errors.wkt_selesai = ''
  errors.durasi = ''
  errors.angkatan = ''
  errors.id_jurusan = ''
  errors.selectedKelasIds = ''

  if (!formData.nama_ujian) {
    errors.nama_ujian = 'Nama ujian wajib diisi'
    isValid = false
  }
  if (!formData.id_bank_soal) {
    errors.id_bank_soal = 'Bank soal wajib dipilih'
    isValid = false
  }
  if (!formData.wkt_mulai) {
    errors.wkt_mulai = 'Waktu mulai wajib diisi'
    isValid = false
  }
  if (!formData.wkt_selesai) {
    errors.wkt_selesai = 'Waktu selesai wajib diisi'
    isValid = false
  } else if (new Date(formData.wkt_selesai) <= new Date(formData.wkt_mulai)) {
    errors.wkt_selesai = 'Waktu selesai harus setelah waktu mulai'
    isValid = false
  }
  if (!formData.durasi) {
    errors.durasi = 'Durasi wajib diisi'
    isValid = false
  } else if (formData.durasi < 1) {
    errors.durasi = 'Durasi harus lebih dari 0 menit'
    isValid = false
  }
  if (!formData.angkatan) {
    errors.angkatan = 'Angkatan wajib dipilih'
    isValid = false
  }
  if (formData.id_jurusan.length === 0) {
    errors.id_jurusan = 'Jurusan wajib dipilih'
    isValid = false
  }
  if (formData.selectedKelasIds.length === 0) {
    errors.selectedKelasIds = 'Minimal pilih satu kelas'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    const jadwalPayload = {
      nama_ujian: formData.nama_ujian,
      id_bank_soal: formData.id_bank_soal,
      wkt_mulai: formatDatetime(formData.wkt_mulai),
      wkt_selesai: formatDatetime(formData.wkt_selesai),
      durasi: formData.durasi,
      tingkat: formData.angkatan,
      id_kelas: formData.selectedKelasIds,
    }

    console.log('Sending payload:', jadwalPayload)
    const response = await api.post('/jadwal', jadwalPayload)

    router.push({ name: 'jadwal.list' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal membuat jadwal'
    console.error('Error creating jadwal:', err)
  } finally {
    isSubmitting.value = false
  }
}

const formatDatetime = (value) => {
  if (!value) return ''

  // Handle Date object from vue-datepicker
  if (value instanceof Date) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    const hours = String(value.getHours()).padStart(2, '0')
    const minutes = String(value.getMinutes()).padStart(2, '0')
    const seconds = '00'
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  // Handle string format (fallback)
  return value.replace('T', ' ') + ':00'
}

const handleCancel = () => {
  router.push({ name: 'jadwal.list' })
}
</script>
