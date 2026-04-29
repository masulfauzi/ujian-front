import axios from 'axios'
import { getToken } from './token'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
