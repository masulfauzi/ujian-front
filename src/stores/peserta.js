import { defineStore } from 'pinia'
import { pesertaService } from '@/services/pesertaService'

export const usePesertaStore = defineStore('peserta', {
  state: () => ({
    pesertas: [],
    totalPeserta: 0,
    currentPage: 1,
    pageSize: 10,
    selectedPeserta: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasPeserta: (state) => state.pesertas.length > 0,
    pesertaCount: (state) => state.pesertas.length,
    totalPages: (state) => Math.ceil(state.totalPeserta / state.pageSize),
    pesertaById: (state) => (id) => state.pesertas.find(p => p.id === id),
  },

  actions: {
    async fetchPesertaList(page = 1, pageSize = 10, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await pesertaService.getPesertaList(page, pageSize, filters)
        this.pesertas = response.data.data || []
        this.totalPeserta = response.data.total
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch peserta list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchPesertaById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await pesertaService.getPesertaById(id)
        this.selectedPeserta = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch peserta detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createPeserta(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await pesertaService.createPeserta(payload)
        this.success = 'Peserta berhasil dibuat'
        this.pesertas.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create peserta'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updatePeserta(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await pesertaService.updatePeserta(id, payload)
        this.success = 'Peserta berhasil diupdate'

        const index = this.pesertas.findIndex(p => p.id === id)
        if (index !== -1) {
          this.pesertas[index] = response.data
        }
        this.selectedPeserta = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update peserta'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deletePeserta(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await pesertaService.deletePeserta(id)
        this.success = 'Peserta berhasil dihapus'
        this.pesertas = this.pesertas.filter(p => p.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete peserta'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restorePeserta(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await pesertaService.restorePeserta(id)
        this.success = 'Peserta berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore peserta'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearError() {
      this.error = null
    },

    clearSuccess() {
      this.success = null
    },
  },
})
