<script setup>
const summaryCards = [
    {
        id: 'mendatang',
        label: 'Ujian Mendatang',
        value: '12',
        icon: '🗓️',
        iconClass: 'bg-sky-50 text-sky-500',
    },
    {
        id: 'berlangsung',
        label: 'Berlangsung',
        value: '03',
        icon: '▶️',
        iconClass: 'bg-emerald-100 text-emerald-600',
    },
    {
        id: 'selesai',
        label: 'Selesai Hari Ini',
        value: '08',
        icon: '✅',
        iconClass: 'bg-slate-100 text-slate-500',
    },
]

const jadwalList = [
    {
        id: 1,
        mapel: 'Matematika',
        kelas: 'XII IPA 1',
        tanggal: '20 Okt 2024',
        jam: '08:00 - 10:00',
        status: 'Berlangsung',
        statusClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
        icon: '🧮',
        iconClass: 'bg-emerald-50 text-emerald-600',
        aksiLabel: 'Pantau',
        aksiClass: 'text-sky-500 hover:underline',
    },
    {
        id: 2,
        mapel: 'Bahasa Inggris',
        kelas: 'XII IPA 2',
        tanggal: '21 Okt 2024',
        jam: '09:00 - 11:00',
        status: 'Mendatang',
        statusClass: 'bg-sky-100 text-sky-700 border border-sky-200',
        icon: '🌐',
        iconClass: 'bg-sky-50 text-sky-500',
        aksiLabel: 'Edit',
        aksiClass: 'text-slate-400 hover:text-sky-500',
    },
    {
        id: 3,
        mapel: 'Fisika',
        kelas: 'XII IPA 1',
        tanggal: '19 Okt 2024',
        jam: '08:00 - 10:00',
        status: 'Selesai',
        statusClass: 'bg-slate-100 text-slate-600 border border-slate-200',
        icon: '🧪',
        iconClass: 'bg-slate-100 text-slate-500',
        aksiLabel: 'Laporan',
        aksiClass: 'text-sky-500 hover:underline',
    },
    {
        id: 4,
        mapel: 'Sejarah Indonesia',
        kelas: 'XII IPS 3',
        tanggal: '22 Okt 2024',
        jam: '10:30 - 12:30',
        status: 'Mendatang',
        statusClass: 'bg-sky-100 text-sky-700 border border-sky-200',
        icon: '📚',
        iconClass: 'bg-sky-50 text-sky-500',
        aksiLabel: 'Edit',
        aksiClass: 'text-slate-400 hover:text-sky-500',
    },
]
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-7xl">
                <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <h1 class="text-3xl font-semibold text-slate-900">Jadwal Ujian</h1>
                        <p class="mt-1 text-sm text-slate-500">Kelola dan pantau semua sesi ujian yang aktif maupun
                            mendatang.</p>
                    </div>
                    <button
                        class="flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-200 transition-all hover:brightness-110 active:scale-95">
                        <span>➕</span>
                        <span>Buat Jadwal Baru</span>
                    </button>
                </div>

                <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div v-for="card in summaryCards" :key="card.id"
                        class="flex items-center gap-4 rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                        <div class="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
                            :class="card.iconClass">
                            {{ card.icon }}
                        </div>
                        <div>
                            <p class="text-sm font-medium text-slate-500">{{ card.label }}</p>
                            <p class="text-2xl font-bold text-slate-900">{{ card.value }}</p>
                        </div>
                    </div>
                </div>

                <div
                    class="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
                    <div class="flex items-center justify-between border-b border-slate-50 px-8 py-6">
                        <h3 class="text-lg font-bold text-slate-900">Daftar Jadwal</h3>
                        <div class="flex gap-2">
                            <button
                                class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-500">⚙️</button>
                            <button
                                class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-sky-50 hover:text-sky-500">⋯</button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full min-w-[860px] text-left">
                            <thead class="bg-slate-50/50">
                                <tr class="text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <th class="px-8 py-4">Nama Mata Pelajaran</th>
                                    <th class="px-8 py-4">Kelas</th>
                                    <th class="px-8 py-4">Waktu</th>
                                    <th class="px-8 py-4">Status</th>
                                    <th class="px-8 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="jadwal in jadwalList" :key="jadwal.id"
                                    class="transition-colors hover:bg-slate-50/50">
                                    <td class="px-8 py-5">
                                        <div class="flex items-center gap-3">
                                            <div class="flex h-10 w-10 items-center justify-center rounded-lg"
                                                :class="jadwal.iconClass">
                                                <span>{{ jadwal.icon }}</span>
                                            </div>
                                            <span class="font-bold text-slate-900">{{ jadwal.mapel }}</span>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5 text-sm font-medium text-slate-600">{{ jadwal.kelas }}</td>
                                    <td class="px-8 py-5">
                                        <div class="flex flex-col">
                                            <span class="text-sm font-bold text-slate-900">{{ jadwal.tanggal }}</span>
                                            <span class="text-xs text-slate-500">{{ jadwal.jam }}</span>
                                        </div>
                                    </td>
                                    <td class="px-8 py-5">
                                        <span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                                            :class="jadwal.statusClass">
                                            {{ jadwal.status }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-5 text-right">
                                        <button class="text-sm font-bold transition-colors" :class="jadwal.aksiClass">
                                            {{ jadwal.aksiLabel }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="flex items-center justify-between border-t border-slate-50 bg-slate-50/30 px-8 py-6">
                        <p class="text-sm text-slate-500">Menampilkan 4 dari 12 jadwal aktif</p>
                        <div class="flex gap-2">
                            <button
                                class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-400"
                                disabled>
                                Sebelumnya
                            </button>
                            <button
                                class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-white">
                                Selanjutnya
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>