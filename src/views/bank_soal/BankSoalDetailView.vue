<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const detailCatalog = {
    1: {
        title: 'Matematika Wajib - Kelas 10',
        description: 'Kelola kumpulan soal untuk persiapan ujian akhir semester ganjil.',
        totalQuestions: '45 Butir',
        lastUpdated: '12 Okt 2023',
        status: 'Terbit / Siap',
    },
    2: {
        title: 'Fisika Dasar - Kelas 11',
        description: 'Kumpulan soal konsep gaya, gerak, energi, dan penerapan dasar fisika.',
        totalQuestions: '36 Butir',
        lastUpdated: '22 Okt 2023',
        status: 'Terbit / Siap',
    },
    3: {
        title: 'Bahasa Indonesia - Kelas 12',
        description: 'Bank soal literasi bacaan, kaidah bahasa, dan penalaran teks.',
        totalQuestions: '40 Butir',
        lastUpdated: '18 Okt 2023',
        status: 'Draft',
    },
    4: {
        title: 'Sejarah Indonesia - Kelas 11',
        description: 'Soal kronologi, analisis peristiwa, dan tokoh penting sejarah nasional.',
        totalQuestions: '31 Butir',
        lastUpdated: '15 Okt 2023',
        status: 'Terbit / Siap',
    },
    5: {
        title: 'Biologi - Kelas 12',
        description: 'Materi sistem organ, genetika, ekologi, dan bioteknologi dasar.',
        totalQuestions: '38 Butir',
        lastUpdated: '12 Okt 2023',
        status: 'Review',
    },
}

const selectedDetail = computed(() => detailCatalog[route.params.id] ?? detailCatalog[1])

const questions = [
    {
        number: '01',
        text: 'Jika nilai dari 2log 8 + 3log 9 - 5log 125 = x, maka tentukan nilai x yang memenuhi persamaan tersebut adalah...',
        topic: 'Logaritma',
        answers: ['2', '3', '5', '8', '10'],
        correctIndex: 2,
        key: 'C',
    },
    {
        number: '02',
        text: 'Himpunan penyelesaian dari sistem persamaan linear x + 2y = 10 dan 2x - y = 5 adalah...',
        topic: 'Aljabar',
        answers: ['{4, 3}', '{3, 4}', '{5, 0}', '{2, 4}', '{0, 5}'],
        correctIndex: 0,
        key: 'A',
    },
]

const choiceLabels = ['A', 'B', 'C', 'D', 'E']

const statusClass = computed(() => {
    if (selectedDetail.value.status === 'Draft') {
        return 'bg-amber-100 text-amber-700'
    }

    if (selectedDetail.value.status === 'Review') {
        return 'bg-violet-100 text-violet-700'
    }

    return 'bg-emerald-100 text-emerald-700'
})
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-7xl space-y-8">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div class="space-y-1">
                        <RouterLink
                            class="mb-1 inline-flex items-center gap-2 text-sm font-medium text-sky-600 transition hover:text-sky-700"
                            to="/bank-soal">
                            <span>←</span>
                            <span>Kembali ke Daftar Bank Soal</span>
                        </RouterLink>
                        <h1 class="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{{ selectedDetail.title
                            }}</h1>
                        <p class="text-sm text-slate-500 md:text-base">{{ selectedDetail.description }}</p>
                    </div>
                    <button
                        class="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:brightness-95"
                        type="button">
                        <span>＋</span>
                        <span>Tambah Soal Baru</span>
                    </button>
                </div>

                <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl text-sky-600">
                            ❓</div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Total Soal</p>
                            <p class="text-2xl font-extrabold text-slate-900">{{ selectedDetail.totalQuestions }}</p>
                        </div>
                    </article>

                    <article class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
                            🕒</div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Terakhir Diperbarui
                            </p>
                            <p class="text-2xl font-extrabold text-slate-900">{{ selectedDetail.lastUpdated }}</p>
                        </div>
                    </article>

                    <article class="flex items-center gap-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div
                            class="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-2xl text-violet-600">
                            ✅</div>
                        <div>
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Status</p>
                            <span class="mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold"
                                :class="statusClass">{{ selectedDetail.status }}</span>
                        </div>
                    </article>
                </div>

                <div class="space-y-4">
                    <div class="flex items-center justify-between px-2">
                        <h2 class="text-2xl font-semibold text-slate-900">Daftar Pertanyaan</h2>
                        <div class="flex gap-2">
                            <button
                                class="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
                                type="button">⚙️</button>
                            <button
                                class="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50"
                                type="button">⇅</button>
                        </div>
                    </div>

                    <article v-for="question in questions" :key="question.number"
                        class="group rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:border-sky-200 hover:shadow-lg">
                        <div class="mb-4 flex items-start justify-between gap-4">
                            <div class="flex gap-4">
                                <div
                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-700">
                                    {{ question.number }}
                                </div>
                                <div class="space-y-2">
                                    <p class="text-base font-semibold leading-relaxed text-slate-800">{{ question.text
                                        }}</p>
                                    <span
                                        class="inline-flex rounded bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-sky-600">
                                        {{ question.topic }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <button class="rounded-lg p-2 text-sky-600 transition hover:bg-sky-50"
                                    type="button">✏️</button>
                                <button class="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                                    type="button">🗑️</button>
                            </div>
                        </div>

                        <div class="ml-0 grid grid-cols-1 gap-3 md:ml-14 md:grid-cols-2 lg:grid-cols-5">
                            <div v-for="(answer, answerIndex) in question.answers"
                                :key="`${question.number}-${answerIndex}`" :class="answerIndex === question.correctIndex
                                    ? 'border-sky-300 bg-sky-50 ring-1 ring-sky-200'
                                    : 'border-slate-100 bg-slate-50/50'" class="rounded-xl border p-3">
                                <span :class="answerIndex === question.correctIndex ? 'text-sky-700' : 'text-slate-400'"
                                    class="mr-2 text-xs font-bold">
                                    {{ choiceLabels[answerIndex] }}.
                                </span>
                                <span
                                    :class="answerIndex === question.correctIndex ? 'font-semibold text-sky-700' : 'text-slate-700'"
                                    class="text-sm">
                                    {{ answer }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="ml-0 mt-4 flex items-center gap-2 border-t border-dashed border-slate-100 pt-4 md:ml-14">
                            <span class="text-emerald-600">✔</span>
                            <span class="text-xs font-bold uppercase tracking-wide text-emerald-600">Kunci Jawaban: {{
                                question.key }}</span>
                        </div>
                    </article>
                </div>

                <div
                    class="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p class="text-sm text-slate-500">Menampilkan 2 dari {{ selectedDetail.totalQuestions }} pertanyaan
                    </p>
                    <div class="flex gap-2">
                        <button
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400"
                            type="button">‹</button>
                        <button
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-500 bg-sky-500 text-sm font-bold text-white"
                            type="button">1</button>
                        <button
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600"
                            type="button">2</button>
                        <button
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600"
                            type="button">3</button>
                        <button
                            class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
                            type="button">›</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>