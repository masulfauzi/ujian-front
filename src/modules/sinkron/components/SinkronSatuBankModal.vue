<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" @click.self="handleClose">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="p-5 border-b border-slate-200 flex items-start justify-between gap-4">
        <div class="min-w-0">
          <p class="text-xs font-semibold uppercase" :class="isUpdate ? 'text-amber-600' : 'text-sky-600'">
            {{ isUpdate ? 'Perbarui bank soal' : 'Tambahkan bank soal' }}
          </p>
          <h2 class="text-lg font-bold text-slate-900 break-words">{{ bank.nama_bank_soal }}</h2>
          <p class="text-sm text-slate-500">
            {{ [bank.nama_mapel, bank.tingkat, bank.nama_jurusan || 'Semua jurusan', bank.nama_guru].filter(Boolean).join(' · ') }}
          </p>
        </div>
        <button
          type="button"
          @click="handleClose"
          :disabled="isRunning"
          class="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
          title="Tutup">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Body -->
      <div class="p-5 overflow-y-auto space-y-5">
        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-start gap-2">
          <span class="material-symbols-outlined">error</span>
          <div>
            <p class="font-semibold">{{ error }}</p>
            <p v-if="errorHint" class="text-sm mt-1">{{ errorHint }}</p>
          </div>
        </div>

        <!-- Loading pratinjau -->
        <div v-if="isPreviewing" class="py-10 text-center text-slate-600">
          <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p class="mt-3">Mengambil pratinjau dari Sianida...</p>
        </div>

        <template v-else-if="data">
          <!-- Banner hasil -->
          <div v-if="!data.dry_run" class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-start gap-2">
            <span class="material-symbols-outlined text-green-600" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            <div class="text-sm">
              <p class="font-bold text-base">Bank soal berhasil {{ data.aksi === 'perbarui' ? 'diperbarui' : 'ditambahkan' }}</p>
              <p v-if="(data.peringatan?.gambar_gagal || []).length">
                Ada {{ data.peringatan.gambar_gagal.length }} gambar yang gagal diunduh, lihat daftarnya di bawah.
              </p>
            </div>
          </div>

          <!-- Ringkasan -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs font-semibold uppercase text-slate-500">Aksi</p>
              <p :class="['text-lg font-bold', data.aksi === 'perbarui' ? 'text-amber-700' : 'text-sky-700']">
                {{ data.aksi === 'perbarui' ? 'Perbarui' : 'Tambah' }}
              </p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 col-span-1 md:col-span-2">
              <p class="text-xs font-semibold uppercase text-slate-500">Jumlah soal</p>
              <p class="text-lg font-bold text-slate-900">
                <template v-if="data.aksi === 'perbarui'">
                  {{ formatNum(data.soal?.sebelum) }}
                  <span class="material-symbols-outlined align-middle text-base text-slate-400">arrow_forward</span>
                </template>
                {{ formatNum(data.soal?.sesudah) }} soal
              </p>
            </div>
            <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p class="text-xs font-semibold uppercase text-slate-500">Gambar</p>
              <p class="text-lg font-bold text-slate-900">{{ formatNum(data.gambar) }}</p>
            </div>
          </div>

          <p v-if="data.nama_di_ujian && data.nama_di_ujian !== bank.nama_bank_soal" class="text-sm text-slate-600">
            <span class="material-symbols-outlined align-middle text-base text-sky-600">info</span>
            Nama di aplikasi ujian: <b>{{ data.nama_di_ujian }}</b> (diberi akhiran karena namanya dobel dengan bank lain)
          </p>

          <!-- Section dihapus -->
          <div v-if="data.section_dihapus > 0" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-start gap-2">
            <span class="material-symbols-outlined text-red-600">warning</span>
            <p>
              Jumlah soal berubah, sehingga <b>{{ formatNum(data.section_dihapus) }} section</b> pada jadwal di bawah
              {{ data.dry_run ? 'akan dihapus' : 'sudah dihapus' }}. Atur ulang section jadwal tersebut.
            </p>
          </div>

          <!-- Jadwal terdampak -->
          <div>
            <p class="font-semibold text-slate-900 mb-2">
              Jadwal yang memakai bank ini
              <span class="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {{ formatNum(jadwalTerdampak.length) }}
              </span>
            </p>
            <p v-if="jadwalTerdampak.length === 0" class="text-sm text-slate-500">Belum ada jadwal yang memakai bank ini.</p>
            <template v-else>
              <p class="text-sm text-slate-600 mb-2">Jadwal tetap ada dan otomatis memakai soal terbaru.</p>
              <ul class="border border-slate-200 rounded-lg divide-y divide-slate-200 text-sm">
                <li v-for="j in jadwalTerdampak" :key="j.id" class="px-4 py-2 flex items-center justify-between gap-2">
                  <span class="text-slate-900">{{ j.nama_ujian }}</span>
                  <router-link
                    v-if="data.section_dihapus > 0 && !data.dry_run"
                    :to="{ name: 'jadwal.section', params: { id: j.id } }"
                    class="text-sky-600 hover:text-sky-700 font-semibold whitespace-nowrap">
                    Atur section
                  </router-link>
                </li>
              </ul>
            </template>
          </div>

          <SinkronBankSoalPeringatan :peringatan="data.peringatan || {}" :dry-run="data.dry_run" />

          <!-- Konfirmasi -->
          <div v-if="data.dry_run" class="space-y-3 pt-2 border-t border-slate-200">
            <p class="text-sm text-slate-600 pt-3">
              Bank soal lain, jadwal lain, peserta, dan nilai tidak berubah.
              Ketik <span class="font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">{{ KONFIRMASI }}</span> untuk melanjutkan.
            </p>
            <input
              v-model="konfirmasi"
              type="text"
              :placeholder="KONFIRMASI"
              :disabled="isRunning"
              autocomplete="off"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all disabled:bg-slate-50">
            <div v-if="isRunning" class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
              <span class="material-symbols-outlined animate-spin">progress_activity</span>
              Menyinkronkan dan mengunduh gambar. Jangan tutup halaman ini.
            </div>
          </div>
        </template>
      </div>

      <!-- Footer -->
      <div class="p-5 border-t border-slate-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          @click="handleClose"
          :disabled="isRunning"
          class="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ data && !data.dry_run ? 'Tutup' : 'Batal' }}
        </button>
        <button
          v-if="!data || data.dry_run"
          type="button"
          @click="handleRun"
          :disabled="!canRun"
          :class="[
            'flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
            isUpdate ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
          ]">
          <span :class="['material-symbols-outlined', isRunning ? 'animate-spin' : '']">{{ isRunning ? 'progress_activity' : 'sync' }}</span>
          {{ isRunning ? 'Menyinkronkan...' : (isUpdate ? 'Perbarui Bank Soal' : 'Tambahkan Bank Soal') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Modal sinkron satu bank soal: pratinjau otomatis -> ketik konfirmasi -> jalankan -> hasil.
import { computed, onMounted, ref } from 'vue'
import SinkronBankSoalPeringatan from './SinkronBankSoalPeringatan.vue'
import { sinkronService, KONFIRMASI_SINKRON_SATU_BANK_SOAL as KONFIRMASI } from '@/services/sinkronService'
import { getSinkronErrorHint, getSinkronErrorMessage } from '../utils/errorHint'

const props = defineProps({
  // Item dari GET /sinkron/bank-soal/sianida
  bank: { type: Object, required: true },
})
const emit = defineEmits(['close', 'synced'])

const data = ref(null) // hasil pratinjau atau hasil sinkron
const error = ref(null)
const errorHint = ref(null)
const konfirmasi = ref('')
const isPreviewing = ref(false)
const isRunning = ref(false)

const HINTS = {
  409: 'Jadwal yang memakai bank soal ini sudah ada siswa yang mulai ujian, sehingga bank soal tidak bisa diperbarui.',
  404: 'Bank soal tidak ditemukan di Sianida. Muat ulang daftar bank soal.',
}

const isUpdate = computed(() => (data.value?.aksi ?? (props.bank.sudah_ada ? 'perbarui' : 'tambah')) === 'perbarui')
const jadwalTerdampak = computed(() => data.value?.jadwal_terdampak || [])
const canRun = computed(() =>
  !isPreviewing.value && !isRunning.value && !!data.value?.dry_run && konfirmasi.value.trim() === KONFIRMASI
)

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const setError = (err, fallback) => {
  error.value = getSinkronErrorMessage(err, fallback)
  errorHint.value = getSinkronErrorHint(err.response?.status, HINTS)
}

const loadPreview = async () => {
  isPreviewing.value = true
  error.value = null
  errorHint.value = null
  try {
    const response = await sinkronService.sinkronSatuBankSoal(props.bank.id, { dryRun: true })
    data.value = response.data
  } catch (err) {
    setError(err, 'Gagal mengambil pratinjau bank soal')
  } finally {
    isPreviewing.value = false
  }
}

const handleRun = async () => {
  if (!canRun.value) return
  isRunning.value = true
  error.value = null
  errorHint.value = null
  try {
    const response = await sinkronService.sinkronSatuBankSoal(props.bank.id, {
      dryRun: false,
      konfirmasi: konfirmasi.value.trim(),
    })
    data.value = response.data
    konfirmasi.value = ''
    emit('synced', response.data)
  } catch (err) {
    setError(err, 'Sinkronisasi bank soal gagal')
  } finally {
    isRunning.value = false
  }
}

const handleClose = () => {
  if (isRunning.value) return
  emit('close')
}

onMounted(loadPreview)
</script>
