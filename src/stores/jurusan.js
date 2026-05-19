import { defineStore } from 'pinia'
import { jurusanService } from '@/services/jurusanService'

export const useJurusanStore = defineStore('jurusan', {
  state: () => ({
    jurusans: [],
    totalJurusans: 0,
    currentPage: 1,
    pageSize: 10,
    selectedJurusan: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasJurusans: (state) => state.jurusans.length > 0,
    jurusanCount: (state) => state.jurusans.length,
    totalPages: (state) => Math.ceil(state.totalJurusans / state.pageSize),
    jurusanById: (state) => (id) => state.jurusans.find(j => j.id === id),
  },

  actions: {
    async fetchJurusanList(page = 1, pageSize = 10) {
      this.isLoading = true
      this.error = null

      try {
        const response = await jurusanService.getJurusanList(page, pageSize)
        this.jurusans = response.data.data || []
        this.totalJurusans = response.data.total
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch jurusan list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchJurusanById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await jurusanService.getJurusanById(id)
        this.selectedJurusan = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch jurusan detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createJurusan(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await jurusanService.createJurusan(payload)
        this.success = 'Jurusan berhasil dibuat'
        this.jurusans.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create jurusan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateJurusan(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await jurusanService.updateJurusan(id, payload)
        this.success = 'Jurusan berhasil diupdate'

        const index = this.jurusans.findIndex(j => j.id === id)
        if (index !== -1) {
          this.jurusans[index] = response.data
        }
        this.selectedJurusan = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update jurusan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteJurusan(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await jurusanService.deleteJurusan(id)
        this.success = 'Jurusan berhasil dihapus'
        this.jurusans = this.jurusans.filter(j => j.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete jurusan'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreJurusan(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await jurusanService.restoreJurusan(id)
        this.success = 'Jurusan berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore jurusan'
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
