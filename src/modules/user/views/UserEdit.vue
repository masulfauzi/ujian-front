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
        <h1 class="text-3xl font-bold text-slate-900">Edit User</h1>
        <p class="text-slate-500 mt-1">Perbarui data, status, atau metode login user</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingData" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data user...</p>
        </div>
      </div>

      <!-- Form Section -->
      <form v-else-if="user" @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
        <!-- Username (read-only) -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Username</label>
          <div class="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            <span class="material-symbols-outlined text-slate-400 text-lg">person</span>
            {{ user.username }}
            <span v-if="isSelf" class="ml-auto bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">Akun Anda</span>
          </div>
          <p class="text-slate-500 text-sm mt-1">Username tidak dapat diubah</p>
        </div>

        <!-- Nama -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">
            Nama <span class="text-red-600">*</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            maxlength="255"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.name }">
          <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Email</label>
          <input
            v-model="formData.email"
            type="email"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email }">
          <p v-if="errors.email" class="text-red-600 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Status</label>
          <div class="flex gap-3">
            <label
              v-for="opt in statusOptions"
              :key="opt.value"
              :class="[
                'flex-1 flex items-center gap-2 p-3 border-2 rounded-lg transition-colors',
                isSelf ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                formData.status === opt.value ? opt.activeClass : 'border-slate-200 hover:border-slate-300'
              ]">
              <input v-model="formData.status" type="radio" :value="opt.value" :disabled="isSelf" class="accent-sky-600">
              <span class="font-semibold">{{ opt.label }}</span>
            </label>
          </div>
          <p class="text-slate-500 text-sm mt-1">
            {{ isSelf ? 'Anda tidak dapat menonaktifkan akun sendiri' : 'User nonaktif tidak bisa login' }}
          </p>
        </div>

        <!-- Metode Login / Password -->
        <div>
          <label class="block text-sm font-semibold text-slate-900 mb-2">Metode Login</label>
          <p class="text-sm text-slate-600 mb-3">
            Saat ini:
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                user.login_sianida ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
              ]">
              {{ user.login_sianida ? 'Sianida' : 'Password lokal' }}
            </span>
          </p>
          <div class="space-y-2">
            <label
              v-for="opt in passwordOptions"
              :key="opt.value"
              :class="[
                'flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors',
                formData.passwordMode === opt.value ? 'border-sky-500 bg-sky-50' : 'border-slate-200 hover:border-slate-300'
              ]">
              <input v-model="formData.passwordMode" type="radio" :value="opt.value" class="mt-1 accent-sky-600">
              <div>
                <p class="font-semibold text-slate-900">{{ opt.label }}</p>
                <p class="text-sm text-slate-500">{{ opt.description }}</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Password lokal -->
        <div v-if="formData.passwordMode === 'local'" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Password Baru <span class="text-red-600">*</span>
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
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const user = ref(null)
const isLoadingData = ref(true)
const isSubmitting = ref(false)
const error = ref(null)

const isSelf = computed(() => !!user.value && user.value.id === authStore.currentUser?.user_id)

const statusOptions = [
  { value: 'active', label: 'Aktif', activeClass: 'border-green-500 bg-green-50 text-green-700' },
  { value: 'inactive', label: 'Nonaktif', activeClass: 'border-red-500 bg-red-50 text-red-700' },
]

const passwordOptions = computed(() => [
  { value: 'keep', label: 'Tidak diubah', description: 'Metode login dan password tetap seperti sekarang' },
  { value: 'sianida', label: 'Login dengan akun Sianida', description: 'Hapus password lokal; user login memakai username & password Sianida' },
  {
    value: 'local',
    label: user.value?.login_sianida ? 'Pakai password lokal' : 'Ganti password lokal',
    description: 'Set password khusus aplikasi ini',
  },
])

const formData = reactive({
  name: '',
  email: '',
  status: 'active',
  passwordMode: 'keep',
  password: '',
  passwordConfirm: '',
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
})

onMounted(async () => {
  try {
    const data = await userStore.fetchUserById(route.params.id)
    user.value = data
    formData.name = data.name || ''
    formData.email = data.email || ''
    formData.status = data.status || 'active'
  } catch (err) {
    error.value = userStore.error || 'Gagal memuat data user'
  } finally {
    isLoadingData.value = false
  }
})

const validate = () => {
  Object.keys(errors).forEach(k => { errors[k] = '' })

  if (!formData.name.trim()) errors.name = 'Nama wajib diisi'
  if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
    errors.email = 'Format email tidak valid'
  }
  if (formData.passwordMode === 'local') {
    if (formData.password.length < 6) errors.password = 'Password minimal 6 karakter'
    if (formData.password !== formData.passwordConfirm) errors.passwordConfirm = 'Konfirmasi password tidak cocok'
  }

  return !Object.values(errors).some(Boolean)
}

// Hanya kirim field yang berubah (backend: field yang tidak dikirim tidak diubah)
const buildPayload = () => {
  const payload = {}
  const name = formData.name.trim()
  const email = formData.email.trim()

  if (name !== (user.value.name || '')) payload.name = name
  if (email && email !== (user.value.email || '')) payload.email = email
  if (!isSelf.value && formData.status !== user.value.status) payload.status = formData.status

  if (formData.passwordMode === 'sianida') payload.password = ''
  else if (formData.passwordMode === 'local') payload.password = formData.password

  return payload
}

const handleSubmit = async () => {
  if (!validate()) return

  const payload = buildPayload()
  if (Object.keys(payload).length === 0) {
    router.push({ name: 'user.list' })
    return
  }

  isSubmitting.value = true
  error.value = null
  try {
    await userStore.updateUser(user.value.id, payload)
    router.push({ name: 'user.list' })
  } catch (err) {
    error.value = userStore.error || 'Gagal memperbarui user'
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  router.push({ name: 'user.list' })
}
</script>
