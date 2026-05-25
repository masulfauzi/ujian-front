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
                            data-icon="person_add" style="font-variation-settings: 'FILL' 1;">person_add</span>
                    </div>
                    <h1 class="font-h2 text-h2 text-on-surface mb-2">Create Account</h1>
                    <p class="font-body-md text-on-surface-variant">Join SkyView Admin to get started</p>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage"
                    class="mb-md p-md bg-green-100 border border-green-300 rounded-lg text-green-800 font-body-md">
                    ✓ {{ successMessage }}
                </div>

                <!-- Error Message -->
                <div v-if="errors.general"
                    class="mb-md p-md bg-red-100 border border-red-300 rounded-lg text-red-800 font-body-md">
                    ⚠ {{ errors.general }}
                </div>

                <!-- Form -->
                <form class="space-y-md" @submit.prevent="handleRegister">
                    <!-- Name Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Full Name</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="person">person</span>
                            </div>
                            <input
                                v-model="formData.name"
                                @blur="validateField('name')"
                                :class="['w-full pl-12 pr-4 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.name ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="Enter your full name" type="text" />
                        </div>
                        <p v-if="errors.name" class="text-red-600 font-label-sm mt-1">{{ errors.name }}</p>
                    </div>

                    <!-- Username Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Username</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
                            </div>
                            <input
                                v-model="formData.username"
                                @blur="validateField('username')"
                                :class="['w-full pl-12 pr-4 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.username ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="Enter your username" type="text" />
                        </div>
                        <p v-if="errors.username" class="text-red-600 font-label-sm mt-1">{{ errors.username }}</p>
                    </div>

                    <!-- Email Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Email Address</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="mail">mail</span>
                            </div>
                            <input
                                v-model="formData.email"
                                @blur="validateField('email')"
                                :class="['w-full pl-12 pr-4 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.email ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="Enter your email" type="email" />
                        </div>
                        <p v-if="errors.email" class="text-red-600 font-label-sm mt-1">{{ errors.email }}</p>
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
                                v-model="formData.password"
                                @blur="validateField('password')"
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

                    <!-- Confirm Password Field -->
                    <div class="space-y-xs">
                        <label class="font-label-md text-on-surface-variant block ml-1">Confirm Password</label>
                        <div class="relative group">
                            <div
                                class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline group-focus-within:text-primary-container transition-colors">
                                <span class="material-symbols-outlined" data-icon="lock">lock</span>
                            </div>
                            <input
                                v-model="formData.confirmPassword"
                                @blur="validateField('confirmPassword')"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                :class="['w-full pl-12 pr-12 py-3 bg-surface-container-low border rounded-lg font-body-md focus:ring-4 focus:ring-primary-container/10 outline-none transition-all placeholder:text-outline-variant',
                                errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-outline-variant focus:border-primary-container'
                                ]"
                                placeholder="••••••••" />
                            <button
                                type="button"
                                @click="showConfirmPassword = !showConfirmPassword"
                                class="absolute inset-y-0 right-0 pr-4 flex items-center text-outline hover:text-primary-container transition-colors">
                                <span class="material-symbols-outlined">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
                            </button>
                        </div>
                        <p v-if="errors.confirmPassword" class="text-red-600 font-label-sm mt-1">{{ errors.confirmPassword }}</p>
                    </div>

                    <!-- Terms Checkbox -->
                    <label class="flex items-center cursor-pointer group">
                        <div class="relative">
                            <input v-model="formData.agreeTerms" class="sr-only peer" type="checkbox" />
                            <div
                                class="w-5 h-5 border-2 border-outline-variant rounded-md peer-checked:bg-primary-container peer-checked:border-primary-container transition-all">
                            </div>
                            <span
                                class="material-symbols-outlined absolute inset-0 text-white text-[16px] flex items-center justify-center opacity-0 peer-checked:opacity-100"
                                data-icon="check">check</span>
                        </div>
                        <span class="ml-2 font-label-md text-on-surface-variant">I agree to the Terms & Conditions</span>
                    </label>

                    <!-- Register Button -->
                    <button
                        type="submit"
                        :disabled="authStore.isLoading"
                        class="w-full py-4 bg-secondary-container text-on-secondary-container font-h3 text-h3 rounded-lg shadow-sm hover:shadow-md hover:bg-secondary-fixed-dim transition-all active:scale-[0.98] mt-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        <span v-if="!authStore.isLoading">Create Account</span>
                        <span v-else class="flex items-center gap-2">
                            <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating Account...
                        </span>
                    </button>

                    <!-- Login Link -->
                    <p class="text-center font-body-md text-on-surface-variant mt-md">
                        Already have an account?
                        <router-link to="/login" class="text-secondary font-semibold hover:underline">Sign In</router-link>
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
import { registerUser } from '@/services/authService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
})

