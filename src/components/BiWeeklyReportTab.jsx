import React from 'react';
import { Document, Packer, Paragraph, TextRun, ShadingType, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, Footer, PageNumber } from "docx";
import { saveAs } from "file-saver";
import { FileDown, Calendar } from 'lucide-react';

export default function BiWeeklyReportTab({ project, onUpdate }) {
  const report = project.biWeeklyReport || {};

  const handleChange = (field, value) => {
    onUpdate({
      ...report,
      [field]: value
    });
  };

  // Fungsi Tanggal mudah dibaca
  const formatDateId = (dateInput) => {
    // Ubah input jadi objek Date. Kalau kosong, ambil tanggal hari ini.
    const dateObj = dateInput ? new Date(dateInput) : new Date();

    // Format ke bahasa Indonesia (contoh: 17 Februari 2026)
    return dateObj.toLocaleDateString('id-ID', {
      day: 'numeric',   // Angka tanggal (1-31)
      month: 'long',    // Nama bulan lengkap (Januari - Desember)
      year: 'numeric'   // Angka tahun (4 digit)
    });
  };

  // Fungsi untuk mendapatkan warna berdasarkan persentase
  const getPercentageColor = (percent) => {
    let r, g;
    let b = 0; // Biru selalu 0 karena kita main di area Merah-Kuning-Hijau

    if (percent < 50) {
      // Fase 1: Dari Merah (FF0000) menuju Kuning (FFFF00)
      r = 255;
      g = Math.round((percent / 50) * 255);
    } else {
      // Fase 2: Dari Kuning (FFFF00) menuju Hijau (00FF00)
      g = 255;
      r = Math.round(((100 - percent) / 50) * 255);
    }

    // Konversi angka RGB (0-255) ke format Hex String (contoh: "FF7000")
    const toHex = (c) => c.toString(16).padStart(2, '0').toUpperCase();
    
    return `${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handleExport = () => {
    // Config menghilangkan garis tabel agar terlihat seperti layout biasa
    const noBorders = {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
    };

    const topBorders = {
      top: { style: BorderStyle.THICK_THIN_SMALL_GAP, size: 0.3, color: "auto" },
      bottom: { style: BorderStyle.NONE, size: 0, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
    };

     const bottomBorders = {
      top: { style: BorderStyle.NONE, size: 0, color: "auto" },
      bottom: { style: BorderStyle.THICK_THIN_SMALL_GAP, size: 0.3, color: "auto" },
      left: { style: BorderStyle.NONE, size: 0, color: "auto" },
      right: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "auto" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "auto" },
    };

    const doc = new Document({
      sections: [{
        properties: {},
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                tabStops: [
                  { type: "right", position: 9500 }
                ],
                children: [
                  new TextRun({ text: "Dicetak menggunakan Aplikasi Supervisi" , italics: true }),
                  new TextRun({ text: " \t| Halaman ke " }),
                  new TextRun({ children: [PageNumber.CURRENT] }), // Spasi sebelum nomor halaman
                  new TextRun({ text: " Dari " }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES] }),
                  new TextRun({ text: " Halaman."}),
                  
                ],
              })
            ]
          })
        },
        children: [
          // HEADER MENGGUNAKAN TABEL
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: bottomBorders, // Garis hanya di bagian bawah header
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                      children: [
                        new TextRun({ text: "LAPORAN DUA MINGGUAN", bold: true }),
                      ],
                      heading: HeadingLevel.HEADING_1,
                      alignment: AlignmentType.CENTER,
                      spacing: { after: 200 }
                    })],
                  }),
                  new TableCell({
                    verticalAlign: "center",
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: {
                      type: ShadingType.CLEAR,
                      color: "auto",
                      fill: getPercentageColor(report.realizationPercentage || 0) // Warna berdasarkan persentase
                    },
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ 
                          text: ` ${report.realizationPercentage || 0}%`, 
                          bold: true, 
                          size: 40,
                        }),
                      ],
                    })],
                  }),
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({
                    verticalAlign: "center",
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ 
                          text: "(Dari Pengendali Teknis ke Wakil/Penanggung Jawab)", 
                          size: 18,
                          italics: true 
                        }),
                      ],
                      spacing: { after: 200 }
                    })],
                  }),
                  new TableCell({
                    verticalAlign: "bottom",
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: {
                      type: ShadingType.CLEAR,
                      color: "auto",
                      fill: getPercentageColor(report.realizationPercentage || 0) // Warna berdasarkan persentase
                    },
                    children: [new Paragraph({
                      alignment: AlignmentType.CENTER,
                      children: [
                        new TextRun({ 
                          text: "Realisasi Prosedur", 
                          bold: true, 
                          italics: true,
                          size: 18,
                        }),
                      ],
                      spacing: { after: 200 }
                    })],
                  })
                ]
              }),
            ]
          }),

          // I. INFORMASI UMUM
          new Paragraph({
            text: "I. INFORMASI UMUM",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 600, after: 150 }
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 2500 }, 
              { type: "left", position: 3000 }
            ],
            children: [
              new TextRun({ text: "Nama Objek Pemeriksaan\t:\t", bold: true }),
              new TextRun(project.meta.entityName || "-")
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 2500 }, 
              { type: "left", position: 3000 }
            ],
            children: [
              new TextRun({ text: "Jenis Pemeriksaan\t:\t", bold: true }),
              new TextRun(project.meta.auditName || "-") // Assuming auditName is akin to type or title
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 2500 }, 
              { type: "left", position: 3000 }
            ],
            children: [
              new TextRun({ text: "Periode Laporan\t:\t", bold: true }),
              new TextRun(` ${formatDateId(report.startDate)} s.d. ${formatDateId(report.endDate)}`)
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 2500 }, 
              { type: "left", position: 3000 }
            ],
            children: [
              new TextRun({ text: "Pengendali Teknis\t:\t", bold: true }),
              // Assuming team is PT and KT for now
              new TextRun(`${project.meta.dalnisName || "-"}`)
            ],
            spacing: { after: 700 }
          }),

          // II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2)
          new Paragraph({
            text: "II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 700, after: 300 }
          }),
          new Paragraph({ 
            text: "1.\tRealisasi Prosedur:", 
            bold: true,
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ], 
          }),
          new Paragraph({ 
            text: `${report.realizationSummary || "-"}`, 
            indent: { left: 500 },
            alignment: AlignmentType.JUSTIFIED,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ], 
          }),
          new Paragraph({ 
            text: "2.\tDeviasi/Hambatan Prosedur:", 
            bold: true, 
            spacing: { before: 100 },
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: report.deviationList || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: `Alasan: ${report.deviationReason || "-"}`,
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),

          // III. STATUS KOMUNIKASI DAN HUBUNGAN DENGAN ENTITAS
          new Paragraph({
            text: "III. STATUS KOMUNIKASI DAN HUBUNGAN DENGAN ENTITAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 700, after: 300 }
          }),
          new Paragraph({ 
            text: "1.\tPelaksanaan Pertemuan:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true 
          }),
          new Paragraph({ 
            text: report.communicationMeeting || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: "2.\tMateri Komunikasi:", 
            bold: true, spacing: { before: 100 },
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ] }),
          new Paragraph({ 
            text: report.communicationMaterial || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ] }),
          new Paragraph({ 
            text: "3.\tRespon Entitas:",
            bold: true, 
            spacing: { before: 100 },
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ] }),
          new Paragraph({ 
            text: report.communicationResponse || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ] }),

          // IV. EVALUASI PENCAPAIAN TUJUAN DAN LINGKUP (SUBSTANSI)
          new Paragraph({
            text: "IV. EVALUASI PENCAPAIAN TUJUAN DAN LINGKUP (SUBSTANSI)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 700, after: 300 }
          }),
          new Paragraph({ 
            text: "1.\tCapaian Tujuan Pemeriksaan:",
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ], 
            bold: true 
          }),
          new Paragraph({ 
            text: report.objectiveEvaluation || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: "2.\tKecukupan Bukti:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true, spacing: { before: 100 } }),
          new Paragraph({ 
            text: report.evidenceSufficiency || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),


          // V. PENJAMINAN MUTU DAN KEPATUHAN
          new Paragraph({
            text: "V. PENJAMINAN MUTU DAN KEPATUHAN",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 700, after: 300 }
          }),
          new Paragraph({ 
            text: "1.\tKepatuhan Standar:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true }),
          new Paragraph({ 
            text: report.complianceStandard || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: "2.\tKode Etik:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true, spacing: { before: 100 } }),
          new Paragraph({ 
            text: report.complianceEthics || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),

          // VI. PERMASALAHAN DAN USULAN ARAHAN
          new Paragraph({
            text: "VI. PERMASALAHAN DAN USULAN ARAHAN",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 700, after: 300 }
          }),
          new Paragraph({ 
            text: "1.\tKendala Signifikan:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true }),
          new Paragraph({ 
            text: report.significantIssues || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: "2.\tUsulan Pengendali Teknis:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true, spacing: { before: 100 } }),
          new Paragraph({ 
            text: report.technicalSuggestions || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),
          new Paragraph({ 
            text: "3.\tPermintaan Arahan:", 
            alignment: AlignmentType.LEFT,
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
            bold: true, spacing: { before: 100 } }),
          new Paragraph({ 
            text: report.requestedDirection || "-", 
            alignment: AlignmentType.JUSTIFIED,
            indent: { left: 500 },
            tabStops: [
              { type: "left", position: 500 }, 
              { type: "left", position: 3000 }
            ],
          }),

          // Signature
          new Paragraph({
             text: `Denpasar, ${formatDateId(new Date().toLocaleDateString())}`,
             alignment: AlignmentType.CENTER,
             spacing: { before: 400, after: 100 }
          }),
           new Paragraph({
             text: "Disusun Oleh,",
             alignment: AlignmentType.CENTER,
             spacing: { after: 400, before: 100 }
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: noBorders,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ 
                        text: "Pengendali Teknis", 
                        alignment: AlignmentType.CENTER, 
                        bold: true })
                      ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ 
                        text: "Pengendali Teknis", 
                        alignment: AlignmentType.CENTER, 
                        bold: true })
                      ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ 
                        text: `( ${report.author || project.meta.dalnisName || "..."} )`, 
                        alignment: AlignmentType.CENTER, 
                        bold: true,
                        spacing: { before: 1000 } 
                      })
                      ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ 
                        text: `( ${report.author || project.meta.dalnisName || "..."} )`, 
                        alignment: AlignmentType.CENTER, 
                        bold: true,
                        spacing: { before: 1000 } 
                      })
                      ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Lap_2_Mingguan_${new Date().toLocaleDateString()}.docx`);
    });
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 pb-20">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 sticky top-0 z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Laporan Dua Mingguan</h2>
          <p className="text-sm text-slate-500">Formulir laporan berkala untuk Pengendali Mutu</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <FileDown size={18} />
          <span>Export Word</span>
        </button>

      </div>

      {/* I. INFORMASI UMUM */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">I. INFORMASI UMUM</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Periode Awal</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                    type="date" 
                    value={report.startDate} 
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Periode Akhir</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input 
                    type="date" 
                    value={report.endDate} 
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full pl-10 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                </div>
            </div>
             <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Penyusun (Pengendali Teknis)</label>
                <input 
                type="text" 
                value={report.author} 
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder={project.meta.dalnisName}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>
      </section>

      {/* II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2) */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2)</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Realisasi Prosedur (Ringkasan langkah yang telah dilaksanakan)</label>
                <textarea 
                rows={3}
                value={report.realizationSummary} 
                onChange={(e) => handleChange('realizationSummary', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Jelaskan prosedur yang sudah selesai..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Persentase Penyelesaian (%)</label>
                <input 
                type="number" 
                min="0"
                max="100"
                value={report.realizationPercentage} 
                onChange={(e) => handleChange('realizationPercentage', e.target.value)}
                className="w-24 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Deviasi/Hambatan Prosedur (Prosedur tertunda)</label>
                <textarea 
                rows={2}
                value={report.deviationList} 
                onChange={(e) => handleChange('deviationList', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Daftar prosedur yang tertunda..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alasan Penundaan (Teknis/Non-Teknis)</label>
                <textarea 
                rows={2}
                value={report.deviationReason} 
                onChange={(e) => handleChange('deviationReason', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Contoh: Data belum tersedia..."
                />
            </div>
        </div>
      </section>

      {/* III. STATUS KOMUNIKASI DAN HUBUNGAN DENGAN ENTITAS */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">III. STATUS KOMUNIKASI & HUBUNGAN ENTITAS</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Pelaksanaan Pertemuan (Entry meeting/Pembahasan)</label>
                <textarea 
                rows={2}
                value={report.communicationMeeting} 
                onChange={(e) => handleChange('communicationMeeting', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Materi Komunikasi (Konfirmasi tujuan/lingkup/dokumen)</label>
                <textarea 
                rows={2}
                value={report.communicationMaterial} 
                onChange={(e) => handleChange('communicationMaterial', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">3. Respon Entitas (Koperatif/Pemenuhan Data)</label>
                <textarea 
                rows={2}
                value={report.communicationResponse} 
                onChange={(e) => handleChange('communicationResponse', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>
      </section>

      {/* IV. EVALUASI PENCAPAIAN TUJUAN DAN LINGKUP (SUBSTANSI) */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">IV. EVALUASI PENCAPAIAN TUJUAN (SUBSTANSI)</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Capaian Tujuan Pemeriksaan (Potensi temuan/isu signifikan)</label>
                <textarea 
                rows={3}
                value={report.objectiveEvaluation} 
                onChange={(e) => handleChange('objectiveEvaluation', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                placeholder="Evaluasi apakah prosedur menjawab tujuan..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Kecukupan Bukti (Penilaian kecukupan & ketepatan)</label>
                <textarea 
                rows={2}
                value={report.evidenceSufficiency} 
                onChange={(e) => handleChange('evidenceSufficiency', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>
      </section>

      {/* V. PENJAMINAN MUTU DAN KEPATUHAN */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">V. PENJAMINAN MUTU DAN KEPATUHAN</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Kepatuhan Standar (SPKN/PMP/Juknis)</label>
                <textarea 
                rows={2}
                value={report.complianceStandard} 
                onChange={(e) => handleChange('complianceStandard', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Kode Etik (Independensi/Integritas)</label>
                <textarea 
                rows={2}
                value={report.complianceEthics} 
                onChange={(e) => handleChange('complianceEthics', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>
      </section>

      {/* VI. PERMASALAHAN DAN USULAN ARAHAN */}
      <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">VI. PERMASALAHAN DAN USULAN ARAHAN</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">1. Kendala Signifikan (Yang butuh atensi PM)</label>
                <textarea 
                rows={2}
                value={report.significantIssues} 
                onChange={(e) => handleChange('significantIssues', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">2. Usulan Pengendali Teknis (Modifikasi/Tenaga Ahli/Waktu)</label>
                <textarea 
                rows={2}
                value={report.technicalSuggestions} 
                onChange={(e) => handleChange('technicalSuggestions', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">3. Permintaan Arahan (Strategis)</label>
                <textarea 
                rows={2}
                value={report.requestedDirection} 
                onChange={(e) => handleChange('requestedDirection', e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" 
                />
            </div>
        </div>
      </section>

    </div>
  );
}
