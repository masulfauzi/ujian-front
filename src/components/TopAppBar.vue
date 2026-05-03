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

            <!-- User Profile -->
            <div class="flex items-center gap-3 pl-2">
                <div class="text-right">
                    <p class="font-label-md text-label-md text-on-surface">{{ userName }}</p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{{ userRole }}</p>
                </div>
                <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-100 p-0.5">
                    <img alt="User profile avatar" class="w-full h-full object-cover rounded-full" :src="userAvatar" />
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'TopAppBar',
    data() {
        return {
            userName: 'Alex Johnston',
            userRole: 'Undergraduate Student',
            userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9U5KURX3eumGQKeub8bUR7L74sraVdj5vIY-omMSvEMaGBJldTzEYfYTvmZppjymd35ebrZbDV3aifEC1b1mYRpgJ2zGe0qL_VWoku_0phkarPtEIQU8GRxUXoipSKtyNOZbHsH-I00WvpZcGt8JMEM1aDNdjpr4l_alp-GAOY3cOwO89_8BRSmRjB5x1XApXCbAqU2m2CVFsxWpsUr7Naw8F9zgR3DS_INZ4Lgmgq3NEfpt_10Qc189HaundOan0GJ7UbJwbkwpM'
        }
    }
}
</script>
