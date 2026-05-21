import { defineStore } from 'pinia'
import { jadwalService } from '@/services/jadwalService'
import { jadwalKelasService } from '@/services/jadwalKelasService'

export const useJadwalStore = defineStore('jadwal', {
  state: () => ({
    jadwals: [],
    totalJadwal: 0,
    currentPage: 1,
    pageSize: 10,
    selectedJadwal: null,
    jadwalKelas: [],
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.totalJadwal / state.pageSize),
  },

  actions: {
    async fetchJadwalList(page = 1, pageSize = 10) {
      this.isLoading = true
      this.error = null

      try {
        const response = await jadwalService.getJadwalList(page, pageSize)
        this.jadwals = response.data?.data || []
        this.totalJadwal = response.data?.total || 0
        this.currentPage = page
        this.pageSize = pageSize
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal mengambil daftar jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchJadwalById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await jadwalService.getJadwalById(id)
        this.selectedJadwal = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal mengambil detail jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createJadwal(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await jadwalService.createJadwal(payload)
        this.success = 'Jadwal berhasil dibuat'
        this.jadwals.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal membuat jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateJadwal(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await jadwalService.updateJadwal(id, payload)
        this.success = 'Jadwal berhasil diperbarui'
        const index = this.jadwals.findIndex(j => j.id === id)
        if (index > -1) {
          this.jadwals[index] = response.data
        }
        this.selectedJadwal = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memperbarui jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteJadwal(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await jadwalService.deleteJadwal(id)
        this.success = 'Jadwal berhasil dihapus'
        this.jadwals = this.jadwals.filter(j => j.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menghapus jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchJadwalKelas(idJadwal) {
      this.isLoading = true
      this.error = null

      try {
        const response = await jadwalKelasService.getJadwalKelasByJadwalId(idJadwal)
        this.jadwalKelas = response.data?.data || []
        return this.jadwalKelas
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal mengambil kelas jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async syncJadwalKelas(idJadwal, selectedKelasIds) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const existing = await jadwalKelasService.getJadwalKelasByJadwalId(idJadwal)
        const existingItems = existing.data?.data || []

        for (const item of existingItems) {
          await jadwalKelasService.deleteJadwalKelas(item.id)
        }

        for (const idKelas of selectedKelasIds) {
          await jadwalKelasService.createJadwalKelas({
            id_jadwal: idJadwal,
            id_kelas: idKelas,
          })
        }

        this.success = 'Kelas jadwal berhasil disinkronkan'
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menyinkronkan kelas jadwal'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    clearSuccess() {
      this.success = null
    },

    clearError() {
      this.error = null
    },
  },
})
