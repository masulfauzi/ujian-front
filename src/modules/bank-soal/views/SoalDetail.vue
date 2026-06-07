<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-4xl mx-auto">
        <!-- Page Title -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Detail Soal</h1>
          <p class="text-slate-500 mt-1">Lihat informasi lengkap soal ujian</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat detail soal...</p>
          </div>
        </div>

        <!-- Detail Section -->
        <div v-else-if="selectedSoal" class="space-y-6">
          <!-- Bank Soal Info Section -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">{{ selectedSoal.nama_bank_soal }}</h2>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Mata Pelajaran -->
              <div class="border-l-4 border-blue-500 pl-4">
                <p class="text-xs text-slate-500 uppercase font-semibold mb-1">Mata Pelajaran</p>
                <p class="text-lg font-semibold text-slate-900">{{ selectedSoal.nama_mapel || mapelNama || '-' }}</p>
              </div>

              <!-- Jumlah Soal -->
              <div class="border-l-4 border-purple-500 pl-4">
                <p class="text-xs text-slate-500 uppercase font-semibold mb-1">Jumlah Soal</p>
                <p class="text-lg font-semibold text-slate-900">{{ selectedSoal.jml_soal || '-' }} Soal</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="handleAddSoal"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">add</span>
              Tambah Soal
            </button>
            <button
              @click="triggerFileInput"
              class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">upload_file</span>
              Import dari Excel
            </button>
            <button
              @click="handleBack"
              class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
              Kembali
            </button>
          </div>

          <!-- Hidden File Input -->
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls"
            class="hidden"
            @change="handleFileImport" />

          <!-- Daftar Soal Section -->
          <div v-if="soals.length > 0 || isSoalLoading" class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Daftar Soal</h3>

            <!-- Loading State -->
            <div v-if="isSoalLoading" class="flex justify-center items-center py-12">
              <div class="text-center">
                <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                <p class="mt-3 text-slate-600">Memuat soal...</p>
              </div>
            </div>

            <!-- Soal List -->
            <div v-else class="space-y-4">
              <div v-for="(soal, index) in sortedSoals" :key="soal.id" class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <!-- Soal Number -->
                <div class="text-sm font-semibold text-slate-600 mb-2">
                  Soal {{ soal.no_soal }}
                </div>

                <!-- Pertanyaan -->
                <div class="mb-3">
                  <div class="text-slate-900 font-medium prose prose-sm max-w-none" v-html="soal.soal"></div>
                  <img v-if="isImageAvailable(soal.gambar_soal)" :src="soal.gambar_soal" :alt="`Gambar soal ${index + 1}`" class="mt-2 w-auto h-auto min-h-[100px] max-h-96 rounded-lg border border-slate-200">
                </div>

                <!-- Opsi Jawaban Section -->
                <div class="mt-4">
                  <p class="text-sm font-semibold text-slate-700 mb-3">Opsi Jawaban:</p>
                  <div class="space-y-2 ml-2">
                    <!-- Opsi A -->
                    <div v-if="soal.opsi_a" class="flex gap-3 pb-3 border-b border-slate-100">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">A</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-slate-700 prose prose-sm max-w-none" v-html="soal.opsi_a"></div>
                        <img v-if="isImageAvailable(soal.gambar_a)" :src="soal.gambar_a" :alt="'Opsi A'" class="mt-2 w-auto h-auto min-h-[100px] max-h-64 rounded-lg border border-slate-200">
                      </div>
                      <span v-if="soal.kunci === 'A'" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap h-fit">✓ Kunci</span>
                    </div>

                    <!-- Opsi B -->
                    <div v-if="soal.opsi_b" class="flex gap-3 pb-3 border-b border-slate-100">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">B</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-slate-700 prose prose-sm max-w-none" v-html="soal.opsi_b"></div>
                        <img v-if="isImageAvailable(soal.gambar_b)" :src="soal.gambar_b" :alt="'Opsi B'" class="mt-2 w-auto h-auto min-h-[100px] max-h-64 rounded-lg border border-slate-200">
                      </div>
                      <span v-if="soal.kunci === 'B'" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap h-fit">✓ Kunci</span>
                    </div>

                    <!-- Opsi C -->
                    <div v-if="soal.opsi_c" class="flex gap-3 pb-3 border-b border-slate-100">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">C</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-slate-700 prose prose-sm max-w-none" v-html="soal.opsi_c"></div>
                        <img v-if="isImageAvailable(soal.gambar_c)" :src="soal.gambar_c" :alt="'Opsi C'" class="mt-2 w-auto h-auto min-h-[100px] max-h-64 rounded-lg border border-slate-200">
                      </div>
                      <span v-if="soal.kunci === 'C'" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap h-fit">✓ Kunci</span>
                    </div>

                    <!-- Opsi D -->
                    <div v-if="soal.opsi_d" class="flex gap-3 pb-3 border-b border-slate-100">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">D</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-slate-700 prose prose-sm max-w-none" v-html="soal.opsi_d"></div>
                        <img v-if="isImageAvailable(soal.gambar_d)" :src="soal.gambar_d" :alt="'Opsi D'" class="mt-2 w-auto h-auto min-h-[100px] max-h-64 rounded-lg border border-slate-200">
                      </div>
                      <span v-if="soal.kunci === 'D'" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap h-fit">✓ Kunci</span>
                    </div>

                    <!-- Opsi E -->
                    <div v-if="soal.opsi_e" class="flex gap-3">
                      <div class="flex-shrink-0">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">E</span>
                      </div>
                      <div class="flex-1">
                        <div class="text-slate-700 prose prose-sm max-w-none" v-html="soal.opsi_e"></div>
                        <img v-if="isImageAvailable(soal.gambar_e)" :src="soal.gambar_e" :alt="'Opsi E'" class="mt-2 w-auto h-auto min-h-[100px] max-h-64 rounded-lg border border-slate-200">
                      </div>
                      <span v-if="soal.kunci === 'E'" class="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap h-fit">✓ Kunci</span>
                    </div>
                  </div>
                </div>

                <!-- Kunci Jawaban Summary -->
                <div class="mt-4 pt-3 border-t border-slate-200">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                    <span class="font-semibold text-green-700">Kunci Jawaban:</span>
                    <span class="text-green-700 ml-2 font-bold text-lg">{{ soal.kunci }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-if="soalError && !isSoalLoading" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {{ soalError }}
            </div>

            <!-- Pagination -->
            <div v-if="soals.length > 0 && totalPages > 1" class="flex items-center justify-between mt-6">
              <p class="text-slate-600 text-sm">
                Menampilkan {{ (soalStore.currentPage - 1) * soalStore.pageSize + 1 }} hingga
                {{ Math.min(soalStore.currentPage * soalStore.pageSize, soalStore.totalSoals) }} dari {{ soalStore.totalSoals }} soal
              </p>
              <div class="flex gap-2">
                <button
                  @click="handleSoalPageChange(soalStore.currentPage - 1)"
                  :disabled="soalStore.currentPage === 1"
                  class="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                  Sebelumnya
                </button>
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in totalPages"
                    :key="page"
                    @click="handleSoalPageChange(page)"
                    :class="[
                      'px-2 py-1 rounded text-sm transition-colors',
                      page === soalStore.currentPage
                        ? 'bg-sky-600 text-white'
                        : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                    ]">
                    {{ page }}
                  </button>
                </div>
                <button
                  @click="handleSoalPageChange(soalStore.currentPage + 1)"
                  :disabled="soalStore.currentPage === totalPages"
                  class="px-3 py-1 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
                  Berikutnya
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!isSoalLoading && soals.length === 0" class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <div class="text-center py-8">
              <span class="material-symbols-outlined text-4xl text-slate-300">quiz</span>
              <p class="text-slate-600 mt-2">Belum ada soal dalam bank soal ini</p>
            </div>
          </div>
        </div>

        <!-- Not Found State -->
        <div v-else class="text-center py-12">
          <span class="material-symbols-outlined text-6xl text-slate-300">search_off</span>
          <p class="text-slate-600 mt-4">Soal tidak ditemukan</p>
          <button
            @click="handleBack"
            class="mt-4 text-sky-600 hover:text-sky-700 font-semibold">
            Kembali ke daftar
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankSoalStore } from '@/stores/bankSoal'
import { useDialog } from '@/composables/useDialog'
import { useMapelStore } from '@/stores/mapel'
import { useSoalStore } from '@/stores/soal'
import { soalService } from '@/services/soalService'

