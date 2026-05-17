<template>
    <!-- TopAppBar -->
    <header
        class="fixed top-0 right-0 left-64 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm flex justify-between items-center h-16 px-8">
        <!-- Search Bar -->
        <div class="flex items-center gap-4 flex-1">
            <div class="relative w-full max-w-md">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                    search
                </span>
                <input
                    class="w-full pl-10 pr-4 py-2 bg-slate-50 border-transparent rounded-full text-sm focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all"
                    placeholder="Search exams, lessons, or grades..." type="text" />
            </div>
        </div>

        <!-- Right Section: Notifications & User Profile -->
        <div class="flex items-center gap-6">
            <!-- Action Buttons -->
            <div class="flex items-center gap-2">
                <button class="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative">
                    <span class="material-symbols-outlined">notifications</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button class="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                    <span class="material-symbols-outlined">help</span>
                </button>
            </div>

            <!-- Divider -->
            <div class="h-8 w-[1px] bg-slate-100"></div>

            <!-- User Profile with Dropdown -->
            <div class="relative">
                <button
                    @click="isDropdownOpen = !isDropdownOpen"
                    class="flex items-center gap-3 pl-2 hover:bg-slate-50 rounded-lg px-2 py-1 transition-colors">
                    <div class="text-right">
                        <p class="font-label-md text-label-md text-on-surface">{{ userName }}</p>
                        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ userRole }}</p>
                    </div>
                    <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-100 p-0.5">
                        <img alt="User profile avatar" class="w-full h-full object-cover rounded-full" :src="userAvatar" />
                    </div>
                </button>

                <!-- Dropdown Menu -->
                <div
                    v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                    <!-- User Info -->
                    <div class="px-4 py-3 border-b border-slate-100">
                        <p class="text-sm font-semibold text-on-surface">{{ userName }}</p>
                        <p class="text-xs text-slate-500">{{ userEmail }}</p>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-2">
                        <button
                            class="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <span class="material-symbols-outlined text-base">account_circle</span>
                            Profile
                        </button>
                        <button
                            class="w-full text-left px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                            <span class="material-symbols-outlined text-base">settings</span>
                            Settings
                        </button>
                        <div class="border-t border-slate-100 my-1"></div>
                        <button
                            @click="handleLogout"
                            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                            <span class="material-symbols-outlined text-base">logout</span>
                            Logout
                        </button>
                    </div>
                </div>

                <!-- Backdrop -->
                <div
                    v-if="isDropdownOpen"
                    @click="isDropdownOpen = false"
                    class="fixed inset-0 z-40"></div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const isDropdownOpen = ref(false)

const userName = ref('Alex Johnston')
const userEmail = ref('alex.johnston@university.edu')
const userRole = ref('Undergraduate Student')
const userAvatar = ref('https://lh3.googleusercontent.com/aida-public/AB6AXuB9U5KURX3eumGQKeub8bUR7L74sraVdj5vIY-omMSvEMaGBJldTzEYfYTvmZppjymd35ebrZbDV3aifEC1b1mYRpgJ2zGe0qL_VWoku_0phkarPtEIQU8GRxUXoipSKtyNOZbHsH-I00WvpZcGt8JMEM1aDNdjpr4l_alp-GAOY3cOwO89_8BRSmRjB5x1XApXCbAqU2m2CVFsxWpsUr7Naw8F9zgR3DS_INZ4Lgmgq3NEfpt_10Qc189HaundOan0GJ7UbJwbkwpM')

const handleLogout = () => {
    isDropdownOpen.value = false
    authStore.logout()
    router.push('/login')
}
</script>
