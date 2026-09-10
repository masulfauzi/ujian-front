<template>
    <div class="bg-surface min-h-screen">
        <!-- User Info & Logout (Top Right) -->
        <div class="fixed top-6 right-6 z-40 flex items-center gap-4 bg-white rounded-2xl px-6 py-3 shadow-lg border border-slate-100">
            <div class="text-right">
                <p class="text-sm font-semibold text-slate-800">{{ authStore.displayName }}</p>
                <p class="text-xs text-slate-500">Peserta Ujian</p>
            </div>
            <button
                @click="handleLogout"
                :disabled="isLoggingOut"
                class="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 text-sm">
                <span class="material-symbols-outlined text-[18px]">logout</span>
                <span class="hidden md:inline">{{ isLoggingOut ? 'Keluar...' : 'Keluar' }}</span>
            </button>
        </div>

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
                                    <span class="text-xs">{{ globalAnsweredCount }}/{{ globalTotalQuestions }}</span>
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
                                    <!-- Section Badge -->
                                    <div v-if="usesSections && viewingSection" class="flex items-center gap-2 mb-4 flex-wrap">
                                        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                            <span class="material-symbols-outlined text-[14px]">bookmark</span>
                                            Section {{ viewingSection.urutan }}/{{ sections.length }}: {{ viewingSection.nama_section }}
                                        </span>
                                        <span v-if="!isViewingFrontier" class="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                                            Meninjau ulang
                                        </span>
                                    </div>

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
                                    <div class="font-h3 text-h3 text-on-surface prose prose-sm max-w-none" v-html="currentQuestion.pertanyaan || '-'"></div>
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
                                                    <div class="text-slate-700 text-sm prose prose-sm max-w-none" v-html="currentQuestion[`opsi_${option.toLowerCase()}`] || '-'"></div>
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

                                <!-- Section Advance Error -->
                                <div v-if="sectionAdvanceError" class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]">schedule</span>
                                    {{ sectionAdvanceError }}
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

                                    <!-- Desktop: Tombol Lanjut ke Section Berikutnya -->
                                    <button
                                        v-if="showNextSectionButton"
                                        @click="handleNextSectionClick"
                                        :disabled="isAdvancingSection || (isViewingFrontier && sectionCountdown > 0)"
                                        class="hidden md:flex ml-auto px-6 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2">
                                        <template v-if="isViewingFrontier && sectionCountdown > 0">
                                            <span class="material-symbols-outlined text-[18px]">lock_clock</span>
                                            Tunggu {{ formatCountdown(sectionCountdown) }}
                                        </template>
                                        <template v-else>
                                            {{ isAdvancingSection ? 'Memproses...' : 'Lanjut ke Section Berikutnya' }}
                                            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                        </template>
                                    </button>

                                    <!-- Desktop: Tombol Selanjutnya -->
                                    <button
                                        v-else
                                        @click="nextQuestion"
                                        :disabled="currentQuestionIndex === totalQuestions - 1"
                                        class="hidden md:flex ml-auto px-6 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2">
                                        Selanjutnya
                                        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>

                                    <!-- Mobile: Tombol Selanjutnya (soal bukan terakhir dalam section) -->
                                    <button
                                        v-if="currentQuestionIndex < totalQuestions - 1"
                                        @click="nextQuestion"
                                        class="md:hidden ml-auto px-3 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors flex items-center gap-2">
                                        <span class="text-xs">Next</span>
                                        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>

                                    <!-- Mobile: Tombol Lanjut ke Section Berikutnya -->
                                    <button
                                        v-else-if="showNextSectionButton"
                                        @click="handleNextSectionClick"
                                        :disabled="isAdvancingSection || (isViewingFrontier && sectionCountdown > 0)"
                                        class="md:hidden ml-auto px-3 py-3 bg-primary-container hover:bg-primary text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        <template v-if="isViewingFrontier && sectionCountdown > 0">
                                            <span class="text-xs">{{ formatCountdown(sectionCountdown) }}</span>
                                        </template>
                                        <template v-else>
                                            <span class="text-xs">{{ isAdvancingSection ? 'Proses' : 'Lanjut' }}</span>
                                        </template>
                                        <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                                    </button>

                                    <!-- Mobile: Tombol Selesai Ujian (soal terakhir, section terakhir) -->
                                    <button
                                        v-else
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

                                <!-- Grouped by Section -->
                                <template v-if="usesSections">
                                    <div v-for="(sec, sIdx) in sections" :key="sec.id" class="mb-4">
                                        <div class="flex items-center justify-between mb-2">
                                            <p class="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">
                                                {{ sec.urutan }}. {{ sec.nama_section }}
                                            </p>
                                            <span v-if="sec.urutan > frontierUrutan" class="flex items-center gap-1 text-[10px] text-slate-400 font-bold shrink-0">
                                                <span class="material-symbols-outlined text-[13px]">lock</span>
                                            </span>
                                        </div>
                                        <div v-if="sec.urutan <= frontierUrutan" class="grid grid-cols-5 gap-2">
                                            <button
                                                v-for="(q, qIdx) in (sectionQuestionsMap[sec.id] || [])"
                                                :key="q.id"
                                                @click="viewSectionQuestion(sIdx, qIdx)"
                                                :class="[
                                                    'aspect-square rounded-lg font-bold text-sm transition-all flex items-center justify-center',
                                                    sIdx === viewingSectionIndex && qIdx === currentQuestionIndex
                                                        ? 'bg-primary text-white shadow-lg'
                                                        : selectedAnswers[q.id]
                                                        ? 'bg-secondary-container text-on-secondary-container'
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                ]">
                                                {{ q.no_soal ?? (qIdx + 1) }}
                                            </button>
                                        </div>
                                        <p v-else class="text-xs text-slate-400 italic px-1">
                                            {{ sec.jml_soal }} soal &mdash; selesaikan section saat ini untuk membuka
                                        </p>
                                    </div>
                                </template>

                                <!-- Flat list (tanpa section) -->
                                <div v-else class="grid grid-cols-4 lg:grid-cols-5 gap-2 mb-6">
                                    <button
                                        v-for="(q, idx) in displayedQuestions"
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
                                    <div v-if="usesSections" class="flex items-center gap-2 text-xs">
                                        <span class="material-symbols-outlined text-[14px] text-slate-400">lock</span>
                                        <span class="text-slate-600">Section terkunci</span>
                                    </div>
                                </div>

                                <!-- Summary -->
                                <div class="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                    <p class="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ringkasan</p>
                                    <div class="space-y-1 text-sm">
                                        <p class="text-slate-600"><span class="font-bold">{{ globalAnsweredCount }}</span>/{{ globalTotalQuestions }} terjawab</p>
                                        <p class="text-slate-600"><span class="font-bold">{{ globalUnansweredCount }}</span> belum dijawab</p>
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
                                            <p class="text-xl font-black text-on-surface">{{ globalAnsweredCount }}</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Terjawab</p>
                                        </div>
                                        <div class="flex-1 p-3 bg-slate-100 rounded-2xl text-center">
                                            <p class="text-xl font-black text-on-surface">{{ globalUnansweredCount }}</p>
                                            <p class="text-xs text-slate-500 mt-0.5">Belum dijawab</p>
                                        </div>
                                    </div>

                                    <!-- Grouped by Section -->
                                    <template v-if="usesSections">
                                        <div v-for="(sec, sIdx) in sections" :key="sec.id" class="mb-4">
                                            <div class="flex items-center justify-between mb-2">
                                                <p class="text-xs font-bold text-slate-500 uppercase tracking-widest truncate">
                                                    {{ sec.urutan }}. {{ sec.nama_section }}
                                                </p>
                                                <span v-if="sec.urutan > frontierUrutan" class="flex items-center gap-1 text-[10px] text-slate-400 font-bold shrink-0">
                                                    <span class="material-symbols-outlined text-[13px]">lock</span>
                                                </span>
                                            </div>
                                            <div v-if="sec.urutan <= frontierUrutan" class="grid grid-cols-6 gap-2 mb-1">
                                                <button
                                                    v-for="(q, qIdx) in (sectionQuestionsMap[sec.id] || [])"
                                                    :key="q.id"
                                                    @click="viewSectionQuestion(sIdx, qIdx); showSoalModal = false"
                                                    :class="[
                                                        'aspect-square rounded-xl font-bold text-sm transition-all flex items-center justify-center',
                                                        sIdx === viewingSectionIndex && qIdx === currentQuestionIndex
                                                            ? 'bg-primary text-white shadow-lg ring-2 ring-primary/30'
                                                            : selectedAnswers[q.id]
                                                            ? 'bg-secondary-container text-on-secondary-container'
                                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    ]">
                                                    {{ q.no_soal ?? (qIdx + 1) }}
                                                </button>
                                            </div>
                                            <p v-else class="text-xs text-slate-400 italic px-1">
                                                {{ sec.jml_soal }} soal &mdash; terkunci
                                            </p>
                                        </div>
                                    </template>

                                    <!-- Grid nomor soal (tanpa section) -->
                                    <div v-else class="grid grid-cols-6 gap-2 mb-5">
                                        <button
                                            v-for="(q, idx) in displayedQuestions"
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
import { useAuthStore } from '@/stores/auth'
import { jawabanService } from '@/services/jawabanService'
import { nilaiService } from '@/services/nilaiService'
import { soalService } from '@/services/soalService'
import { jadwalService } from '@/services/jadwalService'
import { sectionService } from '@/services/sectionService'

