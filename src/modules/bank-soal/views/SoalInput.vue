<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-6xl mx-auto">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Input Soal</h1>
          <p class="text-slate-500 mt-1">{{ bankSoalDetail?.nama_bank_soal }}</p>
        </div>

        <!-- Progress Bar -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold text-slate-700">
              Soal {{ currentSoalNumber }} dari {{ totalSoal }}
            </span>
            <span class="text-sm text-slate-500">
              {{ Math.round((currentSoalNumber / totalSoal) * 100) }}%
            </span>
          </div>
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div
              class="bg-sky-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: (currentSoalNumber / totalSoal) * 100 + '%' }">
            </div>
          </div>
        </div>

        <!-- Question Navigation Tabs -->
        <div class="bg-white rounded-lg shadow border border-slate-200 p-4 mb-6">
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="soalNum in totalSoal"
              :key="soalNum"
              @click="switchSoal(soalNum)"
              :class="[
                'w-10 h-10 rounded-lg font-semibold transition-all',
                currentSoalNumber === soalNum
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : isSoalFilled(soalNum)
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              ]"
              :disabled="isSaving">
              {{ soalNum }}
            </button>
          </div>
          <p class="text-xs text-slate-500 mt-3">Klik nomor untuk pindah ke soal lain</p>
          <p class="text-xs text-slate-500 mt-2">
            <span class="inline-block w-3 h-3 rounded bg-blue-500 mr-1 align-middle"></span> = Soal sudah diisi
          </p>
        </div>

        <!-- Form Section -->
        <form @submit.prevent="handleSave" class="bg-white rounded-lg shadow border border-slate-200 p-6 space-y-6">
          <!-- Soal Text with Quill Editor -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Pertanyaan Soal
            </label>
            <div
              ref="quillContainer"
              class="border border-slate-300 rounded-lg overflow-hidden min-h-64 bg-white"
              :class="{ 'border-red-500': errors.soal }">
            </div>
            <p v-if="errors.soal" class="text-red-600 text-sm mt-1">{{ errors.soal }}</p>
          </div>

          <!-- Gambar Soal -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-2">
              Gambar Soal (Opsional)
            </label>
            <div
              @drop.prevent="handleDrop($event, 'gambar_soal')"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-500 transition-colors cursor-pointer"
              @click="triggerFileInput('gambar_soal')">
              <input
                :ref="setFileRef('gambar_soal')"
                type="file"
                accept="image/*"
                @change="handleFileChange($event, 'gambar_soal')"
                style="display: none;">
              <div v-if="!currentForm.gambar_soal_preview && !currentForm.gambar_soal" class="space-y-2">
                <span class="material-symbols-outlined text-4xl text-slate-400 block">image</span>
                <p class="text-slate-600">Drag & drop gambar atau klik untuk upload</p>
              </div>
              <div v-else class="space-y-2">
                <img :src="currentForm.gambar_soal_preview || currentForm.gambar_soal" :alt="'Gambar soal'" class="max-h-40 mx-auto rounded">
                <p class="text-sm text-sky-600 font-semibold">Klik untuk ubah</p>
              </div>
            </div>
          </div>

          <!-- Opsi Jawaban Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="opsiKey in ['opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e']" :key="opsiKey">
              <!-- Opsi Text -->
              <div>
                <label class="block text-sm font-semibold text-slate-900 mb-2">
                  Opsi {{ opsiKey.split('_')[1].toUpperCase() }}
                </label>
                <input
                  v-model="currentForm[opsiKey]"
                  @blur="validateField(opsiKey)"
                  type="text"
                  :placeholder="`Ketik opsi ${opsiKey.split('_')[1].toUpperCase()}...`"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                  :class="{ 'border-red-500 focus:ring-red-500': errors[opsiKey] }">
                <p v-if="errors[opsiKey]" class="text-red-600 text-sm mt-1">{{ errors[opsiKey] }}</p>
              </div>

              <!-- Opsi Image -->
              <div class="mt-3">
                <label class="block text-sm font-medium text-slate-700 mb-2">
                  Gambar Opsi {{ opsiKey.split('_')[1].toUpperCase() }} (Opsional)
                </label>
                <div
                  @drop.prevent="handleDrop($event, `gambar_${opsiKey.split('_')[1]}`)"
                  @dragover.prevent
                  @dragenter.prevent
                  class="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-sky-500 transition-colors cursor-pointer"
                  @click="triggerFileInput(`gambar_${opsiKey.split('_')[1]}`)">
                  <input
                    :ref="setFileRef(`gambar_${opsiKey.split('_')[1]}`)"
                    type="file"
                    accept="image/*"
                    @change="handleFileChange($event, `gambar_${opsiKey.split('_')[1]}`)"
                    style="display: none;">
                  <div v-if="!currentForm[`gambar_${opsiKey.split('_')[1]}_preview`] && !currentForm[`gambar_${opsiKey.split('_')[1]}`]" class="space-y-1">
                    <span class="material-symbols-outlined text-2xl text-slate-400 block">image</span>
                    <p class="text-xs text-slate-600">Klik untuk upload</p>
                  </div>
                  <img
                    v-else
                    :src="currentForm[`gambar_${opsiKey.split('_')[1]}_preview`] || currentForm[`gambar_${opsiKey.split('_')[1]}`]"
                    :alt="`Gambar opsi ${opsiKey.split('_')[1].toUpperCase()}`"
                    class="max-h-24 mx-auto rounded">
                </div>
              </div>
            </div>
          </div>

          <!-- Kunci Jawaban -->
          <div>
            <label class="block text-sm font-semibold text-slate-900 mb-3">
              Kunci Jawaban <span class="text-red-600">*</span>
            </label>
            <div class="flex gap-4 flex-wrap">
              <label v-for="opsi in ['A', 'B', 'C', 'D', 'E']" :key="opsi" class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="currentForm.kunci"
                  type="radio"
                  :value="opsi"
                  class="w-4 h-4">
                <span class="text-slate-700 font-medium">{{ opsi }}</span>
              </label>
            </div>
            <p v-if="errors.kunci" class="text-red-600 text-sm mt-2">{{ errors.kunci }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t">
            <button
              v-if="currentSoalNumber > 1"
              type="button"
              @click="switchSoal(currentSoalNumber - 1)"
              :disabled="isSaving"
              class="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold rounded-lg transition-colors disabled:opacity-50">
              ← Soal Sebelumnya
            </button>

            <button
              type="submit"
              :disabled="isSaving"
              class="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="!isSaving" class="material-symbols-outlined">save</span>
              <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isSaving ? 'Menyimpan...' : 'Simpan Soal' }}
            </button>

            <button
              v-if="currentSoalNumber < totalSoal"
              type="button"
              @click="handleSaveAndNext"
              :disabled="isSaving"
              class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">navigate_next</span>
              Soal Berikutnya →
            </button>

            <button
              v-else
              type="button"
              @click="handleComplete"
              :disabled="isSaving"
              class="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <span class="material-symbols-outlined">check_circle</span>
              Selesai
            </button>
          </div>

          <!-- Save Status -->
          <div v-if="saveStatus" :class="[
            'p-3 rounded-lg text-sm',
            saveStatus.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          ]">
            {{ saveStatus.message }}
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, reactive, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankSoalStore } from '@/stores/bankSoal'
import { useSoalStore } from '@/stores/soal'
import { soalService } from '@/services/soalService'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const route = useRoute()
const router = useRouter()
const bankSoalStore = useBankSoalStore()
const soalStore = useSoalStore()
const bankSoalId = route.params.id

