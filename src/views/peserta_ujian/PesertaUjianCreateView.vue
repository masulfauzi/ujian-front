<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
    nama: '',
    kelas: '',
    agama: '',
    username: '',
    password: '',
})

const errors = reactive({
    nama: '',
    kelas: '',
    agama: '',
    username: '',
    password: '',
})

const clearErrors = () => {
    errors.nama = ''
    errors.kelas = ''
    errors.agama = ''
    errors.username = ''
    errors.password = ''
}

const validate = () => {
    clearErrors()

    if (!form.nama.trim()) {
        errors.nama = 'Nama lengkap wajib diisi.'
    }

    if (!form.kelas) {
        errors.kelas = 'Kelas wajib dipilih.'
    }

    if (!form.agama) {
        errors.agama = 'Agama wajib dipilih.'
    }

    if (!form.username.trim()) {
        errors.username = 'Username wajib diisi.'
    }

    if (!form.password.trim()) {
        errors.password = 'Password wajib diisi.'
    }

    return !errors.nama && !errors.kelas && !errors.agama && !errors.username && !errors.password
}

const handleSubmit = () => {
    if (!validate()) {
        return
    }

    console.info('Data peserta siap dikirim ke API:', { ...form })
    router.push({ name: 'peserta-ujian-list' })
}
</script>

<template>
    <div class="bg-slate-50 text-slate-900">
        <section class="w-full px-4 py-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto w-full max-w-5xl">
                <nav class="mb-6 flex items-center gap-2 text-slate-400">
                    <RouterLink class="text-xs font-semibold transition-colors hover:text-sky-500" to="/peserta-ujian">
                        Peserta Ujian
                    </RouterLink>
                    <span class="text-xs">›</span>
                    <span class="text-xs font-bold text-sky-600">Tambah Peserta Baru</span>
                </nav>

                <div class="mb-8">
                    <h2 class="text-3xl font-semibold text-slate-900">Tambah Peserta Baru</h2>
                    <p class="mt-1 text-sm text-slate-500">Lengkapi data peserta untuk mendaftarkan akun ujian baru.</p>
                </div>

                <div
                    class="rounded-[24px] border border-white bg-white p-8 shadow-[0_20px_25px_-5px_rgba(14,165,233,0.08),0_8px_10px_-6px_rgba(14,165,233,0.05)] md:p-12">
                    <form class="space-y-8" @submit.prevent="handleSubmit">
                        <div>
                            <h3 class="text-2xl font-semibold text-slate-900">Informasi Peserta</h3>
                            <p class="mt-1 text-sm text-slate-500">Pastikan data yang diinput sudah benar sebelum
                                disimpan.</p>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-slate-800" for="nama">Nama Lengkap</label>
                            <input id="nama" v-model="form.nama" type="text" placeholder="Masukkan nama lengkap peserta"
                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                            <p v-if="errors.nama" class="text-xs font-medium text-rose-500">{{ errors.nama }}</p>
                        </div>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="kelas">Kelas</label>
                                <select id="kelas" v-model="form.kelas"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20">
                                    <option disabled value="">Pilih Kelas</option>
                                    <option value="X-IPA-1">X-IPA-1</option>
                                    <option value="X-IPA-2">X-IPA-2</option>
                                    <option value="XI-IPS-1">XI-IPS-1</option>
                                    <option value="XII-IPA-3">XII-IPA-3</option>
                                </select>
                                <p v-if="errors.kelas" class="text-xs font-medium text-rose-500">{{ errors.kelas }}</p>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="agama">Agama</label>
                                <select id="agama" v-model="form.agama"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20">
                                    <option disabled value="">Pilih Agama</option>
                                    <option value="Islam">Islam</option>
                                    <option value="Kristen">Kristen</option>
                                    <option value="Katolik">Katolik</option>
                                    <option value="Hindu">Hindu</option>
                                    <option value="Buddha">Buddha</option>
                                </select>
                                <p v-if="errors.agama" class="text-xs font-medium text-rose-500">{{ errors.agama }}</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="username">Username</label>
                                <input id="username" v-model="form.username" type="text"
                                    placeholder="Username untuk login"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                                <p v-if="errors.username" class="text-xs font-medium text-rose-500">{{ errors.username
                                    }}</p>
                            </div>

                            <div class="space-y-2">
                                <label class="block text-sm font-medium text-slate-800" for="password">Password</label>
                                <input id="password" v-model="form.password" type="password"
                                    placeholder="Masukkan password"
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20" />
                                <p v-if="errors.password" class="text-xs font-medium text-rose-500">{{ errors.password
                                    }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col items-center justify-end gap-4 pt-4 sm:flex-row">
                            <RouterLink to="/peserta-ujian"
                                class="w-full rounded-full border-2 border-slate-200 px-8 py-3 text-center text-sm font-bold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 sm:w-auto">
                                Batal
                            </RouterLink>
                            <button type="submit"
                                class="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-700/20 transition-all hover:brightness-110 sm:w-auto">
                                <span>💾</span>
                                Simpan Peserta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    </div>
</template>