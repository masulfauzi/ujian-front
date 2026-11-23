import api from './api'

export const KONFIRMASI_SINKRON_SISWA = 'HAPUS SEMUA DATA SISWA'
export const KONFIRMASI_SINKRON_BANK_SOAL = 'HAPUS SEMUA BANK SOAL'

// dryRun = true: pratinjau saja; false: jalankan sungguhan (wajib konfirmasi)
const buildPayload = ({ dryRun = true, konfirmasi = '' } = {}) => {
  const payload = { dry_run: dryRun }
  if (!dryRun) payload.konfirmasi = konfirmasi
  return payload
}

export const sinkronService = {
  sinkronSiswa: async (options) => {
    try {
      const response = await api.post('/sinkron/siswa', buildPayload(options))
      return response.data
    } catch (error) {
      throw error
    }
  },

  sinkronBankSoal: async (options) => {
    try {
      const response = await api.post('/sinkron/bank-soal', buildPayload(options))
      return response.data
    } catch (error) {
      throw error
    }
  },
}
