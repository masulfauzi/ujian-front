<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-4xl mx-auto">
        <div class="mb-8">
          <button
            @click="router.push({ name: 'jadwal.detail', params: { id: jadwalId } })"
            class="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-semibold mb-4">
            <span class="material-symbols-outlined">arrow_back</span>
            Kembali
          </button>
          <h1 class="text-3xl font-bold text-slate-900">Kelola Section Ujian</h1>
          <p class="text-slate-500 mt-1" v-if="jadwalData">
            {{ jadwalData.nama_ujian }} &middot; {{ totalSoalBank }} soal pada bank soal ini
          </p>
        </div>

        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat data section...</p>
          </div>
        </div>

        <template v-else>
          <!-- Info -->
          <div class="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <span class="material-symbols-outlined text-sky-600">info</span>
            <p class="text-sm text-sky-800">
              Bagi soal ujian ini ke dalam beberapa section berurutan. Tiap section memiliki jumlah soal
              dan durasi minimal sendiri sebelum peserta dapat lanjut ke section berikutnya. Total jumlah soal
              seluruh section harus sama dengan jumlah soal pada bank soal ini
              (<span class="font-semibold">{{ totalSoalBank }} soal</span>). Menyimpan akan mengganti seluruh
              pembagian section lama &mdash; lakukan ini sebelum peserta mulai mengerjakan ujian.
            </p>
          </div>

          <!-- Auto divide helper -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6 mb-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Bagi Otomatis</h2>
            <div class="flex flex-wrap items-end gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Jumlah Section</label>
                <input
                  v-model.number="autoDivide.jumlahSection"
                  type="number"
                  min="1"
                  class="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 mb-1">Durasi Minimal / Section (menit)</label>
                <input
                  v-model.number="autoDivide.durasiMenit"
                  type="number"
                  min="0"
                  class="w-48 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <button
                @click="applyAutoDivide"
                type="button"
                class="px-4 py-2 bg-sky-100 text-sky-700 hover:bg-sky-200 font-semibold rounded-lg transition-colors flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px]">auto_fix_high</span>
                Terapkan
              </button>
            </div>
          </div>

          <!-- Section Rows Form -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Pembagian Section</h2>
              <button
                @click="addRow"
                type="button"
                class="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">add</span>
                Tambah Section
              </button>
            </div>

            <div v-for="(row, idx) in sectionRows" :key="idx" class="grid grid-cols-12 gap-3 items-start border border-slate-100 rounded-lg p-3">
              <div class="col-span-12 md:col-span-5">
                <label class="block text-xs font-medium text-slate-500 mb-1">Nama Section</label>
                <input
                  v-model="row.nama_section"
                  type="text"
                  placeholder="Contoh: Bagian 1"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
              </div>
              <div class="col-span-6 md:col-span-3">
                <label class="block text-xs font-medium text-slate-500 mb-1">Jumlah Soal</label>
                <input
                  v-model.number="row.jml_soal"
                  type="number"
                  min="1"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
              </div>
              <div class="col-span-6 md:col-span-3">
                <label class="block text-xs font-medium text-slate-500 mb-1">Durasi Minimal (menit)</label>
                <input
                  v-model.number="row.durasi_menit_minimal"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm" />
              </div>
              <div class="col-span-12 md:col-span-1 flex md:justify-center md:pt-6">
                <button
                  @click="removeRow(idx)"
                  type="button"
                  :disabled="sectionRows.length <= 1"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                  <span class="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            <!-- Summary -->
            <div
              class="flex items-center justify-between p-4 rounded-lg border"
              :class="isBalanced ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'">
              <div class="flex items-center gap-2">
                <span
                  class="material-symbols-outlined text-xl"
                  :class="isBalanced ? 'text-green-600' : 'text-amber-600'">
                  {{ isBalanced ? 'check_circle' : 'error' }}
                </span>
                <p class="text-sm font-semibold" :class="isBalanced ? 'text-green-700' : 'text-amber-700'">
                  Total soal terisi: {{ totalJmlSoalRows }} / {{ totalSoalBank }}
                </p>
              </div>
            </div>

            <button
              @click="handleSubmit"
              :disabled="!canSubmit || isSaving"
              class="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">save</span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Pembagian Section' }}
            </button>
          </div>

          <!-- Existing sections (after save / on load) -->
          <div v-if="existingSections.length > 0" class="bg-white rounded-lg shadow border border-slate-200 p-6 mt-6">
            <h2 class="text-lg font-semibold text-slate-900 mb-4">Section Tersimpan</h2>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-500 border-b border-slate-200">
                    <th class="py-2 pr-4">Urutan</th>
                    <th class="py-2 pr-4">Nama Section</th>
                    <th class="py-2 pr-4">Rentang Soal</th>
                    <th class="py-2 pr-4">Jml Soal</th>
                    <th class="py-2 pr-4">Durasi Minimal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="sec in existingSections" :key="sec.id" class="border-b border-slate-100">
                    <td class="py-2 pr-4 font-semibold">{{ sec.urutan }}</td>
                    <td class="py-2 pr-4">{{ sec.nama_section }}</td>
                    <td class="py-2 pr-4">{{ sec.no_urut_awal }} &ndash; {{ sec.no_urut_akhir }}</td>
                    <td class="py-2 pr-4">{{ sec.jml_soal }}</td>
                    <td class="py-2 pr-4">{{ sec.durasi_menit_minimal }} menit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useDialog } from '@/composables/useDialog'
