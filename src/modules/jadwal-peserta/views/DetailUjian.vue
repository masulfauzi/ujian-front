<template>
    <div class="bg-surface min-h-screen">
        <SideBar />
        <TopAppBar />

        <main class="ml-64 pt-24 pb-12 px-8 min-h-screen">
            <div class="max-w-5xl mx-auto">

                <!-- Loading State -->
                <div v-if="isLoading" class="flex justify-center items-center py-20">
                    <div class="text-center">
                        <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                        <p class="mt-3 text-slate-600">Memuat detail ujian...</p>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50">
                    <div class="flex items-start gap-4">
                        <span class="material-symbols-outlined text-5xl text-red-500 shrink-0">error</span>
                        <div class="flex-1">
                            <h3 class="font-h3 text-h3 text-slate-800 mb-2">Gagal Memuat Detail Ujian</h3>
                            <p class="text-slate-500 text-sm mb-6">{{ error }}</p>
                            <button @click="router.back()" class="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <template v-else>
                    <!-- Breadcrumbs -->
                    <nav class="flex items-center gap-2 mb-8">
                        <button @click="router.back()" class="text-slate-400 font-label-sm text-label-sm hover:text-sky-500 transition-colors">
                            Jadwal Ujian
                        </button>
                        <span class="material-symbols-outlined text-[16px] text-slate-300">chevron_right</span>
                        <span class="text-sky-600 font-label-sm text-label-sm">Detail Ujian</span>
                    </nav>

                    <!-- Header Section -->
                    <section class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <div class="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-3">
                                {{ jadwal?.tingkat ? 'Tingkat ' + jadwal.tingkat : 'Ujian' }}
                            </div>
                            <p class="text-slate-400 text-sm mb-1 font-body-md">{{ detail?.nama_ujian || '-' }}</p>
                            <h1 class="font-h1 text-h1 text-on-surface leading-tight">{{ detail?.nama_bank_soal || '-' }}</h1>
                            <p class="text-slate-500 mt-2 font-body-md flex items-center gap-2">
                                <span class="material-symbols-outlined text-[20px]">calendar_today</span>
                                {{ formatDateTime(detail?.wkt_mulai) }} • {{ formatJam(detail?.wkt_mulai) }} - {{ formatJam(detail?.wkt_selesai) }} WIB
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <button class="px-6 py-3 border border-slate-200 rounded-xl font-label-md text-label-md text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                <span class="material-symbols-outlined">download</span>
                                Unduh Kisi-kisi
                            </button>
                        </div>
                    </section>

                    <!-- Info Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                        <!-- Durasi -->
                        <div class="bg-white p-6 rounded-3xl custom-shadow-lvl2 border border-sky-50 flex flex-col items-center text-center">
                            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
                                <span class="material-symbols-outlined text-[32px]">timer</span>
                            </div>
                            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Durasi</p>
                            <p class="font-h3 text-h3 text-on-surface mt-1">{{ detail?.durasi ? detail.durasi + ' menit' : '-' }}</p>
                        </div>

                        <!-- Tipe Ujian -->
                        <div class="bg-white p-6 rounded-3xl custom-shadow-lvl2 border border-sky-50 flex flex-col items-center text-center">
                            <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
                                <span class="material-symbols-outlined text-[32px]">checklist</span>
                            </div>
                            <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">Tipe Ujian</p>
                            <p class="font-h3 text-h3 text-on-surface mt-1">Pilihan Ganda</p>
                        </div>
                    </div>

                    <!-- Instructions & Details Bento -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mb-8">
                        <!-- Rules Section -->
                        <div class="lg:col-span-2 bg-white rounded-[2rem] p-8 custom-shadow-lvl2 border border-sky-50">
                            <h3 class="font-h3 text-h3 text-on-surface mb-6 flex items-center gap-3">
                                <span class="material-symbols-outlined text-sky-500">gavel</span>
                                Instruksi Pengerjaan
                            </h3>
                            <div class="space-y-4">
                                <div class="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">1</div>
                                    <p class="text-slate-600 font-body-md">Pastikan koneksi internet Anda stabil sebelum menekan tombol "Mulai Ujian".</p>
                                </div>
                                <div class="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">2</div>
                                    <p class="text-slate-600 font-body-md">Dilarang keras membuka tab browser lain atau aplikasi lain selama ujian berlangsung. Sistem akan mendeteksi kecurangan.</p>
                                </div>
                                <div class="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">3</div>
                                    <p class="text-slate-600 font-body-md">Waktu akan terus berjalan meskipun Anda keluar dari halaman ujian atau menutup browser.</p>
                                </div>
                                <div class="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm">4</div>
                                    <p class="text-slate-600 font-body-md">Klik tombol "Simpan & Selesai" jika Anda telah menyelesaikan seluruh soal sebelum waktu habis.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <!-- Preparation Card -->
                        <div class="bg-gradient-to-br from-sky-500 to-sky-700 rounded-[2rem] p-8 text-white relative overflow-hidden custom-shadow-lvl2">
                            <div class="relative z-10">
                                <h4 class="font-h3 text-h3 mb-2">Sudah Siap?</h4>
                                <p class="text-sky-100 font-body-md mb-6 leading-relaxed">Persiapkan alat tulis dan coretan untuk perhitungan jika diperlukan.</p>
                                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">warning</span>
                                    <p class="text-xs font-bold leading-tight uppercase tracking-wide">Ujian ini hanya dapat dilakukan satu kali.</p>
                                </div>
                            </div>
                            <div class="absolute -right-10 -bottom-10 opacity-10">
                                <span class="material-symbols-outlined text-[180px]">calculate</span>
                            </div>
                        </div>
                    </div>

                    <!-- Error Notification -->
                    <div v-if="startError" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
                        <span class="material-symbols-outlined text-red-500 shrink-0">error</span>
                        <div class="flex-1">
                            <p class="text-sm font-bold text-red-800">Gagal Memulai Ujian</p>
                            <p class="text-sm text-red-600 mt-1">{{ startError }}</p>
                        </div>
                        <button @click="startError = null" class="text-red-400 hover:text-red-600">
                            <span class="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>

                    <!-- CTA Section -->
                    <div class="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 py-10 border-t border-slate-200">
                        <div class="text-center md:text-left">
                            <p class="text-slate-400 font-bold uppercase tracking-widest text-[11px] mb-1">Status Ketersediaan</p>
                            <div class="flex items-center gap-2 justify-center md:justify-start">
                                <span class="w-2.5 h-2.5 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(78,222,163,0.6)]"></span>
                                <p class="font-bold text-secondary text-sm">Terbuka (Hingga {{ formatJam(detail?.wkt_selesai) }} WIB)</p>
                            </div>
                        </div>
                        <button
                            @click="mulaiSekarang"
                            :disabled="isStarting"
                            class="group relative inline-flex items-center justify-center px-10 py-5 bg-primary-container text-white font-h3 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
                            <span class="relative z-10 flex items-center gap-3">
                                {{ isStarting ? 'Memulai...' : 'Mulai Ujian Sekarang' }}
                                <span v-if="!isStarting" class="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                                <span v-else class="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            </span>
                            <div class="absolute inset-0 bg-gradient-to-r from-sky-400 to-sky-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </button>
                    </div>
                </template>

            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useDialog } from '@/composables/useDialog'
