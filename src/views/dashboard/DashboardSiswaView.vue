<template>
    <div class="bg-slate-50 text-slate-900">
        <main class="w-full px-4 pb-12 pt-8 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8">
            <div class="mx-auto max-w-7xl">
                <section class="mb-10">
                    <h1 class="mb-2 text-4xl font-bold tracking-tight text-slate-900">Welcome back, Alex! 👋</h1>
                    <p class="text-base text-slate-500">You have <span class="font-bold text-sky-600">2 exams
                            scheduled</span> for this week. Good luck!</p>
                </section>

                <section class="grid grid-cols-1 gap-6 md:grid-cols-12">
                    <article
                        class="relative overflow-hidden rounded-[24px] bg-white p-8 shadow-2xl shadow-sky-500/5 md:col-span-8">
                        <div class="absolute right-0 top-0 p-8 opacity-10">
                            <span class="material-symbols-outlined text-[120px] text-sky-500">auto_awesome</span>
                        </div>
                        <div class="relative z-10">
                            <h3 class="mb-6 text-2xl font-semibold text-slate-900">Current Progress</h3>
                            <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
                                <div class="space-y-2">
                                    <p class="text-sm font-medium text-slate-400">Average Grade</p>
                                    <p class="text-4xl font-extrabold text-sky-600">A-</p>
                                    <div class="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                        <span class="material-symbols-outlined text-xs">trending_up</span>
                                        <span>+4.2%</span>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm font-medium text-slate-400">Exams Passed</p>
                                    <p class="text-4xl font-extrabold text-slate-900">14/16</p>
                                    <div class="mt-2 h-1.5 w-full rounded-full bg-slate-100">
                                        <div class="h-full w-[87%] rounded-full bg-emerald-300"></div>
                                    </div>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm font-medium text-slate-400">Study Hours</p>
                                    <p class="text-4xl font-extrabold text-slate-900">128h</p>
                                    <p class="text-xs font-bold text-slate-400">This Semester</p>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article class="rounded-[24px] bg-sky-600 p-8 text-white shadow-xl shadow-sky-200 md:col-span-4">
                        <p class="mb-4 text-xs font-bold uppercase tracking-widest text-sky-100">Next Exam In</p>
                        <div class="mb-6 flex items-end gap-2">
                            <span class="text-5xl font-black">02</span>
                            <span class="pb-1 text-xl font-bold text-sky-200">Days</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-sky-200">menu_book</span>
                                <div>
                                    <p class="text-lg font-bold leading-tight">Advanced Thermodynamics</p>
                                    <p class="text-sm text-sky-200">May 24, 2024 • 09:00 AM</p>
                                </div>
                            </div>
                            <button
                                class="mt-2 w-full rounded-xl bg-white py-3 font-bold text-sky-600 transition-colors hover:bg-sky-50"
                                type="button">
                                View Study Guide
                            </button>
                        </div>
                    </article>

                    <article class="rounded-[24px] bg-white p-8 shadow-2xl shadow-sky-500/5 md:col-span-7">
                        <div class="mb-8 flex items-center justify-between">
                            <h3 class="text-2xl font-semibold text-slate-900">Recent Results</h3>
                            <a class="flex items-center gap-1 text-sm font-bold text-sky-600 hover:underline" href="#">
                                See all results <span class="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                        <div class="space-y-6">
                            <div
                                class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-sky-100">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-500 shadow-sm">
                                        <span class="material-symbols-outlined"
                                            style="font-variation-settings: 'FILL' 1;">calculate</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900">Digital Logic Design</p>
                                        <p class="text-xs text-slate-400">May 18, 2024</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-6">
                                    <div class="text-right">
                                        <p class="text-lg font-black text-emerald-600">92/100</p>
                                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">High
                                            Distinction</p>
                                    </div>
                                    <span
                                        class="material-symbols-outlined text-slate-300 transition-colors group-hover:text-sky-400">chevron_right</span>
                                </div>
                            </div>
                            <div
                                class="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-sky-100">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-sky-500 shadow-sm">
                                        <span class="material-symbols-outlined"
                                            style="font-variation-settings: 'FILL' 1;">language</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-slate-900">Technical Communication</p>
                                        <p class="text-xs text-slate-400">May 14, 2024</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-6">
                                    <div class="text-right">
                                        <p class="text-lg font-black text-emerald-600">88/100</p>
                                        <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Distinction</p>
                                    </div>
                                    <span
                                        class="material-symbols-outlined text-slate-300 transition-colors group-hover:text-sky-400">chevron_right</span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article class="rounded-[24px] bg-white p-8 shadow-2xl shadow-sky-500/5 md:col-span-5">
                        <h3 class="mb-8 text-2xl font-semibold text-slate-900">This Week</h3>
                        <div
                            class="relative space-y-8 pl-6 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-[2px] before:bg-slate-100">
                            <div class="relative">
                                <div
                                    class="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-sky-500 ring-4 ring-sky-100">
                                </div>
                                <div>
                                    <p class="mb-1 text-xs font-bold text-sky-600">TOMORROW • 02:00 PM</p>
                                    <p class="font-bold text-slate-900">Physics Lab Viva</p>
                                    <p class="text-xs text-slate-400">Virtual Room 402</p>
                                </div>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-slate-300"></div>
                                <div>
                                    <p class="mb-1 text-xs font-bold text-slate-400">THU, MAY 23 • 10:00 AM</p>
                                    <p class="font-bold text-slate-900">Mathematics II Quiz</p>
                                    <p class="text-xs text-slate-400">Main Campus Hall</p>
                                </div>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-[23px] top-1.5 h-3 w-3 rounded-full bg-slate-300"></div>
                                <div>
                                    <p class="mb-1 text-xs font-bold text-slate-400">FRI, MAY 24 • 09:00 AM</p>
                                    <p class="font-bold text-slate-900">Adv. Thermodynamics Final</p>
                                    <p class="text-xs text-slate-400">Online Submission</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </section>

                <section class="mt-10 rounded-[24px] bg-emerald-100 p-1 shadow-inner">
                    <div class="flex flex-col items-center gap-8 rounded-[20px] bg-white p-8 md:flex-row">
                        <div class="h-40 w-full overflow-hidden rounded-2xl md:w-1/3">
                            <img alt="Study session motivation" class="h-full w-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk9E2r7RrBrmp3DmZOYpeQbY9s6boBVr9uNE0LxKWFa90A573nlEXHDS1vrFpir3SFFwvtfWh9JPgu-UqOTmS615UP0M8QpnYBU4v-37IYIJo0YsahtMExYWQwzS9oZc61AW4KKXOEomar8iXcMidGmYbb7ET2KCgUc811xAtm4KOeVp2APIc4k6PpfWcxTMQKqcvOfZ7j8XLWYGrAPdqrA13q11Ic-aLk05VjF6L13NZ9gtG0KbnChOgHP55B925bvgXqPFQvc35b" />
                        </div>
                        <div class="flex-1">
                            <span
                                class="mb-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase text-emerald-700">Study
                                Tip of the Day</span>
                            <h4 class="mb-2 text-2xl font-semibold text-slate-900">The Pomodoro Technique</h4>
                            <p class="mb-6 text-slate-500">Enhance your exam preparation by studying in 25-minute blocks
                                followed by 5-minute breaks. It's proven to boost retention and prevent mental fatigue.
                            </p>
                            <button
                                class="flex items-center gap-2 font-bold text-emerald-700 transition-all duration-150 hover:translate-x-1"
                                type="button">
                                Learn more methods <span class="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    </div>
</template>
