import PesertaUjianListView from '../../views/peserta_ujian/PesertaUjianListView.vue'
import PesertaUjianCreateView from '../../views/peserta_ujian/PesertaUjianCreateView.vue'

const pesertaUjianRoutes = [
    {
        path: '/peserta-ujian',
        name: 'peserta-ujian-list',
        component: PesertaUjianListView,
    },
    {
        path: '/peserta-ujian/tambah',
        name: 'peserta-ujian-create',
        component: PesertaUjianCreateView,
    },
]

export default pesertaUjianRoutes
