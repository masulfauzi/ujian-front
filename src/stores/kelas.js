import { defineStore } from 'pinia'
import { kelasService } from '@/services/kelasService'

export const useKelasStore = defineStore('kelas', {
  state: () => ({
    kelass: [],
    totalKelas: 0,
    currentPage: 1,
    pageSize: 10,
    selectedKelas: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasKelas: (state) => state.kelass.length > 0,
    kelasCount: (state) => state.kelass.length,
    totalPages: (state) => Math.ceil(state.totalKelas / state.pageSize),
    kelasById: (state) => (id) => state.kelass.find(k => k.id === id),
  },

  actions: {
    async fetchKelasList(page = 1, pageSize = 10, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        const response = await kelasService.getKelasList(page, pageSize, filters)
        this.kelass = response.data.data || []
        this.totalKelas = response.data.total
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch kelas list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchKelasById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await kelasService.getKelasById(id)
        this.selectedKelas = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch kelas detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createKelas(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await kelasService.createKelas(payload)
        this.success = 'Kelas berhasil dibuat'
        this.kelass.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create kelas'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateKelas(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await kelasService.updateKelas(id, payload)
        this.success = 'Kelas berhasil diupdate'

        const index = this.kelass.findIndex(k => k.id === id)
        if (index !== -1) {
          this.kelass[index] = response.data
        }
        this.selectedKelas = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update kelas'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteKelas(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await kelasService.deleteKelas(id)
        this.success = 'Kelas berhasil dihapus'
        this.kelass = this.kelass.filter(k => k.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete kelas'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreKelas(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await kelasService.restoreKelas(id)
        this.success = 'Kelas berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore kelas'
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
