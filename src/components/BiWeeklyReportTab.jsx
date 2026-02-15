import React from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { FileDown, Calendar } from 'lucide-react';

export default function BiWeeklyReportTab({ project, onUpdate }) {
  const report = project.biWeeklyReport || {};

  const handleChange = (field, value) => {
    onUpdate({
      ...report,
      [field]: value
    });
  };

  const handleExport = () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "LAPORAN DUA MINGGUAN",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "(Dari Pengendali Teknis ke Pengendali Mutu)",
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // I. INFORMASI UMUM
          new Paragraph({
            text: "I. INFORMASI UMUM",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Nama Objek Pemeriksaan: ", bold: true }),
              new TextRun(project.meta.entityName || "-")
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Jenis Pemeriksaan: ", bold: true }),
              new TextRun(project.meta.auditName || "-") // Assuming auditName is akin to type or title
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Periode Laporan: ", bold: true }),
              new TextRun(`${report.startDate || "..."} s.d. ${report.endDate || "..."}`)
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Tim Pemeriksa: ", bold: true }),
              // Assuming team is PT and KT for now
              new TextRun(`PT: ${project.meta.dalnisName || "-"}, KT: ${project.meta.teamLeaderName || "-"}`)
            ],
            spacing: { after: 200 }
          }),

          // II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2)
          new Paragraph({
            text: "II. STATUS PELAKSANAAN PROGRAM PEMERIKSAAN (P2)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({ text: "1. Realisasi Prosedur:", bold: true }),
          new Paragraph({ text: report.realizationSummary || "-" }),
          new Paragraph({ text: `Persentase Penyelesaian: ${report.realizationPercentage || 0}%` }),
          new Paragraph({ text: "2. Deviasi/Hambatan Prosedur:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.deviationList || "-" }),
          new Paragraph({ text: `Alasan: ${report.deviationReason || "-"}` }),

          // III. STATUS KOMUNIKASI DAN HUBUNGAN DENGAN ENTITAS
          new Paragraph({
            text: "III. STATUS KOMUNIKASI DAN HUBUNGAN DENGAN ENTITAS",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({ text: "1. Pelaksanaan Pertemuan:", bold: true }),
          new Paragraph({ text: report.communicationMeeting || "-" }),
          new Paragraph({ text: "2. Materi Komunikasi:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.communicationMaterial || "-" }),
          new Paragraph({ text: "3. Respon Entitas:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.communicationResponse || "-" }),

          // IV. EVALUASI PENCAPAIAN TUJUAN DAN LINGKUP (SUBSTANSI)
          new Paragraph({
            text: "IV. EVALUASI PENCAPAIAN TUJUAN DAN LINGKUP (SUBSTANSI)",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({ text: "1. Capaian Tujuan Pemeriksaan:", bold: true }),
          new Paragraph({ text: report.objectiveEvaluation || "-" }),
          new Paragraph({ text: "2. Kecukupan Bukti:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.evidenceSufficiency || "-" }),


          // V. PENJAMINAN MUTU DAN KEPATUHAN
          new Paragraph({
            text: "V. PENJAMINAN MUTU DAN KEPATUHAN",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({ text: "1. Kepatuhan Standar:", bold: true }),
          new Paragraph({ text: report.complianceStandard || "-" }),
          new Paragraph({ text: "2. Kode Etik:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.complianceEthics || "-" }),

          // VI. PERMASALAHAN DAN USULAN ARAHAN
          new Paragraph({
            text: "VI. PERMASALAHAN DAN USULAN ARAHAN",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({ text: "1. Kendala Signifikan:", bold: true }),
          new Paragraph({ text: report.significantIssues || "-" }),
          new Paragraph({ text: "2. Usulan Pengendali Teknis:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.technicalSuggestions || "-" }),
          new Paragraph({ text: "3. Permintaan Arahan:", bold: true, spacing: { before: 100 } }),
          new Paragraph({ text: report.requestedDirection || "-" }),

          // Signature
          new Paragraph({
             text: `Tanggal: ${report.createdDate || new Date().toLocaleDateString()}`,
             alignment: AlignmentType.RIGHT,
             spacing: { before: 400 }
          }),
           new Paragraph({
             text: "Disusun Oleh,",
             alignment: AlignmentType.RIGHT,
             spacing: { after: 400 }
          }),
          new Paragraph({
             text: `( ${report.author || project.meta.dalnisName || "..."} )`,
             alignment: AlignmentType.RIGHT,
             bold: true
          }),
          new Paragraph({
             text: "Pengendali Teknis",
             alignment: AlignmentType.RIGHT
          }),
        ],
      }],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Laporan_2_Mingguan_${project.meta.entityName || "Entitas"}.docx`);
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
