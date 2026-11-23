import SinkronSiswa from '../views/SinkronSiswa.vue'

export const sinkronRoutes = [
  {
    path: '/admin/sinkron-siswa',
    name: 'sinkron.siswa',
    component: SinkronSiswa,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
