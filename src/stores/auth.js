import { defineStore } from 'pinia'
import { clearToken, decodeToken, getToken, setToken } from '../services/token'

export const useAuthStore = defineStore('auth', {
    state: () => {
        const token = getToken()
        return {
            token,
            user: decodeToken(token),
        }
    },
    actions: {
        applyToken(token) {
            this.token = token
            setToken(token)
            this.user = decodeToken(token)
        },
        logout() {
            this.token = null
            this.user = null
            clearToken()
        },
    },
})
