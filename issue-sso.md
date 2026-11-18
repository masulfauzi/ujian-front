# Issue: Halaman `/sso` untuk login otomatis dari aplikasi Skanida Student

## Latar belakang
Aplikasi Android **Skanida Student** membuka situs ujian di WebView dengan URL:
```
https://ujian.smkn2semarang.sch.id/sso?code=<KODE_SEKALI_PAKAI>
```
Kode berumur 60 detik dan hanya bisa dipakai sekali. Halaman `/sso` menukar kode itu ke backend
(`POST /api/auth/sso`, lihat `ujian-back/ISSUE_SSO_SKANIDA.md`), menyimpan token seperti login biasa,
lalu masuk ke `/dashboard`.

WebView di aplikasi menghapus cookie/localStorage setiap kali menu ujian dibuka, jadi alur ini dijalankan tiap kali siswa membuka menu.

## Yang dikerjakan

### 1. Service — `src/services/authService.js`
```js
export const loginWithSsoCode = async (code) => {
    const response = await api.post('/auth/sso', { code })
    return response.data
}
```

### 2. Store — `src/stores/auth.js`
Import `loginWithSsoCode`, tambah action (meniru `login`):
```js
async loginWithSso(code) {
    this.logout() // pastikan akun sebelumnya tidak tertinggal
    this.isLoading = true
    this.error = null
    try {
        const response = await loginWithSsoCode(code)
        if (response.success && response.data?.token) {
            this.applyToken(response.data.token, response.data.name)
            return response
        }
        throw new Error(response.message || 'Login otomatis gagal')
    } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Login otomatis gagal'
        throw err
    } finally {
        this.isLoading = false
    }
},
```

### 3. View — `src/modules/auth/views/SsoLogin.vue` (baru)
```vue
<template>
    <main class="flex-grow flex items-center justify-center min-h-screen px-gutter bg-mesh">
        <div class="w-full max-w-[420px] bg-white rounded-[24px] p-lg text-center shadow">
            <template v-if="!error">
                <div class="mx-auto mb-md h-10 w-10 animate-spin rounded-full border-4 border-primary-container border-t-transparent"></div>
                <p class="font-body-md text-on-surface-variant">Masuk ke ujian...</p>
            </template>
            <template v-else>
                <p class="mb-md p-md bg-red-100 border border-red-300 rounded-lg text-red-800 font-body-md">⚠ {{ error }}</p>
                <button class="w-full py-3 rounded-lg bg-primary-container text-white" @click="router.replace('/login')">
                    Login manual
                </button>
            </template>
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
```
Sesuaikan kelas Tailwind dengan desain `Login.vue`.

### 4. Route — `src/modules/auth/routes/index.js`
```js
import SsoLoginView from '../views/SsoLogin.vue'
// ...
{
    path: '/sso',
    name: 'auth.sso',
    component: SsoLoginView,
},
```

### 5. Guard — `src/router/guards.js`
`/sso` harus **selalu** bisa diakses, baik sudah login maupun belum (jangan diarahkan ke `/dashboard` atau `/login` oleh guard;
halaman sendiri yang mengatur redirect). Tambahkan di awal `beforeEach`:
```js
if (to.path === '/sso') {
    next()
    return
}
```

### 6. Server / hosting
Pastikan server (nginx/apache) mengarahkan `/sso` ke `index.html` (SPA fallback), sama seperti `/login`.

## Pengujian
1. Ambil kode dari sianida (`POST /api/ujian/sso-code`, lihat `sianida/issue-ujian-sso.md`).
2. Buka `https://ujian.smkn2semarang.sch.id/sso?code=<KODE>` di browser → langsung `/dashboard` peserta yang benar,
   URL di address bar menjadi `/sso` tanpa kode lalu `/dashboard`.
3. Buka URL yang sama lagi (kode sudah dipakai) → pesan error + tombol "Login manual".
4. `/sso` tanpa kode: sudah login → `/dashboard`; belum login → `/login`.
5. Login manual biasa tetap berfungsi.
