import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './modules/dashboard'
import bankSoalRoutes from './modules/bankSoal'
import loginRoutes from './modules/login'
import ujianRoutes from './modules/ujian'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    ...loginRoutes,
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...ujianRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router