const route = useRoute()
const router = useRouter()
const { $alert, $confirm } = useDialog()
const authStore = useAuthStore()

const nilaiData = ref(null)
const questions = ref([]) // dipakai saat ujian TIDAK memakai section
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
const isLoggingOut = ref(false)

// --- State khusus fitur Section ---
const sections = ref([]) // daftar SectionResponse jadwal ini, urut berdasarkan urutan
const sectionStatus = ref(null) // SectionProgressResponse dari section aktif (frontier) peserta
const viewingSectionIndex = ref(0) // index section yang sedang ditampilkan (bisa <= frontier)
const sectionQuestionsMap = ref({}) // Map: id_section -> array soal (sudah ditransform)
const sectionAdvanceError = ref(null)
const isAdvancingSection = ref(false)
const sectionCountdown = ref(0)
const sectionCountdownInterval = ref(null)

let jadwal = history.state?.jadwal || null
const nilai = history.state?.nilai

// Guard: kalau user refresh halaman, history.state hilang
if (!nilai?.id) {
  router.replace({
    name: 'peserta.ujian.detail',
    params: { id: route.params.id },
  })
}

const usesSections = computed(() => sections.value.length > 0)
const viewingSection = computed(() => sections.value[viewingSectionIndex.value] || null)
const frontierUrutan = computed(() => sectionStatus.value?.urutan ?? sections.value[0]?.urutan ?? 1)
const isViewingFrontier = computed(() => usesSections.value && viewingSection.value?.id === sectionStatus.value?.id_section)
const isLastSectionInView = computed(() => !usesSections.value || (viewingSection.value && viewingSection.value.urutan >= sections.value.length))

