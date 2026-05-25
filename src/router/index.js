import { createRouter, createWebHistory } from 'vue-router'
import { dashboardRoutes } from '../modules/dashboard/routes'
import { authRoutes } from '../modules/auth/routes'
import { bankSoalRoutes } from '../modules/bank-soal/routes'
import { mapelRoutes } from '../modules/mapel/routes'
import { jurusanRoutes } from '../modules/jurusan/routes'
import { kelasRoutes } from '../modules/kelas/routes'
import { pesertaRoutes } from '../modules/peserta/routes'
import { jadwalRoutes } from '../modules/jadwal/routes'
import { jadwalPesertaRoutes } from '../modules/jadwal-peserta/routes'
import { setupAuthGuards } from './guards'

const routes = [
    { path: '/', redirect: '/login' },
    ...dashboardRoutes,
    ...bankSoalRoutes,
    ...mapelRoutes,
    ...jurusanRoutes,
    ...kelasRoutes,
    ...pesertaRoutes,
    ...jadwalRoutes,
    ...jadwalPesertaRoutes,
    ...authRoutes,
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Setup authentication guards
setupAuthGuards(router)

export default router
