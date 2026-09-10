import api from './api'

export const nilaiService = {
  // token wajib diisi hanya jika jadwal.wajib_token aktif
  mulaiUjian: async (idJadwal, token = null) => {
    try {
      const payload = token ? { token } : {}
      const response = await api.post(`/nilai/mulai-ujian/${idJadwal}`, payload)
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

  // Export analisis jawaban per soal ke Excel (per kelas, dalam ZIP)
  getAnalisisJawaban: async (idJadwal) => {
    try {
      const response = await api.get(`/nilai/analisis/${idJadwal}`, {
        responseType: 'blob',
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Maju ke section berikutnya (hanya berhasil jika durasi_menit_minimal section aktif sudah terlampaui)
  nextSection: async (idNilai) => {
    try {
      const response = await api.post(`/nilai/${idNilai}/next-section`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Cek status section aktif (read-only, untuk polling countdown)
  getSectionStatus: async (idNilai) => {
    try {
      const response = await api.get(`/nilai/${idNilai}/section-status`)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
