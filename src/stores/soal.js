import { defineStore } from 'pinia'
import { soalService } from '@/services/soalService'

export const useSoalStore = defineStore('soal', {
  state: () => ({
    soals: [],
    totalSoals: 0,
    currentPage: 1,
    pageSize: 10,
    isLoading: false,
    error: null
  }),

  getters: {
    hasSoals: (state) => state.soals.length > 0,
    soalCount: (state) => state.soals.length,
    totalPages: (state) => Math.ceil(state.totalSoals / state.pageSize)
  },

  actions: {
    async fetchSoalByBankId(bankSoalId, page = 1) {
      this.isLoading = true
      this.error = null

      try {
        const response = await soalService.getSoalByBankId(bankSoalId, page, this.pageSize)
        this.soals = response.data.data || []
        this.totalSoals = response.data.total || 0
        this.currentPage = page
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