const route = useRoute()
const router = useRouter()
const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const { $alert } = useDialog()
const soalStore = useSoalStore()
const soalId = route.params.id

const error = ref(null)
const fileInput = ref(null)
const isImporting = ref(false)

const isLoading = computed(() => bankSoalStore.isLoading)
const selectedSoal = computed(() => bankSoalStore.selectedSoal)

const mapels = computed(() => mapelStore.mapels)
const mapelNama = computed(() => {
  if (!selectedSoal.value) return ''
  const mapel = mapels.value.find(m => m.id === selectedSoal.value.mapel_id)
  return mapel ? mapel.nama_mapel : '-'
})

const soals = computed(() => soalStore.soals)
const sortedSoals = computed(() => {
  return [...soals.value].sort((a, b) => a.no_soal - b.no_soal)
})
const isSoalLoading = computed(() => soalStore.isLoading)
const soalError = computed(() => soalStore.error)
const totalPages = computed(() => soalStore.totalPages)

onMounted(async () => {
  try {
    await mapelStore.fetchMapelList(1, 100)
    await bankSoalStore.fetchSoalById(soalId)
    await soalStore.fetchSoalByBankId(soalId, 1)
  } catch (err) {
    error.value = 'Gagal memuat detail soal'
  }
})

const getTipeSoalLabel = (tipe) => {
  const labels = {
    'pilihan_ganda': 'Pilihan Ganda',
    'uraian': 'Uraian',
    'benar_salah': 'Benar/Salah'
  }
  return labels[tipe] || tipe
}

