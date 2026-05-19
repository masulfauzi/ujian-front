import { createRouter, createWebHistory } from 'vue-router'
import { dashboardRoutes } from '../modules/dashboard/routes'
import { authRoutes } from '../modules/auth/routes'
import { bankSoalRoutes } from '../modules/bank-soal/routes'
import { mapelRoutes } from '../modules/mapel/routes'
import { jurusanRoutes } from '../modules/jurusan/routes'
import { setupAuthGuards } from './guards'

const routes = [
    { path: '/', redirect: '/login' },
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...mapelRoutes,
    ...jurusanRoutes,
    ...authRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Setup authentication guards
setupAuthGuards(router)

export default router
