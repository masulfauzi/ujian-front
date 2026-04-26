import { createRouter, createWebHistory } from 'vue-router'
import dashboardRoutes from './modules/dashboard'
import bankSoalRoutes from './modules/bankSoal'
import loginRoutes from './modules/login'
import ujianRoutes from './modules/ujian'
import pesertaUjianRoutes from './modules/pesertaUjian'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    ...loginRoutes,
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...ujianRoutes,
    ...pesertaUjianRoutes,
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router