// Set soal yang sedang ditampilkan: soal section aktif (jika pakai section) atau seluruh soal
const displayedQuestions = computed(() => {
    if (!usesSections.value) return questions.value
    return sectionQuestionsMap.value[viewingSection.value?.id] || []
})

const currentQuestion = computed(() => displayedQuestions.value[currentQuestionIndex.value] || null)
const totalQuestions = computed(() => displayedQuestions.value.length)
const answeredCount = computed(() => displayedQuestions.value.filter(q => selectedAnswers.value[q.id]).length)
const unansweredCount = computed(() => totalQuestions.value - answeredCount.value)

// Ringkasan global (seluruh section, dipakai di sidebar & modal)
const globalTotalQuestions = computed(() => {
    if (!usesSections.value) return totalQuestions.value
    return sections.value.reduce((sum, s) => sum + (s.jml_soal || 0), 0)
})
const globalAnsweredCount = computed(() => {
    if (!usesSections.value) return answeredCount.value
    return Object.keys(selectedAnswers.value).length
})
const globalUnansweredCount = computed(() => globalTotalQuestions.value - globalAnsweredCount.value)

const showNextSectionButton = computed(() =>
    usesSections.value &&
    currentQuestionIndex.value === totalQuestions.value - 1 &&
    !isLastSectionInView.value
)

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

