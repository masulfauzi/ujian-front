<template>
    <!-- SideNavBar -->
    <aside
        class="fixed left-0 top-0 h-screen w-64 border-r bg-white border-slate-200 shadow-2xl shadow-sky-500/5 flex flex-col h-full p-4 space-y-2 z-50">
        <!-- Logo Section -->
        <div class="mb-8 px-4 flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span class="material-symbols-outlined text-white"
                    style="font-variation-settings: 'FILL' 1;">school</span>
            </div>
            <div>
                <h2 class="text-lg font-black text-sky-600 leading-none">ExamPro</h2>
                <p class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Student Portal</p>
            </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="space-y-1">
            <router-link to="/dashboard"
                class="flex items-center gap-3 bg-sky-50 text-sky-600 rounded-lg px-4 py-3 font-semibold hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">dashboard</span>
                <span class="font-label-md text-label-md">Dashboard</span>
            </router-link>
            <router-link to="/schedule"
                class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">calendar_today</span>
                <span class="font-label-md text-label-md">Exam Schedule</span>
            </router-link>
            <router-link to="/results"
                class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">analytics</span>
                <span class="font-label-md text-label-md">Exam Results</span>
            </router-link>
        </nav>

        <!-- Start Exam Button -->
        <div class="mt-8 px-4">
            <button
                class="w-full bg-primary-container text-white rounded-xl py-3 px-4 font-bold text-sm shadow-lg shadow-sky-200 flex items-center justify-center gap-2 scale-95 active:scale-90 duration-150 hover:scale-100 transition-transform">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                Start New Exam
            </button>
        </div>

        <!-- Bottom Menu -->
        <div class="mt-auto pt-6 border-t border-slate-100 space-y-1">
            <a href="#"
                class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">settings</span>
                <span class="font-label-md text-label-md">Settings</span>
            </a>
            <a href="#"
                class="flex items-center gap-3 text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-3 transition-all hover:translate-x-1 duration-200">
                <span class="material-symbols-outlined">logout</span>
                <span class="font-label-md text-label-md">Logout</span>
            </a>
        </div>
    </aside>
</template>

<script>
export default {
    name: 'SideBar'
}
</script>