const getTingkatKesulitanColor = (tingkat) => {
  const colors = {
    'mudah': 'bg-green-50 text-green-700',
    'sedang': 'bg-yellow-50 text-yellow-700',
    'sulit': 'bg-red-50 text-red-700'
  }
  return colors[tingkat] || 'bg-gray-50 text-gray-700'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return dateString
  }
}

const handleSoalPageChange = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await soalStore.fetchSoalByBankId(soalId, page)
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  if (!validTypes.includes(file.type)) {
    error.value = 'Format file tidak valid. Gunakan file Excel (.xlsx atau .xls)'
    return
  }

  isImporting.value = true
  error.value = null

  try {
    const response = await soalService.importSoalFromExcel(soalId, file)

    if (response && response.data) {
      const importResult = response.data
      error.value = null

      // Tampilkan summary import
      let successMessage = `Import soal berhasil!\n`
      successMessage += `Total diproses: ${importResult.total_processed}\n`
      successMessage += `Berhasil: ${importResult.total_success}\n`
      successMessage += `Gagal: ${importResult.total_failed}`

      if (importResult.total_failed > 0 && importResult.errors?.length > 0) {
        successMessage += `\n\nError:\n`
        importResult.errors.slice(0, 3).forEach(err => {
          successMessage += `- ${err}\n`
        })
        if (importResult.errors.length > 3) {
          successMessage += `... dan ${importResult.errors.length - 3} error lainnya`
        }
      }

      await $alert(successMessage, { title: 'Berhasil', type: 'success' })

      // Reload soal list
      await soalStore.fetchSoalByBankId(soalId, 1)

      // Reset file input
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal mengimport soal dari Excel'
  } finally {
    isImporting.value = false
  }
}

const getOpsiLabel = (index) => {
  return String.fromCharCode(65 + index)
}

const isImageAvailable = (imagePath) => {
  return imagePath && typeof imagePath === 'string' && imagePath.trim().length > 0
}

const decodeHtmlEntities = (html) => {
  if (!html) return ''
  const textarea = document.createElement('textarea')
  textarea.innerHTML = html
  return textarea.value
}

const handleAddSoal = () => {
  router.push({ name: 'bankSoal.soalInput', params: { id: soalId } })
}

const handleBack = () => {
  router.push({ name: 'bankSoal.list' })
}
</script>
