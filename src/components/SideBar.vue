<template>
    <!-- Backdrop (mobile only) -->
    <Transition name="fade">
        <div
            v-if="uiStore.sidebarOpen"
            @click="uiStore.closeSidebar()"
            class="fixed inset-0 bg-black/50 lg:hidden z-40"
        ></div>
    </Transition>

    <!-- SideNavBar -->
    <aside
        class="fixed left-0 top-0 h-screen w-64 border-r bg-white border-slate-200 shadow-2xl shadow-sky-500/5 flex flex-col h-full p-4 space-y-2 z-50 transition-transform duration-300 lg:translate-x-0"
        :class="[
            uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]">
        <!-- Logo Section -->
        <div class="mb-8 px-4 flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-white"
                    style="font-variation-settings: 'FILL' 1;">school</span>
            </div>
            <div>
                <h2 class="text-lg font-black text-sky-600 leading-none">CBT Online</h2>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    {{ isAdmin ? 'Management Portal' : 'Student Portal' }}</p>
            </div>
        </div>

        <!-- Navigation Menu - User -->
        <nav v-if="!isAdmin" class="space-y-1">
            <router-link to="/dashboard"
                @click="uiStore.closeSidebar()"
                class="flex items-center gap-3 bg-sky-50 text-sky-600 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">dashboard</span>
                <span class="font-label-md text-label-md">Dashboard</span>
            </router-link>
            <router-link to="/schedule"
                @click="uiStore.closeSidebar()"
                class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">calendar_today</span>
                <span class="font-label-md text-label-md">Jadwal Ujian</span>
            </router-link>

        </nav>

        <!-- Navigation Menu - Admin -->
        <nav v-else class="space-y-1">
            <router-link to="/admin/dashboard" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/dashboard')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">dashboard</span>
                <span class="font-label-md text-label-md">Dashboard</span>
            </router-link>
            <router-link to="/admin/mapel" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/mapel')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">subject</span>
                <span class="font-label-md text-label-md">Mapel</span>
            </router-link>
            <router-link to="/admin/jurusan" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/jurusan')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">apartment</span>
                <span class="font-label-md text-label-md">Jurusan</span>
            </router-link>
            <router-link to="/admin/kelas" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/kelas')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">meeting_room</span>
                <span class="font-label-md text-label-md">Kelas</span>
            </router-link>
            <router-link to="/admin/bank-soal" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/bank-soal')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">database</span>
                <span class="font-label-md text-label-md">Bank Soal</span>
            </router-link>
            <router-link to="/admin/peserta" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/peserta')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">group</span>
                <span class="font-label-md text-label-md">Peserta Ujian</span>
            </router-link>
            <router-link to="/admin/jadwal" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/jadwal')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">event</span>
                <span class="font-label-md text-label-md">Jadwal Ujian</span>
            </router-link>
            <router-link to="/admin/nilai" @click="uiStore.closeSidebar()" :class="[
                'flex items-center gap-3 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200',
                isActivePath('/admin/nilai')
                    ? 'bg-sky-50 text-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 transition-all'
            ]">
                <span class="material-symbols-outlined">grade</span>
                <span class="font-label-md text-label-md">Nilai</span>
            </router-link>
        </nav>




    </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const uiStore = useUiStore()
const router = useRouter()
const route = useRoute()

const isAdmin = computed(() => authStore.currentUser?.role === 'admin')

const isActivePath = (path) => {
    if (path === '/admin/dashboard') {
        return route.path === '/admin/dashboard'
    }
    return route.path.startsWith(path)
}

const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
