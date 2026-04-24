<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-5xl">
                <div class="mb-8">
                    <nav class="mb-2 flex items-center gap-2 text-slate-400">
                        <RouterLink class="text-xs font-semibold transition-colors hover:text-sky-500" to="/bank-soal">
                            Bank Soal
                        </RouterLink>
                        <span class="text-xs">›</span>
                        <span class="text-xs font-bold text-sky-600">Buat Baru</span>
                    </nav>
                    <h2 class="text-3xl font-semibold text-slate-900">Buat Bank Soal Baru</h2>
                    <p class="mt-1 text-sm text-slate-500">Lengkapi informasi di bawah ini untuk membuat wadah koleksi
                        soal ujian baru.</p>
                </div>

                <div
                    class="rounded-[24px] border border-white bg-white p-8 shadow-[0_20px_25px_-5px_rgba(14,165,233,0.08),0_8px_10px_-6px_rgba(14,165,233,0.05)] md:p-12">
                    <form class="space-y-8" @submit.prevent>
                        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div class="space-y-6 md:col-span-2">
                                <div class="mb-2 flex items-center gap-2">
                                    <div
                                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-sky-500">
                                        ℹ️</div>
                                    <h3 class="text-2xl font-semibold text-slate-900">Informasi Dasar</h3>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="bank_name">Nama Bank
                                    Soal</label>
                                <input id="bank_name" type="text"
                                    placeholder="Contoh: Ujian Tengah Semester Matematika Ganjil"
                                    class="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="subject">Mata
                                    Pelajaran</label>
                                <div class="relative">
                                    <select id="subject"
                                        class="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20">
                                        <option value="" selected disabled>Pilih Mata Pelajaran</option>
                                        <option value="math">Matematika</option>
                                        <option value="science">Sains / IPA</option>
                                        <option value="english">Bahasa Inggris</option>
                                        <option value="history">Sejarah</option>
                                    </select>
                                    <span
                                        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">⌄</span>
                                </div>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="question_count">Jumlah
                                    Soal</label>
                                <div class="flex items-center gap-3">
                                    <input id="question_count" type="number" min="1" max="200" placeholder="0"
                                        class="w-32 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                                    <span class="text-xs font-semibold text-slate-400">Butir Soal</span>
                                </div>
                            </div>
                        </div>

                        <div class="my-8 h-px w-full bg-slate-100"></div>

                        <div class="flex flex-col items-center justify-end gap-4 sm:flex-row">
                            <RouterLink to="/bank-soal"
                                class="w-full rounded-full border-2 border-slate-200 px-8 py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto">
                                Batal
                            </RouterLink>
                            <button type="submit"
                                class="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:brightness-110 sm:w-auto">
                                <span>💾</span>
                                Simpan Bank Soal
                            </button>
                        </div>
                    </form>
                </div>

                <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div class="flex gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-6">
                        <span class="shrink-0 text-sky-500">💡</span>
                        <div>
                            <h4 class="mb-1 text-sm font-bold text-sky-900">Tips Cepat</h4>
                            <p class="text-xs leading-relaxed text-sky-700">Gunakan nama yang deskriptif termasuk tahun
                                ajaran agar mudah dicari di kemudian hari.</p>
                        </div>
                    </div>
                    <div class="flex gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                        <span class="shrink-0 text-emerald-600">🛡️</span>
                        <div>
                            <h4 class="mb-1 text-sm font-bold text-emerald-800">Otomatisasi</h4>
                            <p class="text-xs leading-relaxed text-emerald-700">Bank soal baru akan otomatis
                                tersinkronisasi dengan portal ujian siswa.</p>
                        </div>
                    </div>
                    <div class="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        <span class="shrink-0 text-slate-500">📌</span>
                        <div>
                            <h4 class="mb-1 text-sm font-bold text-slate-800">Catatan</h4>
                            <p class="text-xs leading-relaxed text-slate-600">Anda dapat menambahkan dan mengedit soal
                                setelah bank soal berhasil dibuat.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>