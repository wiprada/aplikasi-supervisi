import React, { useState } from 'react';
import { Search, X, ChevronDown, ChevronRight, BookOpen, Upload, Download } from 'lucide-react';
import { SMART_TEMPLATES } from '../data/constants';
import { generateId, exportToWord } from '../utils/helpers';
import NoteItem from './NoteItem';

export default function ExecutionTab({ project, setProject, csvInputRef, handleImportCSV }) {
  const [expandedProc, setExpandedProc] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [inputValues, setInputValues] = useState({});
  const [activeTemplateMenu, setActiveTemplateMenu] = useState(null);

  const procedures = project.procedures || [];
  const activeProcedureIds = [...new Set(project.notes.map(n => n.procedureId))];
  
  let displayedProcedures = [];
  if (searchQuery.trim()) {
    displayedProcedures = procedures.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    displayedProcedures = procedures.filter(p => activeProcedureIds.includes(p.id));
  }

  const categories = [...new Set(displayedProcedures.map(p => p.category))];
  const getNotesForProc = (procId) => project.notes.filter(n => n.procedureId === procId);

  const handleInputChange = (procId, text) => {
    setInputValues(prev => ({ ...prev, [procId]: text }));
  };

  const applyTemplate = (procId, text) => {
    setInputValues(prev => ({ ...prev, [procId]: text }));
    setActiveTemplateMenu(null); 
  };

  const addNote = (procId) => {
    const content = inputValues[procId];
    if (!content || !content.trim()) return;
    
    const newNote = {
      id: generateId(),
      procedureId: procId,
      content,
      status: 'pending',
      followUp: ''
    };
    
    setProject(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));
    
    setInputValues(prev => ({ ...prev, [procId]: '' })); 
    if (searchQuery) setSearchQuery(''); 
    setExpandedProc(procId);
  };

  const updateNote = (noteId, updates) => {
    setProject(prev => ({
      ...prev,
      notes: prev.notes.map(n => n.id === noteId ? { ...n, ...updates } : n)
    }));
  };

  const deleteNote = (noteId) => {
    setProject(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.id !== noteId)
    }));
  };

  const handleExportNotes = () => {
    const procsWithNotes = procedures.filter(p => activeProcedureIds.includes(p.id));

    if (procsWithNotes.length === 0) {
        alert("Belum ada catatan. Tidak ada yang bisa diexport.");
        return;
    }

    let html = `
      <h2 style="text-align:center">CATATAN HASIL SUPERVISI</h2>
      <p><b>Entitas:</b> ${project.meta.entityName}<br/>
      <b>Pengendali Teknis:</b> ${project.meta.dalnisName}<br/>
      <b>Status:</b> ${new Date().toLocaleDateString('id-ID')}</p>
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 8px;">No</th>
            <th style="padding: 8px;">Prosedur & Fokus PT</th>
            <th style="padding: 8px;">Catatan Dalnis</th>
            <th style="padding: 8px;">Status</th>
            <th style="padding: 8px;">Tindak Lanjut Ketua Tim</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    let counter = 1;
    procsWithNotes.forEach(proc => {
        const notes = project.notes.filter(n => n.procedureId === proc.id);
        if (notes.length > 0) {
            notes.forEach((note, nIndex) => {
                html += `
                <tr>
                  <td style="padding: 8px; text-align: center;">${counter++}</td>
                  <td style="padding: 8px;">${nIndex === 0 ? `<b>${proc.category}</b><br/>${proc.name}` : ''}</td>
                  <td style="padding: 8px;">${note.content}</td>
                  <td style="padding: 8px; text-align: center; color: ${note.status === 'resolved' ? 'green' : 'red'}">
                    ${note.status === 'resolved' ? 'SELESAI' : 'PENDING'}
                  </td>
                  <td style="padding: 8px;">${note.followUp || '-'}</td>
                </tr>`;
            });
        }
    });

    html += `</tbody></table>`;
    html += `
      <br/><br/>
      <table border="0" style="width: 100%; margin-top: 30px;">
        <tr>
          <td style="width: 50%; text-align: left;">
          Denpasar, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
            Pengendali Teknis,<br/>
            <br/><br/><br/><br/>
            <b>${project.meta.dalnisName}</b>
          </td>
        </tr>
      </table>
    `;

    exportToWord(html, `Catatan_Supervisi_${project.meta.entityName}`);
  };

  return (
    <div className="flex flex-col h-full">
        <div className="p-4 md:p-6 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Kertas Kerja Supervisi</h3>
                    <p className="text-sm text-slate-500 hidden md:block">Gunakan Smart Template untuk mempercepat review.</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <input 
                        type="file" 
                        accept=".csv"
                        ref={csvInputRef}
                        onChange={handleImportCSV}
                        className="hidden" 
                    />
                    <button 
                        onClick={() => csvInputRef.current.click()}
                        className="flex items-center justify-center gap-2 text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg text-sm transition-all flex-grow md:flex-grow-0"
                    >
                        <Upload size={16} /> Import
                    </button>
                    <button 
                        onClick={handleExportNotes}
                        className="flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm shadow-sm transition-all flex-grow md:flex-grow-0"
                    >
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari prosedur..."
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
        </div>

        <div className="p-4 md:p-6 space-y-6 flex-1 overflow-y-auto" onClick={() => setActiveTemplateMenu(null)}>
            {categories.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                    <Search size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Tidak ada prosedur yang ditemukan.</p>
                </div>
            ) : (
                categories.map(cat => (
                <div key={cat} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-1 bg-slate-50 p-2 rounded w-fit">{cat}</h4>
                    {displayedProcedures.filter(p => p.category === cat).map(proc => {
                        const notes = getNotesForProc(proc.id);
                        const pendingCount = notes.filter(n => n.status === 'pending').length;
                        const isExpanded = expandedProc === proc.id || (searchQuery && notes.length === 0);

                        return (
                            <div key={proc.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                                <div 
                                    onClick={() => setExpandedProc(expandedProc === proc.id ? null : proc.id)}
                                    className={`p-4 cursor-pointer flex justify-between items-center ${expandedProc === proc.id ? 'bg-slate-50' : 'bg-white'}`}
                                >
                                    <div className="flex items-center gap-3 w-full overflow-hidden">
                                        <div className={`p-2 rounded-full flex-shrink-0 ${pendingCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {expandedProc === proc.id ? <ChevronDown size={20}/> : <ChevronRight size={20}/>}
                                        </div>
                                        <span className="font-medium text-slate-800 text-sm md:text-base truncate">{proc.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                        {pendingCount > 0 && (
                                            <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-bold whitespace-nowrap">
                                                {pendingCount}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                                        <div className="space-y-4 mb-4">
                                            {notes.map(note => (
                                                <NoteItem 
                                                    key={note.id} 
                                                    note={note} 
                                                    onUpdate={updateNote} 
                                                    onDelete={deleteNote}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-slate-200 relative">
                                            {/* Smart Template Button */}
                                            <div className="relative z-20">
                                              <button 
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setActiveTemplateMenu(activeTemplateMenu === proc.id ? null : proc.id);
                                                }}
                                                className={`p-2 w-full sm:w-auto rounded-lg border flex justify-center items-center gap-2 transition-colors ${activeTemplateMenu === proc.id ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                                                title="Pilih Template Review"
                                              >
                                                <BookOpen size={20} /> <span className="sm:hidden text-xs font-bold">Template</span>
                                              </button>

                                              {/* Template Dropdown Menu */}
                                              {activeTemplateMenu === proc.id && (
                                                <div className="absolute bottom-full left-0 mb-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 max-h-64 sm:max-h-80 overflow-y-auto">
                                                  <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-500 uppercase sticky top-0">
                                                    Pilih Template Reviu
                                                  </div>
                                                  {SMART_TEMPLATES.map((tmpl) => (
                                                    <div key={tmpl.id} className="border-b border-slate-50 last:border-0">
                                                      <div className="px-3 py-2 bg-slate-50/50 text-xs font-bold text-blue-600">
                                                        {tmpl.category}
                                                      </div>
                                                      <div className="p-2 space-y-1">
                                                        {tmpl.options.map((opt, idx) => (
                                                          <button
                                                            key={idx}
                                                            onClick={(e) => {
                                                              e.stopPropagation();
                                                              applyTemplate(proc.id, opt.text);
                                                            }}
                                                            className="w-full text-left p-2 hover:bg-blue-50 rounded text-xs text-slate-700 group transition-colors"
                                                          >
                                                            <span className="font-bold block text-slate-800 group-hover:text-blue-700">{opt.label}</span>
                                                            <span className="line-clamp-2 text-slate-500">{opt.text}</span>
                                                          </button>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>

                                            <input 
                                                type="text" 
                                                placeholder="Tulis catatan..." 
                                                className="flex-1 p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={inputValues[proc.id] || ''}
                                                onChange={(e) => handleInputChange(proc.id, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if(e.key === 'Enter') addNote(proc.id);
                                                }}
                                            />
                                            <button 
                                                onClick={() => addNote(proc.id)}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 w-full sm:w-auto"
                                            >
                                                Simpan
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )))}
        </div>
    </div>
  );
}
