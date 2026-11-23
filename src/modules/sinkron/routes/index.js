import SinkronSiswa from '../views/SinkronSiswa.vue'
import SinkronBankSoal from '../views/SinkronBankSoal.vue'

export const sinkronRoutes = [
  {
    path: '/admin/sinkron-siswa',
    name: 'sinkron.siswa',
    component: SinkronSiswa,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/sinkron-bank-soal',
    name: 'sinkron.bank-soal',
    component: SinkronBankSoal,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
