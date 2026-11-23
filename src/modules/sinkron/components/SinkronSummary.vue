<template>
  <div class="space-y-6">
    <!-- Semester -->
    <div v-if="data.semester" class="flex flex-wrap items-center gap-2 text-sm">
      <span class="material-symbols-outlined text-sky-600">calendar_month</span>
      <span class="text-slate-600">Semester aktif Sianida:</span>
      <span class="font-bold text-slate-900">{{ data.semester.semester || '-' }}</span>
      <span v-if="data.semester.tgl_mulai || data.semester.tgl_selesai" class="text-slate-500">
        ({{ data.semester.tgl_mulai || '?' }} s.d. {{ data.semester.tgl_selesai || '?' }})
      </span>
    </div>

    <!-- Ditambahkan -->
    <div>
      <p class="font-semibold text-slate-900 mb-2">{{ data.dry_run ? 'Akan ditambahkan dari Sianida' : 'Ditambahkan dari Sianida' }}</p>
      <div class="grid grid-cols-3 gap-3">
        <div v-for="item in tambahItems" :key="item.label" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p class="text-xs font-semibold uppercase text-slate-500">{{ item.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ formatNum(item.value) }}</p>
        </div>
      </div>
    </div>

    <!-- Dihapus -->
    <div>
      <p class="font-semibold text-slate-900 mb-2">{{ data.dry_run ? 'Akan dihapus permanen' : 'Dihapus permanen' }}</p>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="item in hapusItems"
          :key="item.label"
          :class="['rounded-lg border p-3', item.danger ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50']">
          <p :class="['text-xs font-semibold uppercase', item.danger ? 'text-red-600' : 'text-slate-500']">{{ item.label }}</p>
          <p :class="['text-2xl font-bold', item.danger ? 'text-red-700' : 'text-slate-900']">{{ formatNum(item.value) }}</p>
        </div>
      </div>
    </div>

    <!-- Belum punya akun Sianida (tetap disinkronkan) -->
    <div>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <p class="font-semibold text-slate-900">
          Siswa belum memiliki akun Sianida
          <span
            :class="[
              'ml-1 px-2 py-0.5 rounded-full text-xs font-semibold',
              belumPunyaAkun.length ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
            ]">
            {{ formatNum(belumPunyaAkun.length) }}
          </span>
        </p>
        <input
          v-if="belumPunyaAkun.length > 5"
          v-model="searchAkun"
          type="text"
          placeholder="Cari NISN, nama, atau kelas..."
          class="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
      </div>

      <p v-if="belumPunyaAkun.length === 0" class="text-sm text-slate-500">Semua siswa sudah memiliki akun Sianida.</p>
      <template v-else>
        <div class="flex items-start gap-2 mb-3 p-3 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-900">
          <span class="material-symbols-outlined text-amber-600 text-xl">warning</span>
          <p>
            Siswa berikut <strong>{{ data.dry_run ? 'tetap akan disinkronkan' : 'tetap disinkronkan' }}</strong> dan wajib mengikuti ujian,
            dengan <strong>username sementara = NISN</strong>. Mereka baru bisa login ujian setelah aktivasi akun Sianida
            (disarankan memakai NISN sebagai username). Jika memakai username lain, jalankan sinkronisasi ulang.
          </p>
        </div>
        <div class="border border-slate-200 rounded-lg overflow-auto max-h-80">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">NISN</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Kelas</th>
                <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Username sementara</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(s, i) in filteredBelumPunyaAkun" :key="`${s.nisn}-${i}`" class="hover:bg-slate-50">
                <td class="px-4 py-2 font-mono text-slate-700">{{ s.nisn || '-' }}</td>
                <td class="px-4 py-2 text-slate-900">{{ s.nama || '-' }}</td>
                <td class="px-4 py-2 text-slate-700">{{ s.nama_kelas || '-' }}</td>
                <td class="px-4 py-2 font-mono text-slate-700">{{ s.username || '-' }}</td>
              </tr>
              <tr v-if="filteredBelumPunyaAkun.length === 0">
                <td colspan="4" class="px-4 py-4 text-center text-slate-500">Tidak ada yang cocok dengan pencarian</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Dilewati (hanya jika ada data yang benar-benar tidak bisa dimasukkan) -->
    <div v-if="dilewati.length > 0">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <p class="font-semibold text-slate-900">
          Siswa tidak dapat disinkronkan
          <span class="ml-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            {{ formatNum(dilewati.length) }}
          </span>
        </p>
        <input
          v-if="dilewati.length > 5"
          v-model="search"
          type="text"
          placeholder="Cari NISN, nama, atau alasan..."
          class="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
      </div>
      <p class="text-sm text-slate-600 mb-2">Perbaiki data siswa berikut di Sianida, lalu jalankan sinkronisasi ulang.</p>
      <div class="border border-slate-200 rounded-lg overflow-auto max-h-80">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 sticky top-0">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">NISN</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
              <th class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase">Alasan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(s, i) in filteredDilewati" :key="`${s.nisn}-${i}`" class="hover:bg-slate-50">
              <td class="px-4 py-2 font-mono text-slate-700">{{ s.nisn || '-' }}</td>
              <td class="px-4 py-2 text-slate-900">{{ s.nama || '-' }}</td>
              <td class="px-4 py-2 text-slate-600">{{ s.alasan || '-' }}</td>
            </tr>
            <tr v-if="filteredDilewati.length === 0">
              <td colspan="3" class="px-4 py-4 text-center text-slate-500">Tidak ada yang cocok dengan pencarian</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// data = SinkronResponse dari POST /sinkron/siswa (pratinjau maupun hasil)
const props = defineProps({
  data: { type: Object, required: true },
})

const search = ref('')
const searchAkun = ref('')

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const tambahItems = computed(() => {
  const add = props.data.ditambahkan || {}
  return [
    { label: 'Peserta', value: add.peserta },
    { label: 'Kelas', value: add.kelas },
    { label: 'Jurusan', value: add.jurusan },
  ]
})

const hapusItems = computed(() => {
  const del = props.data.dihapus || {}
  return [
    { label: 'Peserta', value: del.peserta },
    { label: 'Kelas', value: del.kelas },
    { label: 'Jurusan', value: del.jurusan },
    { label: 'Nilai', value: del.nilai, danger: true },
    { label: 'Jawaban', value: del.jawaban, danger: true },
    { label: 'Jadwal Kelas', value: del.jadwal_kelas, danger: true },
  ]
})

// Siswa belum punya akun Sianida: tetap disinkronkan dengan username sementara (NISN)
const belumPunyaAkun = computed(() => props.data.belum_punya_akun || [])

const filteredBelumPunyaAkun = computed(() => {
  const q = searchAkun.value.trim().toLowerCase()
  if (!q) return belumPunyaAkun.value
  return belumPunyaAkun.value.filter(s =>
    [s.nisn, s.nama, s.nama_kelas, s.username].some(v => (v || '').toLowerCase().includes(q))
  )
})

// Siswa yang benar-benar tidak bisa dimasukkan (username dobel, kelas tidak dikenal, NISN/NIS kosong)
const dilewati = computed(() => props.data.dilewati || [])

const filteredDilewati = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return dilewati.value
  return dilewati.value.filter(s =>
    [s.nisn, s.nama, s.alasan].some(v => (v || '').toLowerCase().includes(q))
  )
})
</script>
