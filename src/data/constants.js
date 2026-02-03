// --- Default Data & Constants ---

export const SMART_TEMPLATES = [
  {
    id: 1,
    category: "Vouching & Dokumen",
    focus: "Reviu Validitas & Keterjadian",
    options: [
      { 
        label: "Setuju (Valid)", 
        text: "Reviu dilakukan. Prosedur penelusuran dokumen telah memadai. Bukti yang dikumpulkan relevan dan kompeten untuk mendukung simpulan." 
      },
      { 
        label: "Koreksi (Substansi)", 
        text: "Perlu pendalaman pada substansi transaksi sampel ini. Pastikan tidak hanya lengkap secara formal, tetapi juga valid secara materiil." 
      }
    ]
  },
  {
    id: 2,
    category: "Matematis & Analitis",
    focus: "Reviu Akurasi & Logika",
    options: [
      { 
        label: "Setuju (Akurat)", 
        text: "Akurasi matematis telah diverifikasi. Logika analisis perbandingan data sudah konsisten dan tidak bias." 
      },
      { 
        label: "Koreksi (Hitungan)", 
        text: "Cek kembali rumus perhitungan pada KKP ini. Terdapat nilai material yang perlu dipastikan kebenarannya agar tidak menurunkan kredibilitas laporan." 
      }
    ]
  },
  {
    id: 3,
    category: "Cek Fisik & Observasi",
    focus: "Reviu Metodologi & Keberadaan",
    options: [
      { 
        label: "Setuju (Metodologi Tepat)", 
        text: "Metodologi fisik (misal: roll back) sudah tepat. Bukti fisik cukup untuk menyimpulkan keberadaan dan kondisi aset." 
      },
      { 
        label: "Koreksi (Prosedur Tambahan)", 
        text: "Hasil cek fisik masih meragukan. PT mengusulkan prosedur tambahan/ulang untuk memastikan validitas kondisi di lapangan." 
      }
    ]
  },
  {
    id: 4,
    category: "Konfirmasi Pihak Ketiga",
    focus: "Reviu Keandalan & Independensi",
    options: [
      { 
        label: "Setuju (Independen)", 
        text: "Keandalan bukti balasan konfirmasi dinilai baik karena berasal langsung dari pihak ketiga yang independen." 
      },
      { 
        label: "Koreksi (Alternatif)", 
        text: "Konfirmasi tidak berbalas atau terindikasi tidak independen. PT mewajibkan prosedur alternatif sebelum dijadikan temuan." 
      }
    ]
  },
  {
    id: 5,
    category: "Telaah Regulasi",
    focus: "Reviu Kepatuhan & Unsur Temuan",
    options: [
      { 
        label: "Setuju (Lengkap)", 
        text: "Unsur temuan (Kondisi, Kriteria, Sebab, Akibat) telah terpenuhi sesuai SPKN. Bahasa yang digunakan lugas dan tidak ambigu." 
      },
      { 
        label: "Koreksi (Dasar Hukum)", 
        text: "Interpretasi regulasi pada bagian 'Kriteria' perlu diperbaiki. Pastikan aturan tersebut masih berlaku dan relevan dengan konteks kejadian." 
      }
    ]
  }
];

export const DEFAULT_PROCEDURES = [
  { id: 'def-1', category: '1. Vouching', name: 'Vouching belanja modal ke kontrak dan bukti fisik' },
  { id: 'def-2', category: '2. Matematis', name: 'Perhitungan ulang (recalculation) denda keterlambatan' },
  { id: 'def-3', category: '3. Fisik', name: 'Cek fisik (Stock Opname) persediaan obat' },
  { id: 'def-4', category: '4. Konfirmasi', name: 'Konfirmasi saldo piutang ke Wajib Pajak' },
  { id: 'def-5', category: '5. Regulasi', name: 'Telaah kepatuhan penyusunan Laporan Keuangan terhadap SAP' },
];

export const EMPTY_PROJECT = {
  meta: {
    auditName: '',
    entityName: '',
    fiscalYear: new Date().getFullYear(),
    dalnisName: '',
    teamLeaderName: '',
    startDate: new Date().toISOString().split('T')[0],
  },
  plans: [], 
  notes: [],
  chat: [],
  procedures: DEFAULT_PROCEDURES
};
