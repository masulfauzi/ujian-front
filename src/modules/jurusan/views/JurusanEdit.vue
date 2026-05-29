<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-2xl mx-auto">
      <!-- Page Title -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          Edit Jurusan <span v-if="!isLoadingDetail" class="text-sky-600">{{ selectedJurusan?.nama_jurusan }}</span>
        </h1>
        <p class="text-slate-500 mt-1">Perbarui informasi jurusan</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State for Detail -->
      <div v-if="isLoadingDetail" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data jurusan...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Nama Jurusan Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama Jurusan <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.nama_jurusan"
            @blur="validateNamaJurusan"
            type="text"
            placeholder="Contoh: Teknik Komputer dan Jaringan"
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.nama_jurusan }">
          <p v-if="errors.nama_jurusan" class="text-red-600 text-sm mt-1">{{ errors.nama_jurusan }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.nama_jurusan.length }} / 255 karakter</p>
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
import { onMounted, reactive, ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useJurusanStore } from '@/stores/jurusan'

const route = useRoute()
const router = useRouter()
const jurusanStore = useJurusanStore()
const jurusanId = route.params.id
const isLoadingDetail = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  nama_jurusan: ''
})

const errors = reactive({
  nama_jurusan: ''
})

const selectedJurusan = computed(() => jurusanStore.selectedJurusan)

onMounted(async () => {
  try {
    await jurusanStore.fetchJurusanById(jurusanId)
    const jurusan = jurusanStore.selectedJurusan

    if (jurusan) {
      formData.nama_jurusan = jurusan.nama_jurusan
    }
  } catch (err) {
    error.value = 'Jurusan tidak ditemukan'
  } finally {
    isLoadingDetail.value = false
  }
})

const validateNamaJurusan = () => {
  errors.nama_jurusan = ''
  if (!formData.nama_jurusan || formData.nama_jurusan.trim().length === 0) {
    errors.nama_jurusan = 'Nama jurusan wajib diisi'
  } else if (formData.nama_jurusan.length > 255) {
    errors.nama_jurusan = 'Nama jurusan maksimal 255 karakter'
  }
}

const validateForm = () => {
  validateNamaJurusan()
  return !errors.nama_jurusan
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await jurusanStore.updateJurusan(jurusanId, {
      nama_jurusan: formData.nama_jurusan.trim()
    })

    router.push({ name: 'jurusan.list' })
  } catch (err) {
    error.value = jurusanStore.error || 'Gagal mengupdate jurusan'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
