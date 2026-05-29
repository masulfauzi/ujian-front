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
          Edit Mapel <span v-if="!isLoadingDetail" class="text-sky-600">{{ selectedMapel?.nama_mapel }}</span>
        </h1>
        <p class="text-slate-500 mt-1">Perbarui informasi mata pelajaran</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State for Detail -->
      <div v-if="isLoadingDetail" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data mapel...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Nama Mapel Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama Mata Pelajaran <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.nama_mapel"
            @blur="validateNamaMapel"
            type="text"
            placeholder="Contoh: Matematika"
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.nama_mapel }">
          <p v-if="errors.nama_mapel" class="text-red-600 text-sm mt-1">{{ errors.nama_mapel }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.nama_mapel.length }} / 255 karakter</p>
        </div>

        <!-- Kode Mapel Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Kode Mapel <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.kode_mapel"
            @blur="validateKodeMapel"
            type="text"
            placeholder="Contoh: MAT"
            maxlength="20"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all uppercase"
            :class="{ 'border-red-500 focus:ring-red-500': errors.kode_mapel }">
          <p v-if="errors.kode_mapel" class="text-red-600 text-sm mt-1">{{ errors.kode_mapel }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.kode_mapel.length }} / 20 karakter (otomatis uppercase)</p>
        </div>

        <!-- Deskripsi Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Deskripsi (Opsional)</label>
          <textarea
            v-model="formData.deskripsi"
            placeholder="Deskripsi singkat tentang mata pelajaran ini"
            rows="4"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all resize-none">
          </textarea>
          <p class="text-slate-500 text-sm mt-1">Deskripsi membantu identifikasi mata pelajaran</p>
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
import { useMapelStore } from '@/stores/mapel'

const route = useRoute()
const router = useRouter()
const mapelStore = useMapelStore()
const mapelId = route.params.id
const isLoadingDetail = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  nama_mapel: '',
  kode_mapel: '',
  deskripsi: ''
})

const errors = reactive({
  nama_mapel: '',
  kode_mapel: ''
})

const selectedMapel = computed(() => mapelStore.selectedMapel)

onMounted(async () => {
  try {
    await mapelStore.fetchMapelById(mapelId)
    const mapel = mapelStore.selectedMapel

    if (mapel) {
      formData.nama_mapel = mapel.nama_mapel
      formData.kode_mapel = mapel.kode_mapel
      formData.deskripsi = mapel.deskripsi || ''
    }
  } catch (err) {
    error.value = 'Mapel tidak ditemukan'
  } finally {
    isLoadingDetail.value = false
  }
})

const validateNamaMapel = () => {
  errors.nama_mapel = ''
  if (!formData.nama_mapel || formData.nama_mapel.trim().length === 0) {
    errors.nama_mapel = 'Nama mapel wajib diisi'
  } else if (formData.nama_mapel.length > 255) {
    errors.nama_mapel = 'Nama mapel maksimal 255 karakter'
  }
}

const validateKodeMapel = () => {
  errors.kode_mapel = ''
  if (!formData.kode_mapel || formData.kode_mapel.trim().length === 0) {
    errors.kode_mapel = 'Kode mapel wajib diisi'
  } else if (formData.kode_mapel.length > 20) {
    errors.kode_mapel = 'Kode mapel maksimal 20 karakter'
  }
}

const validateForm = () => {
  validateNamaMapel()
  validateKodeMapel()
  return !errors.nama_mapel && !errors.kode_mapel
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await mapelStore.updateMapel(mapelId, {
      nama_mapel: formData.nama_mapel.trim(),
      kode_mapel: formData.kode_mapel.trim().toUpperCase(),
      deskripsi: formData.deskripsi.trim()
    })

    router.push({ name: 'mapel.list' })
  } catch (err) {
    error.value = mapelStore.error || 'Gagal mengupdate mapel'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
