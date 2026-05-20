<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-2xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">Buat Kelas Baru</h1>
        <p class="text-slate-500 mt-1">Tambahkan kelas baru ke sistem</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isSubmitting" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Membuat kelas...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Jurusan Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Jurusan <span class="text-red-600">*</span>
          </label>
          <SearchableSelect
            v-model="formData.id_jurusan"
            :options="jurusanOptions"
            :hasError="!!errors.id_jurusan"
            placeholder="Pilih Jurusan..." />
          <p v-if="errors.id_jurusan" class="text-red-600 text-sm mt-1">{{ errors.id_jurusan }}</p>
        </div>

        <!-- Nama Kelas Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama Kelas <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.nama_kelas"
            @blur="validateNamaKelas"
            type="text"
            placeholder="Contoh: X TKJ 1"
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.nama_kelas }">
          <p v-if="errors.nama_kelas" class="text-red-600 text-sm mt-1">{{ errors.nama_kelas }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.nama_kelas.length }} / 255 karakter</p>
        </div>

        <!-- Tingkat Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Tingkat <span class="text-red-600">*</span>
          </label>
          <select
            v-model="formData.tingkat"
            @blur="validateTingkat"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
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
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">check</span>
            Simpan Kelas
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
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SearchableSelect from '@/components/SearchableSelect.vue'
import { useKelasStore } from '@/stores/kelas'
import { useJurusanStore } from '@/stores/jurusan'
import { useRouter } from 'vue-router'

const kelasStore = useKelasStore()
const jurusanStore = useJurusanStore()
const router = useRouter()
const isSubmitting = ref(false)
const error = ref(null)

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

onMounted(async () => {
  try {
    await jurusanStore.fetchJurusanList(1, 100)
  } catch (err) {
    console.error('Error loading jurusan:', err)
  }
})

const jurusanOptions = computed(() =>
  jurusanStore.jurusans.map(j => ({ id: j.id, label: j.nama_jurusan }))
)

const validateIdJurusan = () => {
  errors.id_jurusan = formData.id_jurusan ? '' : 'Jurusan wajib dipilih'
}

const validateNamaKelas = () => {
  errors.nama_kelas = ''
  if (!formData.nama_kelas || formData.nama_kelas.trim().length === 0) {
    errors.nama_kelas = 'Nama kelas wajib diisi'
  } else if (formData.nama_kelas.length > 255) {
    errors.nama_kelas = 'Nama kelas maksimal 255 karakter'
  }
}

const validateTingkat = () => {
  errors.tingkat = formData.tingkat ? '' : 'Tingkat wajib dipilih'
}

const validateForm = () => {
  validateIdJurusan()
  validateNamaKelas()
  validateTingkat()
  return !errors.id_jurusan && !errors.nama_kelas && !errors.tingkat
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

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

const handleCancel = () => {
  router.back()
}
</script>
