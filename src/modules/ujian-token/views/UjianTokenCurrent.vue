<template>
  <div class="bg-surface min-h-screen">
    <SideBar />
    <TopAppBar />

    <main class="lg:ml-64 min-h-screen">
      <div class="pt-24 pb-12 px-4 lg:px-8 max-w-2xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-slate-900">Token Ujian</h1>
          <p class="text-slate-500 mt-1">Umumkan kode ini ke peserta di awal sesi untuk jadwal yang mewajibkan token</p>
        </div>

        <div v-if="error" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ error }}
        </div>

        <div v-if="isLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="inline-block w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p class="mt-3 text-slate-600">Memuat token ujian...</p>
          </div>
        </div>

        <template v-else-if="tokenData">
          <!-- Token Card -->
          <div class="bg-gradient-to-br from-sky-500 to-sky-700 rounded-3xl p-10 text-white text-center shadow-lg relative overflow-hidden">
            <div class="absolute -right-10 -bottom-10 opacity-10">
              <span class="material-symbols-outlined text-[180px]">vpn_key</span>
            </div>
            <p class="text-sky-100 text-xs font-bold uppercase tracking-widest mb-4 relative z-10">Token Ujian Berlaku Saat Ini</p>
            <p class="relative z-10 font-black text-6xl tracking-[0.3em] mb-6 select-all" style="word-break: break-all;">
              {{ tokenData.token }}
            </p>
            <button
              @click="copyToken"
              class="relative z-10 inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl font-semibold transition-colors backdrop-blur-sm">
              <span class="material-symbols-outlined text-[18px]">{{ copied ? 'check' : 'content_copy' }}</span>
              {{ copied ? 'Tersalin!' : 'Salin Token' }}
            </button>
          </div>

          <!-- Countdown -->
          <div class="bg-white rounded-lg shadow border border-slate-200 p-6 mt-6">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-semibold text-slate-700">Token berganti otomatis dalam</p>
              <p class="text-lg font-black" :class="countdown <= 10 ? 'text-red-600' : 'text-sky-600'">
                {{ formatCountdown(countdown) }}
              </p>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000 ease-linear"
                :class="countdown <= 10 ? 'bg-red-500' : 'bg-sky-500'"
                :style="{ width: `${progressPercent}%` }">
              </div>
            </div>
            <p class="text-xs text-slate-400 mt-2">Periode rotasi: {{ tokenData.periode_detik }} detik</p>
          </div>

          <!-- Info -->
          <div class="bg-sky-50 border border-sky-200 rounded-lg p-4 mt-6 flex items-start gap-3">
            <span class="material-symbols-outlined text-sky-600">info</span>
            <p class="text-sm text-sky-800">
              Token ini bersifat global dan berlaku untuk semua jadwal yang mengaktifkan opsi
              <span class="font-semibold">"Wajib Token Ujian"</span>, termasuk saat beberapa jadwal berjalan bersamaan.
              Peserta memasukkan kode ini saat menekan tombol "Mulai Ujian Sekarang". Token akan otomatis berganti
              setiap {{ tokenData.periode_detik }} detik.
            </p>
          </div>

          <button
            @click="fetchToken"
            :disabled="isRefreshing"
            class="mt-6 w-full border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            <span class="material-symbols-outlined" :class="{ 'animate-spin': isRefreshing }">refresh</span>
            {{ isRefreshing ? 'Memuat...' : 'Muat Ulang' }}
          </button>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { ujianTokenService } from '@/services/ujianTokenService'

const isLoading = ref(false)
const isRefreshing = ref(false)
const error = ref(null)
const tokenData = ref(null)
const countdown = ref(0)
const copied = ref(false)

let countdownInterval = null
let copiedTimeout = null

const progressPercent = computed(() => {
  if (!tokenData.value?.periode_detik) return 0
  return Math.max(0, Math.min(100, (countdown.value / tokenData.value.periode_detik) * 100))
})

function formatCountdown(seconds) {
  if (seconds <= 0) return '00:00'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

async function copyToken() {
  if (!tokenData.value?.token) return
  try {
    await navigator.clipboard.writeText(tokenData.value.token)
    copied.value = true
    if (copiedTimeout) clearTimeout(copiedTimeout)
    copiedTimeout = setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.warn('Gagal menyalin token:', err)
  }
}

function startCountdown() {
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      // Periode habis, ambil token baru dari server
      fetchToken()
    }
  }, 1000)
}

async function fetchToken(isInitial = false) {
  if (isInitial) {
    isLoading.value = true
  } else {
    isRefreshing.value = true
  }
  error.value = null

  try {
    const response = await ujianTokenService.getCurrentToken()
    tokenData.value = response.data
    countdown.value = response.data?.sisa_detik || 0
    startCountdown()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal memuat token ujian'
  } finally {
    isLoading.value = false
    isRefreshing.value = false
  }
}

onMounted(() => fetchToken(true))

onBeforeUnmount(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (copiedTimeout) clearTimeout(copiedTimeout)
})
</script>