function formatCountdown(seconds) {
    if (seconds <= 0) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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

// Ubah tampilan ke section+soal tertentu. Hanya berhasil jika section itu sudah terbuka (urutan <= frontier).
async function viewSectionQuestion(sectionIndex, questionIndex) {
    const sec = sections.value[sectionIndex]
    if (!sec || sec.urutan > frontierUrutan.value) return

    if (!sectionQuestionsMap.value[sec.id]) {
        try {
            await fetchSectionQuestions(sec)
        } catch (err) {
            saveError.value = err.response?.data?.message || err.message || 'Gagal memuat soal section'
            return
        }
    }

    viewingSectionIndex.value = sectionIndex
    currentQuestionIndex.value = questionIndex
}

// Tombol "Lanjut ke Section Berikutnya": jika sedang meninjau section lama, cukup pindah tampilan
// (section berikutnya sudah pasti terbuka). Jika sedang di section aktif (frontier), harus lewat API
// agar backend yang memvalidasi durasi_menit_minimal.
async function handleNextSectionClick() {
    if (!isViewingFrontier.value) {
        await viewSectionQuestion(viewingSectionIndex.value + 1, 0)
        return
    }
    await advanceSection()
}

async function enrichAndTransformQuestions(data) {
    // Fetch detail soal (opsi & gambar lengkap) secara parallel
    const soalDetailPromises = data.map(item =>
        soalService.getSoalById(item.id_soal)
            .then(res => ({ ...item, soalDetail: res.data }))
            .catch(() => item)
    )
    const dataWithDetails = await Promise.all(soalDetailPromises)

    return dataWithDetails.map(item => ({
        id: item.id_soal,
        no_soal: item.no_soal,
        no_urut: item.no_urut,
        pertanyaan: item.soalDetail?.soal || item.soal,
        opsi_a: item.soalDetail?.opsi_a || item.opsi_a || '',
        opsi_b: item.soalDetail?.opsi_b || item.opsi_b || '',
        opsi_c: item.soalDetail?.opsi_c || item.opsi_c || '',
        opsi_d: item.soalDetail?.opsi_d || item.opsi_d || '',
        opsi_e: item.soalDetail?.opsi_e || item.opsi_e || '',
        gambar_soal: item.soalDetail?.gambar_soal || null,
        gambar_a: item.soalDetail?.gambar_a || item.gambar_a || null,
        gambar_b: item.soalDetail?.gambar_b || item.gambar_b || null,
        gambar_c: item.soalDetail?.gambar_c || item.gambar_c || null,
        gambar_d: item.soalDetail?.gambar_d || item.gambar_d || null,
        gambar_e: item.soalDetail?.gambar_e || item.gambar_e || null,
    }))
}

function mergeAnswerRecords(data) {
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
}

async function fetchSectionQuestions(section) {
    if (sectionQuestionsMap.value[section.id]) {
        return sectionQuestionsMap.value[section.id]
    }
    const response = await jawabanService.getSoalByNilaiIdAndSection(nilai.id, section.id)
    const data = response.data || []
    const transformed = await enrichAndTransformQuestions(data)
    mergeAnswerRecords(data)
    sectionQuestionsMap.value = { ...sectionQuestionsMap.value, [section.id]: transformed }
    return transformed
}

function restartSectionCountdown() {
    if (sectionCountdownInterval.value) {
        clearInterval(sectionCountdownInterval.value)
        sectionCountdownInterval.value = null
    }
    if (!sectionStatus.value || sectionStatus.value.boleh_lanjut || sectionStatus.value.is_section_terakhir) {
        sectionCountdown.value = 0
        return
    }

    const endTimeMs = Date.now() + Math.max(0, sectionStatus.value.sisa_detik || 0) * 1000
    const calcRemaining = () => Math.max(0, Math.floor((endTimeMs - Date.now()) / 1000))

    sectionCountdown.value = calcRemaining()
    sectionCountdownInterval.value = setInterval(() => {
        sectionCountdown.value = calcRemaining()
        if (sectionCountdown.value <= 0) {
            clearInterval(sectionCountdownInterval.value)
            sectionCountdownInterval.value = null
        }
    }, 1000)
}

async function advanceSection() {
    if (isAdvancingSection.value) return
    isAdvancingSection.value = true
    sectionAdvanceError.value = null

    try {
        const response = await nilaiService.nextSection(nilai.id)
        const data = response.data
        sectionStatus.value = data

        if (data.boleh_lanjut) {
            const newIndex = sections.value.findIndex(s => s.id === data.id_section)
            if (newIndex !== -1) {
                await fetchSectionQuestions(sections.value[newIndex])
                viewingSectionIndex.value = newIndex
                currentQuestionIndex.value = 0
            }
            restartSectionCountdown()
        } else {
            sectionAdvanceError.value = `Belum bisa lanjut ke section berikutnya. Tunggu ${formatCountdown(data.sisa_detik)} lagi.`
            restartSectionCountdown()
        }
    } catch (err) {
        sectionAdvanceError.value = err.response?.data?.message || err.message || 'Gagal lanjut ke section berikutnya'
    } finally {
        isAdvancingSection.value = false
    }
}

function toLocalString(date) {
    return new Date(date).toLocaleString('sv-SE').replace('T', ' ')
}

async function handleLogout() {
    if (isLoggingOut.value) return

    const ok = await $confirm('Anda akan keluar dari sesi ujian. Apakah Anda yakin?', {
        title: 'Konfirmasi Keluar',
    })
    if (!ok) return

    isLoggingOut.value = true
    try {
        if (timerInterval.value) clearInterval(timerInterval.value)
        if (sectionCountdownInterval.value) clearInterval(sectionCountdownInterval.value)
        if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
            document.exitFullscreen().catch(() => {})
        }

        authStore.logout()
        router.push({ name: 'login' })
    } catch (err) {
        console.error('Error during logout:', err)
    } finally {
        isLoggingOut.value = false
    }
}

