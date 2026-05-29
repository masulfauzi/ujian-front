<template>
    <div class="bg-surface min-h-screen">
        <SideBar />
        <TopAppBar />

        <main class="lg:ml-64 mt-16 min-h-screen">
            <div class="pt-8 pb-12 px-4 lg:px-8 max-w-5xl mx-auto">

                <!-- Welcome Section -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <h2 class="font-h1 text-h2 text-slate-900">Jadwal Ujian Hari Ini</h2>
                        <p class="text-slate-500 flex items-center gap-2 mt-1">
                            <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                            {{ today }}
                        </p>
                    </div>
                    <div v-if="hasOngoing" class="flex items-center gap-3">
                        <div class="bg-secondary-container/10 border border-secondary-container/20 px-4 py-2 rounded-xl flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                            <span class="text-secondary text-label-md font-label-md">Sesi Sedang Berlangsung</span>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="jadwalStore.isLoadingAktif" class="flex justify-center items-center py-20">
                    <div class="text-center">
                        <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                        <p class="mt-3 text-slate-600">Memuat jadwal ujian...</p>
                    </div>
                </div>

                <template v-else>
                    <!-- Empty State -->
                    <div v-if="jadwalStore.jadwalAktif.length === 0"
                        class="bg-white rounded-3xl p-12 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col items-center text-center">
                        <span class="material-symbols-outlined text-[64px] text-slate-300 mb-4">event_busy</span>
                        <h3 class="font-h3 text-h3 text-slate-500 mb-2">Belum ada ujian hari ini</h3>
                        <p class="text-slate-400 text-sm">Tidak ada ujian yang dijadwalkan untuk hari ini. Silakan periksa kembali besok.</p>
                    </div>

                    <!-- Exam List Grid -->
                    <div v-else class="grid grid-cols-1 gap-6">
                        <div v-for="item in jadwalStore.jadwalAktif" :key="item.id"
                            class="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-slate-50 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden"
                            :class="{ 'shadow-[0_20px_50px_rgba(14,165,233,0.05)] group': getStatus(item) === 'ongoing' }">

                            <!-- Left color bar -->
                            <div class="absolute top-0 left-0 w-2 h-full"
                                :class="{
                                    'bg-secondary': getStatus(item) === 'ongoing',
                                    'bg-slate-200': getStatus(item) !== 'ongoing'
                                }">
                            </div>

                            <!-- Icon -->
                            <div class="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                                :class="{
                                    'bg-secondary-container/20 text-secondary': getStatus(item) === 'ongoing',
                                    'bg-slate-50 text-slate-400': getStatus(item) !== 'ongoing'
                                }">
                                <span class="material-symbols-outlined text-3xl">event_note</span>
                            </div>

                            <!-- Content -->
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-1 flex-wrap">
                                    <span class="px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider"
                                        :class="{
                                            'bg-secondary-container text-on-secondary-container': getStatus(item) === 'ongoing',
                                            'bg-surface-container-low text-slate-500': getStatus(item) !== 'ongoing'
                                        }">
                                        {{ getStatusLabel(item) }}
                                    </span>
                                    <span class="px-2 py-1 bg-sky-50 text-sky-600 text-[10px] font-bold rounded uppercase tracking-wider">
                                        Tingkat {{ item.tingkat }}
                                    </span>
                                    <span class="text-slate-400 text-[12px] font-medium">{{ item.nama_bank_soal }}</span>
                                </div>
                                <h3 class="font-h3 text-h3 text-slate-800">{{ item.nama_ujian }}</h3>
                                <div class="flex items-center gap-4 mt-3 text-slate-500 text-sm">
                                    <span class="material-symbols-outlined text-[18px]">schedule</span>
                                    {{ formatJam(item.wkt_mulai) }} - {{ formatJam(item.wkt_selesai) }}
                                    <span class="text-slate-300">|</span>
                                    <span class="material-symbols-outlined text-[18px]">timer</span>
                                    {{ item.durasi }} menit
                                </div>
                            </div>

                            <!-- Action Button -->
                            <div class="shrink-0 w-full md:w-auto">
                                <!-- Ongoing + sudah_mengerjakan: disabled -->
                                <button v-if="getStatus(item) === 'ongoing' && item.status_pengerjaan === 'sudah_mengerjakan'"
                                    disabled
                                    class="w-full md:w-auto border-2 border-slate-200 bg-slate-50 text-slate-400 font-bold py-3 px-8 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                    Sudah Mengerjakan
                                    <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                                </button>
                                <!-- Ongoing + belum/sedang: aktif -->
                                <button v-else-if="getStatus(item) === 'ongoing'"
                                    @click="mulaiUjian(item)"
                                    class="w-full md:w-auto bg-primary-container hover:bg-primary text-white font-bold py-3 px-8 rounded-xl shadow-[0_8px_20px_rgba(14,165,233,0.25)] transition-all active:scale-95 group-hover:translate-y-[-2px] flex items-center justify-center gap-2">
                                    {{ item.status_pengerjaan === 'sedang_mengerjakan' ? 'Lanjut Mengerjakan' : 'Mulai Mengerjakan' }}
                                    <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </button>
                                <!-- Tidak ongoing (upcoming/ended) -->
                                <button v-else
                                    disabled
                                    class="w-full md:w-auto border-2 border-slate-200 text-slate-400 font-bold py-3 px-8 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
                                    {{ getStatus(item) === 'ended' ? 'Selesai' : 'Belum Dimulai' }}
                                    <span class="material-symbols-outlined text-[18px]">lock</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </template>

            </div>
        </main>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useJadwalStore } from '@/stores/jadwal'

const router = useRouter()
const jadwalStore = useJadwalStore()

const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})

function getStatus(item) {
    const now = new Date()
    const start = new Date(item.wkt_mulai)
    const end = new Date(item.wkt_selesai)
    if (now >= start && now <= end) return 'ongoing'
    if (now < start) return 'upcoming'
    return 'ended'
}

function getStatusLabel(item) {
    const status = getStatus(item)
    if (status === 'ongoing') return 'Ongoing'
    if (status === 'upcoming') return 'Upcoming'
    return 'Selesai'
}

function formatJam(dt) {
    if (!dt) return ''
    return new Date(dt).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    })
}

function mulaiUjian(item) {
    router.push({
        name: 'peserta.ujian.detail',
        params: { id: item.id },
        state: { jadwal: item },
    })
}

const hasOngoing = computed(() =>
    jadwalStore.jadwalAktif.some(item => getStatus(item) === 'ongoing')
)

onMounted(() => {
    jadwalStore.fetchJadwalAktifHariIni()
})
</script>
