import api from './api'

export const soalService = {
  getSoalByBankId: async (bankSoalId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/api/soal/bank/${bankSoalId}`, {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createSoal: async (payload) => {
    try {
      const config = payload instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {}
      const response = await api.post('/api/soal', payload, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateSoal: async (id, payload) => {
    try {
      const config = payload instanceof FormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : {}
      const response = await api.put(`/api/soal/${id}`, payload, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  uploadSoalImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
