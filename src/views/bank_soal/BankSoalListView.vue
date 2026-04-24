<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 class="text-4xl font-extrabold tracking-tight text-slate-900">Bank Soal</h1>
                    <p class="mt-2 text-sm text-slate-500">Kelola materi ujian dan kumpulan pertanyaan Anda di sini.</p>
                </div>
                <button
                    class="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-600 active:scale-95">
                    <span>＋</span>
                    <span>Buat Bank Soal Baru</span>
                </button>
            </div>

            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <article class="flex items-center gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl text-sky-600">
                        📁
                    </div>
                    <div>
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Total Bank Soal</p>
                        <p class="text-3xl font-black text-slate-900">12</p>
                    </div>
                </article>

                <article class="flex items-center gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div
                        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl text-emerald-600">
                        ❓</div>
                    <div>
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Total Pertanyaan</p>
                        <p class="text-3xl font-black text-slate-900">1,240</p>
                    </div>
                </article>

                <article class="flex items-center gap-5 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div
                        class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl text-slate-500">
                        🕒</div>
                    <div>
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-400">Pembaruan Terakhir</p>
                        <p class="text-lg font-bold text-slate-900">Hari Ini, 09:45</p>
                    </div>
                </article>
            </div>

            <div class="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl shadow-sky-500/5">
                <div
                    class="flex flex-col gap-4 border-b border-slate-50 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div class="flex flex-wrap items-center gap-3">
                        <div class="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
                            <span class="text-sm text-slate-400">⚙️</span>
                            <select
                                class="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-slate-600 focus:ring-0">
                                <option>Semua Mata Pelajaran</option>
                                <option>Matematika</option>
                                <option>Bahasa Indonesia</option>
                                <option>Fisika</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
                            <select
                                class="cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-slate-600 focus:ring-0">
                                <option>Semua Jenjang</option>
                                <option>Kelas 10</option>
                                <option>Kelas 11</option>
                                <option>Kelas 12</option>
                            </select>
                        </div>
                    </div>
                    <p class="text-sm text-slate-400">Menampilkan <span class="font-bold text-slate-900">1-5</span> dari
                        12
                        Bank Soal</p>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[900px] text-left">
                        <thead class="bg-slate-50/50">
                            <tr>
                                <th class="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Mata
                                    Pelajaran</th>
                                <th class="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Jenjang
                                </th>
                                <th class="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Jumlah
                                    Soal
                                </th>
                                <th class="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Terakhir
                                    Diperbarui</th>
                                <th class="px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-400">Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50 text-sm">
                            <tr class="transition-colors hover:bg-sky-50/20">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                                            ∑</div>
                                        <span class="font-bold text-slate-900">Matematika Wajib</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5"><span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Kelas
                                        10</span></td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><span class="font-bold">240</span><span
                                            class="rounded bg-emerald-50 px-1.5 text-[10px] text-emerald-500">+12</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-slate-500">24 Okt 2023, 14:20</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><button
                                            class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50">✏️</button><button
                                            class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-sky-50/20">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                                            🧪</div>
                                        <span class="font-bold text-slate-900">Fisika Dasar</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5"><span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Kelas
                                        11</span></td>
                                <td class="px-8 py-5"><span class="font-bold">185</span></td>
                                <td class="px-8 py-5 text-slate-500">22 Okt 2023, 09:15</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><button
                                            class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50">✏️</button><button
                                            class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-sky-50/20">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                            📚</div>
                                        <span class="font-bold text-slate-900">Bahasa Indonesia</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5"><span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Kelas
                                        12</span></td>
                                <td class="px-8 py-5"><span class="font-bold">312</span></td>
                                <td class="px-8 py-5 text-slate-500">18 Okt 2023, 11:40</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><button
                                            class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50">✏️</button><button
                                            class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-sky-50/20">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                                            🏛️</div>
                                        <span class="font-bold text-slate-900">Sejarah Indonesia</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5"><span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Kelas
                                        11</span></td>
                                <td class="px-8 py-5"><span class="font-bold">156</span></td>
                                <td class="px-8 py-5 text-slate-500">15 Okt 2023, 16:05</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><button
                                            class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50">✏️</button><button
                                            class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                            <tr class="transition-colors hover:bg-sky-50/20">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                            🧬</div>
                                        <span class="font-bold text-slate-900">Biologi</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5"><span
                                        class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Kelas
                                        12</span></td>
                                <td class="px-8 py-5"><span class="font-bold">204</span></td>
                                <td class="px-8 py-5 text-slate-500">12 Okt 2023, 08:30</td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-2"><button
                                            class="rounded-lg p-2 text-sky-600 transition-colors hover:bg-sky-50">✏️</button><button
                                            class="rounded-lg p-2 text-rose-500 transition-colors hover:bg-rose-50">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex items-center justify-center gap-2 border-t border-slate-50 bg-slate-50/30 px-8 py-5">
                    <button class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white">‹</button>
                    <button class="h-8 w-8 rounded-lg bg-sky-500 text-sm font-bold text-white">1</button>
                    <button
                        class="h-8 w-8 rounded-lg text-sm font-bold text-slate-500 transition-colors hover:bg-white">2</button>
                    <button
                        class="h-8 w-8 rounded-lg text-sm font-bold text-slate-500 transition-colors hover:bg-white">3</button>
                    <button class="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white">›</button>
                </div>
            </div>

            <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                <article
                    class="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-600 to-sky-400 p-8 text-white shadow-xl">
                    <div class="relative z-10">
                        <h3 class="mb-2 text-2xl font-semibold">Perlu Bantuan Menyusun Soal?</h3>
                        <p class="mb-6 max-w-[280px] text-sm text-sky-50">Gunakan AI Assistant kami untuk membantu
                            membuat
                            variasi pertanyaan berdasarkan kurikulum terbaru.</p>
                        <button
                            class="rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-sky-600 transition-all hover:shadow-lg">Coba
                            AI Assistant</button>
                    </div>
                    <span class="absolute -bottom-8 -right-8 text-[150px] text-white/10">✦</span>
                </article>

                <article
                    class="flex flex-col justify-center rounded-[2rem] border border-emerald-200/60 bg-emerald-100/40 p-8">
                    <h3 class="mb-2 text-2xl font-semibold text-emerald-800">Import Dari Excel</h3>
                    <p class="mb-6 text-sm text-emerald-800/70">Punya bank soal dalam format spreadsheet? Unggah
                        sekarang
                        untuk migrasi data instan.</p>
                    <div class="flex gap-4">
                        <button
                            class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 px-6 py-2.5 text-sm font-bold text-emerald-800 transition-all hover:bg-emerald-200/60">
                            <span>⬆</span>
                            <span>Unggah File</span>
                        </button>
                        <button class="rounded-xl p-2.5 text-emerald-800 transition-all hover:bg-emerald-200/60"
                            title="Unduh Template">⬇</button>
                    </div>
                </article>
            </div>
        </section>
    </div>
</template>