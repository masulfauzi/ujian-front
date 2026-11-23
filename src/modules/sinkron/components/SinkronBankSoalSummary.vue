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
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div v-for="item in tambahItems" :key="item.label" class="rounded-lg border border-slate-200 bg-slate-50 p-3">
          <p class="text-xs font-semibold uppercase text-slate-500">{{ item.label }}</p>
          <p class="text-2xl font-bold text-slate-900">{{ formatNum(item.value) }}</p>
        </div>
      </div>
      <p v-if="data.dry_run" class="text-xs text-slate-500 mt-2">Gambar baru diunduh saat sinkron dijalankan, jadi prosesnya bisa memakan waktu beberapa menit.</p>
    </div>

    <!-- Dihapus -->
    <div>
      <p class="font-semibold text-slate-900 mb-2">{{ data.dry_run ? 'Akan dihapus permanen' : 'Dihapus permanen' }}</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div
          v-for="item in hapusItems"
          :key="item.label"
          :class="['rounded-lg border p-3', item.danger ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50']">
          <p :class="['text-xs font-semibold uppercase', item.danger ? 'text-red-600' : 'text-slate-500']">{{ item.label }}</p>
          <p :class="['text-2xl font-bold', item.danger ? 'text-red-700' : 'text-slate-900']">{{ formatNum(item.value) }}</p>
        </div>
      </div>
    </div>

    <!-- Peringatan -->
    <SinkronBankSoalPeringatan :peringatan="data.peringatan || {}" :dry-run="data.dry_run" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import SinkronBankSoalPeringatan from './SinkronBankSoalPeringatan.vue'

// data = SinkronBankSoalResponse dari POST /sinkron/bank-soal (pratinjau maupun hasil)
const props = defineProps({
  data: { type: Object, required: true },
})

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const tambahItems = computed(() => {
  const add = props.data.ditambahkan || {}
  return [
    { label: 'Bank Soal', value: add.bank_soal },
    { label: 'Soal', value: add.soal },
    { label: 'Gambar', value: add.gambar },
    { label: 'Mapel Baru', value: add.mapel_baru },
  ]
})

const hapusItems = computed(() => {
  const del = props.data.dihapus || {}
  return [
    { label: 'Bank Soal', value: del.bank_soal },
    { label: 'Soal', value: del.soal },
    { label: 'Jadwal', value: del.jadwal, danger: true },
    { label: 'Section', value: del.section, danger: true },
    { label: 'Jadwal Kelas', value: del.jadwal_kelas, danger: true },
    { label: 'Nilai', value: del.nilai, danger: true },
    { label: 'Jawaban', value: del.jawaban, danger: true },
  ]
})
</script>