async function selesaiUjian(force = false) {
    if (isSubmitting.value) return

    if (!force) {
        const msg = globalUnansweredCount.value > 0
            ? `Masih ada ${globalUnansweredCount.value} soal yang belum dijawab. Yakin ingin menyelesaikan ujian?`
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
        if (sectionCountdownInterval.value) clearInterval(sectionCountdownInterval.value)

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

    const el = document.documentElement
    if (!document.fullscreenElement && typeof el.requestFullscreen === 'function') {
        el.requestFullscreen().catch(() => {})
    }

    try {
        nilaiData.value = nilai || {}

        // Cek apakah jadwal ini memakai pembagian section
        let sectionsData = []
        try {
            const sectionsRes = await sectionService.getSectionsByJadwal(route.params.id)
            sectionsData = sectionsRes.data || []
        } catch (e) {
            console.warn('Gagal memuat data section, lanjut tanpa section:', e)
        }
        sections.value = sectionsData.slice().sort((a, b) => a.urutan - b.urutan)

        if (sections.value.length > 0) {
            // Mode section: ambil status section aktif (frontier), lalu preload semua section yang sudah terbuka
            const statusRes = await nilaiService.getSectionStatus(nilai.id)
            sectionStatus.value = statusRes.data

            const frontierIndex = Math.max(0, sections.value.findIndex(s => s.id === sectionStatus.value.id_section))
            const sectionsToPreload = sections.value.slice(0, frontierIndex + 1)
            await Promise.all(sectionsToPreload.map(sec => fetchSectionQuestions(sec).catch(() => {})))

            viewingSectionIndex.value = frontierIndex
            currentQuestionIndex.value = 0
            restartSectionCountdown()
        } else {
            // Mode biasa (tanpa section): ambil seluruh soal ujian sekaligus
            const response = await jawabanService.getSoalByNilaiId(nilai.id)
            const data = response.data || []
            questions.value = await enrichAndTransformQuestions(data)
            mergeAnswerRecords(data)
        }
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
    if (sectionCountdownInterval.value) {
        clearInterval(sectionCountdownInterval.value)
    }
    if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
        document.exitFullscreen().catch(() => {})
    }
})
</script>
