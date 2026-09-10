import api from './api'

export const ujianTokenService = {
  // Ambil token ujian global yang sedang berlaku (rotasi otomatis tiap periode)
  getCurrentToken: async () => {
    try {
      const response = await api.get('/ujian-token/current')
      return response.data
    } catch (error) {
      throw error
    }
  },
}
