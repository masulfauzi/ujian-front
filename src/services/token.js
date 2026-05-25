import { jwtDecode } from 'jwt-decode'

const TOKEN_KEY = 'ujian_token'
const USER_NAME_KEY = 'ujian_user_name'

export const getToken = () => localStorage.getItem(TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)

export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

export const getUserName = () => localStorage.getItem(USER_NAME_KEY)

export const setUserName = (name) => localStorage.setItem(USER_NAME_KEY, name)

export const clearUserName = () => localStorage.removeItem(USER_NAME_KEY)

export const decodeToken = (token) => {
    if (!token) return null

    try {
        return jwtDecode(token)
    } catch (error) {
        return null
    }
}
