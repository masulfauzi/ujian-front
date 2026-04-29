import { createRouter, createWebHistory } from 'vue-router'
import { dashboardRoutes } from '../modules/dashboard/routes'
import { authRoutes } from '../modules/auth/routes'

const routes = [
    { path: '/', redirect: '/dashboard' },
    ...dashboardRoutes,
    ...authRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
