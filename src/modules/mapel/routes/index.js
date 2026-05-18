import MapelList from '../views/MapelList.vue'
import MapelCreate from '../views/MapelCreate.vue'
import MapelEdit from '../views/MapelEdit.vue'
import MapelDetail from '../views/MapelDetail.vue'

export const mapelRoutes = [
  {
    path: '/admin/mapel',
    name: 'mapel.list',
    component: MapelList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/create',
    name: 'mapel.create',
    component: MapelCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/:id',
    name: 'mapel.detail',
    component: MapelDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/mapel/:id/edit',
    name: 'mapel.edit',
    component: MapelEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
