import api from './api'

export const jadwalService = {
  getJadwalList: async (page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize }
      const response = await api.get('/jadwal', { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  getJadwalAktifHariIni: async () => {
    try {
      const response = await api.get('/jadwal/aktif/hari-ini')
      return response.data
    } catch (error) {
      throw error
    }
  },

  getJadwalById: async (id) => {
    try {
      const response = await api.get(`/jadwal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  createJadwal: async (payload) => {
    try {
      const response = await api.post('/jadwal', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateJadwal: async (id, payload) => {
    try {
      const response = await api.put(`/jadwal/${id}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteJadwal: async (id) => {
    try {
      const response = await api.delete(`/jadwal/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
