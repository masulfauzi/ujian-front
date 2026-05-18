import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        stats: {
            totalQuestions: 1284,
            activeExams: 8,
            totalStudents: 452,
            averageGrade: 84.2,
        },
        trends: {
            questionsTrend: '+12 today',
            examsTrend: '3 ending soon',
            studentsTrend: '98% active',
            gradeTrend: '+2.4% vs last term',
        },
        recentSubmissions: [
            {
                id: '1',
                studentName: 'Ahmad Daryanto',
                studentInitials: 'AD',
                examName: 'Biology Midterm',
                submittedAt: '2 min ago',
                status: 'completed',
            },
            {
                id: '2',
                studentName: 'Bella Chen',
                studentInitials: 'BC',
                examName: 'Mathematics Final',
                submittedAt: '15 min ago',
                status: 'completed',
            },
            {
                id: '3',
                studentName: 'Chandra Wijaya',
                studentInitials: 'CW',
                examName: 'Physics Quiz',
                submittedAt: '1 hour ago',
                status: 'completed',
            },
            {
                id: '4',
                studentName: 'Diana Kusuma',
                studentInitials: 'DK',
                examName: 'English Test',
                submittedAt: '2 hours ago',
                status: 'pending',
            },
            {
                id: '5',
                studentName: 'Eka Prasetyo',
                studentInitials: 'EP',
                examName: 'Chemistry Exam',
                submittedAt: '3 hours ago',
                status: 'completed',
            },
        ],
        isLoading: false,
        error: null,
    }),

    getters: {
        hasStats: (state) => Object.values(state.stats).length > 0,
        submissionCount: (state) => state.recentSubmissions.length,
        completedCount: (state) => state.recentSubmissions.filter(s => s.status === 'completed').length,
        pendingCount: (state) => state.recentSubmissions.filter(s => s.status === 'pending').length,
    },

    actions: {
        async fetchStats() {
            this.isLoading = true
            this.error = null

            try {
                // TODO: Replace with actual API call
                // const response = await api.get('/api/admin/stats')
                // this.stats = response.data.stats
                // this.trends = response.data.trends

                // For now, using mock data from state initialization
                return this.stats
            } catch (err) {
                this.error = err.message || 'Failed to fetch stats'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        async fetchRecentSubmissions() {
            this.isLoading = true
            this.error = null

            try {
                // TODO: Replace with actual API call
                // const response = await api.get('/api/admin/submissions')
                // this.recentSubmissions = response.data

                // For now, using mock data from state initialization
                return this.recentSubmissions
            } catch (err) {
                this.error = err.message || 'Failed to fetch submissions'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        clearError() {
            this.error = null
        },
    },
})
