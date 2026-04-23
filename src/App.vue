<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const showNavbar = computed(() => route.path !== '/login')
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header v-if="showNavbar" class="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <h1 class="text-lg font-extrabold tracking-tight text-sky-600">Ujian Front</h1>
        <nav class="flex items-center gap-4 text-sm font-medium">
          <RouterLink class="rounded-md px-3 py-2 text-slate-600 hover:bg-sky-50 hover:text-sky-600" to="/login">
            Login
          </RouterLink>
          <RouterLink class="rounded-md px-3 py-2 text-slate-600 hover:bg-sky-50 hover:text-sky-600" to="/dashboard">
            Dashboard
          </RouterLink>
          <RouterLink class="rounded-md px-3 py-2 text-slate-600 hover:bg-sky-50 hover:text-sky-600" to="/bank-soal">
            Bank Soal
          </RouterLink>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
:deep(.router-link-active) {
  @apply bg-sky-100 text-sky-700;
}
</style>
