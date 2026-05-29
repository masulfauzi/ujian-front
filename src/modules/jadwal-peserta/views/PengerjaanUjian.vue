<template>
    <div class="bg-surface min-h-screen">
        <main class="py-8 px-6 min-h-screen">
            <div class="max-w-6xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="flex justify-center items-center py-20">
                    <div class="text-center">
                        <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                        <p class="mt-3 text-slate-600">Memuat soal ujian...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-5xl text-red-500 shrink-0">error</span>
                        <div class="flex-1">
                            <h3 class="font-h3 text-h3 text-slate-800 mb-2">Gagal Memuat Soal Ujian</h3>
                            <p class="text-slate-500 text-sm mb-6">{{ error }}</p>
                            <button @click="router.back()" class="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <template v-else>
                    <!-- Save Error Notification -->
                    <div
                        v-if="saveError"
                        class="fixed bottom-8 right-8 bg-white px-6 py-4 rounded-2xl shadow-lg border border-red-200 flex items-center gap-4 z-50 max-w-md">
                        <span class="material-symbols-outlined text-red-500">error</span>
                        <p class="text-sm text-red-700 flex-1">{{ saveError }}</p>
                        <button @click="saveError = null" class="text-slate-400 hover:text-slate-600">
                            <span class="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    <!-- Header dengan Timer -->
                    <div class="bg-white rounded-3xl p-4 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-sky-50 mb-6">
                        <div class="flex items-center justify-between gap-3 flex-wrap">
                            <div class="min-w-0">
                                <h2 class="font-h2 text-h2 text-on-surface truncate">{{ nilaiData?.nama_ujian || '-' }}</h2>
                                <p class="text-slate-500 text-sm mt-0.5">{{ nilaiData?.nama_peserta || '-' }}</p>
                            </div>
                            <div class="flex items-center gap-2 md:gap-4 shrink-0">
                                <!-- Timer Card -->
                                <div
                                    class="text-right px-3 py-2 md:px-6 md:py-4 rounded-2xl border-2 transition-all"
                                    :class="[
                                        timeRemaining < 60
                                            ? 'bg-red-50 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                            : timeRemaining < 300
                                            ? 'bg-yellow-50 border-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                                            : 'bg-secondary-container/10 border-secondary-container/20'
                                    ]">
                                    <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-0.5 hidden md:block">Waktu Tersisa</p>
                                    <p
                                        class="font-h3 text-h3 font-bold"
                                        :class="[
                                            timeRemaining < 60
                                                ? 'text-red-600 animate-pulse'
                                                : timeRemaining < 300
                                                ? 'text-yellow-600'
                                                : 'text-on-surface'
                                        ]">
                                        {{ formatTime(timeRemaining) }}
                                    </p>
                                    <div v-if="timeRemaining < 60" class="flex items-center gap-1 mt-1 text-red-600 text-[10px] font-bold">
                                        <span class="material-symbols-outlined text-[12px]">warning</span>
                                        <span class="hidden md:inline">Waktunya menipis!</span>
                                    </div>
                                </div>

                                <!-- Tombol Daftar Soal (mobile only) -->
                                <button
                                    @click="showSoalModal = true"
                                    class="lg:hidden px-3 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-1.5 text-sm">
                                    <span class="material-symbols-outlined text-[18px]">grid_view</span>
                                    <span class="text-xs">{{ answeredCount }}/{{ totalQuestions }}</span>
                                </button>

                                <!-- Tombol Selesai Ujian (desktop only) -->
                                <button
                                    @click="() => selesaiUjian()"
                                    :disabled="isSubmitting"
                                    class="hidden md:flex px-4 py-2 md:px-6 md:py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed items-center gap-2 text-sm md:text-base">
                                    <span class="material-symbols-outlined text-[18px]">check_circle</span>
                                    {{ isSubmitting ? 'Memproses...' : 'Selesai Ujian' }}
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Main Content Grid -->
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <!-- Soal Section (3 kolom) -->
                        <div class="lg:col-span-3 space-y-6">
                            <!-- Soal Card -->
                            <div v-if="currentQuestion" class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-sky-50">
                                <div class="mb-6">
                                    <!-- Progress Bar Section -->
                                    <div class="mb-5">
                                        <div class="flex items-center justify-between mb-2">
                                            <span class="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                                Soal {{ currentQuestionIndex + 1 }} dari {{ totalQuestions }}
                                            </span>
                                            <div class="flex items-center gap-3 text-xs">
                                                <span class="flex items-center gap-1 text-slate-500">
                                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
                                                    {{ answeredCount }} terjawab
                                                </span>
                                                <span class="flex items-center gap-1 text-slate-400">
                                                    <span class="inline-block w-2.5 h-2.5 rounded-full bg-slate-200"></span>
                                                    {{ unansweredCount }} belum
                                                </span>
                                                <span class="font-bold text-primary text-sm">
                                                    {{ Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100) }}%
                                                </span>
                                            </div>
                                        </div>
                                        <!-- Track progress (posisi soal) -->
                                        <div class="relative w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                                            <!-- Answered fill (berada di bawah) -->
                                            <div
                                                class="absolute inset-y-0 left-0 bg-secondary-container/60 rounded-full transition-all duration-500"
                                                :style="{ width: `${(answeredCount / totalQuestions) * 100}%` }">
                                            </div>
                                            <!-- Current position fill -->
                                            <div
                                                class="absolute inset-y-0 left-0 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                                                :class="[
                                                    ((currentQuestionIndex + 1) / totalQuestions) >= 0.75 ? 'bg-green-500' :
                                                    ((currentQuestionIndex + 1) / totalQuestions) >= 0.5  ? 'bg-primary' :
                                                    ((currentQuestionIndex + 1) / totalQuestions) >= 0.25 ? 'bg-yellow-500' : 'bg-slate-400'
                                                ]"
                                                :style="{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }">
                                                <span
                                                    v-if="((currentQuestionIndex + 1) / totalQuestions) * 100 > 15"
                                                    class="text-white text-[10px] font-black leading-none select-none">
                                                    {{ currentQuestionIndex + 1 }}/{{ totalQuestions }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="font-h3 text-h3 text-on-surface" v-html="currentQuestion.pertanyaan || '-'"></div>
                                    <img
                                        v-if="currentQuestion.gambar_soal"
                                        :src="currentQuestion.gambar_soal"
                                        alt="Gambar soal"
                                        class="mt-4 max-h-64 w-auto rounded-xl border border-slate-100 object-contain"
                                    />
                                </div>

                                <!-- Pilihan Jawaban -->
                                <div class="space-y-3 mb-8">
                                    <div
                                        v-for="option in ['A', 'B', 'C', 'D', 'E']"
                                        :key="option"
                                        @click="selectAnswer(option)"
                                        :class="[
                                            'p-4 rounded-2xl border-2 cursor-pointer transition-all',
                                            selectedAnswers[currentQuestion.id] === option
                                                ? 'border-primary bg-primary/5'
                                                : 'border-slate-200 hover:border-slate-300'
                                        ]">
                                        <div class="flex items-start gap-3">
                                            <div :class="[
                                                'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1',
                                                selectedAnswers[currentQuestion.id] === option
                                                    ? 'border-primary bg-primary text-white'
                                                    : 'border-slate-300'
                                            ]">
                                                <span v-if="selectedAnswers[currentQuestion.id] === option" class="material-symbols-outlined text-[14px]">check</span>
                                            </div>
                                            <div class="flex-1">
                                                <div class="flex items-center gap-2">
                                                    <p class="text-slate-700 text-sm">{{ currentQuestion[`opsi_${option.toLowerCase()}`] || '-' }}</p>
                                                    <span
                                                        v-if="savingAnswers[currentQuestion.id] && selectedAnswers[currentQuestion.id] === option"
                                                        class="inline-block w-3 h-3 border-2 border-slate-300 border-t-primary rounded-full animate-spin"
                                                    ></span>
                                                </div>
                                                <img
                                                    v-if="currentQuestion[`gambar_${option.toLowerCase()}`]"
                                                    :src="currentQuestion[`gambar_${option.toLowerCase()}`]"
                                                    :alt="`Gambar opsi ${option}`"
                                                    class="mt-2 max-h-40 w-auto rounded-lg border border-slate-100 object-contain"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Navigation Buttons -->
                                <div class="flex gap-3 pt-6 border-t border-slate-200">
                                    <!-- Tombol Sebelumnya -->
                                    <button
                                        @click="previousQuestion"
                                        :disabled="currentQuestionIndex === 0"
                                        class="px-3 md:px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        <span class="material-symbols-outlined text-[18px]">chevron_left</span>
                                        <span class="hidden md:inline">Sebelumnya</span>
                                        <span class="md:hidden text-xs">Back</span>
                                    </button>

                                    <!-- Desktop: Tombol Selanjutnya -->
                                    <button
                                        @click="nextQuestion"
                                        :disabled="currentQuestionIndex === totalQuestions - 1"
                                        class="hidden md:flex ml-auto px-6 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2">
                                        Selanjutnya
                                        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>

                                    <!-- Mobile: Tombol Selanjutnya (soal bukan terakhir) -->
                                    <button
                                        v-if="currentQuestionIndex < totalQuestions - 1"
                                        @click="nextQuestion"
                                        class="md:hidden ml-auto px-3 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                                        <span class="text-xs">Next</span>
                                        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>

                                    <!-- Mobile: Tombol Selesai Ujian (soal terakhir) -->
                                    <button
                                        v-if="currentQuestionIndex === totalQuestions - 1"
                                        @click="() => selesaiUjian()"
                                        :disabled="isSubmitting"
                                        class="md:hidden ml-auto px-3 py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
                                        <span class="material-symbols-outlined text-[18px]">check_circle</span>
                                        <span class="text-xs">{{ isSubmitting ? 'Proses' : 'Selesai' }}</span>
                                    </button>
                                </div>
                            </div>

                            <!-- No Questions Message -->
                            <div v-else class="bg-white rounded-3xl p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50 text-center">
                                <span class="material-symbols-outlined text-[64px] text-slate-300 block mb-4">quiz</span>
                                <p class="text-slate-500 text-lg">Belum ada soal untuk ujian ini.</p>
                            </div>
                        </div>

                        <!-- Sidebar: Daftar Soal (desktop only) -->
                        <div class="hidden lg:block lg:col-span-1">
                            <div class="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-sky-50 sticky top-28">
                                <h4 class="font-h3 text-h3 text-on-surface mb-4">Daftar Soal</h4>
                                <div class="grid grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
                                    <button
                                        v-for="(q, idx) in questions"
                                        :key="q.id"
                                        @click="goToQuestion(idx)"
                                        :class="[
                                            'aspect-square rounded-lg font-bold text-sm transition-all flex items-center justify-center',
                                            idx === currentQuestionIndex
                                                ? 'bg-primary text-white shadow-lg'
                                                : selectedAnswers[q.id]
                                                ? 'bg-secondary-container text-on-secondary-container'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        ]">
                                        {{ idx + 1 }}
                                    </button>
                                </div>

                                <!-- Legend -->
                                <div class="space-y-2 border-t border-slate-200 pt-4">
                                    <div class="flex items-center gap-2 text-xs">
                                        <div class="w-3 h-3 rounded bg-slate-100"></div>
                                        <span class="text-slate-600">Belum dijawab</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-xs">
                                        <div class="w-3 h-3 rounded bg-secondary-container"></div>
                                        <span class="text-slate-600">Sudah dijawab</span>
                                    </div>
                                    <div class="flex items-center gap-2 text-xs">
                                        <div class="w-3 h-3 rounded bg-primary"></div>
                                        <span class="text-slate-600">Soal aktif</span>
                                    </div>
                                </div>

                                <!-- Summary -->
                                <div class="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ringkasan</p>
                                    <div class="space-y-1 text-sm">
                                        <p class="text-slate-600"><span class="font-bold">{{ answeredCount }}</span>/{{ totalQuestions }} terjawab</p>
                                        <p class="text-slate-600"><span class="font-bold">{{ unansweredCount }}</span> belum dijawab</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Modal Daftar Soal (mobile) -->
                    <Teleport to="body">
                        <Transition name="modal-fade">
                            <div
                                v-if="showSoalModal"
                                class="fixed inset-0 z-[999] flex items-end justify-center bg-black/50 backdrop-blur-sm lg:hidden"
                                @click.self="showSoalModal = false">
                                <div class="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                                    <!-- Handle bar -->
                                    <div class="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-5"></div>

                                    <div class="flex items-center justify-between mb-4">
                                        <h4 class="font-h3 text-h3 text-on-surface">Daftar Soal</h4>
                                        <button @click="showSoalModal = false" class="p-1 text-slate-400 hover:text-slate-600">
                                            <span class="material-symbols-outlined">close</span>
                                        </button>
                                    </div>

                                    <!-- Ringkasan -->
                                    <div class="flex gap-3 mb-5">
                                        <div class="flex-1 p-3 bg-secondary-container/20 rounded-2xl text-center">
                                            <p class="text-xl font-black text-on-surface">{{ answeredCount }}</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Terjawab</p>
                                        </div>
                                        <div class="flex-1 p-3 bg-slate-100 rounded-2xl text-center">
                                            <p class="text-xl font-black text-on-surface">{{ unansweredCount }}</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Belum dijawab</p>
                                        </div>
                                    </div>

                                    <!-- Grid nomor soal -->
                                    <div class="grid grid-cols-6 gap-2 mb-5">
                                        <button
                                            v-for="(q, idx) in questions"
                                            :key="q.id"
                                            @click="goToQuestion(idx); showSoalModal = false"
                                            :class="[
                                                'aspect-square rounded-xl font-bold text-sm transition-all flex items-center justify-center',
                                                idx === currentQuestionIndex
                                                    ? 'bg-primary text-white shadow-lg ring-2 ring-primary/30'
                                                    : selectedAnswers[q.id]
                                                    ? 'bg-secondary-container text-on-secondary-container'
                                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            ]">
                                            {{ idx + 1 }}
                                        </button>
                                    </div>

                                    <!-- Legend -->
                                    <div class="flex gap-4 text-xs border-t border-slate-100 pt-4">
                                        <div class="flex items-center gap-1.5">
                                            <div class="w-3 h-3 rounded bg-slate-100"></div>
                                            <span class="text-slate-500">Belum dijawab</span>
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <div class="w-3 h-3 rounded bg-secondary-container"></div>
                                            <span class="text-slate-500">Sudah dijawab</span>
                                        </div>
                                        <div class="flex items-center gap-1.5">
                                            <div class="w-3 h-3 rounded bg-primary"></div>
                                            <span class="text-slate-500">Aktif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </Teleport>
                </template>

            </div>
        </main>
    </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}
