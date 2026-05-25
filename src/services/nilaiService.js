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
}
