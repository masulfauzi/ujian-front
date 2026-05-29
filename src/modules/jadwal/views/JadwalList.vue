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
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Jadwal Ujian</h1>
          <p class="text-slate-500 mt-1">Kelola semua jadwal ujian dalam sistem</p>
        </div>
        <button
          @click="handleCreate"
          class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
          <span class="material-symbols-outlined">add</span>
          Buat Jadwal Baru
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
          <p class="mt-3 text-slate-600">Memuat data jadwal...</p>
        </div>
      </div>

      <!-- Table Section -->
      <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div v-if="!isLoading && jadwals.length === 0" class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
          <p class="text-slate-600 mt-4">Belum ada jadwal ujian yang dibuat</p>
          <button
            @click="handleCreate"
            class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
            Buat jadwal pertama Anda
          </button>
        </div>

        <table v-else class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Ujian</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Bank Soal</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Pelaksanaan</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Acak Soal</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Acak Opsi</th>
              <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(jadwal, index) in jadwals" :key="jadwal.id" class="hover:bg-slate-50">
              <td class="px-6 py-4 text-slate-900">
                {{ (currentPage - 1) * pageSize + index + 1 }}
              </td>
              <td class="px-6 py-4 text-slate-900 font-medium">{{ jadwal.nama_ujian }}</td>
              <td class="px-6 py-4 text-slate-900">{{ jadwal.nama_bank_soal }}</td>
              <td class="px-6 py-4">
                <p class="text-slate-800 font-medium text-sm">{{ formatTanggal(jadwal.wkt_mulai) }}</p>
                <p class="text-slate-500 text-xs mt-0.5">{{ formatJam(jadwal.wkt_mulai) }} – {{ formatJam(jadwal.wkt_selesai) }} WIB</p>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="jadwal.acak_soal ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">
                    {{ jadwal.acak_soal ? 'check_circle' : 'cancel' }}
                  </span>
                  {{ jadwal.acak_soal ? 'Ya' : 'Tidak' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span :class="jadwal.acak_opsi ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
                  class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
                  <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">
                    {{ jadwal.acak_opsi ? 'check_circle' : 'cancel' }}
                  </span>
                  {{ jadwal.acak_opsi ? 'Ya' : 'Tidak' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleDetail(jadwal.id)"
                    class="p-2 text-sky-600 hover:bg-sky-50 rounded transition-colors"
                    title="Lihat Detail">
                    <span class="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button
                    @click="handleEdit(jadwal.id)"
                    class="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                    title="Edit">
                    <span class="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    @click="handleDelete(jadwal.id)"
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
      <div v-if="!isLoading && jadwals.length > 0" class="flex items-center justify-between mt-6">
        <p class="text-slate-600">
          Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
          {{ Math.min(currentPage * pageSize, totalJadwal) }} dari {{ totalJadwal }} jadwal
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
import { useJadwalStore } from '@/stores/jadwal'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

const jadwalStore = useJadwalStore()
const router = useRouter()
const { $confirm } = useDialog()
const currentPage = ref(1)

onMounted(async () => {
  await jadwalStore.fetchJadwalList(1)
})

const jadwals = computed(() => jadwalStore.jadwals)
const isLoading = computed(() => jadwalStore.isLoading)
const error = computed(() => jadwalStore.error)
const success = computed(() => jadwalStore.success)
const pageSize = computed(() => jadwalStore.pageSize)
const totalJadwal = computed(() => jadwalStore.totalJadwal)
const totalPages = computed(() => jadwalStore.totalPages)

watch(success, (newVal) => {
  if (newVal) {
    setTimeout(() => jadwalStore.clearSuccess(), 3000)
  }
})

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => jadwalStore.clearError(), 3000)
  }
})

const formatTanggal = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatJam = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const handleCreate = () => {
  router.push({ name: 'jadwal.create' })
}

const handleDetail = (id) => {
  router.push({ name: 'jadwal.detail', params: { id } })
}

const handleEdit = (id) => {
  router.push({ name: 'jadwal.edit', params: { id } })
}

const handleDelete = async (id) => {
  if (await $confirm('Yakin ingin menghapus jadwal ini?', { title: 'Konfirmasi Hapus' })) {
    try {
      await jadwalStore.deleteJadwal(id)
      await jadwalStore.fetchJadwalList(currentPage.value, pageSize.value)
    } catch (err) {
      console.error('Error deleting jadwal:', err)
    }
  }
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await jadwalStore.fetchJadwalList(page, pageSize.value)
  }
}
</script>
