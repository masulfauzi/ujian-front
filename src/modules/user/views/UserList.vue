<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
      <!-- Page Title & Create Button -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Manajemen User</h1>
          <p class="text-slate-500 mt-1">Kelola akun admin/guru yang boleh masuk ke sistem</p>
        </div>
        <button
          @click="handleCreate"
          class="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          <span class="material-symbols-outlined">person_add</span>
          Tambah User
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        {{ success }}
      </div>

      <!-- Search -->
      <div class="mb-4 relative max-w-[28rem]">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama, username, atau email..."
          class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all bg-white">
      </div>

      <!-- Loading State -->
      <div v-if="isLoading && users.length === 0" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data user...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div v-if="filteredUsers.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">group_off</span>
          <p class="text-slate-600 mt-4">
            {{ search ? 'Tidak ada user yang cocok dengan pencarian' : 'Belum ada user' }}
          </p>
          <button
            v-if="!search"
            @click="handleCreate"
            class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
            Tambah user pertama
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Username</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Metode Login</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(user, index) in filteredUsers" :key="user.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 text-slate-900">{{ index + 1 }}</td>
                <td class="px-6 py-4 text-slate-900 font-medium">
                  {{ user.name }}
                  <span v-if="isSelf(user)" class="ml-2 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-semibold">Anda</span>
                </td>
                <td class="px-6 py-4 text-slate-600">{{ user.username }}</td>
                <td class="px-6 py-4 text-slate-600">{{ user.email || '-' }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap',
                      user.login_sianida ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'
                    ]">
                    {{ user.login_sianida ? 'Sianida' : 'Password lokal' }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      user.status === 'inactive' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                    ]">
                    {{ user.status === 'inactive' ? 'Nonaktif' : 'Aktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="handleEdit(user.id)"
                      class="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="Edit">
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      v-if="!isSelf(user)"
                      @click="handleDelete(user)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Hapus">
                      <span class="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p v-if="!isLoading && users.length > 0" class="text-slate-600 mt-4">
        Menampilkan {{ filteredUsers.length }} dari {{ users.length }} user
      </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { useDialog } from '@/composables/useDialog'

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const { $confirm } = useDialog()
const search = ref('')

onMounted(async () => {
  try {
    await userStore.fetchUserList()
  } catch (err) {
    console.error('Error fetching users:', err)
  }
})

const users = computed(() => userStore.users)
const isLoading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)
const success = computed(() => userStore.success)

const filteredUsers = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u =>
    [u.name, u.username, u.email].some(v => (v || '').toLowerCase().includes(q))
  )
})

const isSelf = (user) => user.id === authStore.currentUser?.user_id

watch(success, (newVal) => {
  if (newVal) {
    setTimeout(() => userStore.clearSuccess(), 3000)
  }
})

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => userStore.clearError(), 3000)
  }
})

const handleCreate = () => {
  router.push({ name: 'user.create' })
}

const handleEdit = (id) => {
  router.push({ name: 'user.edit', params: { id } })
}

const handleDelete = async (user) => {
  if (await $confirm(`Yakin ingin menghapus user "${user.name}" (${user.username})?`, { title: 'Konfirmasi Hapus' })) {
    try {
      await userStore.deleteUser(user.id)
    } catch (err) {
      console.error('Error deleting user:', err)
    }
  }
}
</script>
