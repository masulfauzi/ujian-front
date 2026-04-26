<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
    bankSoal: '',
    kelas: '',
    waktuMulai: '',
    waktuSelesai: '',
    acakSoal: true,
    acakJawaban: false,
})

const errors = reactive({
    bankSoal: '',
    kelas: '',
    waktuMulai: '',
    waktuSelesai: '',
})

const clearErrors = () => {
    errors.bankSoal = ''
    errors.kelas = ''
    errors.waktuMulai = ''
    errors.waktuSelesai = ''
}

const validate = () => {
    clearErrors()

    if (!form.bankSoal.trim()) {
        errors.bankSoal = 'Bank soal wajib dipilih.'
    }

    if (!form.kelas) {
        errors.kelas = 'Kelas penerima wajib dipilih.'
    }

    if (!form.waktuMulai) {
        errors.waktuMulai = 'Waktu mulai wajib diisi.'
    }

    if (!form.waktuSelesai) {
        errors.waktuSelesai = 'Waktu selesai wajib diisi.'
    }

    if (form.waktuMulai && form.waktuSelesai && new Date(form.waktuSelesai) <= new Date(form.waktuMulai)) {
        errors.waktuSelesai = 'Waktu selesai harus lebih besar dari waktu mulai.'
    }

    return !errors.bankSoal && !errors.kelas && !errors.waktuMulai && !errors.waktuSelesai
}

const handleSubmit = () => {
    if (!validate()) {
        return
    }

    console.info('Data jadwal ujian siap dikirim ke API:', { ...form })
    router.push({ name: 'jadwal-ujian-list' })
}
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-4xl">
                <div class="mb-8">
                    <nav class="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <RouterLink class="transition-colors hover:text-sky-500" to="/jadwal-ujian">
                            Jadwal Ujian
                        </RouterLink>
                        <span>›</span>
                        <span class="font-bold text-sky-600">Tambah Baru</span>
                    </nav>
                    <h2 class="text-3xl font-semibold text-slate-900">Buat Jadwal Ujian Baru</h2>
                    <p class="mt-1 text-sm text-slate-500">Konfigurasikan materi, waktu, dan aturan pelaksanaan ujian.
                    </p>
                </div>

                <div
                    class="relative overflow-hidden rounded-[24px] border border-slate-100 bg-white p-8 shadow-[0_20px_25px_-5px_rgba(14,165,233,0.08),0_8px_10px_-6px_rgba(14,165,233,0.05)] md:p-10">
                    <div class="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl"></div>
                    <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl"></div>

                    <form class="relative space-y-6" @submit.prevent="handleSubmit">
                        <div class="space-y-2">
                            <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <span>📚</span>
                                Pilih Bank Soal
                            </label>
                            <input v-model="form.bankSoal" type="text"
                                placeholder="Cari materi ujian (contoh: Matematika Wajib - Kelas XII)"
                                class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10" />
                            <p v-if="errors.bankSoal" class="text-xs font-medium text-rose-500">{{ errors.bankSoal }}
                            </p>
                        </div>

                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <span>👥</span>
                                    Pilih Kelas Penerima
                                </label>
                            </div>
                            <select v-model="form.kelas"
                                class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10">
                                <option disabled value="">Pilih kelas</option>
                                <option value="XII IPA 1">XII IPA 1</option>
                                <option value="XII IPA 2">XII IPA 2</option>
                                <option value="XII IPS 1">XII IPS 1</option>
                                <option value="XII IPS 3">XII IPS 3</option>
                            </select>
                            <p v-if="errors.kelas" class="text-xs font-medium text-rose-500">{{ errors.kelas }}</p>
                        </div>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <span>🕒</span>
                                    Waktu Mulai
                                </label>
                                <input v-model="form.waktuMulai" type="datetime-local"
                                    class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10" />
                                <p v-if="errors.waktuMulai" class="text-xs font-medium text-rose-500">{{
                                    errors.waktuMulai }}</p>
                            </div>

                            <div class="space-y-2">
                                <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
                                    <span>⏱️</span>
                                    Waktu Selesai
                                </label>
                                <input v-model="form.waktuSelesai" type="datetime-local"
                                    class="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10" />
                                <p v-if="errors.waktuSelesai" class="text-xs font-medium text-rose-500">{{
                                    errors.waktuSelesai }}</p>
                            </div>
                        </div>

                        <div class="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500">Opsi Pelaksanaan Ujian
                            </h4>

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-semibold text-slate-800">Acak Soal</p>
                                    <p class="text-xs text-slate-500">Urutan soal akan berbeda untuk setiap siswa.</p>
                                </div>
                                <input v-model="form.acakSoal" type="checkbox"
                                    class="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            </div>

                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm font-semibold text-slate-800">Acak Jawaban</p>
                                    <p class="text-xs text-slate-500">Pilihan jawaban akan diacak sistem.</p>
                                </div>
                                <input v-model="form.acakJawaban" type="checkbox"
                                    class="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            </div>
                        </div>

                        <div class="flex items-center justify-end gap-4 border-t border-slate-100 pt-4">
                            <RouterLink to="/jadwal-ujian"
                                class="rounded-xl px-8 py-3 text-sm font-bold text-slate-500 transition-all hover:bg-slate-100">
                                Batal
                            </RouterLink>
                            <button type="submit"
                                class="flex items-center gap-2 rounded-xl bg-emerald-600 px-10 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-95">
                                <span>💾</span>
                                Simpan Jadwal
                            </button>
                        </div>
                    </form>
                </div>

                <div class="mt-8 flex items-start gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-6">
                    <span class="text-sky-600">ℹ️</span>
                    <div>
                        <h5 class="text-sm font-semibold text-sky-900">Informasi Penting</h5>
                        <p class="mt-1 text-xs text-sky-700/80">Jadwal yang disimpan akan otomatis muncul di dashboard
                            siswa sesuai waktu mulai.
                            Pastikan Bank Soal telah diverifikasi sebelum mempublikasikan jadwal.</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>