import api from './api'

export const registerUser = async (payload) => {
    const response = await api.post('/auth/register', {
        name: payload.name,
        username: payload.username,
        email: payload.email,
        password: payload.password
    })
    return response.data
}

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
    })
    return response.data
}

export const logoutUser = () => {
    return api.post('/auth/logout')
}