import { jadwalService } from '@/services/jadwalService'
import { nilaiService } from '@/services/nilaiService'

const route = useRoute()
const router = useRouter()
const { $alert } = useDialog()

const jadwal = history.state?.jadwal || null
const detail = ref(null)
const isLoading = ref(false)
const error = ref(null)
const isStarting = ref(false)
const startError = ref(null)

function formatJam(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

function formatDateTime(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

async function mulaiSekarang() {
    if (isStarting.value) return
    isStarting.value = true
    startError.value = null

    try {
        const response = await nilaiService.mulaiUjian(route.params.id)
        const nilaiData = response.data?.data
        // detail.value adalah Vue Proxy — harus di-convert ke plain object dulu
        // sebelum dikirim via history.state (structured clone tidak bisa handle Proxy)
        const jadwalPlain = JSON.parse(JSON.stringify(toRaw(detail.value) ?? {}))

        router.push({
            name: 'peserta.ujian.pengerjaan',
            params: { id: route.params.id },
            state: { nilai: nilaiData, jadwal: jadwalPlain },
        })
    } catch (err) {
        const status = err.response?.status
        const message = err.response?.data?.message

        if (status === 400 && message === 'Ujian sudah pernah dilakukan') {
            await $alert('Ujian sudah pernah dilakukan. Anda akan diarahkan ke dashboard.', { title: 'Perhatian', type: 'warning' })
            await router.push({ name: 'dashboard.home' })
            return
        }

        if (status === 401) {
            startError.value = 'Sesi Anda telah berakhir. Silakan login kembali.'
            setTimeout(() => router.push({ name: 'login' }), 1500)
            return
        }

        startError.value = message || 'Gagal memulai ujian. Coba lagi.'
    } finally {
        isStarting.value = false
    }
}

onMounted(async () => {
    isLoading.value = true
    error.value = null
    try {
        const response = await jadwalService.getJadwalById(route.params.id)
        detail.value = response.data
    } catch (err) {
        error.value = err.response?.data?.message || 'Gagal memuat detail ujian'
    } finally {
        isLoading.value = false
    }
})
</script>
