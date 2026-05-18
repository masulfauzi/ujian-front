<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-3xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Edit Soal</h1>
          <p class="text-slate-500 mt-1">Perbarui pertanyaan ujian</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <!-- Loading State for Detail -->
        <div v-if="isLoadingDetail" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat data soal...</p>
          </div>
        </div>

        <!-- Loading State for Submit -->
        <div v-else-if="isSubmitting" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Mengupdate soal...</p>
          </div>
        </div>

        <!-- Form Section -->
        <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
          <!-- Nama Bank Soal -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Nama Bank Soal <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.nama_bank_soal"
              @blur="validateNamaBankSoal"
              type="text"
              placeholder="Contoh: Soal Quiz Matematika"
              maxlength="255"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.nama_bank_soal }">
            <p v-if="errors.nama_bank_soal" class="text-red-600 text-sm mt-1">{{ errors.nama_bank_soal }}</p>
            <p class="text-slate-500 text-sm mt-1">{{ formData.nama_bank_soal.length }} / 255 karakter</p>
          </div>

          <!-- Mapel Selection (Searchable) -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Mata Pelajaran <span class="text-red-600">*</span>
            </label>
            <SearchableSelect
              :model-value="formData.mapel_id"
              @update:model-value="formData.mapel_id = $event"
              @blur="validateMapel"
              :options="mapelOptions"
              :placeholder="'Cari mata pelajaran...'"
              :has-error="!!errors.mapel_id" />
            <p v-if="errors.mapel_id" class="text-red-600 text-sm mt-1">{{ errors.mapel_id }}</p>
          </div>

          <!-- Jumlah Soal -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Jumlah Soal <span class="text-red-600">*</span>
            </label>
            <input
              v-model.number="formData.jml_soal"
              @blur="validateJmlSoal"
              type="number"
              placeholder="Contoh: 10"
              min="1"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.jml_soal }">
            <p v-if="errors.jml_soal" class="text-red-600 text-sm mt-1">{{ errors.jml_soal }}</p>
          </div>

          <!-- Pilihan Ganda Section -->
          <div v-if="formData.tipe_soal === 'pilihan_ganda'" class="border-t pt-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Pilihan Jawaban</h3>

            <div v-for="(pilihan, index) in pilihanJawaban" :key="index" class="mb-4">
              <div class="flex gap-3 items-start">
                <div class="flex-1">
                  <label class="block text-sm font-medium text-slate-700 mb-2">
                    Pilihan {{ String.fromCharCode(65 + index) }}
                  </label>
                  <input
                    v-model="pilihan.text"
                    type="text"
                    :placeholder="`Ketik pilihan ${String.fromCharCode(65 + index)}`"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                </div>
                <div class="flex items-center gap-2 mt-8">
                  <input
                    :id="`jawaban-${index}`"
                    v-model="formData.jawaban_benar"
                    type="radio"
                    :value="index.toString()"
                    class="w-4 h-4">
                  <label :for="`jawaban-${index}`" class="text-slate-700 font-medium">Jawab</label>
                </div>
              </div>
            </div>

            <p v-if="errors.pilihanJawaban" class="text-red-600 text-sm mt-2">{{ errors.pilihanJawaban }}</p>
            <p v-if="errors.jawaban_benar" class="text-red-600 text-sm mt-2">{{ errors.jawaban_benar }}</p>
          </div>

          <!-- Uraian Section -->
          <div v-else-if="formData.tipe_soal === 'uraian'" class="border-t pt-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Kunci Jawaban</h3>

            <textarea
              v-model="formData.kunci_jawaban"
              placeholder="Ketik kunci jawaban untuk soal uraian ini"
              rows="4"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none">
            </textarea>
            <p class="text-slate-500 text-sm mt-2">Kunci jawaban membantu dalam penilaian soal</p>
          </div>

          <!-- Benar Salah Section -->
          <div v-else-if="formData.tipe_soal === 'benar_salah'" class="border-t pt-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Jawaban Benar</h3>

            <div class="flex gap-6">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.jawaban_benar"
                  type="radio"
                  value="benar"
                  class="w-4 h-4">
                <span class="text-slate-700 font-medium">Benar</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="formData.jawaban_benar"
                  type="radio"
                  value="salah"
                  class="w-4 h-4">
                <span class="text-slate-700 font-medium">Salah</span>
              </label>
            </div>
            <p v-if="errors.jawaban_benar" class="text-red-600 text-sm mt-2">{{ errors.jawaban_benar }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
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
import { reactive, ref, computed, onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SearchableSelect from '@/components/SearchableSelect.vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankSoalStore } from '@/stores/bankSoal'
import { useMapelStore } from '@/stores/mapel'

const route = useRoute()
const router = useRouter()
const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const soalId = route.params.id

const isLoadingDetail = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  nama_bank_soal: '',
  mapel_id: '',
  jml_soal: '',
  tipe_soal: 'pilihan_ganda',
  pertanyaan: 'Bank Soal',
  tingkat_kesulitan: 'sedang',
  jawaban_benar: '',
  kunci_jawaban: ''
})

