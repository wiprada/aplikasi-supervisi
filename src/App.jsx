import React, { useState, useRef } from 'react';
import { 
  Save, 
  ClipboardList, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Maximize2,
  MessageSquare,
  Menu
} from 'lucide-react';
import { DEFAULT_PROCEDURES, EMPTY_PROJECT } from './data/constants';
import { generateId, parseCSV } from './utils/helpers';
import LandingView from './components/LandingView';
import NavButton from './components/NavButton';
import ProjectInfoTab from './components/ProjectInfoTab';
import PlanTab from './components/PlanTab';
import ExecutionTab from './components/ExecutionTab';
import ChatTab from './components/ChatTab';
import SaveModal from './components/SaveModal';

export default function App() {
  const [view, setView] = useState('landing'); 
  const [activeTab, setActiveTab] = useState('info'); 
  const [project, setProject] = useState(EMPTY_PROJECT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [lastSaveStatus, setLastSaveStatus] = useState(null);
  const csvInputRef = useRef(null);

  const handleNewProject = () => {
    const newProj = JSON.parse(JSON.stringify(EMPTY_PROJECT));
    setProject(newProj);
    setView('dashboard');
    setActiveTab('info');
    setMobileMenuOpen(false);
  };

  const handleOpenFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedData = JSON.parse(event.target.result);
        if (loadedData.meta && loadedData.notes) {
          if (!loadedData.procedures) {
            loadedData.procedures = DEFAULT_PROCEDURES;
          }
          if (!loadedData.chat) {
            loadedData.chat = [];
          }
          setProject(loadedData);
          // Load save status from file if it exists
          if (loadedData.lastSaveInfo) {
            setLastSaveStatus({
              date: new Date(loadedData.lastSaveInfo.date),
              type: loadedData.lastSaveInfo.type
            });
          } else {
            setLastSaveStatus(null);
          }
          setView('dashboard');
          setMobileMenuOpen(false);
        } else {
          alert("Format file tidak valid.");
        }
      } catch (err) {
        alert("Gagal membaca file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveProject = async (options) => {
    const { includePT, includeKT } = options;
    let projectToSave = JSON.parse(JSON.stringify(project)); // Deep copy

    // Filter notes based on exclusive user selection
    const filteredNotes = projectToSave.notes.filter(note => {
      if (includePT) return note.content && note.content.trim() !== '';
      if (includeKT) return note.followUp && note.followUp.trim() !== '';
      return true;
    }).map(note => {
      const n = { ...note };
      if (includePT) n.followUp = '';
      if (includeKT) n.content = n.content || '(Tanpa Catatan)';
      return n;
    });

    projectToSave.notes = filteredNotes;

    // Create and add save status to the project data
    const saveType = includePT ? 'Catatan PT' : 'Respon KT';
    const newSaveStatus = { date: new Date().toISOString(), type: saveType };
    projectToSave.lastSaveInfo = newSaveStatus;

    const dataStr = JSON.stringify(projectToSave, null, 2);
    const safeName = project.meta.entityName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'proyek_baru';
    const fileName = `${safeName}_${includePT ? 'pt' : 'kt'}.supervisi`;

    try {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Supervisi Data File',
            accept: { 'application/json': ['.supervisi'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(dataStr);
        await writable.close();
      } else {
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      // Update the local state with the new save status
      setLastSaveStatus({ date: new Date(newSaveStatus.date), type: newSaveStatus.type });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to save file:', err);
      }
    } finally {
      setIsSaveModalOpen(false);
    }
  };

  const handleUpdateMeta = (field, value) => {
    setProject(prev => ({
      ...prev,
      meta: { ...prev.meta, [field]: value }
    }));
  };

  const handleUpdateChat = (newChatData) => {
    setProject(prev => ({
      ...prev,
      chat: newChatData
    }));
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const { rows } = parseCSV(text);
      const newProcedures = [];
      let headerSkipped = false;
      
      rows.forEach((row, index) => {
        if (row.length === 0 || (row.length === 1 && !row[0].trim())) return;

        const firstColLower = (row[0] || '').toLowerCase().trim();
        if (!headerSkipped && (index === 0 || firstColLower === 'laporan' || firstColLower === 'category' || firstColLower === 'kategori')) {
            headerSkipped = true;
            return; 
        }

        let category = 'Umum';
        let name = '';

        if (row.length >= 5) {
            const laporan = (row[0] || '').trim();
            const namaAkun = (row[2] || '').trim();
            category = namaAkun || laporan || 'Umum';
            const kode = (row[3] || '').trim();
            const uraian = (row[4] || '').trim();
            name = kode ? `${kode} - ${uraian}` : uraian;
        } 
        else if (row.length >= 2) {
            category = (row[0] || '').trim();
            name = row.slice(1).join(', ').trim(); 
        }

        if (name) {
            newProcedures.push({
              id: `csv-${index}-${generateId()}`,
              category,
              name
            });
        }
      });

      if (newProcedures.length > 0) {
        if(window.confirm(`Ditemukan ${newProcedures.length} prosedur baru.\nTekan OK untuk mengganti daftar prosedur Master.`)) {
            setProject(prev => ({ ...prev, procedures: newProcedures }));
        }
      } else {
        alert("Gagal mengimpor data. Pastikan format CSV valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; 
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (view === 'landing') {
    return (
      <LandingView 
        onNewProject={handleNewProject} 
        onOpenFile={handleOpenFile} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
           <div className="bg-blue-500 p-1.5 rounded">
             <ClipboardList className="text-white w-4 h-4" />
           </div>
           <span className="font-bold tracking-wide">Supervisi</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           <Menu size={24} />
        </button>
      </div>

      {/* Sidebar - Hidden on mobile unless toggled */}
      <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-slate-800 text-slate-300 flex-shrink-0 flex flex-col transition-all duration-300 md:h-screen sticky md:top-0`}>
        <div className="hidden md:flex p-6 border-b border-slate-700 items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <ClipboardList className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-wide">Supervisi</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <NavButton 
            active={activeTab === 'info'} 
            onClick={() => { setActiveTab('info'); setMobileMenuOpen(false); }} 
            icon={<Briefcase size={18} />} 
            label="Informasi Audit" 
          />
          <NavButton 
            active={activeTab === 'plan'} 
            onClick={() => { setActiveTab('plan'); setMobileMenuOpen(false); }} 
            icon={<FileText size={18} />} 
            label="Rencana Supervisi" 
          />
          <NavButton 
            active={activeTab === 'execution'} 
            onClick={() => { setActiveTab('execution'); setMobileMenuOpen(false); }} 
            icon={<CheckCircle size={18} />} 
            label="Catatan & Review" 
          />
          <NavButton 
            active={activeTab === 'chat'} 
            onClick={() => { setActiveTab('chat'); setMobileMenuOpen(false); }} 
            icon={<MessageSquare size={18} />} 
            label="Diskusi Tim" 
          />
        </nav>

        <div className="p-4 border-t border-slate-700 space-y-3 pb-8 md:pb-4">
          <button 
            onClick={toggleFullscreen}
            className="w-full py-2 px-4 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <Maximize2 size={16} /> Layar Penuh
          </button>
          <button 
            onClick={() => setIsSaveModalOpen(true)}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
          >
            <Save size={16} /> Simpan
          </button>
          <button 
            onClick={() => setView('landing')}
            className="w-full py-2 px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 md:p-8 w-full max-w-full">
        <header className="mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              {activeTab === 'info' && 'Informasi Penugasan'}
              {activeTab === 'plan' && 'Rencana Supervisi'}
              {activeTab === 'execution' && 'Pelaksanaan Supervisi'}
              {activeTab === 'chat' && 'Diskusi Tim'}
            </h2>
            <p className="text-slate-500 text-xs md:text-sm mt-1 truncate max-w-[300px] md:max-w-full">
              {project.meta.entityName ? `Entitas: ${project.meta.entityName}` : 'Lengkapi data entitas terlebih dahulu'}
            </p>
          </div>
          {lastSaveStatus && (
            <div className="text-xs text-right text-gray-500 bg-gray-100 p-2 rounded-md">
              <p>Disimpan terakhir ({lastSaveStatus.type}):</p>
              <p className="font-semibold">{lastSaveStatus.date.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          )}
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
          {activeTab === 'info' && <ProjectInfoTab project={project} onUpdate={handleUpdateMeta} />}
          {activeTab === 'plan' && <PlanTab project={project} setProject={setProject} />}
          {activeTab === 'execution' && (
            <ExecutionTab 
                project={project} 
                setProject={setProject} 
                csvInputRef={csvInputRef}
                handleImportCSV={handleImportCSV} 
            />
          )}
          {activeTab === 'chat' && <ChatTab chatData={project.chat} onUpdateChat={handleUpdateChat} />}
        </div>
      </main>
      
      <SaveModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
}
