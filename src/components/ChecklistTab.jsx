import React, { useState } from 'react';
import { Download, CheckCircle2, XCircle, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { CHECKLIST_ITEMS } from '../data/constants';
import { exportToWord } from '../utils/helpers';

export default function ChecklistTab({ project, setProject }) {
  const [expandedSections, setExpandedSections] = useState(
    CHECKLIST_ITEMS.reduce((acc, section) => ({ ...acc, [section.id]: true }), {})
  );

  const checklist = project.checklist || {};

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const updateChecklistItem = (itemId, field, value) => {
    setProject(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist?.[itemId],
          [field]: value
        }
      }
    }));
  };

  const getItemStatus = (itemId) => {
    return checklist[itemId]?.answer || null;
  };

  const getItemNote = (itemId) => {
    return checklist[itemId]?.note || '';
  };

  // Calculate statistics
  const allItems = CHECKLIST_ITEMS.flatMap(section => section.items);
  const totalItems = allItems.length;
  const answeredYa = allItems.filter(item => getItemStatus(item.id) === 'ya').length;
  const answeredTidak = allItems.filter(item => getItemStatus(item.id) === 'tidak').length;
  const unanswered = totalItems - answeredYa - answeredTidak;
  const progressPercent = Math.round(((answeredYa + answeredTidak) / totalItems) * 100);

  const handleExportChecklist = () => {
    let html = `
      <h2 style="text-align:center">CHECKLIST REVIU HP3 DAN COVER SHEET</h2>
      <h3 style="text-align:center">Pengendali Teknis</h3>
      <br />
      <p><b>Entitas:</b> ${project.meta.entityName || '-'}<br/>
      <b>Tahun Anggaran:</b> ${project.meta.fiscalYear || '-'}<br/>
      <b>Pengendali Teknis:</b> ${project.meta.dalnisName || '-'}<br/>
      <b>Ketua Tim:</b> ${project.meta.teamLeaderName || '-'}</p>
      <br/>
    `;
    
    CHECKLIST_ITEMS.forEach(section => {
      html += `
        <h4 style="margin-top: 20px; background-color: #f0f0f0; padding: 8px;">${section.section}</h4>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 8px; width: 40px;">No</th>
              <th style="padding: 8px;">Item Pemeriksaan</th>
              <th style="padding: 8px; width: 80px;">Ya/Tidak</th>
              <th style="padding: 8px; width: 200px;">Catatan</th>
            </tr>
          </thead>
          <tbody>
      `;
      
      section.items.forEach((item, index) => {
        const status = getItemStatus(item.id);
        const note = getItemNote(item.id);
        const statusText = status === 'ya' ? 'Ya' : status === 'tidak' ? 'Tidak' : '-';
        
        html += `
          <tr>
            <td style="padding: 8px; text-align: center;">${index + 1}</td>
            <td style="padding: 8px;">${item.text}</td>
            <td style="padding: 8px; text-align: center; ${status === 'ya' ? 'color: green;' : status === 'tidak' ? 'color: red;' : ''}">${statusText}</td>
            <td style="padding: 8px;">${note}</td>
          </tr>
        `;
      });
      
      html += `</tbody></table>`;
    });

    html += `
      <br/><br/>
      <p><b>Ringkasan:</b></p>
      <ul>
        <li>Item Terjawab Ya: ${answeredYa}</li>
        <li>Item Terjawab Tidak: ${answeredTidak}</li>
        <li>Item Belum Dijawab: ${unanswered}</li>
        <li>Progress: ${progressPercent}%</li>
      </ul>
      <br/><br/>
      <p>Denpasar, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      <p>Pengendali Teknis,</p>
      <br/><br/><br/>
      <p><b>${project.meta.dalnisName || '___________________'}</b></p>
    `;

    exportToWord(html, `Checklist_Reviu_${project.meta.entityName || 'Proyek'}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Checklist Reviu HP3 & Cover Sheet</h3>
          <p className="text-sm text-slate-500 mt-1">Berdasarkan PMP 2015, SPKN 2017, dan Kebijakan Pemeriksaan LKPD</p>
        </div>
        
        <button 
          onClick={handleExportChecklist}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <Download size={16} /> Export Word
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 size={16} /> Ya: {answeredYa}
            </span>
            <span className="flex items-center gap-1.5 text-red-500">
              <XCircle size={16} /> Tidak: {answeredTidak}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Circle size={16} /> Belum: {unanswered}
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-700">
            Progress: {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map(section => (
          <div key={section.id} className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-slate-700">{section.section}</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">
                  {section.items.filter(item => getItemStatus(item.id)).length}/{section.items.length}
                </span>
              </div>
              {expandedSections[section.id] ? (
                <ChevronUp size={20} className="text-slate-500" />
              ) : (
                <ChevronDown size={20} className="text-slate-500" />
              )}
            </button>

            {/* Section Items */}
            {expandedSections[section.id] && (
              <div className="divide-y divide-slate-100">
                {section.items.map((item, index) => {
                  const status = getItemStatus(item.id);
                  const note = getItemNote(item.id);
                  
                  return (
                    <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Number */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-600">
                          {index + 1}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 text-sm leading-relaxed mb-3">{item.text}</p>
                          
                          <div className="flex flex-col md:flex-row gap-3">
                            {/* Answer Buttons */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateChecklistItem(item.id, 'answer', status === 'ya' ? null : 'ya')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                  status === 'ya'
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-green-50 hover:text-green-600'
                                }`}
                              >
                                <CheckCircle2 size={16} /> Ya
                              </button>
                              <button
                                onClick={() => updateChecklistItem(item.id, 'answer', status === 'tidak' ? null : 'tidak')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                                  status === 'tidak'
                                    ? 'bg-red-500 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500'
                                }`}
                              >
                                <XCircle size={16} /> Tidak
                              </button>
                            </div>
                            
                            {/* Note Input */}
                            <input
                              type="text"
                              placeholder="Catatan (opsional)"
                              value={note}
                              onChange={(e) => updateChecklistItem(item.id, 'note', e.target.value)}
                              className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800">
          <strong>Catatan:</strong> Checklist ini digunakan bersamaan dengan instrumen kendali mutu lainnya. 
          Hasil reviu PT (catatan perbaikan) harus didokumentasikan dalam lembar reviu KKP sebagai bukti pelaksanaan pengendalian mutu berjenjang.
        </p>
      </div>
    </div>
  );
}
