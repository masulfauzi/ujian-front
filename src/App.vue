<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const isLoginPage = computed(() => route.path === '/login')
const isFullscreenPage = computed(() => Boolean(route.meta?.fullscreen))

const showSidebar = computed(() => !isLoginPage.value && !isFullscreenPage.value)
const showGlobalHeader = computed(() => !isLoginPage.value && !isFullscreenPage.value)

const dashboardMenuClass = computed(() => {
  const isActive = route.path === '/dashboard'
  return isActive
    ? 'flex items-center gap-3 border-r-4 border-sky-500 bg-sky-50 px-3 py-3 font-semibold text-sky-600'
    : 'flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500'
})

const bankSoalMenuClass = computed(() => {
  const isActive = route.path.startsWith('/bank-soal')
  return isActive
    ? 'flex items-center gap-3 border-r-4 border-sky-500 bg-sky-50 px-3 py-3 font-semibold text-sky-600'
    : 'flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500'
})

const ujianMenuClass = computed(() => {
  const isActive = route.path.startsWith('/ujian')
  return isActive
    ? 'flex items-center gap-3 border-r-4 border-sky-500 bg-sky-50 px-3 py-3 font-semibold text-sky-600'
    : 'flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500'
})

const dashboardSiswaMenuClass = computed(() => {
  const isActive = route.path === '/dashboard-siswa'
  return isActive
    ? 'flex items-center gap-3 border-r-4 border-sky-500 bg-sky-50 px-3 py-3 font-semibold text-sky-600'
    : 'flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500'
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <aside v-if="showSidebar"
      class="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-slate-200 bg-white py-6 shadow-[4px_0_20px_rgba(0,0,0,0.05)] lg:flex">
      <div class="mb-10 px-6">
        <h1 class="text-xl font-bold tracking-tight text-sky-600">ExamPro</h1>
        <p class="text-xs font-medium text-slate-500">Management Portal</p>
      </div>

      <nav class="flex-1 space-y-1 px-3 text-sm">
        <RouterLink :class="dashboardMenuClass" to="/dashboard">
          <span>Dashboard</span>
        </RouterLink>
        <RouterLink :class="dashboardSiswaMenuClass" to="/dashboard-siswa">
          <span>Dashboard Siswa</span>
        </RouterLink>
        <RouterLink :class="bankSoalMenuClass" to="/bank-soal">
          <span>Bank Soal</span>
        </RouterLink>
        <RouterLink :class="ujianMenuClass" to="/ujian">
          <span>Ujian</span>
        </RouterLink>
        <a class="flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500"
          href="#">
          <span>Peserta Ujian</span>
        </a>
        <a class="flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500"
          href="#">
          <span>Jadwal Ujian</span>
        </a>
        <a class="flex items-center gap-3 px-3 py-3 text-slate-500 transition hover:bg-slate-50 hover:text-sky-500"
          href="#">
          <span>Nilai</span>
        </a>
      </nav>

      <div class="mt-auto border-t border-slate-100 px-6 pt-6">
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">SW
          </div>
          <div class="overflow-hidden">
            <p class="truncate text-xs font-bold text-slate-800">Dr. Sarah Wijaya</p>
            <p class="truncate text-[10px] text-slate-500">Senior Administrator</p>
          </div>
        </div>
      </div>
    </aside>

    <header v-if="showGlobalHeader"
      class="sticky top-0 z-30 h-16 border-b border-slate-200 bg-white/80 px-4 backdrop-blur lg:left-64 lg:ml-64 lg:px-8">
      <div class="flex h-full items-center justify-between">
        <div class="flex items-center gap-6">
          <span class="text-base font-semibold text-slate-800 lg:text-lg">Exam Management</span>
          <div class="hidden items-center lg:flex">
            <input
              class="w-64 rounded-full border-none bg-slate-100 px-4 py-2 text-xs outline-none ring-2 ring-transparent transition focus:ring-sky-500"
              placeholder="Search exams, students..." type="text" />
          </div>
        </div>
        <div class="flex items-center gap-3 text-sm text-slate-600">
          <button class="rounded-full p-2 transition hover:bg-slate-100">🔔</button>
          <button class="rounded-full p-2 transition hover:bg-slate-100">❔</button>
          <div class="hidden h-8 w-px bg-slate-200 md:block"></div>
          <span class="hidden font-medium text-slate-700 md:block">Sarah Wijaya</span>
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-sky-100 bg-white text-xs font-bold text-sky-700">
            SW
          </div>
        </div>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
