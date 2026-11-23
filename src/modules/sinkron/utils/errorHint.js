// Penjelasan tambahan untuk status error endpoint sinkronisasi.
const DEFAULT_HINTS = {
  409: 'Masih ada ujian yang aktif dalam 2 jam terakhir. Tunggu hingga semua ujian selesai lalu coba lagi.',
  502: 'Sianida tidak bisa dihubungi atau membalas error. Coba lagi beberapa saat lagi atau periksa konfigurasi sinkron di server.',
  500: 'Penyimpanan gagal dan dibatalkan. Data lama tetap utuh.',
}

export const getSinkronErrorHint = (status, overrides = {}) =>
  ({ ...DEFAULT_HINTS, ...overrides })[status] || null

export const getSinkronErrorMessage = (err, fallback) =>
  err.response?.data?.message || err.message || fallback
