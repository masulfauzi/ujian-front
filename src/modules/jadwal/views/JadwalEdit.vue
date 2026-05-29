<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-2xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          Edit Jadwal Ujian <span v-if="!isLoadingDetail" class="text-sky-600">{{ selectedJadwal?.nama_bank_soal }}</span>
        </h1>
        <p class="text-slate-500 mt-1">Perbarui informasi jadwal ujian</p>
      </div>

      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <div v-if="isLoadingDetail" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data jadwal...</p>
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

        <!-- Opsi Pengacakan -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-3">Opsi Pengacakan</label>
          <div class="space-y-3 border border-slate-300 rounded-lg p-4">
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative mt-0.5 shrink-0">
                <input type="checkbox" v-model="formData.acak_soal" class="sr-only peer" />
                <div class="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all flex items-center justify-center">
                  <span v-if="formData.acak_soal" class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">check</span>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-800 group-hover:text-sky-600 transition-colors">Acak Soal</p>
                <p class="text-xs text-slate-500 mt-0.5">Urutan soal diacak untuk setiap peserta</p>
              </div>
            </label>
            <div class="border-t border-slate-100"></div>
            <label class="flex items-start gap-3 cursor-pointer group">
              <div class="relative mt-0.5 shrink-0">
                <input type="checkbox" v-model="formData.acak_opsi" class="sr-only peer" />
                <div class="w-5 h-5 rounded border-2 border-slate-300 peer-checked:border-sky-500 peer-checked:bg-sky-500 transition-all flex items-center justify-center">
                  <span v-if="formData.acak_opsi" class="material-symbols-outlined text-white text-[14px]" style="font-variation-settings: 'FILL' 1;">check</span>
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-800 group-hover:text-sky-600 transition-colors">Acak Opsi Jawaban</p>
                <p class="text-xs text-slate-500 mt-0.5">Urutan pilihan jawaban (A–E) diacak untuk setiap peserta</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">check</span>
            Simpan Perubahan
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
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const router = useRouter()
const jadwalStore = useJadwalStore()
const jurusanStore = useJurusanStore()
const kelasStore = useKelasStore()

const isLoadingDetail = ref(false)
const isSubmitting = ref(false)
const error = ref(null)
const showKelasOptions = ref(false)
const bankSoals = ref([])
const selectedJurusanData = ref([])

const formData = reactive({
  nama_ujian: '',
  id_bank_soal: '',
  wkt_mulai: '',
  wkt_selesai: '',
  durasi: '',
  angkatan: '',
  id_jurusan: [],
  selectedKelasIds: [],
  acak_soal: false,
  acak_opsi: false,
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

const jadwalId = route.params.id

onMounted(async () => {
  isLoadingDetail.value = true
  try {
    // Load master data
    const [bankSoalRes, jurusanRes] = await Promise.all([
      api.get('/bank-soal', { params: { page: 1, page_size: 100 } }),
      jurusanStore.fetchJurusanList(1, 100),
    ])

    bankSoals.value = bankSoalRes.data?.data?.data || []

    // Load jadwal detail
    const jadwalData = await jadwalStore.fetchJadwalById(jadwalId)

    console.log('Jadwal data:', jadwalData)

    if (!jadwalData || !jadwalData.id) {
      throw new Error('Data jadwal tidak ditemukan')
    }

    formData.nama_ujian = jadwalData.nama_ujian || ''
    formData.id_bank_soal = jadwalData.id_bank_soal || ''
    formData.wkt_mulai = jadwalData.wkt_mulai ? toDatetimeLocal(jadwalData.wkt_mulai) : ''
    formData.wkt_selesai = jadwalData.wkt_selesai ? toDatetimeLocal(jadwalData.wkt_selesai) : ''
    formData.durasi = jadwalData.durasi || ''
    formData.angkatan = jadwalData.tingkat || ''
    formData.acak_soal = !!jadwalData.acak_soal
    formData.acak_opsi = !!jadwalData.acak_opsi

    // Extract id_jurusan dari response - gunakan key id_jurusan
    if (jadwalData.id_jurusan && Array.isArray(jadwalData.id_jurusan)) {
      selectedJurusanData.value = jadwalData.id_jurusan
      formData.id_jurusan = jadwalData.id_jurusan.map(item => item.id_jurusan)
      console.log('Selected jurusan IDs:', formData.id_jurusan)
      console.log('Selected jurusan data:', selectedJurusanData.value)
    }

    // Extract id_kelas dari response - id_kelas adalah array of objects dengan id_kelas field
    if (jadwalData.id_kelas && Array.isArray(jadwalData.id_kelas)) {
      formData.selectedKelasIds = jadwalData.id_kelas.map(item => item.id_kelas)
      console.log('Selected kelas IDs:', formData.selectedKelasIds)

      // Load kelas untuk semua selected jurusans
      if (formData.id_jurusan.length > 0 && formData.angkatan) {
        await loadKelas()
        // Safety check: ensure kelas section is shown if we have selected kelas
        if (formData.selectedKelasIds.length > 0) {
          showKelasOptions.value = true
        }
      }
    }
  } catch (err) {
    console.error('Full error:', err)
    console.error('Error response:', err.response)
    error.value = err.response?.data?.message || err.message || 'Gagal memuat data jadwal'
    console.error('Error loading jadwal:', err)
  } finally {
    isLoadingDetail.value = false
  }
})

const selectedJadwal = computed(() => jadwalStore.selectedJadwal)

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
      acak_soal: formData.acak_soal ? 1 : 0,
      acak_opsi: formData.acak_opsi ? 1 : 0,
    }

    console.log('Sending payload:', jadwalPayload)
    const response = await api.put(`/jadwal/${jadwalId}`, jadwalPayload)

    router.push({ name: 'jadwal.list' })
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memperbarui jadwal'
    console.error('Error updating jadwal:', err)
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

const toDatetimeLocal = (value) => {
  if (!value) return ''

  // Handle ISO 8601 format with timezone (e.g., "2026-05-21T10:26:00Z")
  if (value.includes('T')) {
    // Remove timezone part and create Date object
    const dateObj = new Date(value)
    return dateObj
  }

  // Handle old format "YYYY-MM-DD HH:MM:SS"
  const [date, time] = value.split(' ')
  const [year, month, day] = date.split('-')
  const [hours, minutes] = time.split(':')
  return new Date(year, month - 1, day, hours, minutes)
}

const handleCancel = () => {
  router.push({ name: 'jadwal.list' })
}
</script>
