<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-8 max-w-4xl mx-auto">
        <div class="mb-8">
          <button
            @click="handleBack"
            class="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold mb-4">
            <span class="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
          <h1 class="text-3xl font-bold text-slate-900">Detail Jadwal Ujian</h1>
          <p class="text-slate-500 mt-1">Informasi lengkap jadwal ujian</p>
        </div>

        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat detail jadwal...</p>
          </div>
        </div>

        <div v-else-if="jadwalData" class="space-y-6">
          <!-- Bank Soal & Angkatan -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Informasi Umum</h2>
            <div class="space-y-4">
              <div>
                <p class="text-sm font-medium text-slate-600">Nama Ujian</p>
                <p class="text-lg text-slate-900 font-semibold mt-1">{{ jadwalData.nama_ujian }}</p>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm font-medium text-slate-600">Bank Soal</p>
                  <p class="text-lg text-slate-900 font-semibold mt-1">{{ jadwalData.nama_bank_soal }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-600">Angkatan</p>
                  <p class="text-lg text-slate-900 font-semibold mt-1">{{ jadwalData.tingkat }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Waktu Ujian -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Jadwal Ujian</h2>
            <div class="grid grid-cols-2 gap-6">
              <div>
                <p class="text-sm font-medium text-slate-600">Waktu Mulai</p>
                <p class="text-lg text-slate-900 font-semibold mt-1">{{ formatDateTime(jadwalData.wkt_mulai) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-600">Waktu Selesai</p>
                <p class="text-lg text-slate-900 font-semibold mt-1">{{ formatDateTime(jadwalData.wkt_selesai) }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-600">Durasi</p>
                <p class="text-lg text-slate-900 font-semibold mt-1">{{ jadwalData.durasi }} menit</p>
              </div>
            </div>
          </div>

          <!-- Jurusan -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Jurusan</h2>
            <div class="space-y-2">
              <div v-for="jurusan in jadwalData.id_jurusan" :key="jurusan.id" class="flex items-center gap-2 text-slate-900">
                <span class="material-symbols-outlined text-sky-600">check_circle</span>
                {{ jurusan.nama_jurusan }}
              </div>
            </div>
          </div>

          <!-- Kelas -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Kelas yang Mengikuti Ujian</h2>
            <div v-if="jadwalData.id_kelas.length === 0" class="text-slate-600">
              Tidak ada kelas dalam jadwal ini
            </div>
            <div v-else class="grid grid-cols-2 gap-4">
              <div v-for="kelas in jadwalData.id_kelas" :key="kelas.id" class="flex items-center gap-3 p-3 bg-sky-50 rounded-lg border border-sky-200">
                <span class="material-symbols-outlined text-sky-600">class</span>
                <span class="text-slate-900 font-medium">{{ kelas.nama_kelas }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button
              @click="handleEdit"
              class="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">edit</span>
              Edit Jadwal
            </button>
            <button
              @click="handleBack"
              class="flex-1 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors">
              Kembali
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useJadwalStore } from '@/stores/jadwal'

const route = useRoute()
const router = useRouter()
const jadwalStore = useJadwalStore()

const isLoading = ref(false)
const error = ref(null)
const jadwalData = ref(null)

const jadwalId = route.params.id

onMounted(async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await jadwalStore.fetchJadwalById(jadwalId)

    if (!data || !data.id) {
      throw new Error('Data jadwal tidak ditemukan')
    }

    jadwalData.value = data
  } catch (err) {
    console.error('Error loading jadwal detail:', err)
    error.value = err.response?.data?.message || err.message || 'Gagal memuat detail jadwal'
  } finally {
    isLoading.value = false
  }
})

const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const handleEdit = () => {
  router.push({ name: 'jadwal.edit', params: { id: jadwalId } })
}

const handleBack = () => {
  router.push({ name: 'jadwal.list' })
}
</script>
