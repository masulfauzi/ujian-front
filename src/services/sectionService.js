import api from './api'

export const sectionService = {
  // GET daftar section satu jadwal (urut berdasarkan urutan)
  getSectionsByJadwal: async (idJadwal) => {
    try {
      const response = await api.get(`/section/jadwal/${idJadwal}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getSectionById: async (id) => {
    try {
      const response = await api.get(`/section/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Definisikan/ubah pembagian section untuk satu jadwal (mengganti seluruh definisi lama)
  defineSections: async (idJadwal, sections) => {
    try {
      const response = await api.post(`/section/jadwal/${idJadwal}/define`, { sections })
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteSection: async (id) => {
    try {
      const response = await api.delete(`/section/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  restoreSection: async (id) => {
    try {
      const response = await api.patch(`/section/${id}/restore`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
