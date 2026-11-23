<template>
  <div class="space-y-6">
    <!-- Peringatan -->
    <div class="bg-red-50 border border-red-200 rounded-lg p-5">
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-red-600 text-3xl" style="font-variation-settings: 'FILL' 1;">warning</span>
        <div class="space-y-3 text-sm text-red-900">
          <slot name="warning" />
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
          <div class="text-sm text-green-800">
            <slot name="result-note" :data="result" />
          </div>
        </div>
      </div>
      <div class="p-5">
        <slot name="summary" :data="result" />
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
        <slot name="summary" :data="preview" />
      </div>
      <div v-else-if="!isPreviewing" class="p-8 text-center text-slate-500">
        <span class="material-symbols-outlined text-5xl text-slate-300">cloud_sync</span>
        <p class="mt-2">Klik <b>Pratinjau</b> untuk melihat {{ emptyText }}</p>
      </div>
    </div>

    <!-- Langkah 2: Jalankan -->
    <div v-if="preview" class="bg-white rounded-lg shadow border border-red-200 overflow-hidden">
      <div class="p-5 space-y-4">
        <div>
          <p class="text-xs font-semibold text-red-600 uppercase">Langkah 2</p>
          <h2 class="text-xl font-bold text-slate-900">Jalankan Sinkronisasi</h2>
          <p class="text-sm text-slate-500">
            Ketik <span class="font-mono font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">{{ konfirmasiText }}</span> untuk melanjutkan
          </p>
        </div>
        <input
          v-model="konfirmasi"
          type="text"
          :placeholder="konfirmasiText"
          :disabled="isBusy"
          autocomplete="off"
          class="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:bg-slate-50">
        <div v-if="isRunning" class="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
          <span class="material-symbols-outlined animate-spin">progress_activity</span>
          {{ runningText }}
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
</template>

<script setup>
// Alur sinkronisasi dari Sianida yang dipakai bersama (siswa, bank soal):
// peringatan -> pratinjau (dry_run) -> ketik konfirmasi -> dialog konfirmasi -> jalankan -> hasil.
import { computed, ref } from 'vue'
import { useDialog } from '@/composables/useDialog'
import { getSinkronErrorHint, getSinkronErrorMessage } from '../utils/errorHint'

const props = defineProps({
  // Teks yang wajib diketik persis sebelum menjalankan sinkron sungguhan
  konfirmasiText: { type: String, required: true },
  // ({ dryRun, konfirmasi }) => Promise<{ data }> (respons API)
  request: { type: Function, required: true },
  // (preview) => string, isi dialog konfirmasi terakhir
  confirmMessage: { type: Function, required: true },
  runningText: { type: String, default: 'Sinkronisasi sedang berjalan. Jangan tutup atau muat ulang halaman ini.' },
  emptyText: { type: String, default: 'data yang akan diambil dari Sianida' },
})

const { $confirm } = useDialog()

const preview = ref(null)
const result = ref(null)
const error = ref(null)
const errorHint = ref(null)
const konfirmasi = ref('')
const isPreviewing = ref(false)
const isRunning = ref(false)

const isBusy = computed(() => isPreviewing.value || isRunning.value)
const canRun = computed(() => !isBusy.value && !!preview.value && konfirmasi.value.trim() === props.konfirmasiText)

const setError = (err, fallback) => {
  error.value = getSinkronErrorMessage(err, fallback)
  errorHint.value = getSinkronErrorHint(err.response?.status)
}

const handlePreview = async () => {
  isPreviewing.value = true
  error.value = null
  errorHint.value = null
  result.value = null
  try {
    const response = await props.request({ dryRun: true })
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

  const ok = await $confirm(props.confirmMessage(preview.value), { title: 'Jalankan Sinkronisasi?' })
  if (!ok) return

  isRunning.value = true
  error.value = null
  errorHint.value = null
  try {
    const response = await props.request({ dryRun: false, konfirmasi: konfirmasi.value.trim() })
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
