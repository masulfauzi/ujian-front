import api from './api'

export const bankSoalService = {
  getSoalList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filters
      }
      const response = await api.get('/api/bank-soal', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getSoalById: async (id) => {
    try {
      const response = await api.get(`/api/bank-soal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createSoal: async (payload) => {
    try {
      const response = await api.post('/api/bank-soal', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateSoal: async (id, payload) => {
    try {
      const response = await api.put(`/api/bank-soal/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteSoal: async (id) => {
    try {
      const response = await api.delete(`/api/bank-soal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreSoal: async (id) => {
    try {
      const response = await api.patch(`/api/bank-soal/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
