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

// Checklist Reviu HP3 dan Cover Sheet untuk Pengendali Teknis
export const CHECKLIST_ITEMS = [
  {
    id: 'A',
    section: 'A. Reviu Kelengkapan dan Administrasi',
    items: [
      { id: 'A1', text: 'Apakah Cover Sheet dan HP3 tersedia secara fisik atau elektronis (e-KKP) dan telah diisi oleh Ketua Tim/Anggota Tim?' },
      { id: 'A2', text: 'Apakah identitas penugasan (Nama Objek, Tahun Anggaran, Kode KKP) pada Cover Sheet sudah benar?' },
      { id: 'A3', text: 'Apakah terdapat sistem referensi silang (cross-reference) yang jelas antara Cover Sheet, HP3, dan bukti pendukung dalam KKP?' },
      { id: 'A4', text: 'Apakah Cover Sheet dapat ditelusuri dengan mudah ke KKP pendukung yang relevan?' },
    ]
  },
  {
    id: 'B',
    section: 'B. Reviu Kesesuaian dengan Program Pemeriksaan (P2)',
    items: [
      { id: 'B5', text: 'Apakah seluruh langkah prosedur yang direncanakan dalam Program Pemeriksaan (P2) telah dituangkan dalam HP3?' },
      { id: 'B6', text: 'Apakah setiap langkah prosedur dalam HP3 telah dilaksanakan?' },
      { id: 'B7', text: 'Jika terdapat prosedur yang tidak dilaksanakan atau dimodifikasi, apakah telah didukung oleh alasan/justifikasi yang memadai dan didokumentasikan dalam HP3?' },
      { id: 'B8', text: 'Apakah perubahan atau penambahan prosedur (jika ada) telah mendapatkan persetujuan (dari PT atau PM)?' },
    ]
  },
  {
    id: 'C',
    section: 'C. Reviu Substansi Hasil Pelaksanaan Prosedur (HP3)',
    items: [
      { id: 'C9', text: 'Apakah bukti pemeriksaan yang dikumpulkan dan dilampirkan dalam KKP sudah cukup dan tepat (relevan, kompeten) untuk mendukung simpulan di HP3?' },
      { id: 'C10', text: 'Apakah analisis/penjelasan hasil pemeriksaan dalam HP3 menjawab tujuan dari prosedur yang dilakukan?' },
      { id: 'C11', text: 'Apakah terdapat kebenaran matematis dan akurasi angka pada data yang disajikan dalam HP3 (misal: penjumlahan, perkalian tarif)?' },
      { id: 'C12', text: 'Apakah validitas substansi transaksi yang diuji telah diverifikasi (misal: keaslian bukti, konfirmasi pihak ketiga)?' },
      { id: 'C13', text: 'Apakah simpulan per prosedur dalam HP3 logis dan didukung oleh bukti yang ada?' },
    ]
  },
  {
    id: 'D',
    section: 'D. Reviu Cover Sheet (Simpulan Umum)',
    items: [
      { id: 'D14', text: 'Apakah deskripsi hasil pemeriksaan pada Cover Sheet menggambarkan ikhtisar yang akurat dari detail di HP3?' },
      { id: 'D15', text: 'Apakah simpulan akhir pada Cover Sheet konsisten dengan temuan atau hasil analisis yang ada di HP3?' },
      { id: 'D16', text: 'Apakah informasi pada Cover Sheet telah diverifikasi kebenarannya oleh Ketua Tim sebelum diserahkan ke PT?' },
    ]
  },
  {
    id: 'E',
    section: 'E. Identifikasi Temuan dan Risiko (Quality Control)',
    items: [
      { id: 'E17', text: 'Jika hasil prosedur menunjukkan adanya penyimpangan, apakah konsep Temuan Pemeriksaan telah memenuhi unsur Kondisi, Kriteria, Sebab, dan Akibat?' },
      { id: 'E18', text: 'Apakah penggunaan bahasa dalam narasi HP3 dan Cover Sheet sudah sesuai ketentuan (baku, jelas, tidak ambigu)?' },
      { id: 'E19', text: 'Apakah terdapat indikasi kerugian negara/unsur pidana? Jika ya, apakah sudah didiskusikan kelayakannya dengan Pengendali Mutu?' },
      { id: 'E20', text: 'Apakah terdapat temuan yang dinilai tidak layak? Jika ya, apakah alasan ketidaklayakan (misal: bukti lemah) sudah didokumentasikan?' },
    ]
  }
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
  checklist: {}, // Object to store checklist answers: { itemId: { answer: 'ya'|'tidak'|null, note: '' } }
  procedures: DEFAULT_PROCEDURES
};