.modal-fade-enter-active > div,
.modal-fade-leave-active > div {
    transition: transform 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from > div,
.modal-fade-leave-to > div {
    transform: translateY(100%);
}
</style>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'
import { jawabanService } from '@/services/jawabanService'
import { nilaiService } from '@/services/nilaiService'
import { soalService } from '@/services/soalService'
import { jadwalService } from '@/services/jadwalService'

const route = useRoute()
const router = useRouter()
const { $alert, $confirm } = useDialog()

const nilaiData = ref(null)
const questions = ref([])
const selectedAnswers = ref({})
const jawabanRecords = ref({}) // Map: id_soal -> jawaban record (dengan id, untuk update)
const currentQuestionIndex = ref(0)
const isLoading = ref(false)
const error = ref(null)
const isSubmitting = ref(false)
const timeRemaining = ref(0)
const timerInterval = ref(null)
const savingAnswers = ref({})
const saveError = ref(null)
const showSoalModal = ref(false)

let jadwal = history.state?.jadwal || null
const nilai = history.state?.nilai

// Guard: kalau user refresh halaman, history.state hilang
if (!nilai?.id) {
  router.replace({
    name: 'peserta.ujian.detail',
    params: { id: route.params.id },
  })
}

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || null)
const totalQuestions = computed(() => questions.value.length)
const answeredCount = computed(() => Object.keys(selectedAnswers.value).length)
const unansweredCount = computed(() => totalQuestions.value - answeredCount.value)

