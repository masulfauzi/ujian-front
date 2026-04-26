import JadwalUjianView from '../../views/jadwal_ujian/JadwalUjianView.vue'
import JadwalUjianCreateView from '../../views/jadwal_ujian/JadwalUjianCreateView.vue'

const jadwalUjianRoutes = [
    {
        path: '/jadwal-ujian',
        name: 'jadwal-ujian-list',
        component: JadwalUjianView,
    },
    {
        path: '/jadwal-ujian/tambah',
        name: 'jadwal-ujian-create',
        component: JadwalUjianCreateView,
    },
]

export default jadwalUjianRoutes