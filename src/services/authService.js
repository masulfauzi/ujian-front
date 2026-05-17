import api from './api'

export const registerUser = async (payload) => {
    const response = await api.post('/api/auth/register', {
        name: payload.name,
        email: payload.email,
        password: payload.password
    })
    return response.data
}

export const loginUser = async (credentials) => {
    const response = await api.post('/api/auth/login', {
        email: credentials.email,
        password: credentials.password
    })
    return response.data
}

export const logoutUser = () => {
    return api.post('/api/auth/logout')
}
