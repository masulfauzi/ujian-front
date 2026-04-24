import DashboardOverviewView from '../../views/dashboard/DashboardOverviewView.vue'
import DashboardSiswaView from '../../views/dashboard/DashboardSiswaView.vue'

const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'dashboard-overview',
        component: DashboardOverviewView,
    },
    {
        path: '/dashboard-siswa',
        name: 'dashboard-siswa',
        component: DashboardSiswaView,
    },
]

export default dashboardRoutes