function formatTime(seconds) {
    // Handle negative atau 0
    if (seconds <= 0) {
        return '00:00:00'
    }

    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

async function selectAnswer(option) {
    if (!currentQuestion.value) return
    const soalId = currentQuestion.value.id

    // Update UI dulu (optimistic update)
    selectedAnswers.value[soalId] = option

    // Auto-save ke backend
    savingAnswers.value[soalId] = true
    saveError.value = null

    try {
        const payload = {
            id_nilai: nilai.id,
            id_soal: soalId,
            jawaban: option,
        }

        // Cek apakah jawaban sudah pernah dijawab sebelumnya
        const jawabanRecord = jawabanRecords.value[soalId]

        if (jawabanRecord?.id) {
            // Jawaban sudah ada, gunakan PUT untuk update
            const updatePayload = {
                ...jawabanRecord,
                id_peserta: jawabanRecord.id_peserta || nilai.id_peserta,
                jawaban: option,
            }
            await jawabanService.updateJawaban(jawabanRecord.id, updatePayload)
        } else {
            // Jawaban baru, coba POST
            // Jika gagal karena sudah ada, lakukan retry dengan PUT
            try {
                await jawabanService.submitJawaban(payload)
                // Jika POST berhasil, store jawaban record (dari response atau generate)
                // Untuk sekarang, kita tidak tahu ID, akan update saat fetch ulang
            } catch (postErr) {
                // Jika POST gagal karena sudah ada, retry dengan PUT
                if (postErr.response?.status === 400 && postErr.response?.data?.message?.includes('sudah ada')) {
                    // Fetch ulang jawaban untuk dapat ID
                    const response = await jawabanService.getSoalByNilaiId(nilai.id)
                    const data = response.data || []

                    // Cari jawaban record yang baru ditemukan
                    const foundRecord = data.find(item => item.id_soal === soalId)
                    if (foundRecord) {
                        jawabanRecords.value[soalId] = {
                            id: foundRecord.id,
                            id_nilai: foundRecord.id_nilai,
                            id_soal: foundRecord.id_soal,
                            id_peserta: foundRecord.id_peserta,
                            no_urut: foundRecord.no_urut,
                        }

                        // Retry dengan PUT
                        const updatePayload = {
                            id_nilai: foundRecord.id_nilai,
                            id_soal: foundRecord.id_soal,
                            id_peserta: foundRecord.id_peserta,
                            no_urut: foundRecord.no_urut,
                            jawaban: option,
                        }
                        await jawabanService.updateJawaban(foundRecord.id, updatePayload)
                    } else {
                        throw postErr
                    }
                } else {
                    throw postErr
                }
            }
        }
    } catch (err) {
        saveError.value = `Gagal menyimpan jawaban: ${err.response?.data?.message || err.message}`
    } finally {
        savingAnswers.value[soalId] = false
    }
}

function previousQuestion() {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
    }
}

