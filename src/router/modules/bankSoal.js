import BankSoalListView from '../../views/bank_soal/BankSoalListView.vue'
import BankSoalCreateView from '../../views/bank_soal/BankSoalCreateView.vue'
import BankSoalDetailView from '../../views/bank_soal/BankSoalDetailView.vue'

const bankSoalRoutes = [
    {
        path: '/bank-soal',
        name: 'bank-soal-list',
        component: BankSoalListView,
    },
    {
        path: '/bank-soal/tambah',
        name: 'bank-soal-create',
        component: BankSoalCreateView,
    },
    {
        path: '/bank-soal/:id',
        name: 'bank-soal-detail',
        component: BankSoalDetailView,
    },
]

export default bankSoalRoutes