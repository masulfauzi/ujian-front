<template>
  <div class="space-y-6">
    <SinkronListTable
      v-if="!dryRun"
      title="Gambar gagal diunduh"
      :items="peringatan.gambar_gagal || []"
      :columns="[
        { key: 'nama_bank_soal', label: 'Bank Soal' },
        { key: 'no_soal', label: 'No. Soal' },
        { key: 'file', label: 'File', mono: true },
      ]"
      tone="red"
      description="Soal berikut tetap dimasukkan tanpa gambar. Periksa dan unggah ulang gambarnya di Bank Soal."
      empty-text="Semua gambar berhasil diunduh." />

    <SinkronListTable
      title="Soal dilewati"
      :items="peringatan.soal_dilewati || []"
      :columns="[
        { key: 'nama_bank_soal', label: 'Bank Soal' },
        { key: 'no_soal', label: 'No. Soal' },
        { key: 'alasan', label: 'Alasan' },
      ]"
      tone="red"
      description="Soal tidak valid (mis. kunci kosong di bank draft) tidak dimasukkan. Perbaiki di Sianida lalu sinkron ulang."
      empty-text="Semua soal valid." />

    <SinkronListTable
      v-if="(peringatan.bank_kosong || []).length"
      title="Bank soal tanpa soal valid"
      :items="peringatan.bank_kosong"
      :columns="[
        { key: 'nama_bank_soal', label: 'Bank Soal' },
        { key: 'nama_guru', label: 'Guru' },
        { key: 'status', label: 'Status' },
      ]"
      tone="amber"
      description="Bank soal berikut tetap dimasukkan, tetapi belum berisi soal." />

    <SinkronListTable
      v-if="(peringatan.nama_bank_diubah || []).length"
      title="Nama bank soal diubah karena dobel"
      :items="peringatan.nama_bank_diubah"
      :columns="[
        { key: 'nama_asli', label: 'Nama di Sianida' },
        { key: 'nama_baru', label: 'Nama di Aplikasi Ujian' },
      ]"
      tone="sky" />

    <SinkronListTable
      v-if="(peringatan.mapel_baru || []).length"
      title="Mapel baru dibuat otomatis"
      :items="peringatan.mapel_baru"
      :columns="[{ key: 'value', label: 'Nama Mapel' }]"
      tone="sky"
      description="Mapel dari Sianida yang belum ada di aplikasi ujian." />
  </div>
</template>

<script setup>
// Daftar peringatan hasil sinkron bank soal (dipakai sinkron total maupun per bank)
import SinkronListTable from './SinkronListTable.vue'

defineProps({
  peringatan: { type: Object, default: () => ({}) },
  // gambar_gagal hanya terisi saat sinkron sungguhan
  dryRun: { type: Boolean, default: true },
})
</script>
