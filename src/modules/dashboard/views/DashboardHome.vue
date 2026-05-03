<template>
    <div class="bg-surface min-h-screen">
        <!-- Sidebar -->
        <SideBar />

        <!-- Top App Bar -->
        <TopAppBar />

        <!-- Main Content -->
        <main class="ml-64 min-h-screen">
            <!-- Content Area -->
            <div class="pt-24 pb-12 px-8 max-w-7xl mx-auto">
                <!-- Welcome Header -->
                <div class="mb-10">
                    <h1 class="font-h1 text-h1 text-on-surface mb-2">Welcome back, {{ userName }}! 👋</h1>
                    <p class="font-body-md text-body-md text-slate-500">
                        You have <span class="text-sky-600 font-bold">{{ examsScheduled }} exams scheduled</span> for
                        this week. Good luck!
                    </p>
                </div>

                <!-- Bento Dashboard Layout -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <!-- Summary Card (Bento Large) -->
                    <div
                        class="md:col-span-8 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5 relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-8 opacity-10">
                            <span class="material-symbols-outlined text-[120px] text-sky-500">auto_awesome</span>
                        </div>
                        <div class="relative z-10">
                            <h3 class="font-h3 text-h3 text-on-surface mb-6">Current Progress</h3>
                            <div class="grid grid-cols-3 gap-8">
                                <!-- Average Grade -->
                                <div class="space-y-2">
                                    <p class="text-slate-400 text-sm font-medium">Average Grade</p>
                                    <p class="text-4xl font-extrabold text-sky-600">{{ currentProgress.averageGrade }}
                                    </p>
                                    <div class="flex items-center gap-1 text-secondary text-xs font-bold">
                                        <span class="material-symbols-outlined text-xs">trending_up</span>
                                        {{ currentProgress.gradeChange }}%
                                    </div>
                                </div>

                                <!-- Exams Passed -->
                                <div class="space-y-2">
                                    <p class="text-slate-400 text-sm font-medium">Exams Passed</p>
                                    <p class="text-4xl font-extrabold text-on-surface">{{ currentProgress.examsPassed
                                    }}/{{ currentProgress.examsTotal }}</p>
                                    <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                                        <div class="bg-secondary-container h-full rounded-full"
                                            :style="{ width: currentProgress.passPercentage + '%' }">
                                        </div>
                                    </div>
                                </div>

                                <!-- Study Hours -->
                                <div class="space-y-2">
                                    <p class="text-slate-400 text-sm font-medium">Study Hours</p>
                                    <p class="text-4xl font-extrabold text-on-surface">{{ currentProgress.studyHours }}h
                                    </p>
                                    <p class="text-slate-400 text-xs font-bold">This Semester</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Next Exam Card (Bento Small) -->
                    <div class="md:col-span-4 bg-sky-600 rounded-[24px] p-8 text-white shadow-xl shadow-sky-200">
                        <p class="text-sky-100 font-bold text-xs uppercase tracking-widest mb-4">Next Exam In</p>
                        <div class="flex items-end gap-2 mb-6">
                            <span class="text-5xl font-black">{{ String(nextExam.daysLeft).padStart(2, '0') }}</span>
                            <span class="text-xl font-bold pb-1 text-sky-200">Days</span>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-start gap-3">
                                <span class="material-symbols-outlined text-sky-200">menu_book</span>
                                <div>
                                    <p class="font-bold text-lg leading-tight">{{ nextExam.subject }}</p>
                                    <p class="text-sm text-sky-200">{{ nextExam.date }} • {{ nextExam.time }}</p>
                                </div>
                            </div>
                            <button
                                class="w-full bg-white text-sky-600 font-bold py-3 rounded-xl hover:bg-sky-50 transition-colors mt-2">
                                View Study Guide
                            </button>
                        </div>
                    </div>

                    <!-- Recent Results (Bento Medium) -->
                    <div class="md:col-span-7 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5">
                        <div class="flex justify-between items-center mb-8">
                            <h3 class="font-h3 text-h3 text-on-surface">Recent Results</h3>
                            <router-link to="/dashboard/reports"
                                class="text-sky-600 text-sm font-bold flex items-center gap-1 hover:underline">
                                See all results <span class="material-symbols-outlined text-sm">arrow_forward</span>
                            </router-link>
                        </div>
                        <div class="space-y-6">
                            <div v-for="result in recentResults" :key="result.id"
                                class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-100 transition-all group">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-500 shadow-sm">
                                        <span class="material-symbols-outlined"
                                            style="font-variation-settings: 'FILL' 1;">
                                            {{ result.icon }}
                                        </span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-on-surface">{{ result.name }}</p>
                                        <p class="text-xs text-slate-400">{{ result.date }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-6">
                                    <div class="text-right">
                                        <p class="text-lg font-black text-secondary">{{ result.score }}/100</p>
                                        <p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{{
                                            result.grade }}</p>
                                    </div>
                                    <span
                                        class="material-symbols-outlined text-slate-300 group-hover:text-sky-400 transition-colors">
                                        chevron_right
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Schedule Widget (Bento Small/Tall) -->
                    <div class="md:col-span-5 bg-white rounded-[24px] p-8 shadow-2xl shadow-sky-500/5">
                        <h3 class="font-h3 text-h3 text-on-surface mb-8">This Week</h3>
                        <div
                            class="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            <div v-for="(event, index) in thisWeekEvents" :key="index" class="relative">
                                <div :class="[
                                    'absolute -left-[23px] top-1.5 w-3 h-3 rounded-full ring-4',
                                    event.isUpcoming
                                        ? 'bg-sky-500 ring-sky-100'
                                        : 'bg-slate-300 ring-transparent'
                                ]">
                                </div>
                                <div>
                                    <p :class="[
                                        'text-xs font-bold mb-1',
                                        event.isUpcoming ? 'text-sky-600' : 'text-slate-400'
                                    ]">
                                        {{ event.timeLabel }}
                                    </p>
                                    <p class="font-bold text-on-surface">{{ event.name }}</p>
                                    <p class="text-xs text-slate-400">{{ event.location }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Study Tips Banner -->
                <div class="mt-10 rounded-[24px] bg-secondary-container p-1 shadow-inner">
                    <div class="bg-white rounded-[20px] p-8 flex flex-col md:flex-row items-center gap-8">
                        <div class="w-full md:w-1/3 rounded-2xl overflow-hidden h-40">
                            <img alt="Study session motivation" class="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBk9E2r7RrBrmp3DmZOYpeQbY9s6boBVr9uNE0LxKWFa90A573nlEXHDS1vrFpir3SFFwvtfWh9JPgu-UqOTmS615UP0M8QpnYBU4v-37IYIJo0YsahtMExYWQwzS9oZc61AW4KKXOEomar8iXcMidGmYbb7ET2KCgUc811xAtm4KOeVp2APIc4k6PpfWcxTMQKqcvOfZ7j8XLWYGrAPdqrA13q11Ic-aLk05VjF6L13NZ9gtG0KbnChOgHP55B925bvgXqPFQvc35b" />
                        </div>
                        <div class="flex-1">
                            <span
                                class="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-black uppercase rounded-full mb-4">
                                Study Tip of the Day
                            </span>
                            <h4 class="font-h3 text-h3 text-on-surface mb-2">{{ studyTip.title }}</h4>
                            <p class="text-slate-500 mb-6 font-body-md">{{ studyTip.description }}</p>
                            <button
                                class="text-secondary font-bold flex items-center gap-2 hover:translate-x-1 duration-150 transition-all">
                                Learn more methods <span class="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'

export default {
    name: 'DashboardHome',
    components: {
        SideBar,
        TopAppBar
    },
    data() {
        return {
            userName: 'Alex',
            examsScheduled: 2,
            currentProgress: {
                averageGrade: 'A-',
                gradeChange: '+4.2',
                examsPassed: 14,
                examsTotal: 16,
                passPercentage: 87,
                studyHours: 128
            },
            nextExam: {
                daysLeft: 2,
                subject: 'Advanced Thermodynamics',
                date: 'May 24, 2024',
                time: '09:00 AM'
            },
            recentResults: [
                {
                    id: 1,
                    icon: 'calculate',
                    name: 'Digital Logic Design',
                    date: 'May 18, 2024',
                    score: 92,
                    grade: 'High Distinction'
                },
                {
                    id: 2,
                    icon: 'language',
                    name: 'Technical Communication',
                    date: 'May 14, 2024',
                    score: 88,
                    grade: 'Distinction'
                }
            ],
            thisWeekEvents: [
                {
                    name: 'Physics Lab Viva',
                    timeLabel: 'TOMORROW • 02:00 PM',
                    location: 'Virtual Room 402',
                    isUpcoming: true
                },
                {
                    name: 'Mathematics II Quiz',
                    timeLabel: 'THU, MAY 23 • 10:00 AM',
                    location: 'Main Campus Hall',
                    isUpcoming: false
                },
                {
                    name: 'Adv. Thermodynamics Final',
                    timeLabel: 'FRI, MAY 24 • 09:00 AM',
                    location: 'Online Submission',
                    isUpcoming: false
                }
            ],
            studyTip: {
                title: 'The Pomodoro Technique',
                description: 'Enhance your exam preparation by studying in 25-minute blocks followed by 5-minute breaks. It\'s proven to boost retention and prevent mental fatigue.'
            }
        }
    }
}
</script>
