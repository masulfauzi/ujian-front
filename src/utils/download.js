// Helper untuk endpoint yang mengembalikan file (blob) via axios, mis. export Excel/PDF/ZIP.

// Trigger download file dari axios response (responseType: 'blob').
// Nama file diambil dari header Content-Disposition, fallback ke defaultFilename.
export function downloadBlob(response, defaultFilename, mimeType) {
  const blob = mimeType ? new Blob([response.data], { type: mimeType }) : new Blob([response.data])
  const url = URL.createObjectURL(blob)
  const filename =
    response.headers['content-disposition']?.match(/filename="?(.+?)"?$/)?.[1] || defaultFilename
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Axios dengan responseType 'blob' membuat body error (400/500) ikut terbaca sebagai Blob,
// bukan objek JSON biasa, sehingga err.response.data.message selalu undefined. Fungsi ini
// membaca ulang Blob tersebut sebagai teks lalu di-parse sebagai JSON untuk dapatkan pesannya.
export async function extractBlobErrorMessage(err, fallback) {
  const data = err.response?.data
  if (data instanceof Blob) {
    try {
      const parsed = JSON.parse(await data.text())
      return parsed?.message || fallback
    } catch {
      return fallback
    }
  }
  return data?.message || fallback
}
