<template>
  <div class="space-y-4">
    <!-- Info -->
    <div class="bg-sky-50 border border-sky-200 rounded-lg p-4 text-sm text-sky-900 flex items-start gap-3">
      <span class="material-symbols-outlined text-sky-600">info</span>
      <div class="space-y-1">
        <p>Tarik satu bank soal dari Sianida tanpa mengganggu bank soal dan jadwal lain.</p>
        <p>
          Bank yang sudah ada akan <b>diperbarui</b>: semua soalnya diganti versi terbaru. Jadwal yang memakainya tetap ada,
          tetapi section-nya dihapus jika jumlah soal berubah. Bank yang sudah dipakai ujian tidak bisa diperbarui.
        </p>
      </div>
    </div>

    <!-- Semester & muat ulang -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
      <div v-if="semester" class="flex flex-wrap items-center gap-2 text-sm">
        <span class="material-symbols-outlined text-sky-600">calendar_month</span>
        <span class="text-slate-600">Semester aktif Sianida:</span>
        <span class="font-bold text-slate-900">{{ semester.semester || '-' }}</span>
      </div>
      <div v-else></div>
      <button
        type="button"
        @click="loadList"
        :disabled="isLoading"
        class="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 disabled:opacity-50">
        <span :class="['material-symbols-outlined text-lg', isLoading ? 'animate-spin' : '']">refresh</span>
        Muat ulang
      </button>
    </div>

    <!-- Error -->
    <div v-if="error" class="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 flex items-start gap-2">
      <span class="material-symbols-outlined">error</span>
      <div>
        <p class="font-semibold">{{ error }}</p>
        <p v-if="errorHint" class="text-sm mt-1">{{ errorHint }}</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="flex flex-col md:flex-row md:items-center gap-3">
      <div class="relative w-full md:w-[24rem] md:flex-none">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
        <input
          v-model="search"
          type="text"
          placeholder="Cari nama bank, mapel, atau guru..."
          class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
      </div>
      <select
        v-model="filterStatus"
        class="w-full md:w-40 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
        <option value="">Semua status</option>
        <option value="final">Final</option>
        <option value="draft">Draft</option>
      </select>
      <select
        v-model="filterKeadaan"
        class="w-full md:w-52 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500">
        <option value="">Semua keadaan</option>
        <option value="baru">Belum ada di ujian</option>
        <option value="berubah">Soal berubah</option>
        <option value="sama">Sudah sinkron</option>
        <option value="dipakai">Sudah dipakai ujian</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="isLoading && banks.length === 0" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        <p class="mt-3 text-slate-600">Mengambil daftar bank soal dari Sianida...</p>
      </div>
    </div>

    <!-- Tabel -->
    <div v-else class="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
      <div v-if="filteredBanks.length === 0" class="text-center py-12">
        <span class="material-symbols-outlined text-6xl text-slate-300">inventory_2</span>
        <p class="text-slate-600 mt-4">
          {{ banks.length ? 'Tidak ada bank soal yang cocok dengan pencarian atau filter' : 'Tidak ada bank soal di Sianida' }}
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Bank Soal</th>
              <th class="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase whitespace-nowrap">Soal Sianida</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase whitespace-nowrap">Di Ujian</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Jadwal</th>
              <th class="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="bank in filteredBanks" :key="bank.id" class="hover:bg-slate-50">
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ bank.nama_bank_soal }}</p>
                <p class="text-xs text-slate-500">
                  {{ [bank.nama_mapel, bank.tingkat, bank.nama_jurusan || 'Semua jurusan', bank.nama_guru].filter(Boolean).join(' · ') }}
                </p>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                    bank.status === 'final' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                  ]">
                  {{ bank.status || '-' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center text-slate-900">{{ formatNum(bank.jumlah_soal) }}</td>
              <td class="px-4 py-3 text-center">
                <span v-if="!bank.sudah_ada" class="text-xs text-slate-400">Belum ada</span>
                <template v-else>
                  <span class="text-slate-900">{{ formatNum(bank.jumlah_soal_ujian) }}</span>
                  <span
                    v-if="isChanged(bank)"
                    class="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"
                    title="Jumlah soal di Sianida berbeda dengan di aplikasi ujian">
                    Berubah
                  </span>
                </template>
              </td>
              <td class="px-4 py-3 text-center text-slate-900">{{ formatNum(bank.jumlah_jadwal) }}</td>
              <td class="px-4 py-3 text-center">
                <span
                  v-if="bank.sudah_dipakai_ujian"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-500 cursor-not-allowed whitespace-nowrap"
                  title="Sudah ada siswa yang mulai ujian memakai bank ini, sinkron ulang akan ditolak">
                  <span class="material-symbols-outlined text-base">lock</span>
                  Dipakai ujian
                </span>
                <button
                  v-else
                  type="button"
                  @click="selectedBank = bank"
                  :class="[
                    'inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors whitespace-nowrap',
                    bank.sudah_ada ? 'bg-amber-600 hover:bg-amber-700' : 'bg-sky-600 hover:bg-sky-700'
                  ]">
                  <span class="material-symbols-outlined text-base">{{ bank.sudah_ada ? 'sync' : 'add' }}</span>
                  {{ bank.sudah_ada ? 'Perbarui' : 'Tambahkan' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <p v-if="banks.length > 0" class="text-slate-600 text-sm">
      Menampilkan {{ formatNum(filteredBanks.length) }} dari {{ formatNum(banks.length) }} bank soal
    </p>

    <SinkronSatuBankModal
      v-if="selectedBank"
      :bank="selectedBank"
      @synced="needsReload = true"
      @close="handleModalClose" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import SinkronSatuBankModal from './SinkronSatuBankModal.vue'
import { sinkronService } from '@/services/sinkronService'
import { getSinkronErrorHint, getSinkronErrorMessage } from '../utils/errorHint'

const banks = ref([])
const semester = ref(null)
const isLoading = ref(false)
const error = ref(null)
const errorHint = ref(null)

const search = ref('')
const filterStatus = ref('')
const filterKeadaan = ref('')

const selectedBank = ref(null)
const needsReload = ref(false)

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const isChanged = (bank) => bank.sudah_ada && Number(bank.jumlah_soal) !== Number(bank.jumlah_soal_ujian)

const keadaanOf = (bank) => {
  if (bank.sudah_dipakai_ujian) return 'dipakai'
  if (!bank.sudah_ada) return 'baru'
  return isChanged(bank) ? 'berubah' : 'sama'
}

const filteredBanks = computed(() => {
  const q = search.value.trim().toLowerCase()
  return banks.value.filter(bank => {
    if (filterStatus.value && bank.status !== filterStatus.value) return false
    if (filterKeadaan.value && keadaanOf(bank) !== filterKeadaan.value) return false
    if (!q) return true
    return [bank.nama_bank_soal, bank.nama_mapel, bank.nama_guru, bank.tingkat, bank.nama_jurusan]
      .some(v => (v || '').toLowerCase().includes(q))
  })
})

const loadList = async () => {
  isLoading.value = true
  error.value = null
  errorHint.value = null
  try {
    const response = await sinkronService.getBankSoalSianida()
    banks.value = response.data?.bank_soal || []
    semester.value = response.data?.semester || null
  } catch (err) {
    error.value = getSinkronErrorMessage(err, 'Gagal mengambil daftar bank soal dari Sianida')
    errorHint.value = getSinkronErrorHint(err.response?.status)
  } finally {
    isLoading.value = false
  }
}

const handleModalClose = () => {
  selectedBank.value = null
  if (needsReload.value) {
    needsReload.value = false
    loadList()
  }
}

onMounted(loadList)
</script>
