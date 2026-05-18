import BankSoalList from '../views/BankSoalList.vue'
import SoalCreate from '../views/SoalCreate.vue'
import SoalEdit from '../views/SoalEdit.vue'
import SoalDetail from '../views/SoalDetail.vue'

export const bankSoalRoutes = [
  {
    path: '/admin/bank-soal',
    name: 'bankSoal.list',
    component: BankSoalList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/create',
    name: 'bankSoal.create',
    component: SoalCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/:id',
    name: 'bankSoal.detail',
    component: SoalDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/bank-soal/:id/edit',
    name: 'bankSoal.edit',
    component: SoalEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
