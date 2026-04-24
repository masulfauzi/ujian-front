import BankSoalListView from '../../views/bank_soal/BankSoalListView.vue'
import BankSoalCreateView from '../../views/bank_soal/BankSoalCreateView.vue'
import BankSoalDetailView from '../../views/bank_soal/BankSoalDetailView.vue'
import BankSoalQuestionCreateView from '../../views/bank_soal/BankSoalQuestionCreateView.vue'

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
    {
        path: '/bank-soal/:id/tambah-soal',
        name: 'bank-soal-question-create',
        component: BankSoalQuestionCreateView,
    },
]

export default bankSoalRoutes