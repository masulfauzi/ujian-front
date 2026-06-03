<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Manajemen Nilai</h1>
          <p class="text-slate-500 mt-1">Lihat dan ekspor nilai peserta ujian</p>
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ errorMsg }}
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-2">Pilih Jadwal</label>
              <select
                v-model="selectedJadwalId"
                @change="loadNilai()"
                :disabled="isLoadingJadwal"
                class="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed">
                <option value="">-- Pilih Jadwal --</option>
                <option v-for="jadwal in jadwalList" :key="jadwal.id" :value="jadwal.id">
                  {{ jadwal.nama_ujian }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingNilai" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat data nilai...</p>
          </div>
        </div>

        <!-- Export Button & Data Section -->
        <div v-else-if="selectedJadwalId">
          <!-- Export Button -->
          <div class="mb-6 flex gap-3">
            <button
              v-if="nilaiList.length > 0"
              @click="handleExport"
              :disabled="isExporting"
              class="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              <span class="material-symbols-outlined">download</span>
              {{ isExporting ? 'Mengunduh...' : 'Export Nilai' }}
            </button>
          </div>

          <!-- Table Section -->
          <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
            <div v-if="nilaiList.length === 0" class="text-center py-12">
              <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
              <p class="text-slate-600 mt-4">Belum ada data nilai untuk jadwal ini</p>
            </div>

            <table v-else class="w-full">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Peserta</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nilai</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Mulai</th>
                  <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Waktu Selesai</th>
                  <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200">
                <tr v-for="(nilai, index) in nilaiList" :key="nilai.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 text-slate-900 font-medium">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td class="px-6 py-4 text-slate-900">{{ nilai.nama_peserta }}</td>
                  <td class="px-6 py-4 text-slate-900 font-medium">{{ nilai.nilai }}</td>
                  <td class="px-6 py-4 text-slate-600 text-sm">{{ formatDateTime(nilai.wkt_mulai) }}</td>
                  <td class="px-6 py-4 text-slate-600 text-sm">{{ formatDateTime(nilai.wkt_selesai) }}</td>
                  <td class="px-6 py-4 text-center">
                    <span
                      :class="nilai.nilai >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold">
                      <span class="material-symbols-outlined text-[13px]" style="font-variation-settings: 'FILL' 1;">
                        {{ nilai.nilai >= 75 ? 'check_circle' : 'cancel' }}
                      </span>
                      {{ nilai.nilai >= 75 ? 'Lulus' : 'Tidak Lulus' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="nilaiList.length > 0" class="flex items-center justify-between mt-6">
            <p class="text-slate-600">
              Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
              {{ Math.min(currentPage * pageSize, totalNilai) }} dari {{ totalNilai }} data nilai
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

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <span class="material-symbols-outlined text-7xl text-slate-300">event</span>
          <p class="text-slate-600 mt-4 text-lg">Pilih jadwal untuk melihat data nilai</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { jadwalService } from '@/services/jadwalService'
import { nilaiService } from '@/services/nilaiService'

const jadwalList = ref([])
const selectedJadwalId = ref('')
const nilaiList = ref([])
const totalNilai = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const isLoadingJadwal = ref(false)
const isLoadingNilai = ref(false)
const isExporting = ref(false)
const errorMsg = ref('')

const totalPages = computed(() => Math.ceil(totalNilai.value / pageSize.value))

onMounted(async () => {
  isLoadingJadwal.value = true
  try {
    const res = await jadwalService.getJadwalList(1, 100)
    jadwalList.value = res.data?.data || []
  } catch (err) {
    errorMsg.value = 'Gagal memuat daftar jadwal'
    console.error('Error loading jadwal:', err)
  } finally {
    isLoadingJadwal.value = false
  }
})

const loadNilai = async (page = 1) => {
  if (!selectedJadwalId.value) {
    nilaiList.value = []
    totalNilai.value = 0
    currentPage.value = 1
    return
  }
  isLoadingNilai.value = true
  errorMsg.value = ''
  try {
    const res = await nilaiService.getNilaiByJadwal(selectedJadwalId.value, page, pageSize.value)
    nilaiList.value = res.data?.data || []
    totalNilai.value = res.data?.total || 0
    currentPage.value = page
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal memuat nilai'
    nilaiList.value = []
    totalNilai.value = 0
    console.error('Error loading nilai:', err)
  } finally {
    isLoadingNilai.value = false
  }
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await loadNilai(page)
  }
}

const handleExport = async () => {
  if (!selectedJadwalId.value) return
  isExporting.value = true
  try {
    const response = await nilaiService.exportNilai(selectedJadwalId.value)
    const blob = new Blob([response.data], { type: 'application/zip' })
    const url = URL.createObjectURL(blob)
    const filename =
      response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || 'export_nilai.zip'
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Gagal mengekspor nilai'
    console.error('Error exporting nilai:', err)
  } finally {
    isExporting.value = false
  }
}

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}
</script>
