<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const examCatalog = {
    1: {
        title: 'Matematika Dasar',
        subtitle: 'Kalkulus Dasar',
        timeRemaining: '45:00',
        totalQuestions: 50,
    },
    2: {
        title: 'Bahasa Indonesia',
        subtitle: 'Literasi Teks',
        timeRemaining: '60:00',
        totalQuestions: 45,
    },
    3: {
        title: 'Sejarah Modern',
        subtitle: 'Pemahaman Konteks',
        timeRemaining: '90:00',
        totalQuestions: 40,
    },
}

const examId = computed(() => Number(route.params.id))
const exam = computed(() => examCatalog[examId.value] ?? examCatalog[1])

const currentQuestion = ref(1)
const selectedOption = ref('B')
const showQuestionModal = ref(false)

const options = [
    { key: 'A', text: '2x cos(x²) + 3e^(3x)' },
    { key: 'B', text: 'cos(2x) + e^(3x)' },
    { key: 'C', text: '2x sin(x²) + 3e^(3x)' },
    { key: 'D', text: 'x² cos(x) + e^(3x)' },
]

const questionNumbers = computed(() =>
    Array.from({ length: exam.value.totalQuestions }, (_, index) => {
        const number = index + 1
        if (number === currentQuestion.value) {
            return { number, status: 'active' }
        }

        if (number <= 5) {
            return { number, status: 'answered' }
        }

        if (number === 6) {
            return { number, status: 'flagged' }
        }

        return { number, status: 'unvisited' }
    }),
)

const paletteItemClass = (status) => {
    if (status === 'active') {
        return 'bg-sky-100 text-sky-700 border-r-4 border-sky-500'
    }

    if (status === 'answered') {
        return 'bg-emerald-100 text-emerald-700'
    }

    if (status === 'flagged') {
        return 'bg-amber-100 text-amber-700 border border-amber-300'
    }

    return 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
}

const optionClass = (optionKey) => {
    if (selectedOption.value === optionKey) {
        return 'border-2 border-sky-500 bg-sky-50'
    }

    return 'border border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
}

const openQuestionModal = () => {
    showQuestionModal.value = true
}

const closeQuestionModal = () => {
    showQuestionModal.value = false
}

