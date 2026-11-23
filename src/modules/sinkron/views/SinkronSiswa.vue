<template>
  <div class="bg-surface min-h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Top App Bar -->
    <TopAppBar />

    <!-- Main Content -->
    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-5xl mx-auto space-y-6">
      <!-- Page Title -->
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Sinkron Siswa dari Sianida</h1>
        <p class="text-slate-500 mt-1">Ambil data siswa aktif semester berjalan dari Sianida dan ganti data jurusan, kelas, dan peserta</p>
      </div>

      <!-- Peringatan -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-5">
        <div class="flex items-start gap-3">
          <span class="material-symbols-outlined text-red-600 text-3xl" style="font-variation-settings: 'FILL' 1;">warning</span>
          <div class="space-y-3 text-sm text-red-900">
            <p class="font-bold text-base">Perhatian: proses ini mengganti seluruh data siswa</p>
            <ul class="list-disc ml-5 space-y-1">
              <li><b>Jurusan, kelas, dan peserta</b> diganti total dengan data dari Sianida.</li>
              <li><b>Nilai dan jawaban</b> semua ujian <b>dihapus permanen</b>.</li>
              <li><b>Penugasan jadwal ke kelas</b> dihapus. Setiap jadwal harus ditugaskan ulang ke kelas.</li>
              <li>Bank soal, soal, jadwal, section, mapel, dan akun admin <b>tidak berubah</b>.</li>
            </ul>
            <div>
              <p class="font-semibold">Sebelum menjalankan:</p>
              <ol class="list-decimal ml-5 space-y-1">
                <li>Unduh export nilai yang masih dibutuhkan di halaman
                  <router-link to="/admin/nilai" class="underline font-semibold hover:text-red-700">Nilai</router-link>.
                </li>
                <li>Backup database.</li>
                <li>Pastikan tidak ada ujian yang sedang berjalan (sinkron ditolak bila ada ujian aktif dalam 2 jam terakhir).</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-start gap-2">
        <span class="material-symbols-outlined">error</span>
        <div>
          <p class="font-semibold">{{ error }}</p>
          <p v-if="errorHint" class="text-sm mt-1">{{ errorHint }}</p>
        </div>
      </div>

      <!-- Hasil Sinkron Sungguhan -->
      <div v-if="result" class="bg-white rounded-lg shadow border border-green-200 overflow-hidden">
        <div class="bg-green-50 border-b border-green-200 p-5 flex items-start gap-3">
          <span class="material-symbols-outlined text-green-600 text-3xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          <div>
            <p class="font-bold text-green-900 text-lg">Sinkronisasi selesai</p>
            <p class="text-sm text-green-800">
              Data semester <b>{{ result.semester?.semester || '-' }}</b> berhasil dimasukkan.
              Jangan lupa tugaskan ulang setiap jadwal ke kelas di halaman
              <router-link to="/admin/jadwal" class="underline font-semibold">Jadwal Ujian</router-link>.
            </p>
          </div>
        </div>
        <div class="p-5">
          <SinkronSummary :data="result" />
        </div>
      </div>

      <!-- Langkah 1: Pratinjau -->
      <div class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div class="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold text-sky-600 uppercase">Langkah 1</p>
            <h2 class="text-xl font-bold text-slate-900">Pratinjau</h2>
            <p class="text-sm text-slate-500">Lihat ringkasan perubahan tanpa mengubah data apa pun</p>
          </div>
          <button
            @click="handlePreview"
            :disabled="isBusy"
            class="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            <span :class="['material-symbols-outlined', isPreviewing ? 'animate-spin' : '']">{{ isPreviewing ? 'progress_activity' : 'preview' }}</span>
            {{ isPreviewing ? 'Mengambil data Sianida...' : (preview ? 'Pratinjau Ulang' : 'Pratinjau') }}
          </button>
        </div>

        <div v-if="preview" class="p-5">
          <SinkronSummary :data="preview" />
        </div>
        <div v-else-if="!isPreviewing" class="p-8 text-center text-slate-500">
          <span class="material-symbols-outlined text-5xl text-slate-300">cloud_sync</span>
          <p class="mt-2">Klik <b>Pratinjau</b> untuk melihat data yang akan diambil dari Sianida</p>
        </div>
      </div>

      <!-- Langkah 2: Jalankan -->
      <div v-if="preview" class="bg-white rounded-lg shadow border border-red-200 overflow-hidden">
        <div class="p-5 space-y-4">
          <div>
            <p class="text-xs font-semibold text-red-600 uppercase">Langkah 2</p>
            <h2 class="text-xl font-bold text-slate-900">Jalankan Sinkronisasi</h2>
            <p class="text-sm text-slate-500">
              Ketik <span class="font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">{{ KONFIRMASI }}</span> untuk melanjutkan
            </p>
          </div>
          <input
            v-model="konfirmasi"
            type="text"
            :placeholder="KONFIRMASI"
            :disabled="isBusy"
            autocomplete="off"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:bg-slate-50">
          <div v-if="isRunning" class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
            <span class="material-symbols-outlined animate-spin">progress_activity</span>
            Sinkronisasi sedang berjalan. Jangan tutup atau muat ulang halaman ini.
          </div>
          <button
            @click="handleRun"
            :disabled="!canRun"
            class="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <span class="material-symbols-outlined">sync</span>
            {{ isRunning ? 'Menyinkronkan...' : 'Jalankan Sinkronisasi' }}
          </button>
        </div>
      </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SinkronSummary from '../components/SinkronSummary.vue'
