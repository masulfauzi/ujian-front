// Jenis soal yang didukung backend (lihat SOAL_API.md bagian "Jenis Soal").
// pg  = pilihan ganda, kunci/jawaban 1 huruf (mis. "B")
// pgk = pilihan ganda kompleks, kunci >= 2 huruf, jawaban >= 1 huruf (mis. "AC")
// bs  = benar/salah, 3 pernyataan di opsi_a..opsi_c, kunci/jawaban 3 karakter B/S (mis. "BSB")
export const JENIS_SOAL = [
  { value: 'pg', label: 'Pilihan Ganda' },
  { value: 'pgk', label: 'Pilihan Ganda Kompleks' },
  { value: 'bs', label: 'Benar/Salah' },
]

export const OPSI_HURUF = ['A', 'B', 'C', 'D', 'E']

export const jenisLabel = (jenis) =>
  JENIS_SOAL.find((j) => j.value === jenis)?.label || JENIS_SOAL[0].label

// Tambah/hapus satu huruf dari string huruf, hasil selalu unik & terurut (format yang dipakai server).
export const toggleHuruf = (str, huruf) => {
  const set = new Set((str || '').split('').filter(Boolean))
  if (set.has(huruf)) set.delete(huruf)
  else set.add(huruf)
  return [...set].sort().join('')
}
