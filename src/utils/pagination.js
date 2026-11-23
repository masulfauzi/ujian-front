// Daftar item pagination ringkas: angka halaman dan '...' untuk celah.
// Contoh (siblings = 1): halaman 60 dari 129 -> [1, '...', 59, 60, 61, '...', 129]
// Jumlah item selalu tetap (2 * siblings + 5) agar lebar pagination stabil.
export const ELLIPSIS = '...'

export const getPageItems = (current, total, siblings = 1) => {
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const slots = 2 * siblings + 5

  if (total <= slots) return range(1, total)

  const edgeCount = 3 + 2 * siblings // jumlah angka di blok ujung (tanpa '...' dan halaman seberang)

  if (current - siblings <= 3) {
    return [...range(1, edgeCount), ELLIPSIS, total]
  }
  if (current + siblings >= total - 2) {
    return [1, ELLIPSIS, ...range(total - edgeCount + 1, total)]
  }
  return [1, ELLIPSIS, ...range(current - siblings, current + siblings), ELLIPSIS, total]
}
