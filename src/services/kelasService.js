import api from './api'

export const kelasService = {
  getKelasList: async (page = 1, pageSize = 10, filters = {}) => {
    try {
      const params = { page, page_size: pageSize }
      if (filters.id_jurusan) params.id_jurusan = filters.id_jurusan
      if (filters.tingkat) params.tingkat = filters.tingkat
      const response = await api.get('/kelas', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getKelasById: async (id) => {
    try {
      const response = await api.get(`/kelas/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createKelas: async (payload) => {
    try {
      const response = await api.post('/kelas', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateKelas: async (id, payload) => {
    try {
      const response = await api.put(`/kelas/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteKelas: async (id) => {
    try {
      const response = await api.delete(`/kelas/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreKelas: async (id) => {
    try {
      const response = await api.patch(`/kelas/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
