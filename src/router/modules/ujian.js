import UjianListView from '../../views/ujian/UjianListView.vue'
import UjianConfirmationView from '../../views/ujian/UjianConfirmationView.vue'

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
]

export default ujianRoutes
