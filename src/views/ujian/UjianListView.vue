<script setup>
const exams = [
    {
        id: 1,
        title: 'Matematika Dasar',
        category: 'Science & Tech',
        status: 'ongoing',
        startTime: '08:00',
        endTime: '10:00',
        location: 'Ruang 402 (Lt. 4)',
        isOnline: false,
        actionLabel: 'Mulai Ujian',
        actionStyle: 'primary',
    },
    {
        id: 2,
        title: 'Bahasa Indonesia',
        category: 'Humanities',
        status: 'upcoming',
        startTime: '13:00',
        endTime: '15:00',
        location: 'meet.google.com/edu-exam',
        isOnline: true,
        actionLabel: 'Belum Dibuka',
        actionStyle: 'outline',
    },
    {
        id: 3,
        title: 'Sejarah Modern',
        category: 'Social Studies',
        status: 'upcoming',
        startTime: '15:30',
        endTime: '17:00',
        location: 'Lab Komputer 1',
        isOnline: false,
        actionLabel: 'Terkunci',
        actionStyle: 'disabled',
    },
]

const statusBadgeClass = (status) => {
    if (status === 'ongoing') {
        return 'bg-emerald-100 text-emerald-700'
    }

    return 'bg-slate-100 text-slate-600'
}

const statusBorderClass = (status) => {
    if (status === 'ongoing') {
        return 'bg-emerald-500'
    }

    return 'bg-sky-500'
}

const actionClass = (style) => {
    if (style === 'primary') {
        return 'bg-sky-500 text-white hover:bg-sky-600'
    }

    if (style === 'outline') {
        return 'border border-sky-500 text-sky-600 hover:bg-sky-50'
    }

    return 'cursor-not-allowed border border-slate-200 text-slate-400 bg-white'
}
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto max-w-5xl">
                <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 class="text-3xl font-bold text-slate-900 md:text-4xl">Jadwal Ujian Hari Ini</h1>
                        <p class="mt-2 text-sm text-slate-500">Senin, 14 Oktober 2024</p>
                    </div>

                    <div class="inline-flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2">
                        <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span class="text-sm font-medium text-emerald-700">Sesi Sedang Berlangsung</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-6">
                    <article v-for="exam in exams" :key="exam.id"
                        class="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                        <div class="absolute left-0 top-0 h-full w-1.5" :class="statusBorderClass(exam.status)"></div>

                        <div class="flex flex-col gap-6 md:flex-row md:items-center">
                            <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                                {{ exam.isOnline ? '🌐' : '📝' }}
                            </div>

                            <div class="flex-1">
                                <div class="mb-2 flex flex-wrap items-center gap-3">
                                    <span class="rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider"
                                        :class="statusBadgeClass(exam.status)">
                                        {{ exam.status }}
                                    </span>
                                    <span class="text-xs font-medium text-slate-400">{{ exam.category }}</span>
                                </div>

                                <h2 class="text-2xl font-semibold text-slate-800">{{ exam.title }}</h2>

                                <div class="mt-3 flex flex-wrap gap-5 text-sm text-slate-500">
                                    <p>{{ exam.startTime }} - {{ exam.endTime }}</p>
                                    <p>{{ exam.isOnline ? `Online: ${exam.location}` : exam.location }}</p>
                                </div>
                            </div>

                            <button class="w-full rounded-xl px-6 py-3 text-sm font-bold transition md:w-auto"
                                :class="actionClass(exam.actionStyle)">
                                {{ exam.actionLabel }}
                            </button>
                        </div>
                    </article>
                </div>

                <div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <article class="md:col-span-2 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 p-8 text-white">
                        <h3 class="text-xl font-bold">Panduan Ujian Digital</h3>
                        <p class="mt-2 text-sm text-white/90">
                            Pastikan koneksi internet stabil dan perangkat siap sebelum memulai ujian. Gunakan browser terbaru
                            agar kompatibilitas tetap optimal.
                        </p>
                        <button class="mt-6 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50">
                            Baca Selengkapnya
                        </button>
                    </article>

                    <article class="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-6">
                        <h3 class="text-lg font-bold text-slate-800">Butuh Bantuan?</h3>
                        <p class="mt-2 text-sm text-slate-600">
                            Jika ada kendala teknis saat pengerjaan ujian, segera hubungi tim IT support sekolah.
                        </p>
                        <a class="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:underline" href="#">
                            Hubungi IT Support
                        </a>
                    </article>
                </div>
            </div>
        </section>
    </div>
</template>
