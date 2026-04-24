<template>
    <div class="bg-slate-50 text-slate-900">
        <main class="min-h-screen p-4 lg:ml-64 lg:mt-0 lg:p-8">
            <section class="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 class="mb-2 text-3xl font-semibold text-slate-900">Welcome back, Dr. Sarah!</h2>
                    <p class="text-sm text-slate-500">Here's what's happening with your exams today.</p>
                </div>
                <div class="text-left lg:text-right">
                    <p class="text-[10px] uppercase tracking-[0.2em] text-slate-400">Today's Date</p>
                    <p class="text-sm font-bold text-slate-700">October 24, 2023</p>
                </div>
            </section>

            <section class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <article
                    class="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div
                        class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-50 transition-transform group-hover:scale-110">
                    </div>
                    <p class="mb-1 text-xs text-slate-500">Total Questions</p>
                    <p class="text-2xl font-semibold text-slate-800">1,284</p>
                    <p class="mt-2 text-[11px] font-semibold text-emerald-600">+12 today</p>
                </article>

                <article
                    class="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div
                        class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-50 transition-transform group-hover:scale-110">
                    </div>
                    <p class="mb-1 text-xs text-slate-500">Active Exams</p>
                    <p class="text-2xl font-semibold text-slate-800">8</p>
                    <p class="mt-2 text-[11px] font-semibold text-emerald-600">3 ending soon</p>
                </article>

                <article
                    class="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div
                        class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-sky-50 transition-transform group-hover:scale-110">
                    </div>
                    <p class="mb-1 text-xs text-slate-500">Total Students</p>
                    <p class="text-2xl font-semibold text-slate-800">452</p>
                    <p class="mt-2 text-[11px] font-semibold text-slate-500">98% active</p>
                </article>

                <article
                    class="group relative overflow-hidden rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div
                        class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-50 transition-transform group-hover:scale-110">
                    </div>
                    <p class="mb-1 text-xs text-slate-500">Average Grade</p>
                    <p class="text-2xl font-semibold text-slate-800">84.2</p>
                    <p class="mt-2 text-[11px] font-semibold text-emerald-600">+2.4% vs last term</p>
                </article>
            </section>

            <section class="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div class="space-y-6 xl:col-span-2">
                    <article
                        class="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_20px_50px_rgba(14,165,233,0.05)] lg:p-8">
                        <div class="mb-8 flex items-center justify-between">
                            <div>
                                <h3 class="text-xl font-semibold text-slate-800">Recent Exam Submissions</h3>
                                <p class="text-sm text-slate-500">Real-time update of student activity</p>
                            </div>
                            <button class="text-sm font-semibold text-sky-600 hover:underline">View All</button>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[640px] text-left text-sm">
                                <thead>
                                    <tr
                                        class="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400">
                                        <th class="pb-4">Student</th>
                                        <th class="pb-4">Exam Name</th>
                                        <th class="pb-4">Time</th>
                                        <th class="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <tr class="hover:bg-slate-50/60">
                                        <td class="py-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                                                    AD</div>
                                                <span class="font-medium text-slate-700">Ahmad Dahlan</span>
                                            </div>
                                        </td>
                                        <td class="py-4 text-slate-600">Calculus II Mid-term</td>
                                        <td class="py-4 text-slate-500">10:45 AM</td>
                                        <td class="py-4">
                                            <span
                                                class="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Submitted</span>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-slate-50/60">
                                        <td class="py-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                                                    BP</div>
                                                <span class="font-medium text-slate-700">Budi Pratama</span>
                                            </div>
                                        </td>
                                        <td class="py-4 text-slate-600">English Literature</td>
                                        <td class="py-4 text-slate-500">10:32 AM</td>
                                        <td class="py-4">
                                            <span
                                                class="rounded-full bg-sky-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-sky-700">In
                                                Progress</span>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-slate-50/60">
                                        <td class="py-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                                                    CA</div>
                                                <span class="font-medium text-slate-700">Citra Ananda</span>
                                            </div>
                                        </td>
                                        <td class="py-4 text-slate-600">Calculus II Mid-term</td>
                                        <td class="py-4 text-slate-500">09:58 AM</td>
                                        <td class="py-4">
                                            <span
                                                class="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Submitted</span>
                                        </td>
                                    </tr>
                                    <tr class="hover:bg-slate-50/60">
                                        <td class="py-4">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                                                    DS</div>
                                                <span class="font-medium text-slate-700">Dewi Sartika</span>
                                            </div>
                                        </td>
                                        <td class="py-4 text-slate-600">Advanced Physics</td>
                                        <td class="py-4 text-slate-500">09:15 AM</td>
                                        <td class="py-4">
                                            <span
                                                class="rounded-full bg-rose-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-rose-700">Late
                                                Submission</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </article>
                </div>

                <div class="space-y-6">
                    <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 class="mb-6 text-xs font-bold uppercase tracking-wider text-slate-800">Quick Actions</h3>
                        <div class="space-y-4">
                            <button
                                class="flex w-full items-center justify-between rounded-xl bg-sky-500 p-4 text-white shadow-lg shadow-sky-200 transition hover:opacity-90 active:scale-95">
                                <span class="text-sm font-semibold">Create New Question</span>
                                <span>›</span>
                            </button>
                            <button
                                class="flex w-full items-center justify-between rounded-xl border-2 border-emerald-200 bg-white p-4 text-emerald-700 transition hover:bg-emerald-50 active:scale-95">
                                <span class="text-sm font-semibold">Schedule Exam</span>
                                <span>›</span>
                            </button>
                            <button
                                class="flex w-full items-center justify-between rounded-xl bg-slate-50 p-4 text-slate-600 transition hover:bg-slate-100 active:scale-95">
                                <span class="text-sm font-semibold">Add Participant</span>
                                <span>›</span>
                            </button>
                        </div>
                    </article>

                    <article class="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-slate-800">System Overview</h3>
                        <div class="space-y-4">
                            <div class="h-24 w-full overflow-hidden rounded-lg bg-slate-100 p-2">
                                <div class="flex h-full items-end gap-[2px]">
                                    <div class="h-[30%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[45%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[35%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[60%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[80%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[65%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[90%] w-full rounded-t-sm bg-sky-500"></div>
                                    <div class="h-[75%] w-full rounded-t-sm bg-sky-500"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-slate-500">Weekly System Usage</span>
                                <span class="font-bold text-emerald-600">+18.5%</span>
                            </div>
                        </div>

                        <div class="mt-6 space-y-3 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-500">Server Load</span>
                                <span class="font-semibold text-slate-700">32%</span>
                            </div>
                            <div class="h-1 w-full rounded-full bg-slate-100">
                                <div class="h-1 w-[32%] rounded-full bg-emerald-300"></div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-500">Storage Used</span>
                                <span class="font-semibold text-slate-700">68%</span>
                            </div>
                            <div class="h-1 w-full rounded-full bg-slate-100">
                                <div class="h-1 w-[68%] rounded-full bg-sky-500"></div>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    </div>
</template>