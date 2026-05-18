import { defineStore } from 'pinia'
import { mapelService } from '@/services/mapelService'

export const useMapelStore = defineStore('mapel', {
  state: () => ({
    mapels: [],
    totalMapels: 0,
    currentPage: 1,
    pageSize: 10,
    selectedMapel: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasMapels: (state) => state.mapels.length > 0,
    mapelCount: (state) => state.mapels.length,
    totalPages: (state) => Math.ceil(state.totalMapels / state.pageSize),
    mapelById: (state) => (id) => state.mapels.find(m => m.id === id),
  },

  actions: {
    async fetchMapelList(page = 1) {
      this.isLoading = true
      this.error = null

      try {
        const response = await mapelService.getMapelList(page, this.pageSize)
        this.mapels = response.data.data
        this.totalMapels = response.data.total
        this.currentPage = page
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch mapel list'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchMapelById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await mapelService.getMapelById(id)
        this.selectedMapel = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch mapel detail'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createMapel(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await mapelService.createMapel(payload)
        this.success = 'Mapel berhasil dibuat'
        this.mapels.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to create mapel'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateMapel(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await mapelService.updateMapel(id, payload)
        this.success = 'Mapel berhasil diupdate'

        const index = this.mapels.findIndex(m => m.id === id)
        if (index !== -1) {
          this.mapels[index] = response.data
        }
        this.selectedMapel = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to update mapel'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteMapel(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await mapelService.deleteMapel(id)
        this.success = 'Mapel berhasil dihapus'
        this.mapels = this.mapels.filter(m => m.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to delete mapel'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async restoreMapel(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await mapelService.restoreMapel(id)
        this.success = 'Mapel berhasil di-restore'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to restore mapel'
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