const currentSoalNumber = ref(1)
const isSaving = ref(false)
const saveStatus = ref(null)
const soalList = reactive({})
const fileInputs = {}
const quillContainer = ref(null)
const quillEditor = ref(null)

const bankSoalDetail = computed(() => bankSoalStore.selectedSoal)
const totalSoal = computed(() => bankSoalDetail.value?.jml_soal || 0)

const currentForm = computed({
  get: () => soalList[currentSoalNumber.value] || getEmptyForm(),
  set: (value) => {
    soalList[currentSoalNumber.value] = value
  }
})

const errors = reactive({
  kunci: ''
})

onMounted(async () => {
  try {
    await bankSoalStore.fetchSoalById(bankSoalId)

    // Initialize all soals with empty forms
    for (let i = 1; i <= totalSoal.value; i++) {
      soalList[i] = getEmptyForm()
    }

    // Fetch existing soals from database
    try {
      const response = await soalService.getSoalByBankId(bankSoalId, 1, 100)
      const existingSoals = response.data?.data || []

      console.log('API Response:', response)
      console.log('Existing soals fetched:', existingSoals)

      // Populate soalList with existing data using no_soal as key
      if (Array.isArray(existingSoals)) {
        existingSoals.forEach((soal) => {
          const soalNumber = soal.no_soal
          const soalData = {
            id: soal.id,
            no_soal: soal.no_soal,
            soal: soal.soal || '',
            gambar_soal: soal.gambar_soal || null,
            opsi_a: soal.opsi_a || '',
            opsi_b: soal.opsi_b || '',
            opsi_c: soal.opsi_c || '',
            opsi_d: soal.opsi_d || '',
            opsi_e: soal.opsi_e || '',
            gambar_a: soal.gambar_a || null,
            gambar_b: soal.gambar_b || null,
            gambar_c: soal.gambar_c || null,
            gambar_d: soal.gambar_d || null,
            gambar_e: soal.gambar_e || null,
            kunci: soal.kunci || ''
          }

          soalList[soalNumber] = soalData

          console.log(`Soal ${soalNumber} loaded from database:`, soalData)
        })
      }

      console.log('Final soalList:', JSON.parse(JSON.stringify(soalList)))
    } catch (err) {
      console.error('Error fetching existing soals:', err)
    }

    initializeQuill()
  } catch (err) {
    console.error('Error loading bank soal:', err)
  }
})

