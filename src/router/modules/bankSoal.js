import BankSoalListView from '../../views/bank_soal/BankSoalListView.vue'
import BankSoalCreateView from '../../views/bank_soal/BankSoalCreateView.vue'

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
]

export default bankSoalRoutes