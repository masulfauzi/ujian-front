import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'

export const authRoutes = [
    {
        path: '/login',
        name: 'auth.login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'auth.register',
        component: RegisterView,
    },
]
