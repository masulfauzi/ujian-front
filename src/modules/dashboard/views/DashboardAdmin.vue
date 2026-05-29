<template>
    <div class="bg-surface min-h-screen">
        <!-- Sidebar -->
        <SideBar />

        <!-- Top App Bar -->
        <TopAppBar />

        <!-- Main Content -->
        <main class="lg:ml-64 min-h-screen">
            <!-- Content Area -->
            <div class="pt-20 lg:pt-24 pb-12 px-4 lg:px-8 max-w-7xl mx-auto">
                <!-- Welcome Section -->
                <section class="mb-10 flex items-center justify-between">
                    <div>
                        <h1 class="font-h2 text-h2 text-on-surface mb-2">Welcome back, {{ adminName }}!</h1>
                        <p class="font-body-md text-body-md text-slate-500">Here's what's happening with your exams today.</p>
                    </div>
                    <div class="text-right">
                        <p class="text-label-sm text-slate-400 uppercase tracking-widest">Today's Date</p>
                        <p class="text-label-md font-bold text-slate-700">{{ currentDate }}</p>
                    </div>
                </section>

                <!-- Summary Stats Bento Grid -->
                <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <!-- Total Questions Card -->
                    <div class="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                        <div class="absolute -right-4 -top-4 w-24 h-24 bg-sky-50 rounded-full transition-transform group-hover:scale-110"></div>
                        <span class="material-symbols-outlined text-primary-container mb-4 text-3xl">database</span>
                        <h3 class="text-label-sm text-slate-500 mb-1">Total Questions</h3>
                        <p class="text-h3 font-h3 text-slate-800">{{ adminStore.stats.totalQuestions }}</p>
                        <div class="mt-2 flex items-center gap-1 text-[10px] text-secondary font-bold">
                            <span class="material-symbols-outlined text-xs">trending_up</span>
                            <span>{{ adminStore.trends.questionsTrend }}</span>
                        </div>
                    </div>

                    <!-- Active Exams Card -->
                    <div class="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                        <div class="absolute -right-4 -top-4 w-24 h-24 bg-on-secondary-container/5 rounded-full transition-transform group-hover:scale-110"></div>
                        <span class="material-symbols-outlined text-on-secondary-container mb-4 text-3xl">play_circle</span>
                        <h3 class="text-label-sm text-slate-500 mb-1">Active Exams</h3>
                        <p class="text-h3 font-h3 text-slate-800">{{ adminStore.stats.activeExams }}</p>
                        <div class="mt-2 flex items-center gap-1 text-[10px] text-secondary font-bold">
                            <span class="material-symbols-outlined text-xs">timer</span>
                            <span>{{ adminStore.trends.examsTrend }}</span>
                        </div>
                    </div>

                    <!-- Total Students Card -->
                    <div class="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                        <div class="absolute -right-4 -top-4 w-24 h-24 bg-sky-50 rounded-full transition-transform group-hover:scale-110"></div>
                        <span class="material-symbols-outlined text-primary-container mb-4 text-3xl">group</span>
                        <h3 class="text-label-sm text-slate-500 mb-1">Total Students</h3>
                        <p class="text-h3 font-h3 text-slate-800">{{ adminStore.stats.totalStudents }}</p>
                        <div class="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <span class="material-symbols-outlined text-xs">check_circle</span>
                            <span>{{ adminStore.trends.studentsTrend }}</span>
                        </div>
                    </div>

                    <!-- Average Grade Card -->
                    <div class="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden group">
                        <div class="absolute -right-4 -top-4 w-24 h-24 bg-on-secondary-container/5 rounded-full transition-transform group-hover:scale-110"></div>
                        <span class="material-symbols-outlined text-on-secondary-container mb-4 text-3xl">grade</span>
                        <h3 class="text-label-sm text-slate-500 mb-1">Average Grade</h3>
                        <p class="text-h3 font-h3 text-slate-800">{{ adminStore.stats.averageGrade }}</p>
                        <div class="mt-2 flex items-center gap-1 text-[10px] text-secondary font-bold">
                            <span class="material-symbols-outlined text-xs">trending_up</span>
                            <span>{{ adminStore.trends.gradeTrend }}</span>
                        </div>
                    </div>
                </section>

                <!-- Recent Exam Submissions -->
                <div class="bg-white rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.05)] p-8 border border-slate-100">
                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-h3 font-h3 text-slate-800">Recent Exam Submissions</h2>
                            <p class="text-sm text-slate-500">Real-time update of student activity</p>
                        </div>
                        <button class="text-sm font-semibold text-primary-container hover:underline">View All</button>
                    </div>

                    <!-- Table -->
                    <div class="overflow-hidden">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="border-b border-slate-50">
                                    <th class="pb-4 text-label-sm text-slate-400 uppercase tracking-wider">Student</th>
                                    <th class="pb-4 text-label-sm text-slate-400 uppercase tracking-wider">Exam Name</th>
                                    <th class="pb-4 text-label-sm text-slate-400 uppercase tracking-wider">Time</th>
                                    <th class="pb-4 text-label-sm text-slate-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                <tr v-for="submission in adminStore.recentSubmissions" :key="submission.id"
                                    class="group hover:bg-slate-50/50 transition-colors">
                                    <td class="py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xs">
                                                {{ submission.studentInitials }}
                                            </div>
                                            <span class="text-sm font-medium text-slate-700">{{ submission.studentName }}</span>
                                        </div>
                                    </td>
                                    <td class="py-4 text-sm text-slate-600">{{ submission.examName }}</td>
                                    <td class="py-4 text-sm text-slate-500">{{ submission.submittedAt }}</td>
                                    <td class="py-4">
                                        <span :class="['px-3 py-1 text-xs font-semibold rounded-full',
                                            submission.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        ]">
                                            {{ submission.status }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SideBar from '@/components/SideBar.vue'
import TopAppBar from '@/components/TopAppBar.vue'
import { useAdminStore } from '@/stores/admin'
import { useAuthStore } from '@/stores/auth'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const currentDate = ref('')
const adminName = ref('')

onMounted(() => {
    // Set admin name from auth store
    adminName.value = authStore.currentUser?.name || 'Admin'

    // Format current date
    const today = new Date()
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    currentDate.value = today.toLocaleDateString('id-ID', options)

    // Fetch stats
    adminStore.fetchStats()
    adminStore.fetchRecentSubmissions()
})
</script>
