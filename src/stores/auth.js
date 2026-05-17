import { defineStore } from 'pinia'
import { clearToken, decodeToken, getToken, setToken } from '../services/token'
import { registerUser, loginUser } from '../services/authService'

export const useAuthStore = defineStore('auth', {
    state: () => {
        const token = getToken()
        return {
            token,
            user: decodeToken(token),
            isLoading: false,
            error: null,
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.token && !!state.user,
        currentUser: (state) => state.user,
        authToken: (state) => state.token,
    },

    actions: {
        applyToken(token) {
            this.token = token
            setToken(token)
            this.user = decodeToken(token)
            this.error = null
        },

        clearError() {
            this.error = null
        },

        async register(payload) {
            this.isLoading = true
            this.error = null

            try {
                const response = await registerUser(payload)
                if (response.success && response.data?.token) {
                    this.applyToken(response.data.token)
                    return response
                }
                throw new Error(response.message || 'Registration failed')
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Registration error'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        async login(credentials) {
            this.isLoading = true
            this.error = null

            try {
                const response = await loginUser(credentials)
                if (response.success && response.data?.token) {
                    this.applyToken(response.data.token)
                    return response
                }
                throw new Error(response.message || 'Login failed')
            } catch (err) {
                this.error = err.response?.data?.message || err.message || 'Login error'
                throw err
            } finally {
                this.isLoading = false
            }
        },

        logout() {
            this.token = null
            this.user = null
            this.error = null
            clearToken()
        },
    },
})
