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
        <h1 class="text-3xl font-bold text-slate-900">Tambah User</h1>
        <p class="text-slate-500 mt-1">Daftarkan akun admin/guru yang boleh masuk ke sistem</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Form Section -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Nama -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Contoh: Budi Santoso, S.Pd."
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.name }">
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- Username -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Username <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="Username sianida"
            maxlength="100"
            autocomplete="off"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.username }">
          <p v-if="errors.username" class="text-red-600 text-sm mt-1">{{ errors.username }}</p>
          <p v-else class="text-slate-500 text-sm mt-1">Untuk login Sianida, gunakan username yang sama dengan di Sianida</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Email (Opsional)</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="nama@contoh.com"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email }">
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
          <p v-else class="text-slate-500 text-sm mt-1">
            Jika kosong, diisi otomatis <span class="font-mono">{{ (formData.username.trim() || '&lt;username&gt;') }}@sianida.local</span>
          </p>
        </div>

        <!-- Metode Login -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Metode Login</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              v-for="opt in loginOptions"
              :key="opt.value"
              :class="[
                'flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors',
                formData.loginMethod === opt.value ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              ]">
              <input v-model="formData.loginMethod" type="radio" :value="opt.value" class="mt-1 accent-sky-600">
              <div>
                <p class="font-semibold text-slate-900">{{ opt.label }}</p>
                <p class="text-sm text-slate-500">{{ opt.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Password lokal -->
        <div v-if="formData.loginMethod === 'local'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Password <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              autocomplete="new-password"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.password }">
            <p v-if="errors.password" class="text-red-600 text-sm mt-1">{{ errors.password }}</p>
          </div>
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Konfirmasi Password <span class="text-red-600">*</span>
            </label>
            <input
              v-model="formData.passwordConfirm"
              type="password"
              autocomplete="new-password"
              placeholder="Ulangi password"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
              :class="{ 'border-red-500 focus:ring-red-500': errors.passwordConfirm }">
            <p v-if="errors.passwordConfirm" class="text-red-600 text-sm mt-1">{{ errors.passwordConfirm }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <button
            type="submit"
            class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="isSubmitting">
            <span class="material-symbols-outlined">{{ isSubmitting ? 'hourglass_empty' : 'check' }}</span>
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan User' }}
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const isSubmitting = ref(false)
const error = ref(null)

const loginOptions = [
  { value: 'sianida', label: 'Akun Sianida', description: 'Login memakai username & password Sianida (disarankan untuk guru)' },
  { value: 'local', label: 'Password lokal', description: 'Login memakai password khusus aplikasi ini (mis. akun cadangan)' },
]

const formData = reactive({
  name: '',
  username: '',
  email: '',
  loginMethod: 'sianida',
  password: '',
  passwordConfirm: '',
})

const errors = reactive({
  name: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

const validate = () => {
  Object.keys(errors).forEach(k => { errors[k] = '' })

  if (!formData.name.trim()) errors.name = 'Nama wajib diisi'
  if (!formData.username.trim()) errors.username = 'Username wajib diisi'
  if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Format email tidak valid'
  }
  if (formData.loginMethod === 'local') {
    if (formData.password.length < 6) errors.password = 'Password minimal 6 karakter'
    if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = 'Konfirmasi password tidak cocok'
  }

  return !Object.values(errors).some(Boolean)
}

const handleSubmit = async () => {
  if (!validate()) return

  const payload = {
    name: formData.name.trim(),
    username: formData.username.trim(),
  }
  if (formData.email.trim()) payload.email = formData.email.trim()
  if (formData.loginMethod === 'local') payload.password = formData.password

  isSubmitting.value = true
  error.value = null
  try {
    await userStore.createUser(payload)
    router.push({ name: 'user.list' })
  } catch (err) {
    error.value = userStore.error || 'Gagal menambahkan user'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'user.list' })
}
</script>