function nextQuestion() {
    if (currentQuestionIndex.value < totalQuestions.value - 1) {
        currentQuestionIndex.value++
    }
}

function goToQuestion(index) {
    currentQuestionIndex.value = index
}

function toLocalString(date) {
    return new Date(date).toLocaleString('sv-SE').replace('T', ' ')
}

async function selesaiUjian(force = false) {
    if (isSubmitting.value) return

    if (!force) {
        const msg = unansweredCount.value > 0
            ? `Masih ada ${unansweredCount.value} soal yang belum dijawab. Yakin ingin menyelesaikan ujian?`
            : 'Yakin ingin menyelesaikan ujian?'
        const ok = await $confirm(msg, {
            title: 'Selesaikan Ujian',
            checkboxLabel: 'Saya yakin ingin menyelesaikan ujian dan tidak dapat mengubah jawaban setelahnya.',
        })
        if (!ok) return
    }

    isSubmitting.value = true

    try {
        const now = toLocalString(new Date())
        await nilaiService.selesaiUjian(nilai.id, {
            aktivitas_terakhir: now,
            wkt_selesai: now,
        })

        if (timerInterval.value) clearInterval(timerInterval.value)

        await $alert('Ujian Anda telah selesai! Terima kasih.', { title: 'Ujian Selesai', type: 'success' })
        router.push({ name: 'dashboard.home' })
    } catch (err) {
        const message = err.response?.data?.message || err.message
        await $alert(`Gagal menyelesaikan ujian: ${message}`, { title: 'Gagal', type: 'error' })
    } finally {
        isSubmitting.value = false
    }
}

