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
        <h1 class="text-3xl font-bold text-slate-900">Sinkron Bank Soal dari Sianida</h1>
        <p class="text-slate-500 mt-1">Ambil bank soal semester aktif (draft maupun final) beserta soalnya dari Sianida</p>
      </div>

      <!-- Tab -->
      <div class="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          @click="setMode(tab.value)"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors',
            mode === tab.value
              ? (tab.value === 'total' ? 'bg-red-600 text-white' : 'bg-sky-600 text-white')
              : 'text-slate-600 hover:bg-slate-100'
          ]">
          <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </div>

      <SinkronBankSoalList v-if="mode === 'per-bank'" />

      <SinkronFlow
        v-else
        :konfirmasi-text="KONFIRMASI_SINKRON_BANK_SOAL"
        :request="sinkronService.sinkronBankSoal"
        :confirm-message="confirmMessage"
        running-text="Sinkronisasi sedang berjalan dan gambar soal sedang diunduh. Proses ini bisa memakan waktu beberapa menit. Jangan tutup atau muat ulang halaman ini."
        empty-text="bank soal yang akan diambil dari Sianida">
        <template #warning>
          <p class="font-bold text-base">Perhatian: proses ini mengganti seluruh bank soal</p>
          <ul class="list-disc ml-5 space-y-1">
            <li><b>Bank soal dan soal</b> diganti total dengan data dari Sianida (status draft maupun final).</li>
            <li><b>Semua jadwal ujian dihapus permanen</b>, beserta section, penugasan kelas, <b>nilai, dan jawaban</b>. Jadwal harus dibuat ulang setelahnya.</li>
            <li>Mapel tidak dihapus. Mapel dari Sianida dicocokkan lewat nama; yang belum ada dibuat otomatis.</li>
            <li>Peserta, kelas, jurusan, dan akun admin <b>tidak berubah</b>.</li>
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
        </template>

        <template #result-note="{ data }">
          Bank soal semester <b>{{ data.semester?.semester || '-' }}</b> berhasil dimasukkan.
          Buat ulang jadwal ujian di halaman
          <router-link to="/admin/jadwal" class="underline font-semibold">Jadwal Ujian</router-link>.
          <template v-if="(data.peringatan?.gambar_gagal || []).length">
            Ada {{ data.peringatan.gambar_gagal.length }} gambar yang gagal diunduh, lihat daftarnya di bawah.
          </template>
        </template>

        <template #summary="{ data }">
          <SinkronBankSoalSummary :data="data" />
        </template>
      </SinkronFlow>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SinkronFlow from '../components/SinkronFlow.vue'
import SinkronBankSoalSummary from '../components/SinkronBankSoalSummary.vue'
import SinkronBankSoalList from '../components/SinkronBankSoalList.vue'
import { sinkronService, KONFIRMASI_SINKRON_BANK_SOAL } from '@/services/sinkronService'

const route = useRoute()
const router = useRouter()

const tabs = [
  { value: 'per-bank', label: 'Per Bank Soal', icon: 'playlist_add_check' },
  { value: 'total', label: 'Semua Bank Soal (Reset Total)', icon: 'restart_alt' },
]

// Tab aktif disimpan di query (?mode=total) agar bisa di-link
const mode = computed(() => (route.query.mode === 'total' ? 'total' : 'per-bank'))
const setMode = (value) => {
  router.replace({ query: { ...route.query, mode: value === 'total' ? 'total' : undefined } })
}

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const confirmMessage = (p) => {
  const del = p.dihapus || {}
  return `Semua bank soal akan diganti, dan ${formatNum(del.jadwal)} jadwal, ${formatNum(del.nilai)} nilai, serta ${formatNum(del.jawaban)} jawaban akan dihapus permanen. Lanjutkan?`
}
</script>
