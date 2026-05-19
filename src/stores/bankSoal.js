import { defineStore } from 'pinia'
import { bankSoalService } from '@/services/bankSoalService'

export const useBankSoalStore = defineStore('bankSoal', {
  state: () => ({
    soals: [],
    totalSoals: 0,
    currentPage: 1,
    pageSize: 10,
    selectedSoal: null,
    filters: {
      mapel_id: null,
      tipe_soal: null,
      tingkat_kesulitan: null,
      search: null
    },
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasSoals: (state) => state.soals.length > 0,
    soalCount: (state) => state.soals.length,
    totalPages: (state) => Math.ceil(state.totalSoals / state.pageSize),
    soalById: (state) => (id) => state.soals.find(s => s.id === id),
  },

  actions: {
    async fetchSoalList(page = 1, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const filterParams = {
          ...this.filters,
          ...filters
        }

        // Remove null/empty filters
        Object.keys(filterParams).forEach(key => {
          if (!filterParams[key]) {
            delete filterParams[key]
          }
        })

        const response = await bankSoalService.getSoalList(page, this.pageSize, filterParams)
        this.soals = response.data.data
        this.totalSoals = response.data.total
        this.currentPage = page
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch soal list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchSoalById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await bankSoalService.getSoalById(id)
        this.selectedSoal = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch soal detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createSoal(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await bankSoalService.createSoal(payload)
        this.success = 'Soal berhasil dibuat'
        this.soals.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateSoal(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await bankSoalService.updateSoal(id, payload)
        this.success = 'Soal berhasil diupdate'

        const index = this.soals.findIndex(s => s.id === id)
        if (index !== -1) {
          this.soals[index] = response.data
        }
        this.selectedSoal = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteSoal(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await bankSoalService.deleteSoal(id)
        this.success = 'Soal berhasil dihapus'
        this.soals = this.soals.filter(s => s.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreSoal(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await bankSoalService.restoreSoal(id)
        this.success = 'Soal berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore soal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters) {
      this.filters = {
        ...this.filters,
        ...filters
      }
    },

    clearFilters() {
      this.filters = {
        mapel_id: null,
        tipe_soal: null,
        tingkat_kesulitan: null,
        search: null
      }
    },

    clearError() {
      this.error = null
    },

    clearSuccess() {
      this.success = null
    },

    async importSoalFromExcel(formData) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await bankSoalService.importSoalFromExcel(formData)
        this.success = 'Soal berhasil diimpor dari Excel'
        return response
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal mengimpor soal dari Excel'
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
