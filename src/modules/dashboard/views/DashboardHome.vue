<template>
    <div class="bg-surface min-h-screen">
        <!-- Sidebar -->
        <SideBar />

        <!-- Top App Bar -->
        <TopAppBar />

        <!-- Main Content -->
        <main class="lg:ml-64 min-h-screen">
            <div class="pt-20 lg:pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
                <!-- Welcome Header -->
                <div class="mb-10">
                    <h1 class="font-h1 text-h1 text-on-surface mb-2">Selamat datang, {{ displayName }}!</h1>
                    <p class="font-body-md text-body-md text-slate-500">
                        Berikut informasi akun Anda.
                    </p>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="flex justify-center items-center py-20">
                    <div class="text-center">
                        <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
                        <p class="mt-3 text-slate-600">Memuat informasi...</p>
                    </div>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <!-- Profile Card (Bento Large) -->
                    <div class="md:col-span-8 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5 relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-8 opacity-10">
                            <span class="material-symbols-outlined text-[120px] text-sky-500">person</span>
                        </div>
                        <div class="relative z-10">
                            <h3 class="font-h3 text-h3 text-on-surface mb-6">Profil Saya</h3>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">badge</span>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400 uppercase font-bold">Nama</p>
                                        <p class="font-bold text-on-surface text-lg">{{ displayName }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">account_circle</span>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400 uppercase font-bold">Username</p>
                                        <p class="font-bold text-on-surface text-lg">{{ pesertaInfo?.username || currentUser?.email || '-' }}</p>
                                    </div>
                                </div>
                                <div v-if="pesertaInfo?.nama_kelas" class="flex items-center gap-4">
                                    <div class="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-sky-500">
                                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">class</span>
                                    </div>
                                    <div>
                                        <p class="text-xs text-slate-400 uppercase font-bold">Kelas</p>
                                        <p class="font-bold text-on-surface text-lg">{{ pesertaInfo.nama_kelas }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Role Card (Bento Small) -->
                    <div class="md:col-span-4 bg-sky-600 rounded-[24px] p-8 text-white shadow-xl shadow-sky-200">
                        <p class="text-sky-100 font-bold text-xs uppercase tracking-widest mb-4">Status Akun</p>
                        <div class="mb-6">
                            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <span class="material-symbols-outlined text-[40px]" style="font-variation-settings: 'FILL' 1;">
                                    {{ currentUser?.role === 'peserta' ? 'school' : 'admin_panel_settings' }}
                                </span>
                            </div>
                            <p class="text-3xl font-black capitalize">{{ currentUser?.role || 'User' }}</p>
                            <p class="text-sky-200 text-sm mt-1">Tipe Akun</p>
                        </div>
                        <div class="bg-white/10 rounded-xl p-4">
                            <p class="text-xs text-sky-200 uppercase font-bold mb-1">ID Pengguna</p>
                            <p class="font-mono font-bold text-sm break-all">{{ currentUser?.user_id || '-' }}</p>
                        </div>
                    </div>

                    <!-- Detail Info Card -->
                    <div class="md:col-span-7 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5">
                        <h3 class="font-h3 text-h3 text-on-surface mb-6">Informasi Detail</h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-slate-400">fingerprint</span>
                                    <p class="text-slate-600 font-medium">User ID</p>
                                </div>
                                <p class="font-mono font-bold text-on-surface text-sm">{{ currentUser?.user_id || '-' }}</p>
                            </div>
                            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-slate-400">mail</span>
                                    <p class="text-slate-600 font-medium">Email / Username</p>
                                </div>
                                <p class="font-bold text-on-surface">{{ currentUser?.email || '-' }}</p>
                            </div>
                            <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-slate-400">manage_accounts</span>
                                    <p class="text-slate-600 font-medium">Role</p>
                                </div>
                                <span class="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-bold capitalize">
                                    {{ currentUser?.role || '-' }}
                                </span>
                            </div>
                            <div v-if="pesertaInfo?.nama_kelas" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-slate-400">class</span>
                                    <p class="text-slate-600 font-medium">Kelas</p>
                                </div>
                                <p class="font-bold text-on-surface">{{ pesertaInfo.nama_kelas }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Token Info Card -->
                    <div class="md:col-span-5 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5">
                        <h3 class="font-h3 text-h3 text-on-surface mb-6">Info Sesi</h3>
                        <div class="space-y-6">
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-2">Token Berlaku Hingga</p>
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-sky-500">schedule</span>
                                    <p class="font-bold text-on-surface">{{ tokenExpiry }}</p>
                                </div>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400 uppercase font-bold mb-2">Status Token</p>
                                <div class="flex items-center gap-2">
                                    <span class="w-2 h-2 bg-secondary rounded-full inline-block"></span>
                                    <p class="font-bold text-secondary">Aktif</p>
                                </div>
                            </div>
                            <div class="border-t border-slate-100 pt-4">
                                <p class="text-xs text-slate-400 uppercase font-bold mb-2">Autentikasi</p>
                                <div class="flex items-center gap-3">
                                    <span class="material-symbols-outlined text-slate-400">lock</span>
                                    <p class="text-slate-600 font-medium text-sm">JWT Bearer Token</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useAuthStore } from '@/stores/auth'
import { pesertaService } from '@/services/pesertaService'

const authStore = useAuthStore()
const pesertaInfo = ref(null)
const isLoading = ref(false)

const currentUser = computed(() => authStore.currentUser)
const displayName = computed(() => authStore.displayName)

const tokenExpiry = computed(() => {
    const exp = currentUser.value?.exp
    if (!exp) return '-'
    try {
        return new Date(exp * 1000).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    } catch {
        return '-'
    }
})

onMounted(async () => {
    const userId = currentUser.value?.user_id
    const role = currentUser.value?.role
    if (userId && role === 'peserta') {
        isLoading.value = true
        try {
            const response = await pesertaService.getPesertaById(userId)
            pesertaInfo.value = response.data
        } catch {
            // silently fail, show info from token only
        } finally {
            isLoading.value = false
        }
    }
})
</script>
