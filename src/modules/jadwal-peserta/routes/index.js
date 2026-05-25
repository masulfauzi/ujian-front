import JadwalUjianHariIni from '../views/JadwalUjianHariIni.vue'
import DetailUjian from '../views/DetailUjian.vue'
import PengerjaanUjian from '../views/PengerjaanUjian.vue'

export const jadwalPesertaRoutes = [
  {
    path: '/schedule',
    name: 'peserta.jadwal',
    component: JadwalUjianHariIni,
    meta: { requiresAuth: true },
  },
  {
    path: '/ujian/:id',
    name: 'peserta.ujian.detail',
    component: DetailUjian,
    meta: { requiresAuth: true },
  },
  {
    path: '/ujian/:id/pengerjaan',
    name: 'peserta.ujian.pengerjaan',
    component: PengerjaanUjian,
    meta: { requiresAuth: true },
  },
]