const errors = ref({})
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const validateField = (field) => {
    switch (field) {
        case 'name':
            errors.value.name = ''
            if (!formData.value.name.trim()) {
                errors.value.name = 'Name is required'
            } else if (formData.value.name.trim().length < 3) {
                errors.value.name = 'Name must be at least 3 characters'
            }
            break
        case 'username':
            errors.value.username = ''
            if (!formData.value.username.trim()) {
                errors.value.username = 'Username is required'
            } else if (formData.value.username.trim().length < 3) {
                errors.value.username = 'Username must be at least 3 characters'
            } else if (!/^[a-zA-Z0-9_]+$/.test(formData.value.username)) {
                errors.value.username = 'Username can only contain letters, numbers, and underscores'
            }
            break
        case 'email':
            errors.value.email = ''
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!formData.value.email.trim()) {
                errors.value.email = 'Email is required'
            } else if (!emailRegex.test(formData.value.email)) {
                errors.value.email = 'Please enter a valid email address'
            }
            break
        case 'password':
            errors.value.password = ''
            if (!formData.value.password) {
                errors.value.password = 'Password is required'
            } else if (formData.value.password.length < 6) {
                errors.value.password = 'Password must be at least 6 characters'
            }
            break
        case 'confirmPassword':
            errors.value.confirmPassword = ''
            if (!formData.value.confirmPassword) {
                errors.value.confirmPassword = 'Confirm password is required'
            } else if (formData.value.confirmPassword !== formData.value.password) {
                errors.value.confirmPassword = 'Passwords do not match'
            }
            break
    }
}

const isFormValid = () => {
    validateField('name')
    validateField('username')
    validateField('email')
    validateField('password')
    validateField('confirmPassword')

    if (!formData.value.agreeTerms) {
        errors.value.terms = 'You must agree to the Terms & Conditions'
    } else {
        errors.value.terms = ''
    }

    // Count only non-empty errors
    const errorCount = Object.values(errors.value).filter(error => error && error.trim()).length
    return errorCount === 0
}

const handleRegister = async () => {
    errors.value = {}
    successMessage.value = ''

    if (!isFormValid()) {
        // Show specific error messages instead of generic message
        const errorMessages = Object.entries(errors.value)
            .filter(([key, value]) => key !== 'general' && value)
            .map(([key, value]) => value)

        if (errorMessages.length > 0) {
            errors.value.general = errorMessages.join(', ')
        } else {
            errors.value.general = 'Please fix the errors above'
        }
        console.log('Validation errors:', errors.value)
        return
    }

    try {
        const response = await authStore.register({
            name: formData.value.name,
            username: formData.value.username,
            email: formData.value.email,
            password: formData.value.password
        })

        successMessage.value = response.message || 'Account created successfully!'

        // Reset form
        formData.value = {
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false
        }

        // Redirect after 2 seconds
        setTimeout(() => {
            router.push('/login')
        }, 2000)
    } catch (error) {
        const errorData = error.response?.data
        if (errorData?.errors) {
            errors.value = { ...errorData.errors }
        } else if (authStore.error) {
            errors.value.general = authStore.error
        } else if (!navigator.onLine) {
            errors.value.general = 'Network error. Please check your internet connection.'
        } else {
            errors.value.general = 'Failed to create account. Please try again.'
        }
    }
}
</script>
