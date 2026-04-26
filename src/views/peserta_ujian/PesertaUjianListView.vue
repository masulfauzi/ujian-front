<script setup>
const pesertaList = [
    { id: 1, nama: 'Ahmad Dani', inisial: 'AD', inisialClass: 'bg-sky-100 text-sky-600', kelas: 'XII IPA 1', username: 'ahmaddani_2024' },
    { id: 2, nama: 'Siti Pertiwi', inisial: 'SP', inisialClass: 'bg-emerald-100 text-emerald-600', kelas: 'XII IPS 2', username: 'sitipertiwi_01' },
    { id: 3, nama: 'Budi Pratama', inisial: 'BP', inisialClass: 'bg-purple-100 text-purple-600', kelas: 'XII IPA 3', username: 'budi_pratama99' },
    { id: 4, nama: 'Rina Nuraini', inisial: 'RN', inisialClass: 'bg-orange-100 text-orange-600', kelas: 'XII IPA 1', username: 'rina_nura_24' },
    { id: 5, nama: 'Fajar Ramadhan', inisial: 'FR', inisialClass: 'bg-blue-100 text-blue-600', kelas: 'XII IPS 1', username: 'fajarr_ram' },
]
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mb-10">
                <h2 class="text-3xl font-semibold text-slate-900">Daftar Peserta Ujian</h2>
                <p class="mt-1 text-sm text-slate-500">Kelola data siswa yang terdaftar dalam sistem</p>
            </div>

            <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div class="flex flex-wrap items-center gap-3">
                    <RouterLink to="/peserta-ujian/tambah"
                        class="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:shadow-lg hover:shadow-emerald-100 active:scale-95">
                        <span>＋</span>
                        <span>Tambah Peserta</span>
                    </RouterLink>
                    <button
                        class="inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-5 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-100 active:scale-95">
                        <span>⬆</span>
                        <span>Upload Excel</span>
                    </button>
                </div>

                <div class="relative w-full max-w-sm">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔎</span>
                    <input
                        class="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10"
                        placeholder="Cari Nama atau Username..." type="text" />
                </div>
            </div>

            <div class="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-2xl shadow-sky-900/5">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[920px] border-collapse text-left">
                        <thead>
                            <tr class="border-b border-slate-100 bg-slate-50/50">
                                <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">No</th>
                                <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Nama
                                    Lengkap</th>
                                <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Kelas
                                </th>
                                <th class="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Username
                                </th>
                                <th
                                    class="px-6 py-5 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                    Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            <tr v-for="peserta in pesertaList" :key="peserta.id"
                                class="transition-colors hover:bg-sky-50/30">
                                <td class="px-6 py-5 text-sm font-medium text-slate-600">{{ peserta.id }}</td>
                                <td class="px-6 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                                            :class="peserta.inisialClass">
                                            {{ peserta.inisial }}
                                        </div>
                                        <span class="text-sm font-semibold text-slate-800">{{ peserta.nama }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-5">
                                    <span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">
                                        {{ peserta.kelas }}
                                    </span>
                                </td>
                                <td class="px-6 py-5 text-sm text-slate-500">{{ peserta.username }}</td>
                                <td class="px-6 py-5">
                                    <div class="flex justify-center gap-2">
                                        <button class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-100"
                                            title="Edit">
                                            ✏️
                                        </button>
                                        <button class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50"
                                            title="Hapus">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    class="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-5 md:flex-row md:items-center md:justify-between">
                    <p class="text-sm text-slate-500">Menampilkan <span class="font-bold text-slate-800">5</span> dari
                        <span class="font-bold text-slate-800">120</span> Peserta
                    </p>
                    <div class="flex items-center gap-2">
                        <button
                            class="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-colors hover:bg-slate-50"
                            disabled>
                            ‹
                        </button>
                        <button
                            class="h-10 w-10 rounded-lg bg-sky-500 font-bold text-white shadow-md shadow-sky-200">1</button>
                        <button
                            class="h-10 w-10 rounded-lg font-bold text-slate-600 transition hover:bg-slate-100">2</button>
                        <button
                            class="h-10 w-10 rounded-lg font-bold text-slate-600 transition hover:bg-slate-100">3</button>
                        <span class="px-2 text-slate-400">...</span>
                        <button
                            class="h-10 w-10 rounded-lg font-bold text-slate-600 transition hover:bg-slate-100">24</button>
                        <button
                            class="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-50">
                            ›
                        </button>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div
                    class="rounded-[24px] bg-gradient-to-br from-sky-500 to-sky-600 p-6 text-white shadow-xl shadow-sky-500/20">
                    <p class="text-xs font-bold uppercase">Total Peserta</p>
                    <p class="mt-3 text-3xl font-bold">1,240</p>
                    <p class="mt-1 text-sm text-sky-100">+12 siswa baru minggu ini</p>
                </div>
                <div class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <p class="text-xs font-bold uppercase text-emerald-600">Status Aktif</p>
                    <p class="mt-3 text-3xl font-bold text-slate-800">98%</p>
                    <p class="mt-1 text-sm text-slate-500">Akun peserta terverifikasi</p>
                </div>
                <div class="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
                    <p class="text-xs font-bold uppercase text-amber-600">Total Kelas</p>
                    <p class="mt-3 text-3xl font-bold text-slate-800">12</p>
                    <p class="mt-1 text-sm text-slate-500">Tingkat XII IPA & IPS</p>
                </div>
            </div>
        </section>
    </div>
</template>
