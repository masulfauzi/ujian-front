import UjianListView from '../../views/ujian/UjianListView.vue'
import UjianConfirmationView from '../../views/ujian/UjianConfirmationView.vue'
import UjianAttemptView from '../../views/ujian/UjianAttemptView.vue'

const ujianRoutes = [
    {
        path: '/ujian',
        name: 'ujian-list',
        component: UjianListView,
    },
    {
        path: '/ujian/:id/konfirmasi',
        name: 'ujian-confirmation',
        component: UjianConfirmationView,
    },
    {
        path: '/ujian/:id/pengerjaan',
        name: 'ujian-attempt',
        component: UjianAttemptView,
        meta: {
            fullscreen: true,
        },
    },
]

export default ujianRoutes
