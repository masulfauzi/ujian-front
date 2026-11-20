import UserList from '../views/UserList.vue'
import UserCreate from '../views/UserCreate.vue'
import UserEdit from '../views/UserEdit.vue'

export const userRoutes = [
  {
    path: '/admin/user',
    name: 'user.list',
    component: UserList,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user/create',
    name: 'user.create',
    component: UserCreate,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/user/:id/edit',
    name: 'user.edit',
    component: UserEdit,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