import { useDialog } from '@/composables/useDialog'
import { sinkronService, KONFIRMASI_SINKRON_SISWA as KONFIRMASI } from '@/services/sinkronService'

const { $confirm } = useDialog()

const preview = ref(null)
const result = ref(null)
const error = ref(null)
const errorHint = ref(null)
const konfirmasi = ref('')
const isPreviewing = ref(false)
const isRunning = ref(false)

const isBusy = computed(() => isPreviewing.value || isRunning.value)
const canRun = computed(() => !isBusy.value && !!preview.value && konfirmasi.value.trim() === KONFIRMASI)

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const setError = (err, fallback) => {
  const status = err.response?.status
  error.value = err.response?.data?.message || err.message || fallback
  errorHint.value = {
    409: 'Masih ada ujian yang aktif dalam 2 jam terakhir. Tunggu hingga semua ujian selesai lalu coba lagi.',
    502: 'Sianida tidak bisa dihubungi atau membalas error. Coba lagi beberapa saat lagi atau periksa konfigurasi sinkron di server.',
    500: 'Penyimpanan gagal dan dibatalkan. Data lama tetap utuh.',
  }[status] || null
}

const handlePreview = async () => {
  isPreviewing.value = true
  error.value = null
  errorHint.value = null
  result.value = null
  try {
    const response = await sinkronService.sinkronSiswa({ dryRun: true })
    preview.value = response.data
    konfirmasi.value = ''
  } catch (err) {
    setError(err, 'Gagal mengambil pratinjau sinkronisasi')
  } finally {
    isPreviewing.value = false
  }
}

const handleRun = async () => {
  if (!canRun.value) return

  const p = preview.value
  const ok = await $confirm(
    `Semua data siswa akan diganti dan ${formatNum(p.dihapus?.nilai)} nilai serta ${formatNum(p.dihapus?.jawaban)} jawaban akan dihapus permanen. Lanjutkan?`,
    { title: 'Jalankan Sinkronisasi?' }
  )
  if (!ok) return

  isRunning.value = true
  error.value = null
  errorHint.value = null
  try {
    const response = await sinkronService.sinkronSiswa({ dryRun: false, konfirmasi: konfirmasi.value.trim() })
    result.value = response.data
    preview.value = null
    konfirmasi.value = ''
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    setError(err, 'Sinkronisasi gagal')
  } finally {
    isRunning.value = false
  }
}
</script>
