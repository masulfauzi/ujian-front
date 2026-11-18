import LoginView from '../views/Login.vue'
import SsoLoginView from '../views/SsoLogin.vue'
// import RegisterView from '../views/Register.vue'

export const authRoutes = [
    {
        path: '/login',
        name: 'auth.login',
        component: LoginView,
    },
    {
        path: '/sso',
        name: 'auth.sso',
        component: SsoLoginView,
    },
    // {
    //     path: '/register',
    //     name: 'auth.register',
    //     component: RegisterView,
    // },
]
