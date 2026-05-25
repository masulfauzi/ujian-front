import api from './api'

export const jawabanService = {
  // GET soal + jawaban yang sudah dipilih untuk record nilai tertentu
  getSoalByNilaiId: async (idNilai) => {
    try {
      const response = await api.get(`/jawaban/nilai/${idNilai}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // POST jawaban peserta baru (auto-save setiap kali pilih opsi)
  submitJawaban: async (payload) => {
    try {
      const response = await api.post('/jawaban', payload)
      return response.data
    } catch (error) {
      // Jika jawaban sudah ada, backend akan return error dengan pesan khusus
      if (error.response?.status === 400 && error.response?.data?.message?.includes('sudah ada')) {
        // Jika jawaban sudah ada, caller harus handle dengan updateJawaban
        throw error
      }
      throw error
    }
  },

  // PUT jawaban peserta yang sudah ada (update by jawaban record ID)
  updateJawaban: async (jawabanId, payload) => {
    try {
      const response = await api.put(`/jawaban/${jawabanId}`, payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
