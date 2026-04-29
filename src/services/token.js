import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'ujian_token'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const decodeToken = (token) => {
    if (!token) return null

    try {
        return jwtDecode(token)
    } catch (error) {
        return null
    }
}
