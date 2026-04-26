<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const examCatalog = {
    1: {
        id: 1,
        category: 'Science & Tech',
        title: 'Matematika Dasar',
        dateTime: 'Senin, 14 Oktober 2024 • 09:00 - 11:00 WIB',
        duration: '120 menit',
        totalQuestions: '50 Soal',
        passingGrade: '75',
        type: 'Pilihan Ganda',
        supervisorName: 'Prof. Dr. Sarah Wijaya',
        supervisorDepartment: 'Departemen Matematika',
        availability: 'Terbuka (Hingga 11:00 WIB)',
    },
    2: {
        id: 2,
        category: 'Humanities',
        title: 'Bahasa Indonesia',
        dateTime: 'Senin, 14 Oktober 2024 • 13:00 - 15:00 WIB',
        duration: '120 menit',
        totalQuestions: '45 Soal',
        passingGrade: '75',
        type: 'Pilihan Ganda',
        supervisorName: 'Dr. Rina Maharani',
        supervisorDepartment: 'Departemen Bahasa',
        availability: 'Terjadwal (Mulai 13:00 WIB)',
    },
    3: {
        id: 3,
        category: 'Social Studies',
        title: 'Sejarah Modern',
        dateTime: 'Senin, 14 Oktober 2024 • 15:30 - 17:00 WIB',
        duration: '90 menit',
        totalQuestions: '40 Soal',
        passingGrade: '70',
        type: 'Pilihan Ganda',
        supervisorName: 'Dr. Arif Setiawan',
        supervisorDepartment: 'Departemen Sejarah',
        availability: 'Terjadwal (Mulai 15:30 WIB)',
    },
}

const examId = computed(() => Number(route.params.id))
const exam = computed(() => examCatalog[examId.value])

const instructions = [
    'Pastikan koneksi internet stabil sebelum menekan tombol mulai ujian.',
    'Jangan membuka tab atau aplikasi lain selama ujian berlangsung.',
    'Waktu ujian tetap berjalan walaupun halaman ujian tertutup.',
    'Klik Simpan & Selesai jika seluruh soal sudah dikerjakan.',
]
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto max-w-6xl">
                <div v-if="!exam" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                    <h1 class="text-xl font-bold text-rose-700">Data ujian tidak ditemukan</h1>
                    <RouterLink class="mt-3 inline-flex text-sm font-semibold text-sky-600 hover:underline" to="/ujian">
                        Kembali ke daftar ujian
                    </RouterLink>
                </div>

                <template v-else>
                    <nav
                        class="mb-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <RouterLink class="transition hover:text-sky-600" to="/ujian">Jadwal Ujian</RouterLink>
                        <span>›</span>
                        <span class="text-sky-600">Konfirmasi Ujian</span>
                    </nav>

                    <section class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div
                                class="mb-3 inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                {{ exam.category }}
                            </div>
                            <h1 class="text-4xl font-bold leading-tight text-slate-900">{{ exam.title }}</h1>
                            <p class="mt-2 text-sm text-slate-500">{{ exam.dateTime }}</p>
                        </div>

                        <button
                            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                            Unduh Kisi-kisi
                        </button>
                    </section>

                    <section class="mb-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <article class="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Durasi</p>
                            <p class="mt-2 text-2xl font-bold text-slate-900">{{ exam.duration }}</p>
                        </article>
                        <article class="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Jumlah Soal</p>
                            <p class="mt-2 text-2xl font-bold text-slate-900">{{ exam.totalQuestions }}</p>
                        </article>
                        <article class="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Passing Grade</p>
                            <p class="mt-2 text-2xl font-bold text-slate-900">{{ exam.passingGrade }}</p>
                        </article>
                        <article class="rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                            <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Tipe Ujian</p>
                            <p class="mt-2 text-2xl font-bold text-slate-900">{{ exam.type }}</p>
                        </article>
                    </section>

                    <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <article class="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
                            <h2 class="mb-6 text-2xl font-semibold text-slate-900">Instruksi Pengerjaan</h2>
                            <div class="space-y-4">
                                <div v-for="(instruction, index) in instructions" :key="instruction"
                                    class="flex gap-4 rounded-2xl border border-transparent p-4 transition hover:border-slate-100 hover:bg-slate-50">
                                    <div
                                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                                        {{ index + 1 }}
                                    </div>
                                    <p class="text-sm leading-relaxed text-slate-600">{{ instruction }}</p>
                                </div>
                            </div>
                        </article>

                        <div class="space-y-6">
                            <article
                                class="rounded-[2rem] bg-gradient-to-br from-sky-500 to-sky-700 p-8 text-white shadow-sm">
                                <h3 class="text-2xl font-bold">Sudah Siap?</h3>
                                <p class="mt-2 text-sm leading-relaxed text-sky-100">
                                    Persiapkan perangkat dan pastikan jaringan internet tetap stabil sebelum mulai
                                    ujian.
                                </p>
                                <div class="mt-6 rounded-xl border border-white/20 bg-white/10 p-3">
                                    <p class="text-xs font-bold uppercase tracking-wide">
                                        Ujian ini hanya dapat dilakukan satu kali.
                                    </p>
                                </div>
                            </article>

                            <article class="rounded-[2rem] border border-sky-100 bg-sky-50 p-6">
                                <p class="mb-4 text-sm font-bold text-slate-800">Pengawas Ujian</p>
                                <div class="space-y-1">
                                    <p class="text-sm font-semibold text-slate-900">{{ exam.supervisorName }}</p>
                                    <p class="text-xs text-slate-500">{{ exam.supervisorDepartment }}</p>
                                </div>
                            </article>
                        </div>
                    </section>

                    <section
                        class="mt-12 flex flex-col items-center justify-center gap-8 border-t border-slate-200 py-10 md:flex-row">
                        <div class="text-center md:text-left">
                            <p class="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">Status
                                Ketersediaan</p>
                            <div class="flex items-center justify-center gap-2 md:justify-start">
                                <span
                                    class="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <p class="text-sm font-bold text-emerald-600">{{ exam.availability }}</p>
                            </div>
                        </div>

                        <RouterLink
                            class="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-10 py-5 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-sky-600 active:scale-95"
                            :to="{ name: 'ujian-attempt', params: { id: exam.id } }">
                            Mulai Ujian Sekarang
                        </RouterLink>
                    </section>
                </template>
            </div>
        </section>
    </div>
</template>
