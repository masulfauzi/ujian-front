import api from './api'

export const pesertaService = {
  getPesertaList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = { page, page_size: pageSize }
      if (filters.id_kelas) params.id_kelas = filters.id_kelas
      const response = await api.get('/peserta', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getPesertaById: async (id) => {
    try {
      const response = await api.get(`/peserta/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createPeserta: async (payload) => {
    try {
      const response = await api.post('/peserta', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updatePeserta: async (id, payload) => {
    try {
      const response = await api.put(`/peserta/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deletePeserta: async (id) => {
    try {
      const response = await api.delete(`/peserta/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restorePeserta: async (id) => {
    try {
      const response = await api.patch(`/peserta/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