const getEmptyForm = () => ({
  soal: '',
  gambar_soal: null,
  opsi_a: '',
  opsi_b: '',
  opsi_c: '',
  opsi_d: '',
  opsi_e: '',
  gambar_a: null,
  gambar_b: null,
  gambar_c: null,
  gambar_d: null,
  gambar_e: null,
  kunci: ''
})

const initializeQuill = async () => {
  await nextTick()

  if (quillContainer.value && !quillEditor.value) {
    quillEditor.value = new Quill(quillContainer.value, {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean']
        ]
      },
      placeholder: 'Ketik pertanyaan soal...'
    })

    const text = currentForm.value.soal
    if (text) {
      quillEditor.value.root.innerHTML = text
    }

    quillEditor.value.on('text-change', () => {
      currentForm.value.soal = quillEditor.value.root.innerHTML
    })
  }
}

const validateField = (field) => {
  if (field !== 'kunci') return
  errors.kunci = currentForm.value.kunci ? '' : 'Kunci Jawaban wajib dipilih'
}

const validateForm = () => {
  if (quillEditor.value) {
    currentForm.value.soal = quillEditor.value.root.innerHTML
  }

  validateField('kunci')

  return !errors.kunci
}

const switchSoal = async (soalNum) => {
  if (currentSoalNumber.value !== soalNum) {
    if (quillEditor.value) {
      currentForm.value.soal = quillEditor.value.root.innerHTML
    }

    currentSoalNumber.value = soalNum

    if (quillEditor.value) {
      const text = currentForm.value.soal || ''
      quillEditor.value.root.innerHTML = text
    }
  }
}

const handleFileChange = async (event, field) => {
  const file = event.target.files[0]
  if (file) {
    // Store file object for later upload
    currentForm.value[field] = file

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file)
    currentForm.value[`${field}_preview`] = previewUrl
  }
}

const handleDrop = (event, field) => {
  const files = event.dataTransfer.files
  if (files.length > 0) {
    const fileInput = { target: { files } }
    handleFileChange(fileInput, field)
  }
}

const setFileRef = (field) => (el) => {
  fileInputs[field] = el
}

const triggerFileInput = (field) => {
  if (fileInputs[field]) {
    fileInputs[field].click()
  }
}

const isSoalFilled = (soalNum) => {
  const soal = soalList[soalNum]
  if (!soal) {
    console.log(`Soal ${soalNum}: not found in soalList`)
    return false
  }

  // Check if soal has been saved to database by checking if no_soal exists
  const isFilled = soal.no_soal !== undefined && soal.no_soal !== null

  console.log(`Soal ${soalNum}: no_soal = ${soal.no_soal}, isFilled = ${isFilled}`)

  return isFilled
}

