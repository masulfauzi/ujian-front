<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-3xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Buat Soal Baru</h1>
          <p class="text-slate-500 mt-1">Tambahkan pertanyaan baru ke bank soal</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <!-- Loading State -->
        <div v-if="isSubmitting" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Membuat soal...</p>
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

          <!-- Mapel Selection -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Mata Pelajaran <span class="text-red-600">*</span>
            </label>
            <SearchableSelect
              :model-value="formData.mapel_id"
              @update:model-value="formData.mapel_id = $event"
              @blur="validateMapel"
              :options="mapelOptions"
              placeholder="Cari mata pelajaran..."
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

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              :disabled="isSubmitting">
              <span class="material-symbols-outlined">check</span>
              Simpan Soal
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
import { useBankSoalStore } from '@/stores/bankSoal'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'

const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const router = useRouter()
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  nama_bank_soal: '',
  mapel_id: '',
  jml_soal: ''
})

const errors = reactive({
  nama_bank_soal: '',
  mapel_id: '',
  jml_soal: ''
})

onMounted(async () => {
  await mapelStore.fetchMapelList(1, 100)
})

const mapels = computed(() => mapelStore.mapels)

const mapelOptions = computed(() =>
  mapels.value.map(mapel => ({
    id: mapel.id,
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

const validateForm = () => {
  validateNamaBankSoal()
  validateMapel()
  validateJmlSoal()
  return !errors.nama_bank_soal && !errors.mapel_id && !errors.jml_soal
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

    await bankSoalStore.createSoal(payload)
    router.push({ name: 'bankSoal.list' })
  } catch (err) {
    error.value = bankSoalStore.error || 'Gagal membuat soal'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
