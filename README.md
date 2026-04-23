# Ujian Front (Vue.js)

Project ini menggunakan Vue.js + Vite dengan pendekatan struktur berbasis modul.

## Struktur High-Level

- `src/views` sebagai pusat halaman berbasis modul.
- `src/router/modules` sebagai konfigurasi route per modul.
- `src/components` untuk komponen reusable lintas modul.
- `src/services` untuk integrasi API atau service layer.
- `src/utils` untuk helper/utilitas bersama.

## Konvensi Modul

- Setiap domain fitur memiliki folder sendiri di `src/views`.
- Contoh awal:
	- `src/views/dashboard`
	- `src/views/bank_soal`
- Penambahan fitur baru wajib mengikuti pola modul yang sama.

## Routing Modul

- Setiap modul memiliki file route terpisah di `src/router/modules`.
- `src/router/index.js` hanya bertugas menggabungkan route dari tiap modul.

## Menjalankan Proyek

```bash
npm install
npm run dev
```
