# Aplikasi Supervisi

Aplikasi Supervisi adalah sebuah alat bantu berbasis web yang dirancang untuk memfasilitasi proses supervisi dalam kegiatan audit. Aplikasi ini memungkinkan Pengendali Teknis (PT) dan Ketua Tim (KT) untuk merencanakan, mencatat, dan meninjau prosedur audit secara kolaboratif dalam satu platform yang terintegrasi.

Aplikasi ini berjalan sepenuhnya di sisi klien (browser), memastikan semua data audit tetap tersimpan secara lokal di komputer pengguna dan tidak dikirim ke server manapun, sehingga menjaga kerahasiaan data.

## Fitur Utama

- **Manajemen Proyek**:
  - Membuat proyek supervisi baru dari awal.
  - Membuka dan melanjutkan pekerjaan dari file `.supervisi` yang sudah ada.
  - Menyimpan seluruh data proyek (termasuk rencana, catatan, dan chat) ke dalam satu file `.supervisi`.
- **Penyimpanan Selektif**:
  - Opsi untuk menyimpan file `.supervisi` yang hanya berisi **Catatan Pengendali Teknis (PT)** atau **hanya Respon Ketua Tim (KT)**, memungkinkan pembuatan versi file yang terpisah untuk masing-masing peran.
- **Status Penyimpanan Persisten**:
  - Menampilkan informasi kapan dan jenis data apa yang terakhir disimpan di header aplikasi. Status ini juga ikut tersimpan di dalam file proyek.
- **Tabulasi Data Terstruktur**:
  - **Informasi Penugasan**: Mengelola metadata proyek seperti nama audit, entitas, tahun fiskal, dan nama personel.
  - **Rencana Supervisi**: Membuat dan mengelola daftar prosedur audit yang akan dilaksanakan.
  - **Pelaksanaan Supervisi**: Mencatat hasil reviu PT dan tanggapan KT untuk setiap prosedur audit.
  - **Diskusi Tim**: Fitur chat terintegrasi untuk diskusi dan pencatatan isu-isu penting, yang datanya juga tersimpan dalam file proyek.
- **Utilitas Tambahan**:
  - **Impor Prosedur dari CSV**: Mempercepat proses input rencana supervisi dengan mengimpor data dari file CSV.
  - **Ekspor Chat ke Word**: Mengekspor riwayat diskusi tim ke dalam format dokumen Microsoft Word untuk keperluan dokumentasi.
  - **Mode Layar Penuh**: Memaksimalkan area kerja untuk pengalaman yang lebih fokus.

## Teknologi yang Digunakan

- **Frontend**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Struktur Folder Proyek

```
/
├── public/             # Aset statis
├── src/
│   ├── assets/         # Gambar dan aset lainnya
│   ├── components/     # Komponen-komponen React yang dapat digunakan kembali
│   ├── data/           # Data konstan seperti template default
│   └── utils/          # Fungsi-fungsi helper (misal: parser CSV, export)
├── .eslintrc.cjs       # Konfigurasi ESLint
├── index.html          # Entry point HTML
├── package.json        # Daftar dependensi dan skrip proyek
├── postcss.config.js   # Konfigurasi PostCSS
├── tailwind.config.js  # Konfigurasi Tailwind CSS
└── vite.config.js      # Konfigurasi Vite
```

## Panduan Penggunaan dan Instalasi

### Prasyarat

Pastikan Anda memiliki [Node.js](https://nodejs.org/) (disarankan versi LTS) dan `npm` terinstal di sistem Anda.

### 1. Instalasi Dependensi

Buka terminal di direktori root proyek dan jalankan perintah berikut untuk menginstal semua paket yang dibutuhkan:

```bash
npm install
```

### 2. Menjalankan Aplikasi (Mode Development)

Setelah instalasi selesai, jalankan perintah berikut untuk memulai server development:

```bash
npm run dev
```

Aplikasi akan berjalan dan dapat diakses melalui URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

### 3. Membangun Aplikasi (Mode Produksi)

Untuk membuat versi produksi yang teroptimasi, jalankan perintah:

```bash
npm run build
```

Hasilnya akan tersedia di dalam folder `dist`, yang siap untuk di-deploy ke server web statis.

---
*Dokumentasi ini dibuat secara otomatis.*

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
