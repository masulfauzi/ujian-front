import JadwalList from '../views/JadwalList.vue'
import JadwalCreate from '../views/JadwalCreate.vue'
import JadwalDetail from '../views/JadwalDetail.vue'
import JadwalEdit from '../views/JadwalEdit.vue'

export const jadwalRoutes = [
  {
    path: '/admin/jadwal',
    name: 'jadwal.list',
    component: JadwalList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/create',
    name: 'jadwal.create',
    component: JadwalCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id',
    name: 'jadwal.detail',
    component: JadwalDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jadwal/:id/edit',
    name: 'jadwal.edit',
    component: JadwalEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
