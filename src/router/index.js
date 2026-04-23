import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './modules/dashboard'
import bankSoalRoutes from './modules/bankSoal'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    ...dashboardRoutes,
    ...bankSoalRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router