import api from './api'

export const soalService = {
  getSoalByBankId: async (bankSoalId, page = 1, pageSize = 10) => {
    try {
      const response = await api.get(`/api/soal/bank/${bankSoalId}`, {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}
