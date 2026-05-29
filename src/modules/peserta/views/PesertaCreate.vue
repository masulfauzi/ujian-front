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
        <h1 class="text-3xl font-bold text-slate-900">Buat Peserta Baru</h1>
        <p class="text-slate-500 mt-1">Tambahkan peserta ujian baru ke sistem</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isSubmitting" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Membuat peserta...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Nama Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.nama"
            @blur="validateNama"
            type="text"
            placeholder="Masukkan nama lengkap peserta"
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.nama }">
          <p v-if="errors.nama" class="text-red-600 text-sm mt-1">{{ errors.nama }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.nama.length }} / 255 karakter</p>
        </div>

        <!-- Kelas Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Kelas <span class="text-red-600">*</span>
          </label>
          <SearchableSelect
            v-model="formData.id_kelas"
            :options="kelasOptions"
            :hasError="!!errors.id_kelas"
            placeholder="Pilih Kelas..." />
          <p v-if="errors.id_kelas" class="text-red-600 text-sm mt-1">{{ errors.id_kelas }}</p>
        </div>

        <!-- Username Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Username <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.username"
            @blur="validateUsername"
            type="text"
            placeholder="Masukkan username"
            maxlength="100"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.username }">
          <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
          <p class="text-slate-500 text-sm mt-1">{{ formData.username.length }} / 100 karakter</p>
        </div>

        <!-- Password Field -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Password <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.password"
            @blur="validatePassword"
            type="password"
            placeholder="Masukkan password minimal 6 karakter"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.password }">
          <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          <p class="text-slate-500 text-sm mt-1">Minimal 6 karakter</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">check</span>
            Simpan Peserta
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
import { usePesertaStore } from '@/stores/peserta'
import { useKelasStore } from '@/stores/kelas'
import { useRouter } from 'vue-router'

const pesertaStore = usePesertaStore()
const kelasStore = useKelasStore()
const router = useRouter()
const isSubmitting = ref(false)
const error = ref(null)

const formData = reactive({
  nama: '',
  id_kelas: '',
  username: '',
  password: '',
})

const errors = reactive({
  nama: '',
  id_kelas: '',
  username: '',
  password: '',
})

onMounted(async () => {
  try {
    await kelasStore.fetchKelasList(1, 100)
  } catch (err) {
    console.error('Error loading kelas:', err)
  }
})

const kelasOptions = computed(() =>
  kelasStore.kelass.map(k => ({ id: k.id, label: k.nama_kelas }))
)

const validateNama = () => {
  errors.nama = ''
  if (!formData.nama || formData.nama.trim().length === 0) {
    errors.nama = 'Nama wajib diisi'
  } else if (formData.nama.length > 255) {
    errors.nama = 'Nama maksimal 255 karakter'
  }
}

const validateIdKelas = () => {
  errors.id_kelas = formData.id_kelas ? '' : 'Kelas wajib dipilih'
}

const validateUsername = () => {
  errors.username = ''
  if (!formData.username || formData.username.trim().length === 0) {
    errors.username = 'Username wajib diisi'
  } else if (formData.username.length > 100) {
    errors.username = 'Username maksimal 100 karakter'
  }
}

const validatePassword = () => {
  errors.password = ''
  if (!formData.password || formData.password.length === 0) {
    errors.password = 'Password wajib diisi'
  } else if (formData.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
  }
}

const validateForm = () => {
  validateNama()
  validateIdKelas()
  validateUsername()
  validatePassword()
  return !errors.nama && !errors.id_kelas && !errors.username && !errors.password
}

const handleSubmit = async () => {
  error.value = null

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    await pesertaStore.createPeserta({
      nama: formData.nama.trim(),
      id_kelas: formData.id_kelas,
      username: formData.username.trim(),
      password: formData.password,
    })

    router.push({ name: 'peserta.list' })
  } catch (err) {
    error.value = pesertaStore.error || 'Gagal membuat peserta'
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.back()
}
</script>
