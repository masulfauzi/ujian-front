<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-4xl mx-auto">
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

          <!-- Metadata Section -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Informasi Sistem</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500 uppercase font-semibold">Dibuat pada</p>
                <p class="text-slate-900 font-medium">{{ formatDate(selectedSoal.created_at) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase font-semibold">Diperbarui pada</p>
                <p class="text-slate-900 font-medium">{{ formatDate(selectedSoal.updated_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="handleEdit"
              class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">edit</span>
              Edit Soal
            </button>
            <button
              @click="handleDelete"
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">delete</span>
              Hapus Soal
            </button>
            <button
              @click="handleBack"
              class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
              Kembali
            </button>
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
import { useMapelStore } from '@/stores/mapel'

const route = useRoute()
const router = useRouter()
const bankSoalStore = useBankSoalStore()
const mapelStore = useMapelStore()
const soalId = route.params.id

const error = ref(null)

const isLoading = computed(() => bankSoalStore.isLoading)
const selectedSoal = computed(() => bankSoalStore.selectedSoal)

const mapels = computed(() => mapelStore.mapels)
const mapelNama = computed(() => {
  if (!selectedSoal.value) return ''
  const mapel = mapels.value.find(m => m.id === selectedSoal.value.mapel_id)
  return mapel ? mapel.nama_mapel : '-'
})

onMounted(async () => {
  try {
    await mapelStore.fetchMapelList(1, 100)
    await bankSoalStore.fetchSoalById(soalId)
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
      second: '2-digit'
    })
  } catch {
    return dateString
  }
}

const handleEdit = () => {
  router.push({ name: 'bankSoal.edit', params: { id: soalId } })
}

const handleDelete = async () => {
  if (confirm('Yakin ingin menghapus soal ini? Tindakan ini tidak dapat dibatalkan.')) {
    try {
      await bankSoalStore.deleteSoal(soalId)
      router.push({ name: 'bankSoal.list' })
    } catch (err) {
      error.value = bankSoalStore.error || 'Gagal menghapus soal'
    }
  }
}

const handleBack = () => {
  router.push({ name: 'bankSoal.list' })
}
</script>