const pilihanJawaban = reactive([])

const errors = reactive({
  nama_bank_soal: '',
  mapel_id: '',
  jml_soal: '',
  tipe_soal: '',
  pertanyaan: '',
  tingkat_kesulitan: '',
  jawaban_benar: '',
  pilihanJawaban: ''
})

onMounted(async () => {
  try {
    await mapelStore.fetchMapelList(1, 100)
    await bankSoalStore.fetchSoalById(soalId)
    const soal = bankSoalStore.selectedSoal

    if (soal) {
      formData.nama_bank_soal = soal.nama_bank_soal || ''
      // Support both response shapes while the soal detail payload is normalized.
      formData.mapel_id = String(soal.id_mapel ?? soal.mapel_id ?? '')
      formData.jml_soal = soal.jml_soal ? Number(soal.jml_soal) : ''
      formData.tipe_soal = soal.tipe_soal
      formData.pertanyaan = soal.pertanyaan
      formData.tingkat_kesulitan = soal.tingkat_kesulitan
      formData.kunci_jawaban = soal.kunci_jawaban || ''

      if (soal.tipe_soal === 'pilihan_ganda') {
        pilihanJawaban.splice(0, pilihanJawaban.length)
        soal.pilihan_jawaban.forEach(p => pilihanJawaban.push({ text: p }))
        formData.jawaban_benar = soal.jawaban_benar.toString()
      } else if (soal.tipe_soal === 'benar_salah') {
        formData.jawaban_benar = soal.jawaban_benar
      }
    }
  } catch (err) {
    error.value = 'Soal tidak ditemukan'
  } finally {
    isLoadingDetail.value = false
  }
})

const mapels = computed(() => mapelStore.mapels)
const mapelOptions = computed(() =>
  mapels.value.map(mapel => ({
    id: String(mapel.id),
    label: mapel.nama_mapel
  }))
)

const validateNamaBankSoal = () => {
  errors.nama_bank_soal = ''
  if (!formData.nama_bank_soal || formData.nama_bank_soal.trim().length === 0) {
    errors.nama_bank_soal = 'Nama bank soal wajib diisi'
  }
}

const validateMapel = () => {
  errors.mapel_id = ''
  if (!formData.mapel_id) {
    errors.mapel_id = 'Mata pelajaran wajib dipilih'
  }
}

const validateJmlSoal = () => {
  errors.jml_soal = ''
  if (!formData.jml_soal) {
    errors.jml_soal = 'Jumlah soal wajib diisi'
  } else if (formData.jml_soal < 1) {
    errors.jml_soal = 'Jumlah soal minimal 1'
  }
}

const validatePilihanJawaban = () => {
  errors.pilihanJawaban = ''
  errors.jawaban_benar = ''

  const filledPilihan = pilihanJawaban.filter(p => p.text.trim().length > 0)
  if (filledPilihan.length < 2) {
    errors.pilihanJawaban = 'Minimal 2 pilihan jawaban harus diisi'
    return false
  }

  if (!formData.jawaban_benar) {
    errors.jawaban_benar = 'Jawaban benar harus dipilih'
    return false
  }

  return true
}

const validateForm = () => {
  validateNamaBankSoal()
  validateMapel()
  validateJmlSoal()
  return !errors.nama_bank_soal && !errors.mapel_id && !errors.jml_soal
}

const getTipeSoalLabel = (tipe) => {
  const labels = {
    'pilihan_ganda': 'Pilihan Ganda',
    'uraian': 'Uraian',
    'benar_salah': 'Benar/Salah'
  }
  return labels[tipe] || tipe
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      nama_bank_soal: formData.nama_bank_soal.trim(),
      id_mapel: formData.mapel_id,
      jml_soal: parseInt(formData.jml_soal)
    }

    await bankSoalStore.updateSoal(soalId, payload)
    router.push({ name: 'bankSoal.list' })
  } catch (err) {
    error.value = bankSoalStore.error || 'Gagal mengupdate soal'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
