import api from './api'

export const soalService = {
  getSoalByBankId: async (bankSoalId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/soal/bank/${bankSoalId}`, {
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
      const response = await api.post('/soal', payload, config)
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
      const response = await api.put(`/soal/${id}`, payload, config)
      return response.data
    } catch (error) {
      throw error
    }
  },

  uploadSoalImage: async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  importSoalFromExcel: async (idBankSoal, file) => {
    try {
      const formData = new FormData()
      formData.append('id_bank_soal', idBankSoal)
      formData.append('file', file)
      const response = await api.post('/soal/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getSoalById: async (id) => {
    try {
      const response = await api.get(`/soal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
