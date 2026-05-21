import api from './api'

export const jadwalKelasService = {
  getJadwalKelasByJadwalId: async (idJadwal) => {
    try {
      const response = await api.get('/jadwal-kelas', {
        params: { id_jadwal: idJadwal, page_size: 100 },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  createJadwalKelas: async (payload) => {
    try {
      const response = await api.post('/jadwal-kelas', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteJadwalKelas: async (id) => {
    try {
      const response = await api.delete(`/jadwal-kelas/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
