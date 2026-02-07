import React, { useRef } from 'react';
import { ClipboardList, PlusCircle, FolderOpen } from 'lucide-react';

export default function LandingView({ onNewProject, onOpenFile }) {
  const fileInputRef = useRef(null);

  return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ClipboardList className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Supervisi Dalnis</h1>
          <p className="text-slate-500 mb-8">
            Aplikasi kendali mutu audit dengan fitur Smart Template untuk Pengendali Teknis.
          </p>
          
          <div className="space-y-4">
            <button 
              onClick={onNewProject}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-3 transition-all font-semibold shadow-md hover:shadow-lg"
            >
              <PlusCircle size={20} />
              Mulai Proyek Supervisi Baru
            </button>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".supervisi,.json"
                ref={fileInputRef}
                onChange={onOpenFile}
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current.click()}
                className="w-full py-4 px-6 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 rounded-xl flex items-center justify-center gap-3 transition-all font-semibold"
              >
                <FolderOpen size={20} />
                Buka File Proyek
              </button>
            </div>
          </div>
          <p className="mt-8 text-xs text-slate-400">Versi 2.1 Penambahan Fitur Ceklist Reviu HP3</p>
        </div>
      </div>
  );
}
