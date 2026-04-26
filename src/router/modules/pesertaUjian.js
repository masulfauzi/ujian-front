import PesertaUjianListView from '../../views/peserta_ujian/PesertaUjianListView.vue'
import PesertaUjianCreateView from '../../views/peserta_ujian/PesertaUjianCreateView.vue'
import PesertaUjianUploadView from '../../views/peserta_ujian/PesertaUjianUploadView.vue'

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
    {
        path: '/peserta-ujian/upload',
        name: 'peserta-ujian-upload',
        component: PesertaUjianUploadView,
    },
]

export default pesertaUjianRoutes
