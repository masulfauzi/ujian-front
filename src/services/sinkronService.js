import api from './api'

export const KONFIRMASI_SINKRON_SISWA = 'HAPUS SEMUA DATA SISWA'
export const KONFIRMASI_SINKRON_BANK_SOAL = 'HAPUS SEMUA BANK SOAL'
export const KONFIRMASI_SINKRON_SATU_BANK_SOAL = 'SINKRON BANK SOAL'

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

  // Daftar ringkas bank soal di Sianida + keadaannya di aplikasi ujian (untuk sinkron per bank)
  getBankSoalSianida: async () => {
    try {
      const response = await api.get('/sinkron/bank-soal/sianida')
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Sinkron satu bank soal (id = ID bank soal di Sianida)
  sinkronSatuBankSoal: async (id, options) => {
    try {
      const response = await api.post(`/sinkron/bank-soal/${id}`, buildPayload(options))
      return response.data
    } catch (error) {
      throw error
    }
  },
}
