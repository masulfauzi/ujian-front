<template>
    <main class="flex-grow flex items-center justify-center min-h-screen px-gutter bg-mesh">
        <div class="w-full max-w-[420px]">
            <div
                class="bg-white rounded-[24px] p-lg shadow-[0_20px_50px_rgba(14,165,233,0.08)] border border-white text-center">
                <template v-if="!error">
                    <div
                        class="mx-auto mb-md h-10 w-10 animate-spin rounded-full border-4 border-primary-container border-t-transparent">
                    </div>
                    <p class="font-body-md text-on-surface-variant">Masuk ke ujian...</p>
                </template>
                <template v-else>
                    <div
                        class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-xl mb-md">
                        <span class="material-symbols-outlined text-[40px] text-red-600"
                            style="font-variation-settings: 'FILL' 1;">error</span>
                    </div>
                    <h1 class="font-h3 text-on-surface mb-md">Login otomatis gagal</h1>
                    <div
                        class="mb-md p-md bg-red-100 border border-red-300 rounded-lg text-red-800 font-body-md">
                        ⚠ {{ error }}
                    </div>
                    <button type="button"
                        class="w-full py-3 rounded-lg bg-primary-container text-white font-label-md hover:opacity-90 active:scale-[0.98] transition-all"
                        @click="router.replace('/login')">
                        Login manual
                    </button>
                </template>
            </div>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const error = ref(null)

onMounted(async () => {
    const code = typeof route.query.code === 'string' ? route.query.code : ''

    // Buang kode dari URL & riwayat secepatnya (tidak bisa dipakai ulang / di-reload).
    window.history.replaceState(window.history.state, '', '/sso')

    if (!code) {
        router.replace(authStore.isAuthenticated ? '/dashboard' : '/login')
        return
    }

    try {
        await authStore.loginWithSso(code)
        router.replace('/dashboard')
    } catch {
        error.value = authStore.error || 'Login otomatis gagal. Silakan login manual.'
    }
})
</script>
