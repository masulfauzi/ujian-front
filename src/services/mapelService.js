import api from './api'

export const mapelService = {
  getMapelList: async (page = 1, pageSize = 10) => {
    try {
      const response = await api.get('/api/mapel', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getMapelById: async (id) => {
    try {
      const response = await api.get(`/api/mapel/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createMapel: async (payload) => {
    try {
      const response = await api.post('/api/mapel', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateMapel: async (id, payload) => {
    try {
      const response = await api.put(`/api/mapel/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteMapel: async (id) => {
    try {
      const response = await api.delete(`/api/mapel/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreMapel: async (id) => {
    try {
      const response = await api.patch(`/api/mapel/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}