import { jadwalService } from '@/services/jadwalService'
import { soalService } from '@/services/soalService'
import { sectionService } from '@/services/sectionService'

const route = useRoute()
const router = useRouter()
const { $alert, $confirm } = useDialog()

const jadwalId = route.params.id

const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)

const jadwalData = ref(null)
const totalSoalBank = ref(0)
const existingSections = ref([])
const sectionRows = ref([{ nama_section: '', jml_soal: null, durasi_menit_minimal: 0 }])

const autoDivide = ref({ jumlahSection: 5, durasiMenit: 0 })

const totalJmlSoalRows = computed(() =>
  sectionRows.value.reduce((sum, r) => sum + (Number(r.jml_soal) || 0), 0)
)

const isBalanced = computed(() =>
  totalSoalBank.value > 0 && totalJmlSoalRows.value === totalSoalBank.value
)

const canSubmit = computed(() =>
  isBalanced.value &&
  sectionRows.value.length > 0 &&
  sectionRows.value.every(r => r.nama_section.trim() && Number(r.jml_soal) >= 1 && Number(r.durasi_menit_minimal) >= 0)
)

function addRow() {
  sectionRows.value.push({ nama_section: '', jml_soal: null, durasi_menit_minimal: 0 })
}

function removeRow(idx) {
  if (sectionRows.value.length <= 1) return
  sectionRows.value.splice(idx, 1)
}

function applyAutoDivide() {
  const n = Math.max(1, Number(autoDivide.value.jumlahSection) || 1)
  const durasi = Math.max(0, Number(autoDivide.value.durasiMenit) || 0)
  const total = totalSoalBank.value

  const base = Math.floor(total / n)
  const remainder = total % n

  sectionRows.value = Array.from({ length: n }, (_, i) => ({
    nama_section: `Section ${i + 1}`,
    jml_soal: base + (i < remainder ? 1 : 0),
    durasi_menit_minimal: durasi,
  }))
}

async function loadData() {
  isLoading.value = true
  error.value = null

  try {
    const jadwalRes = await jadwalService.getJadwalById(jadwalId)
    jadwalData.value = jadwalRes.data

    if (jadwalData.value?.id_bank_soal) {
      const soalRes = await soalService.getSoalByBankId(jadwalData.value.id_bank_soal, 1, 1)
      totalSoalBank.value = soalRes.data?.total || 0
    }

    const sectionRes = await sectionService.getSectionsByJadwal(jadwalId)
    const sorted = (sectionRes.data || []).slice().sort((a, b) => a.urutan - b.urutan)
    existingSections.value = sorted

    if (sorted.length > 0) {
      sectionRows.value = sorted.map(sec => ({
        nama_section: sec.nama_section,
        jml_soal: sec.jml_soal,
        durasi_menit_minimal: sec.durasi_menit_minimal,
      }))
    } else if (totalSoalBank.value > 0) {
      sectionRows.value = [{ nama_section: 'Section 1', jml_soal: totalSoalBank.value, durasi_menit_minimal: 0 }]
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal memuat data section'
  } finally {
    isLoading.value = false
  }
}

async function handleSubmit() {
  if (!canSubmit.value || isSaving.value) return

  const msg = existingSections.value.length > 0
    ? 'Menyimpan akan MENGGANTI seluruh pembagian section lama untuk jadwal ini. Sesi ujian yang sedang berjalan tidak akan otomatis disesuaikan. Lanjutkan?'
    : 'Simpan pembagian section untuk jadwal ini?'
  const ok = await $confirm(msg, { title: 'Simpan Pembagian Section' })
  if (!ok) return

  isSaving.value = true
  error.value = null

  try {
    const payload = sectionRows.value.map(r => ({
      nama_section: r.nama_section.trim(),
      jml_soal: Number(r.jml_soal),
      durasi_menit_minimal: Number(r.durasi_menit_minimal) || 0,
    }))
    const res = await sectionService.defineSections(jadwalId, payload)
    const sorted = (res.data || []).slice().sort((a, b) => a.urutan - b.urutan)
    existingSections.value = sorted

    await $alert('Pembagian section berhasil disimpan.', { title: 'Berhasil', type: 'success' })
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Gagal menyimpan pembagian section'
    error.value = message
    await $alert(message, { title: 'Gagal', type: 'error' })
  } finally {
    isSaving.value = false
  }
}

onMounted(loadData)
</script>