const goToQuestion = (questionNumber) => {
    currentQuestion.value = questionNumber
    showQuestionModal.value = false
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 text-slate-900">
        <header
            class="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
            <div class="flex items-center gap-3 md:gap-4">
                <h1 class="text-sm font-bold tracking-tight text-slate-900 md:text-lg">{{ exam.title }}</h1>
                <div class="hidden h-6 w-px bg-slate-200 md:block"></div>
                <p class="hidden text-sm font-medium text-slate-500 md:block">{{ exam.subtitle }}</p>
            </div>

            <div class="flex items-center gap-3 md:gap-4">
                <div
                    class="rounded-full border border-sky-100 bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-700">
                    {{ exam.timeRemaining }}
                </div>
                <button class="hidden rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white md:inline-flex">
                    Selesai Ujian
                </button>
            </div>
        </header>

        <div class="flex min-h-screen pt-16 pb-20">
            <aside class="hidden w-72 border-r border-slate-200 bg-slate-50 md:flex md:flex-col">
                <div class="border-b border-slate-200 p-6">
                    <h2 class="text-xl font-bold text-slate-900">Navigasi Soal</h2>
                    <p class="mt-1 text-xs font-semibold text-slate-500">{{ exam.totalQuestions }} Soal</p>
                </div>

                <div class="flex-1 overflow-y-auto p-4">
                    <div class="grid grid-cols-5 gap-2">
                        <button v-for="item in questionNumbers" :key="item.number"
                            class="aspect-square rounded-lg text-xs font-bold transition"
                            :class="paletteItemClass(item.status)">
                            {{ item.number }}
                        </button>
                    </div>
                </div>

                <div class="border-t border-slate-200 bg-white p-4">
                    <button
                        class="w-full rounded-xl border-2 border-amber-300 py-3 text-sm font-bold text-amber-700 transition hover:bg-amber-50">
                        Tandai untuk Review
                    </button>
                </div>
            </aside>

            <main class="flex-1 overflow-y-auto">
                <div class="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
                    <section class="mb-6 flex items-start justify-between gap-3 md:mb-8">
                        <div>
                            <span
                                class="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-700">
                                Soal {{ currentQuestion }} dari {{ exam.totalQuestions }}
                            </span>
                            <h2 class="mt-3 text-xl font-semibold text-slate-900 md:text-2xl">
                                Tentukan turunan fungsi berikut.
                            </h2>
                        </div>
                        <p class="hidden text-xs font-medium text-slate-500 md:block">Nilai: 4.0</p>
                    </section>

                    <section class="mb-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm md:mb-8 md:p-8">
                        <div class="mb-6 rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center md:mb-8">
                            <p class="text-2xl font-semibold italic text-slate-800">f(x) = sin(x²) + e^(3x)</p>
                        </div>

                        <div class="space-y-3 md:space-y-4">
                            <button v-for="option in options" :key="option.key"
                                class="flex w-full items-center gap-4 rounded-xl p-4 text-left transition active:scale-[0.99]"
                                :class="optionClass(option.key)" @click="selectedOption = option.key">
                                <div
                                    class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-700">
                                    {{ option.key }}
                                </div>
                                <p class="flex-1 text-sm font-medium text-slate-800 md:text-base">{{ option.text }}</p>
                            </button>
                        </div>
                    </section>

                    <section class="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:hidden">
                        <div class="mb-4 flex items-center justify-between">
                            <h3 class="text-sm font-semibold text-slate-700">Progress Soal</h3>
                            <span
                                class="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">12
                                / {{ exam.totalQuestions }}
                                terjawab</span>
                        </div>
                        <button
                            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
                            @click="openQuestionModal">
                            Lihat Semua Nomor Soal
                        </button>
                    </section>
                </div>
            </main>
        </div>

        <div v-if="showQuestionModal" class="fixed inset-0 z-50 bg-slate-900/40 p-4 md:hidden"
            @click="closeQuestionModal">
            <div class="mx-auto mt-20 max-w-sm rounded-2xl bg-white p-5 shadow-xl" @click.stop>
                <div class="mb-4 flex items-center justify-between">
                    <h3 class="text-sm font-bold text-slate-800">Semua Nomor Soal</h3>
                    <button class="rounded-lg px-2 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100"
                        @click="closeQuestionModal">
                        Tutup
                    </button>
                </div>

                <div class="max-h-[60vh] overflow-y-auto">
                    <div class="grid grid-cols-6 gap-2">
                        <button v-for="item in questionNumbers" :key="`modal-${item.number}`"
                            class="aspect-square rounded-md text-[11px] font-bold transition"
                            :class="paletteItemClass(item.status)" @click="goToQuestion(item.number)">
                            {{ item.number }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <nav
            class="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-between border-t border-slate-200 bg-white px-4 md:px-6">
            <button
                class="text-xs font-bold uppercase tracking-wide text-slate-500 transition hover:text-sky-600 md:text-sm">
                Sebelumnya
            </button>

            <button
                class="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-700 transition hover:bg-emerald-100 md:hidden">
                Selesai Ujian
            </button>

            <div class="hidden items-center gap-6 text-xs font-semibold uppercase tracking-wide text-slate-500 md:flex">
                <span class="inline-flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full bg-emerald-100"></span> Terjawab
                </span>
                <span class="inline-flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full border border-amber-300 bg-amber-100"></span> Ditandai
                </span>
                <span class="inline-flex items-center gap-2">
                    <span class="h-3 w-3 rounded-full border border-slate-300 bg-white"></span> Belum
                </span>
            </div>

            <button
                class="text-xs font-bold uppercase tracking-wide text-sky-600 transition hover:text-sky-700 md:text-sm">
                Selanjutnya
            </button>
        </nav>
    </div>
</template>
