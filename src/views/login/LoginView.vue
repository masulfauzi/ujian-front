<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
    router.push('/dashboard')
}
</script>

<template>
    <section class="relative min-h-[calc(100vh-64px)] overflow-hidden bg-slate-50">
        <div
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_45%)]">
        </div>

        <div class="relative mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center px-6 py-10">
            <div
                class="w-full max-w-[480px] rounded-3xl border border-white bg-white p-10 shadow-[0_20px_50px_rgba(14,165,233,0.08)]">
                <div class="mb-8 text-center">
                    <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-sky-100">
                        <svg class="h-8 w-8 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M17.5 19H9a7 7 0 1 1 2.32-13.6A5 5 0 1 1 17.5 19Z" />
                            <path d="m9 13 2 2 4-4" />
                        </svg>
                    </div>
                    <h2 class="mb-2 text-3xl font-semibold text-slate-900">Login</h2>
                    <p class="text-sm text-slate-500">Welcome back to SkyView Admin</p>
                </div>

                <form class="space-y-5" @submit.prevent="goToDashboard">
                    <div class="space-y-2">
                        <label class="ml-1 block text-sm font-medium text-slate-600">Username</label>
                        <div class="relative">
                            <span
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M20 21a8 8 0 0 0-16 0" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input type="text" placeholder="Enter your username"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                        </div>
                    </div>

                    <div class="space-y-2">
                        <label class="ml-1 block text-sm font-medium text-slate-600">Password</label>
                        <div class="relative">
                            <span
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input type="password" placeholder="••••••••"
                                class="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-12 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                            <button type="button"
                                class="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-sky-600">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-1">
                        <label class="flex items-center gap-2 text-sm text-slate-500">
                            <input type="checkbox"
                                class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500" />
                            Remember me
                        </label>
                        <a href="#" class="text-sm font-medium text-sky-600 hover:underline">Forgot password?</a>
                    </div>

                    <button type="submit"
                        class="mt-2 w-full rounded-lg bg-emerald-200 px-4 py-3 text-lg font-semibold text-emerald-900 transition hover:bg-emerald-300 active:scale-[0.98]">
                        Login
                    </button>

                    <p class="text-center text-sm text-slate-500">
                        Don't have an account?
                        <a href="#" class="font-semibold text-emerald-700 hover:underline">Create Account</a>
                    </p>
                </form>
            </div>
        </div>
    </section>
</template>