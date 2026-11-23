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

      <SinkronFlow
        :konfirmasi-text="KONFIRMASI_SINKRON_SISWA"
        :request="sinkronService.sinkronSiswa"
        :confirm-message="confirmMessage">
        <template #warning>
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
        </template>

        <template #result-note="{ data }">
          Data semester <b>{{ data.semester?.semester || '-' }}</b> berhasil dimasukkan.
          Jangan lupa tugaskan ulang setiap jadwal ke kelas di halaman
          <router-link to="/admin/jadwal" class="underline font-semibold">Jadwal Ujian</router-link>.
        </template>

        <template #summary="{ data }">
          <SinkronSummary :data="data" />
        </template>
      </SinkronFlow>
      </div>
    </main>
  </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import SinkronFlow from '../components/SinkronFlow.vue'
import SinkronSummary from '../components/SinkronSummary.vue'
import { sinkronService, KONFIRMASI_SINKRON_SISWA } from '@/services/sinkronService'

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const confirmMessage = (p) =>
  `Semua data siswa akan diganti dan ${formatNum(p.dihapus?.nilai)} nilai serta ${formatNum(p.dihapus?.jawaban)} jawaban akan dihapus permanen. Lanjutkan?`
</script>
