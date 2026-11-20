import api from './api'

export const userService = {
  getUserList: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createUser: async (payload) => {
    try {
      const response = await api.post('/users', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateUser: async (id, payload) => {
    try {
      const response = await api.put(`/users/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
