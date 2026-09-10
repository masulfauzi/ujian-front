import UjianTokenCurrent from '../views/UjianTokenCurrent.vue'

export const ujianTokenRoutes = [
  {
    path: '/admin/ujian-token',
    name: 'ujianToken.current',
    component: UjianTokenCurrent,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]
