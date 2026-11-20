import { defineStore } from 'pinia'
import { userService } from '@/services/userService'

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    selectedUser: null,
    isLoading: false,
    error: null,
    success: null,
  }),

  getters: {
    hasUsers: (state) => state.users.length > 0,
    userById: (state) => (id) => state.users.find(u => u.id === id),
  },

  actions: {
    async fetchUserList() {
      this.isLoading = true
      this.error = null

      try {
        const response = await userService.getUserList()
        this.users = response.data || []
        return this.users
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat daftar user'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async fetchUserById(id) {
      this.isLoading = true
      this.error = null

      try {
        const response = await userService.getUserById(id)
        this.selectedUser = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memuat data user'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async createUser(payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await userService.createUser(payload)
        this.success = 'User berhasil ditambahkan'
        this.users.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menambahkan user'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateUser(id, payload) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        const response = await userService.updateUser(id, payload)
        this.success = 'User berhasil diperbarui'

        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = response.data
        }
        this.selectedUser = response.data
        return response.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal memperbarui user'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteUser(id) {
      this.isLoading = true
      this.error = null
      this.success = null

      try {
        await userService.deleteUser(id)
        this.success = 'User berhasil dihapus'
        this.users = this.users.filter(u => u.id !== id)
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Gagal menghapus user'
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
