<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-7xl mx-auto">
      <!-- Page Title & Create Button -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Mapel</h1>
          <p class="text-slate-500 mt-1">Kelola semua mata pelajaran dalam sistem</p>
        </div>
        <button
          @click="handleCreate"
          class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          <span class="material-symbols-outlined">add</span>
          Buat Mapel Baru
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

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3 text-slate-600">Memuat data mapel...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div v-if="!isLoading && mapels.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
          <p class="text-slate-600 mt-4">Belum ada mapel yang dibuat</p>
          <button
            @click="handleCreate"
            class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
            Buat mapel pertama Anda
          </button>
        </div>

        <table v-else class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Mapel</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Deskripsi</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(mapel, index) in mapels" :key="mapel.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-900">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="px-6 py-4 text-slate-900 font-medium">{{ mapel.nama_mapel }}</td>
              <td class="px-6 py-4 text-slate-600">
                <span class="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {{ mapel.kode_mapel }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-600">
                {{ mapel.deskripsi ? truncateText(mapel.deskripsi, 50) : '-' }}
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleView(mapel.id)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Lihat detail">
                    <span class="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button
                    @click="handleEdit(mapel.id)"
                    class="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="Edit">
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    @click="handleDelete(mapel.id)"
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

      <!-- Pagination -->
      <div v-if="!isLoading && mapels.length > 0" class="flex items-center justify-between mt-6">
        <p class="text-slate-600">
          Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
          {{ Math.min(currentPage * pageSize, totalMapels) }} dari {{ totalMapels }} mapel
        </p>
        <div class="flex gap-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Sebelumnya
          </button>
          <div class="flex items-center gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="handlePageChange(page)"
              :class="[
                'px-3 py-2 rounded-lg font-medium transition-colors',
                page === currentPage
                  ? 'bg-sky-600 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              ]">
              {{ page }}
            </button>
          </div>
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Berikutnya
          </button>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

const mapelStore = useMapelStore()
const router = useRouter()
const { $confirm } = useDialog()
const currentPage = ref(1)
const deleteConfirmId = ref(null)

onMounted(async () => {
  await mapelStore.fetchMapelList(1)
})

const mapels = computed(() => mapelStore.mapels)
const isLoading = computed(() => mapelStore.isLoading)
const error = computed(() => mapelStore.error)
const success = computed(() => mapelStore.success)
const pageSize = computed(() => mapelStore.pageSize)
const totalMapels = computed(() => mapelStore.totalMapels)
const totalPages = computed(() => mapelStore.totalPages)

watch(success, (newVal) => {
  if (newVal) {
    setTimeout(() => mapelStore.clearSuccess(), 3000)
  }
})

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => mapelStore.clearError(), 3000)
  }
})

const handleCreate = () => {
  router.push({ name: 'mapel.create' })
}

const handleView = (id) => {
  router.push({ name: 'mapel.detail', params: { id } })
}

const handleEdit = (id) => {
  router.push({ name: 'mapel.edit', params: { id } })
}

const handleDelete = async (id) => {
  if (await $confirm('Yakin ingin menghapus mapel ini?', { title: 'Konfirmasi Hapus' })) {
    try {
      await mapelStore.deleteMapel(id)
      await mapelStore.fetchMapelList(currentPage.value)
    } catch (err) {
      console.error('Error deleting mapel:', err)
    }
  }
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await mapelStore.fetchMapelList(page)
  }
}

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>
