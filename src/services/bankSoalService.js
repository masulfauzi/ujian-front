import api from './api'

export const bankSoalService = {
  getBankSoalList: async (page = 1, pageSize = 10) => {
    try {
      const params = {
        page,
        page_size: pageSize
      }
      const response = await api.get('/bank-soal', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getSoalList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = {
        page,
        page_size: pageSize,
        ...filters
      }
      const response = await api.get('/bank-soal', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getSoalById: async (id) => {
    try {
      const response = await api.get(`/bank-soal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createSoal: async (payload) => {
    try {
      const response = await api.post('/bank-soal', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateSoal: async (id, payload) => {
    try {
      const response = await api.put(`/bank-soal/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteSoal: async (id) => {
    try {
      const response = await api.delete(`/bank-soal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreSoal: async (id) => {
    try {
      const response = await api.patch(`/bank-soal/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  importSoalFromExcel: async (formData) => {
    try {
      const response = await api.post('/bank-soal/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
