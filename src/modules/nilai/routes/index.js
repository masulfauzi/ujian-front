import NilaiList from '../views/NilaiList.vue'

export const nilaiRoutes = [
  {
    path: '/admin/nilai',
    name: 'nilai.list',
    component: NilaiList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
