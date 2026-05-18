import DashboardHome from '../views/DashboardHome.vue'
import DashboardReports from '../views/DashboardReports.vue'
import DashboardAdmin from '../views/DashboardAdmin.vue'

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
    {
        path: '/admin/dashboard',
        name: 'admin.dashboard',
        component: DashboardAdmin,
        meta: { requiresAuth: true, requiresAdmin: true },
    },
]
