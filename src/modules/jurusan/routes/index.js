import JurusanList from '../views/JurusanList.vue'
import JurusanCreate from '../views/JurusanCreate.vue'
import JurusanEdit from '../views/JurusanEdit.vue'
import JurusanDetail from '../views/JurusanDetail.vue'

export const jurusanRoutes = [
  {
    path: '/admin/jurusan',
    name: 'jurusan.list',
    component: JurusanList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/create',
    name: 'jurusan.create',
    component: JurusanCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/:id',
    name: 'jurusan.detail',
    component: JurusanDetail,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/jurusan/:id/edit',
    name: 'jurusan.edit',
    component: JurusanEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
