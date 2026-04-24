<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const bankSoalId = computed(() => String(route.params.id ?? '1'))

const bankSoalTitleCatalog = {
    1: 'Matematika Wajib - Kelas 10',
    2: 'Fisika Dasar - Kelas 11',
    3: 'Bahasa Indonesia - Kelas 12',
    4: 'Sejarah Indonesia - Kelas 11',
    5: 'Biologi - Kelas 12',
}

const bankSoalTitle = computed(() => bankSoalTitleCatalog[bankSoalId.value] ?? 'Bank Soal')

const answerOptions = ['A', 'B', 'C', 'D', 'E']
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-5xl space-y-10">
                <div>
                    <nav
                        class="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        <RouterLink class="transition hover:text-sky-600" to="/bank-soal">Bank Soal</RouterLink>
                        <span>›</span>
                        <RouterLink class="transition hover:text-sky-600" :to="`/bank-soal/${bankSoalId}`">{{
                            bankSoalTitle }}</RouterLink>
                        <span>›</span>
                        <span class="text-sky-600">Tambah Soal</span>
                    </nav>

                    <RouterLink :to="`/bank-soal/${bankSoalId}`"
                        class="mb-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700">
                        <span>←</span>
                        <span>Kembali ke Detail Bank Soal</span>
                    </RouterLink>

                    <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Tambah Soal Baru</h1>
                    <p class="mt-2 text-sm text-slate-500 md:text-base">
                        Masukkan detail pertanyaan dan pilihan jawaban untuk mata pelajaran
                        <span class="font-semibold text-slate-700">{{ bankSoalTitle }}</span>.
                    </p>
                </div>

                <div
                    class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-[0_20px_40px_-12px_rgba(14,165,233,0.08)] md:p-10">
                    <form class="space-y-8" @submit.prevent>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between gap-3">
                                <label class="text-sm font-semibold text-slate-800" for="question">Detail
                                    Pertanyaan</label>
                                <button
                                    class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 transition hover:text-sky-700"
                                    type="button">
                                    <span>🖼️</span>
                                    <span>Upload Gambar Soal</span>
                                </button>
                            </div>
                            <textarea id="question" rows="5" placeholder="Tuliskan butir soal di sini..."
                                class="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"></textarea>
                        </div>

                        <div class="space-y-4">
                            <label class="block text-sm font-semibold text-slate-800">Pilihan Jawaban & Kunci</label>
                            <div class="space-y-3">
                                <div v-for="option in answerOptions" :key="option" class="flex items-center gap-3">
                                    <input :id="`key-${option}`"
                                        class="h-5 w-5 cursor-pointer border-slate-300 text-sky-600 focus:ring-sky-500"
                                        name="correct_answer" type="radio" :value="option" />
                                    <label :for="`key-${option}`" class="sr-only">Pilih kunci {{ option }}</label>
                                    <div
                                        class="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 p-1 transition focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
                                        <span
                                            class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-sm font-bold text-slate-400">{{
                                                option }}</span>
                                        <input :placeholder="`Masukkan jawaban ${option}`"
                                            class="w-full border-none bg-transparent text-sm focus:ring-0"
                                            type="text" />
                                        <button
                                            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-50 hover:text-sky-500"
                                            type="button">🖼️</button>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs italic text-slate-400">Klik radio di sisi kiri untuk menentukan kunci
                                jawaban benar.</p>
                        </div>

                        <div class="grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-xs font-bold uppercase tracking-wide text-slate-500"
                                    for="bobot">Bobot Nilai</label>
                                <input id="bobot"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-sky-500"
                                    max="100" min="1" type="number" value="1" />
                            </div>
                            <div class="space-y-2">
                                <label class="block text-xs font-bold uppercase tracking-wide text-slate-500"
                                    for="kategori">Kategori Soal</label>
                                <select id="kategori"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-sky-500 focus:ring-sky-500">
                                    <option>Mudah</option>
                                    <option selected>Sedang</option>
                                    <option>Sulit</option>
                                    <option>HOTS</option>
                                </select>
                            </div>
                        </div>

                        <div
                            class="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                            <RouterLink :to="`/bank-soal/${bankSoalId}`"
                                class="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                Batal
                            </RouterLink>
                            <button type="submit"
                                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-100 px-5 py-3 text-sm font-bold text-emerald-700 transition hover:brightness-95">
                                <span>💾</span>
                                <span>Simpan Soal</span>
                            </button>
                        </div>
                    </form>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <article class="rounded-3xl border border-sky-100 bg-sky-50 p-6">
                        <h3 class="mb-2 text-sm font-bold text-sky-900">Tips Pembuatan Soal</h3>
                        <p class="text-sm text-sky-700">Gunakan bahasa yang jelas dan tidak ambigu agar soal mudah
                            dipahami peserta.</p>
                    </article>
                    <article class="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
                        <h3 class="mb-2 text-sm font-bold text-emerald-900">Editor Matematika</h3>
                        <p class="text-sm text-emerald-700">Gunakan format rumus standar agar ekspresi matematika tetap
                            terbaca rapi.</p>
                    </article>
                    <article class="rounded-3xl border border-slate-200 bg-white p-6">
                        <h3 class="mb-2 text-sm font-bold text-slate-800">Auto Save</h3>
                        <p class="text-sm text-slate-600">Draft soal tersimpan sebagai data sementara selama sesi
                            pengisian berjalan.</p>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>