function initializeTimer() {
    const durasi = jadwal?.durasi
    if (!durasi) {
        console.warn('Durasi tidak ditemukan. Isi jadwal:', JSON.stringify(jadwal))
        return
    }

    // Hitung waktu selesai berdasarkan wkt_mulai dari nilai + durasi jadwal.
    // Dengan ini timer tetap akurat meski peserta crash/refresh/login ulang.
    const wktMulai = nilai?.wkt_mulai
    const endTimeMs = wktMulai
        ? new Date(wktMulai).getTime() + Number(durasi) * 60 * 1000
        : Date.now() + Number(durasi) * 60 * 1000

    const calcRemaining = () => Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000))

    timeRemaining.value = calcRemaining()

    if (timeRemaining.value <= 0) {
        selesaiUjian(true)
        return
    }

    timerInterval.value = setInterval(() => {
        timeRemaining.value = calcRemaining()

        if (timeRemaining.value <= 0) {
            clearInterval(timerInterval.value)
            selesaiUjian(true)
        }
    }, 1000)
}

onMounted(async () => {
    isLoading.value = true
    error.value = null

    // Pastikan jadwal tersedia; fallback ke API jika history.state kosong
    if (!jadwal?.durasi) {
        try {
            const res = await jadwalService.getJadwalById(route.params.id)
            jadwal = res.data
        } catch (e) {
            console.warn('Gagal memuat jadwal untuk timer:', e)
        }
    }

    initializeTimer()

    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {})
    }

    try {
        nilaiData.value = nilai || {}

        // Panggil endpoint untuk ambil soal + jawaban yang sudah dipilih
        const response = await jawabanService.getSoalByNilaiId(nilai.id)
        const data = response.data || []

        // Fetch soal details (untuk mendapatkan opsi A-E) secara parallel
        const soalDetailPromises = data.map(item =>
            soalService.getSoalById(item.id_soal)
                .then(res => ({
                    ...item,
                    soalDetail: res.data
                }))
                .catch(() => item)
        )
        const dataWithDetails = await Promise.all(soalDetailPromises)

        // Transform ke format yang dipakai di template
        questions.value = dataWithDetails.map(item => ({
            id: item.id_soal,
            no_soal: item.no_soal,
            pertanyaan: item.soalDetail?.soal || item.soal,
            opsi_a: item.soalDetail?.opsi_a || '',
            opsi_b: item.soalDetail?.opsi_b || '',
            opsi_c: item.soalDetail?.opsi_c || '',
            opsi_d: item.soalDetail?.opsi_d || '',
            opsi_e: item.soalDetail?.opsi_e || '',
            gambar_soal: item.soalDetail?.gambar_soal || null,
            gambar_a: item.soalDetail?.gambar_a || null,
            gambar_b: item.soalDetail?.gambar_b || null,
            gambar_c: item.soalDetail?.gambar_c || null,
            gambar_d: item.soalDetail?.gambar_d || null,
            gambar_e: item.soalDetail?.gambar_e || null,
        }))

        // Restore jawaban yang sudah pernah dipilih dan store jawaban record untuk update
        data.forEach(item => {
            if (item.jawaban) {
                selectedAnswers.value[item.id_soal] = item.jawaban
            }
            jawabanRecords.value[item.id_soal] = {
                id: item.id,
                id_nilai: item.id_nilai,
                id_soal: item.id_soal,
                id_peserta: item.id_peserta,
                no_urut: item.no_urut,
            }
        })
    } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Gagal memuat soal ujian'
    } finally {
        isLoading.value = false
    }
})

onBeforeUnmount(() => {
    if (timerInterval.value) {
        clearInterval(timerInterval.value)
    }
    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
    }
})
</script>