const handleSave = async () => {
  if (!validateForm()) {
    saveStatus.value = {
      type: 'error',
      message: 'Mohon isi semua field yang wajib'
    }
    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
    return
  }

  isSaving.value = true

  try {
    const formData = new FormData()

    // Append soal data
    formData.append('id_bank_soal', bankSoalId)
    formData.append('no_soal', currentSoalNumber.value)
    formData.append('soal', currentForm.value.soal || '')
    formData.append('opsi_a', currentForm.value.opsi_a || '')
    formData.append('opsi_b', currentForm.value.opsi_b || '')
    formData.append('opsi_c', currentForm.value.opsi_c || '')
    formData.append('opsi_d', currentForm.value.opsi_d || '')
    formData.append('opsi_e', currentForm.value.opsi_e || '')
    formData.append('kunci', currentForm.value.kunci || '')

    // Append files if they exist and are File objects
    const imageFields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e']
    imageFields.forEach(field => {
      if (currentForm.value[field] instanceof File) {
        formData.append(field, currentForm.value[field])
      }
    })

    let savedId = currentForm.value.id
    if (currentForm.value.id) {
      await soalService.updateSoal(currentForm.value.id, formData)
    } else {
      const res = await soalService.createSoal(formData)
      savedId = res.data?.data?.id || res.data?.id
    }

    // Tandai soal sebagai sudah tersimpan agar nomor langsung biru
    soalList[currentSoalNumber.value] = {
      ...soalList[currentSoalNumber.value],
      id: savedId,
      no_soal: currentSoalNumber.value,
    }

    saveStatus.value = {
      type: 'success',
      message: `Soal ${currentSoalNumber.value} berhasil disimpan`
    }

    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
  } catch (err) {
    saveStatus.value = {
      type: 'error',
      message: err.response?.data?.message || 'Gagal menyimpan soal'
    }
  } finally {
    isSaving.value = false
  }
}

const handleSaveAndNext = async () => {
  if (!validateForm()) {
    saveStatus.value = {
      type: 'error',
      message: 'Mohon isi semua field yang wajib sebelum lanjut ke soal berikutnya'
    }
    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
    return
  }

  isSaving.value = true

  try {
    const formData = new FormData()

    // Append soal data
    formData.append('id_bank_soal', bankSoalId)
    formData.append('no_soal', currentSoalNumber.value)
    formData.append('soal', currentForm.value.soal || '')
    formData.append('opsi_a', currentForm.value.opsi_a || '')
    formData.append('opsi_b', currentForm.value.opsi_b || '')
    formData.append('opsi_c', currentForm.value.opsi_c || '')
    formData.append('opsi_d', currentForm.value.opsi_d || '')
    formData.append('opsi_e', currentForm.value.opsi_e || '')
    formData.append('kunci', currentForm.value.kunci || '')

    // Append files if they exist and are File objects
    const imageFields = ['gambar_soal', 'gambar_a', 'gambar_b', 'gambar_c', 'gambar_d', 'gambar_e']
    imageFields.forEach(field => {
      if (currentForm.value[field] instanceof File) {
        formData.append(field, currentForm.value[field])
      }
    })

    let savedId = currentForm.value.id
    if (currentForm.value.id) {
      await soalService.updateSoal(currentForm.value.id, formData)
    } else {
      const res = await soalService.createSoal(formData)
      savedId = res.data?.data?.id || res.data?.id
    }

    // Tandai soal sebagai sudah tersimpan agar nomor langsung biru
    soalList[currentSoalNumber.value] = {
      ...soalList[currentSoalNumber.value],
      id: savedId,
      no_soal: currentSoalNumber.value,
    }

    saveStatus.value = {
      type: 'success',
      message: `Soal ${currentSoalNumber.value} berhasil disimpan`
    }

    setTimeout(() => {
      saveStatus.value = null
    }, 1500)

    if (currentSoalNumber.value < totalSoal.value) {
      setTimeout(() => {
        switchSoal(currentSoalNumber.value + 1)
      }, 500)
    }
  } catch (err) {
    saveStatus.value = {
      type: 'error',
      message: err.response?.data?.message || 'Gagal menyimpan soal'
    }
    setTimeout(() => {
      saveStatus.value = null
    }, 3000)
  } finally {
    isSaving.value = false
  }
}

const handleComplete = async () => {
  await handleSave()
  if (saveStatus.value?.type === 'success') {
    router.push({ name: 'bankSoal.detail', params: { id: bankSoalId } })
  }
}
</script>
