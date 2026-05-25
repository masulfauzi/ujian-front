<template>
  <div class="font-body-md bg-background text-on-background min-h-screen flex flex-col">
    <!-- Default App Header (hidden on dashboard pages) -->
    <header v-if="!isDashboardPage"
      class="bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm fixed top-0 w-full z-50 font-['Plus_Jakarta_Sans'] antialiased">
      <div class="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
        <div class="text-xl font-extrabold tracking-tight text-primary">
          SkyView Admin
        </div>
        <div class="flex items-center space-gap-4">
          <button
            class="text-slate-600 hover:text-sky-500 hover:bg-sky-50 transition-colors duration-200 px-3 py-2 rounded-lg text-label-md">
            Help
          </button>
          <button
            class="p-2 text-slate-600 hover:bg-sky-50 rounded-full transition-colors active:scale-95 transition-transform">
            <span class="material-symbols-outlined" data-icon="dark_mode">dark_mode</span>
          </button>
        </div>
      </div>
    </header>
    <div :class="!isLoginPage && !isDashboardPage ? 'pt-16 bg-background' : ''" class="flex-grow flex flex-col">
      <router-view />
    </div>
    <AppDialog />
    <footer
      class="bg-slate-50 border-t border-slate-200 w-full py-8 mt-auto text-sm font-['Plus_Jakarta_Sans'] text-slate-500">
      <div class="flex flex-col md:flex-row justify-between items-center px-8 space-y-4 md:space-y-0 max-w-7xl mx-auto">
        <div class="font-bold text-slate-900">
          SkyView Systems
        </div>
        <div class="flex space-x-6">
          <a class="text-slate-500 hover:text-sky-500 hover:underline transition-all cursor-pointer" href="#">Privacy
            Policy</a>
          <a class="text-slate-500 hover:text-sky-500 hover:underline transition-all cursor-pointer" href="#">Terms of
            Service</a>
          <a class="text-slate-500 hover:text-sky-500 hover:underline transition-all cursor-pointer" href="#">Contact
            Support</a>
        </div>
        <div class="text-slate-500">
          © 2024 SkyView Systems. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppDialog from '@/components/AppDialog.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
const isDashboardPage = computed(() => route.path.startsWith('/dashboard') || route.path.startsWith('/admin') || route.path.startsWith('/schedule') || route.path.startsWith('/ujian'))
</script>
