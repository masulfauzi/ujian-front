import api from './api'

export const KONFIRMASI_SINKRON_SISWA = 'HAPUS SEMUA DATA SISWA'

export const sinkronService = {
  // dryRun = true: pratinjau saja; false: jalankan sungguhan (wajib konfirmasi)
  sinkronSiswa: async ({ dryRun = true, konfirmasi = '' } = {}) => {
    try {
      const payload = { dry_run: dryRun }
      if (!dryRun) payload.konfirmasi = konfirmasi
      const response = await api.post('/sinkron/siswa', payload)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
