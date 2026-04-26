<script setup>
import { computed, reactive, ref } from 'vue'

const fileInput = ref(null)

const uploadForm = reactive({
    file: null,
})

const uploadError = ref('')
const successMessage = ref('')

const maxFileSize = 5 * 1024 * 1024
const allowedExtensions = ['xlsx', 'xls']

const selectedFileName = computed(() => uploadForm.file?.name || 'Belum ada file dipilih')
const selectedFileSize = computed(() => {
    if (!uploadForm.file) {
        return '-'
    }

    const fileSizeMb = uploadForm.file.size / (1024 * 1024)
    return `${fileSizeMb.toFixed(2)} MB`
})

const validateFile = (file) => {
    if (!file) {
        return 'File Excel wajib dipilih.'
    }

    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !allowedExtensions.includes(extension)) {
        return 'Format file harus .xlsx atau .xls.'
    }

    if (file.size > maxFileSize) {
        return 'Ukuran file maksimal 5MB.'
    }

    return ''
}

const setFile = (file) => {
    uploadError.value = ''
    successMessage.value = ''

    const validationMessage = validateFile(file)
    if (validationMessage) {
        uploadForm.file = null
        uploadError.value = validationMessage
        return
    }

    uploadForm.file = file
}

const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0]
    setFile(selectedFile)
}

const triggerFilePicker = () => {
    fileInput.value?.click()
}

const handleDrop = (event) => {
    const droppedFile = event.dataTransfer?.files?.[0]
    setFile(droppedFile)
}

const clearFile = () => {
    uploadForm.file = null
    uploadError.value = ''
    successMessage.value = ''

    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const handleUpload = () => {
    uploadError.value = ''
    successMessage.value = ''

    const validationMessage = validateFile(uploadForm.file)
    if (validationMessage) {
        uploadError.value = validationMessage
        return
    }

    console.info('File peserta siap diunggah ke API:', uploadForm.file)
    successMessage.value = `File ${uploadForm.file.name} siap diproses.`
}
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-5xl">
                <nav class="mb-6 flex items-center gap-2 text-slate-400">
                    <RouterLink class="text-xs font-semibold transition-colors hover:text-sky-500" to="/peserta-ujian">
                        Peserta Ujian
                    </RouterLink>
                    <span class="text-xs">›</span>
                    <span class="text-xs font-bold text-sky-600">Upload Excel</span>
                </nav>

                <div class="mb-8">
                    <h2 class="text-4xl font-bold text-slate-900">Upload Data Peserta</h2>
                    <p class="mt-2 text-sm text-slate-500">Impor data peserta ujian secara massal menggunakan berkas
                        Excel (.xlsx) untuk efisiensi administrasi.</p>
                </div>

                <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div class="space-y-6 lg:col-span-1">
                        <div class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h3 class="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
                                <span>ℹ️</span>
                                Instruksi
                            </h3>
                            <ul class="space-y-4">
                                <li class="flex gap-3">
                                    <span
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">1</span>
                                    <p class="text-sm text-slate-600">Unduh template Excel yang telah disediakan sistem.
                                    </p>
                                </li>
                                <li class="flex gap-3">
                                    <span
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">2</span>
                                    <p class="text-sm text-slate-600">Isi data peserta sesuai header kolom. Jangan
                                        mengubah struktur kolom.</p>
                                </li>
                                <li class="flex gap-3">
                                    <span
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">3</span>
                                    <p class="text-sm text-slate-600">Simpan file dalam format .xlsx atau .xls sebelum
                                        diunggah.</p>
                                </li>
                                <li class="flex gap-3">
                                    <span
                                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">4</span>
                                    <p class="text-sm text-slate-600">Pastikan NIK/NISN berupa angka tanpa karakter
                                        khusus.</p>
                                </li>
                            </ul>
                        </div>

                        <div class="rounded-3xl border border-sky-200 bg-sky-50 p-6">
                            <div class="mb-4 flex items-center gap-3">
                                <span class="text-2xl">📄</span>
                                <span class="text-sm font-bold text-sky-900">Template Sistem</span>
                            </div>
                            <p class="mb-6 text-sm text-sky-700">Gunakan file ini untuk menghindari kesalahan format
                                saat proses import data.</p>
                            <a href="/templates/template-peserta.xls" download
                                class="flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-all hover:brightness-110">
                                <span>⬇</span>
                                Download Template Excel
                            </a>
                        </div>
                    </div>

                    <div class="lg:col-span-2">
                        <div
                            class="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-200/50">
                            <div class="mb-6 flex items-end justify-between">
                                <div>
                                    <h3 class="text-2xl font-semibold text-slate-900">Unggah Berkas</h3>
                                    <p class="text-sm text-slate-500">Pilih file Excel yang sudah siap diproses.</p>
                                </div>
                                <span
                                    class="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">Format:
                                    .xlsx, .xls</span>
                            </div>

                            <input ref="fileInput" accept=".xlsx,.xls" class="hidden" type="file"
                                @change="handleFileChange" />

                            <div class="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-4 border-dashed border-slate-100 bg-slate-50/60 p-10 text-center transition-all hover:border-sky-300 hover:bg-sky-50"
                                @click="triggerFilePicker" @dragover.prevent @drop.prevent="handleDrop">
                                <div
                                    class="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
                                    <span class="text-4xl text-sky-600">☁️</span>
                                </div>
                                <h4 class="mb-2 text-xl font-semibold text-slate-900">Tarik & Lepas File</h4>
                                <p class="mb-6 max-w-xs text-sm text-slate-500">Atau klik untuk menjelajahi file di
                                    perangkat Anda</p>
                                <div
                                    class="rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-medium text-slate-600">
                                    Pilih File Berkas
                                </div>
                            </div>

                            <div
                                class="mt-6 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div
                                    class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                                    📊
                                </div>
                                <div class="flex-1 overflow-hidden">
                                    <p class="truncate text-sm font-bold text-slate-900">{{ selectedFileName }}</p>
                                    <p class="text-xs text-slate-500">{{ selectedFileSize }} • {{ uploadForm.file ?
                                        'Siap untuk diunggah' : 'Belum ada file' }}</p>
                                </div>
                                <button v-if="uploadForm.file" type="button"
                                    class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-rose-500"
                                    @click="clearFile">
                                    ✕
                                </button>
                            </div>

                            <p v-if="uploadError" class="mt-4 text-sm font-medium text-rose-500">{{ uploadError }}</p>
                            <p v-if="successMessage" class="mt-4 text-sm font-medium text-emerald-600">{{ successMessage
                                }}</p>

                            <div
                                class="mt-8 flex flex-col items-center justify-end gap-4 border-t border-slate-100 pt-8 sm:flex-row">
                                <RouterLink to="/peserta-ujian"
                                    class="w-full rounded-2xl px-8 py-4 text-center text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto">
                                    Batal
                                </RouterLink>
                                <button type="button"
                                    class="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-10 py-4 text-sm font-bold text-emerald-950 shadow-lg shadow-emerald-500/30 transition-all hover:brightness-110 sm:w-auto"
                                    @click="handleUpload">
                                    <span>✔</span>
                                    Proses Upload
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    </div>
</template>