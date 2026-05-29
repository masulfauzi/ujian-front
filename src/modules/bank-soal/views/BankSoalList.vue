<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
        <!-- Page Title & Create Button -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Bank Soal</h1>
            <p class="text-slate-500 mt-1">Kelola semua pertanyaan ujian dalam sistem</p>
          </div>
          <button
            @click="handleCreate"
            class="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            <span class="material-symbols-outlined">add</span>
            Buat Soal Baru
          </button>
        </div>

        <!-- Filter Section -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Filter & Cari</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Search Input -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Cari Pertanyaan</label>
              <input
                v-model="searchText"
                type="text"
                placeholder="Ketik pertanyaan..."
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
            </div>

            <!-- Mapel Filter -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Mata Pelajaran</label>
              <select
                v-model="selectedMapel"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Semua Mapel</option>
                <option v-for="mapel in mapels" :key="mapel.id" :value="mapel.id">
                  {{ mapel.nama_mapel }}
                </option>
              </select>
            </div>

            <!-- Tipe Soal Filter -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tipe Soal</label>
              <select
                v-model="selectedTipeSoal"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Semua Tipe</option>
                <option value="pilihan_ganda">Pilihan Ganda</option>
                <option value="uraian">Uraian</option>
                <option value="benar_salah">Benar/Salah</option>
              </select>
            </div>

            <!-- Tingkat Kesulitan Filter -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Tingkat Kesulitan</label>
              <select
                v-model="selectedTingkatKesulitan"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="">Semua Tingkat</option>
                <option value="mudah">Mudah</option>
                <option value="sedang">Sedang</option>
                <option value="sulit">Sulit</option>
              </select>
            </div>
          </div>

          <!-- Filter Buttons -->
          <div class="flex gap-3 mt-4">
            <button
              @click="applyFilters"
              class="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition-colors">
              Cari
            </button>
            <button
              @click="resetFilters"
              class="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors">
              Reset
            </button>
          </div>
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
            <p class="mt-3 text-slate-600">Memuat data soal...</p>
          </div>
        </div>

        <!-- Table Section -->
        <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
          <div v-if="soals.length === 0" class="text-center py-12">
            <span class="material-symbols-outlined text-6xl text-slate-300">inbox</span>
            <p class="text-slate-600 mt-4">Belum ada soal yang dibuat</p>
            <button
              @click="handleCreate"
              class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
              Buat soal pertama Anda
            </button>
          </div>

          <table v-else class="w-full">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No.</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Bank Soal</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Mata Pelajaran</th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Jumlah Soal</th>
                <th class="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(soal, index) in soals" :key="soal.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 text-slate-900">
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-6 py-4 text-slate-900 font-medium">
                  {{ soal.nama_bank_soal }}
                </td>
                <td class="px-6 py-4 text-slate-600">
                  {{ soal.nama_mapel || '-' }}
                </td>
                <td class="px-6 py-4 text-slate-600">
                  {{ soal.jml_soal }}
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex items-center justify-center gap-2">
                    <button
                      @click="handleView(soal.id)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Lihat detail">
                      <span class="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button
                      @click="handleEdit(soal.id)"
                      class="p-2 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      title="Edit">
                      <span class="material-symbols-outlined text-lg">edit</span>
                    </button>
                    <button
                      @click="handleDelete(soal.id)"
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
        <div v-if="!isLoading && soals.length > 0" class="flex items-center justify-between mt-6">
          <p class="text-slate-600">
            Menampilkan {{ (currentPage - 1) * pageSize + 1 }} hingga
            {{ Math.min(currentPage * pageSize, totalSoals) }} dari {{ totalSoals }} soal
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
import { useBankSoalStore } from '@/stores/bankSoal'
import { useMapelStore } from '@/stores/mapel'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const router = useRouter()
const { $confirm } = useDialog()

const currentPage = ref(1)
const searchText = ref('')
const selectedMapel = ref('')
const selectedTipeSoal = ref('')
const selectedTingkatKesulitan = ref('')

onMounted(async () => {
  // Load mapel list untuk filter dropdown
  await mapelStore.fetchMapelList(1, 100)
  // Load soal list
  await bankSoalStore.fetchSoalList(currentPage.value, {})
})

const soals = computed(() => bankSoalStore.soals)
const mapels = computed(() => mapelStore.mapels)
const isLoading = computed(() => bankSoalStore.isLoading)
const error = computed(() => bankSoalStore.error)
const success = computed(() => bankSoalStore.success)
const pageSize = computed(() => bankSoalStore.pageSize)
const totalSoals = computed(() => bankSoalStore.totalSoals)
const totalPages = computed(() => bankSoalStore.totalPages)

watch(success, (newVal) => {
  if (newVal) {
    setTimeout(() => bankSoalStore.clearSuccess(), 3000)
  }
})

watch(error, (newVal) => {
  if (newVal) {
    setTimeout(() => bankSoalStore.clearError(), 3000)
  }
})

const handleCreate = () => {
  router.push({ name: 'bankSoal.create' })
}

const handleView = (id) => {
  router.push({ name: 'bankSoal.detail', params: { id } })
}

const handleEdit = (id) => {
  router.push({ name: 'bankSoal.edit', params: { id } })
}

const handleDelete = async (id) => {
  if (await $confirm('Yakin ingin menghapus soal ini?', { title: 'Konfirmasi Hapus' })) {
    try {
      await bankSoalStore.deleteSoal(id)
      await bankSoalStore.fetchSoalList(currentPage.value, {})
    } catch (err) {
      console.error('Error deleting soal:', err)
    }
  }
}

const handlePageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await bankSoalStore.fetchSoalList(page, {})
  }
}

const applyFilters = async () => {
  const filters = {
    mapel_id: selectedMapel.value || undefined,
    tipe_soal: selectedTipeSoal.value || undefined,
    tingkat_kesulitan: selectedTingkatKesulitan.value || undefined,
    search: searchText.value || undefined
  }
  await bankSoalStore.setFilters(filters)
  currentPage.value = 1
  await bankSoalStore.fetchSoalList(1, filters)
}

const resetFilters = async () => {
  searchText.value = ''
  selectedMapel.value = ''
  selectedTipeSoal.value = ''
  selectedTingkatKesulitan.value = ''
  await bankSoalStore.clearFilters()
  currentPage.value = 1
  await bankSoalStore.fetchSoalList(1, {})
}

const getMapelNama = (mapelId) => {
  const mapel = mapels.value.find(m => m.id === mapelId)
  return mapel ? mapel.nama_mapel : '-'
}

const getTipeSoalLabel = (tipe) => {
  if (!tipe) return '-'
  const labels = {
    'pilihan_ganda': 'Pilihan Ganda',
    'uraian': 'Uraian',
    'benar_salah': 'Benar/Salah'
  }
  return labels[tipe] || tipe
}

const getTingkatKesulitanColor = (tingkat) => {
  if (!tingkat) return 'bg-gray-50 text-gray-700'
  const colors = {
    'mudah': 'bg-green-50 text-green-700',
    'sedang': 'bg-yellow-50 text-yellow-700',
    'sulit': 'bg-red-50 text-red-700'
  }
  return colors[tingkat] || 'bg-gray-50 text-gray-700'
}

const truncateText = (text, maxLength) => {
  if (!text) return '-'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
</script>
