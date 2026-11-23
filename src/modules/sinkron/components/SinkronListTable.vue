<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
      <p class="font-semibold text-slate-900">
        {{ title }}
        <span :class="['ml-1 px-2 py-0.5 rounded-full text-xs font-semibold', items.length ? badgeClass : 'bg-green-100 text-green-800']">
          {{ formatNum(items.length) }}
        </span>
      </p>
      <input
        v-if="items.length > 5"
        v-model="search"
        type="text"
        placeholder="Cari..."
        class="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
    </div>

    <p v-if="items.length === 0" class="text-sm text-slate-500">{{ emptyText }}</p>
    <template v-else>
      <p v-if="description" class="text-sm text-slate-600 mb-2">{{ description }}</p>
      <div class="border border-slate-200 rounded-lg overflow-auto max-h-80">
        <table class="w-full text-sm">
          <thead class="bg-slate-50 sticky top-0">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-4 py-2 text-left text-xs font-semibold text-slate-600 uppercase whitespace-nowrap">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="(row, i) in filteredRows" :key="i" class="hover:bg-slate-50">
              <td
                v-for="col in columns"
                :key="col.key"
                :class="['px-4 py-2', col.mono ? 'font-mono text-slate-700 break-all' : 'text-slate-900']">
                {{ row[col.key] ?? '-' }}
              </td>
            </tr>
            <tr v-if="filteredRows.length === 0">
              <td :colspan="columns.length" class="px-4 py-4 text-center text-slate-500">
                Tidak ada yang cocok dengan pencarian
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script setup>
// Tabel daftar sederhana untuk peringatan hasil sinkronisasi.
// items boleh berupa array objek atau array string (string ditampilkan di kolom "value").
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  items: { type: Array, default: () => [] },
  // [{ key, label, mono? }]
  columns: { type: Array, default: () => [{ key: 'value', label: 'Nama' }] },
  tone: { type: String, default: 'amber' }, // amber | sky | red
  description: { type: String, default: '' },
  emptyText: { type: String, default: 'Tidak ada.' },
})

const search = ref('')

const formatNum = (n) => (Number(n) || 0).toLocaleString('id-ID')

const badgeClass = computed(() => ({
  amber: 'bg-amber-100 text-amber-800',
  sky: 'bg-sky-100 text-sky-800',
  red: 'bg-red-100 text-red-800',
}[props.tone] || 'bg-amber-100 text-amber-800'))

const rows = computed(() =>
  props.items.map(item => (item !== null && typeof item === 'object' ? item : { value: item }))
)

const filteredRows = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return rows.value
  return rows.value.filter(row =>
    props.columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(q))
  )
})
</script>
