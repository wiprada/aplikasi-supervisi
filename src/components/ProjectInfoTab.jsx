import React from 'react';

export default function ProjectInfoTab({ project, onUpdate }) {
  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Penugasan Audit</label>
          <input 
            type="text" 
            value={project.meta.auditName}
            onChange={(e) => onUpdate('auditName', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Contoh: Audit Kinerja Atas Pengelolaan..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Entitas/Obrik</label>
          <input 
            type="text" 
            value={project.meta.entityName}
            onChange={(e) => onUpdate('entityName', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tahun Anggaran</label>
          <input 
            type="number" 
            value={project.meta.fiscalYear}
            onChange={(e) => onUpdate('fiscalYear', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Pengendali Teknis</label>
          <input 
            type="text" 
            value={project.meta.dalnisName}
            onChange={(e) => onUpdate('dalnisName', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nama Ketua Tim</label>
          <input 
            type="text" 
            value={project.meta.teamLeaderName}
            onChange={(e) => onUpdate('teamLeaderName', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tanggal Mulai Penugasan</label>
          <input 
            type="date" 
            value={project.meta.startDate}
            onChange={(e) => onUpdate('startDate', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
