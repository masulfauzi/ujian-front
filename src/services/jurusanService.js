import api from './api'

export const jurusanService = {
  getJurusanList: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/jurusan', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getJurusanById: async (id) => {
    try {
      const response = await api.get(`/jurusan/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createJurusan: async (payload) => {
    try {
      const response = await api.post('/jurusan', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateJurusan: async (id, payload) => {
    try {
      const response = await api.put(`/jurusan/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteJurusan: async (id) => {
    try {
      const response = await api.delete(`/jurusan/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreJurusan: async (id) => {
    try {
      const response = await api.patch(`/jurusan/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
