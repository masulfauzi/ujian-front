import DashboardHome from '../views/DashboardHome.vue'
import DashboardReports from '../views/DashboardReports.vue'

export const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard.home',
        component: DashboardHome,
    },
    {
        path: '/dashboard/reports',
        name: 'dashboard.reports',
        component: DashboardReports,
    },
]
