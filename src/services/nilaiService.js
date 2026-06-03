import api from './api'

export const nilaiService = {
  mulaiUjian: async (idJadwal) => {
    try {
      const response = await api.post(`/nilai/mulai-ujian/${idJadwal}`)
      return response
    } catch (error) {
      throw error
    }
  },

  selesaiUjian: async (idNilai, payload) => {
    try {
      const response = await api.put(`/nilai/${idNilai}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getNilaiByJadwal: async (idJadwal, page = 1, pageSize = 10) => {
    try {
      const params = { page, page_size: pageSize }
      const response = await api.get(`/nilai/jadwal/${idJadwal}`, { params })
      return response.data
    } catch (error) {
      throw error
    }
  },

  exportNilai: async (idJadwal) => {
    try {
      const response = await api.get(`/nilai/export/${idJadwal}`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      throw error
    }
  },
}
