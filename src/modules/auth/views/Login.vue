<template>
    <main class="flex-grow flex items-center justify-center pt-16 px-gutter bg-mesh">
        <div class="w-full max-w-[480px]">
            <div
                class="bg-white rounded-[24px] p-lg shadow-[0_20px_50px_rgba(14,165,233,0.08)] border border-white relative overflow-hidden">
                <!-- Logo & Heading -->
                <div class="text-center mb-md">
                    <div
                        class="inline-flex items-center justify-center w-16 h-16 bg-primary-container/10 rounded-xl mb-md">
                        <span class="material-symbols-outlined text-[40px] text-primary-container"
                            data-icon="cloud_done" style="font-variation-settings: 'FILL' 1;">cloud_done</span>
                    </div>
                    <h1 class="font-h2 text-h2 text-on-surface mb-2">Login</h1>
                    <p class="font-body-md text-on-surface-variant">Welcome back to SkyView Admin</p>
                </div>
                <!-- Error Message -->
                <div v-if="errors.general"
                    class="mb-md p-md bg-red-100 border border-red-300 rounded-lg text-red-800 font-body-md">
                    ⚠ {{ errors.general }}
                </div>

                <!-- Form -->
                <form class="space-y-md" @submit.prevent="handleLogin">
                    <!-- Username Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Username</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="person">person</span>
                            </div>
                            <input
                                v-model="form.username"
                                :class="['w-full pl-12 pr-4 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.username ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="Enter your username" type="text" />
                        </div>
                        <p v-if="errors.username" class="text-red-600 font-label-sm mt-1">{{ errors.username }}</p>
                    </div>
                    <!-- Password Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Password</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="lock">lock</span>
                            </div>
                            <input
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                :class="['w-full pl-12 pr-12 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.password ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="••••••••" />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary-container transition-colors">
                                <span class="material-symbols-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                            </button>
                        </div>
                        <p v-if="errors.password" class="text-red-600 font-label-sm mt-1">{{ errors.password }}</p>
                    </div>
                    <!-- Options -->
                    <div class="flex items-center justify-between py-1">
                        <label class="flex items-center cursor-pointer group">
                            <div class="relative">
                                <input v-model="form.rememberMe" class="sr-only peer" type="checkbox" />
                                <div
                                    class="w-5 h-5 border-2 border-outline-variant rounded-md peer-checked:bg-primary-container peer-checked:border-primary-container transition-all">
                                </div>
                                <span
                                    class="material-symbols-outlined absolute inset-0 text-white text-[16px] flex items-center justify-center opacity-0 peer-checked:opacity-100"
                                    data-icon="check">check</span>
                            </div>
                            <span class="ml-2 font-label-md text-on-surface-variant">Remember me</span>
                        </label>
                        <a class="font-label-md text-primary-container hover:underline" href="#">Forgot password?</a>
                    </div>
                    <!-- Login Button (Mint Green) -->
                    <button
                        type="submit"
                        :disabled="authStore.isLoading"
                        class="w-full py-4 bg-secondary-container text-on-secondary-container font-h3 text-h3 rounded-lg shadow-sm hover:shadow-md hover:bg-secondary-fixed-dim transition-all active:scale-[0.98] mt-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="!authStore.isLoading">Login</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                        </span>
                    </button>
                    <!-- Create Account -->
                    <p class="text-center font-body-md text-on-surface-variant mt-md">
                        Don't have an account?
                        <router-link to="/register" class="text-secondary font-semibold hover:underline">Create Account</router-link>
                    </p>
                </form>
                <!-- Decorative corner elements -->
                <div class="absolute -top-12 -right-12 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl"></div>
                <div class="absolute -bottom-12 -left-12 w-24 h-24 bg-primary-container/10 rounded-full blur-2xl"></div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    username: '',
    password: '',
    rememberMe: false,
})

const errors = ref({})
const showPassword = ref(false)

const handleLogin = async () => {
    errors.value = {}

    // Validation
    if (!form.value.username.trim()) {
        errors.value.username = 'Username is required'
    }
    if (!form.value.password) {
        errors.value.password = 'Password is required'
    }

    if (Object.keys(errors.value).length > 0) {
        return
    }

    try {
        await authStore.login({
            username: form.value.username,
            password: form.value.password
        })
        router.push('/dashboard')
    } catch (error) {
        const errorData = error.response?.data
        if (errorData?.message) {
            errors.value.general = errorData.message
        } else if (authStore.error) {
            errors.value.general = authStore.error
        } else if (!navigator.onLine) {
            errors.value.general = 'Network error. Please check your internet connection.'
        } else {
            errors.value.general = 'Failed to login. Please try again.'
        }
    }
}
</script>
