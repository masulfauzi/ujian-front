import KelasList from '../views/KelasList.vue'
import KelasCreate from '../views/KelasCreate.vue'
import KelasEdit from '../views/KelasEdit.vue'
import KelasDetail from '../views/KelasDetail.vue'

export const kelasRoutes = [
  {
    path: '/admin/kelas',
    name: 'kelas.list',
    component: KelasList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/create',
    name: 'kelas.create',
    component: KelasCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id',
    name: 'kelas.detail',
    component: KelasDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/kelas/:id/edit',
    name: 'kelas.edit',
    component: KelasEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
