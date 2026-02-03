import React, { useState } from 'react';
import { Download, Calendar, PlusCircle, Trash2 } from 'lucide-react';
import { generateId, exportToWord } from '../utils/helpers';

export default function PlanTab({ project, setProject }) {
  const [newPlan, setNewPlan] = useState({ startDate: '', endDate: '', activity: '' });

  const addPlan = () => {
    if (!newPlan.activity || !newPlan.startDate) return;
    setProject(prev => ({
      ...prev,
      plans: [...prev.plans, { ...newPlan, id: generateId() }]
    }));
    setNewPlan({ startDate: '', endDate: '', activity: '' });
  };

  const removePlan = (id) => {
    setProject(prev => ({
      ...prev,
      plans: prev.plans.filter(p => p.id !== id)
    }));
  };

  const formatDateRange = (start, end) => {
    if (!start) return '-';
    if (!end || start === end) return start;
    return `${start} s.d. ${end}`;
  };

  // --- Calculate Total Days ---
  const totalDays = project.plans.reduce((acc, curr) => {
    if(!curr.startDate) return acc;
    const start = new Date(curr.startDate);
    const end = curr.endDate ? new Date(curr.endDate) : new Date(curr.startDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
    return acc + diffDays;
  }, 0);

  const handleExportPlan = () => {
    let html = `
      <h2 style="text-align:center">RENCANA SUPERVISI</h2>
      <br />
      <p><b>Entitas:</b> ${project.meta.entityName}<br/>
      <b>Pengendali Teknis:</b> ${project.meta.dalnisName}<br/>
      <b>Ketua Tim:</b> ${project.meta.teamLeaderName}</p>
      <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 8px; width: 50px;">No</th>
            <th style="padding: 8px; width: 200px;">Waktu Pelaksanaan</th>
            <th style="padding: 8px;">Kegiatan Supervisi</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    project.plans.forEach((plan, index) => {
      const dateStr = formatDateRange(plan.startDate || plan.date, plan.endDate); 
      html += `
        <tr>
          <td style="padding: 8px; text-align: center;">${index + 1}</td>
          <td style="padding: 8px;">${dateStr}</td>
          <td style="padding: 8px;">${plan.activity}</td>
        </tr>
      `;
    });

    html += `
        <tr style="background-color: #f9f9f9; font-weight: bold;">
          <td colspan="2" style="padding: 8px; text-align: right;">Total Hari Supervisi</td>
          <td style="padding: 8px;">${totalDays} Hari</td>
        </tr>
    `;

    html += `</tbody></table>`;
    html += `
      <br/><br/><br/>
      Denpasar, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br/>
        Pengendali Teknis,<br/>
        <br/><br/><br/><br/>
        <b>${project.meta.dalnisName}</b>
    `;

    exportToWord(html, `Rencana_Supervisi_${project.meta.entityName}`);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold text-slate-800">Jadwal & Rencana</h3>
        
        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg flex items-center gap-2 border border-blue-100 flex-grow md:flex-grow-0">
                <Calendar size={18} />
                <span className="font-bold text-sm">Total: {totalDays} Hari</span>
            </div>

            <button 
              onClick={handleExportPlan}
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex-grow md:flex-grow-0 justify-center"
            >
              <Download size={18} /> <span className="hidden sm:inline">Export</span> Word
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="md:col-span-4 grid grid-cols-2 gap-2">
           <div>
             <label className="text-xs text-slate-500 block mb-1">Mulai</label>
             <input 
              type="date" 
              className="w-full p-2 border rounded-lg text-sm bg-white"
              value={newPlan.startDate}
              onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
             />
           </div>
           <div>
             <label className="text-xs text-slate-500 block mb-1">Selesai</label>
             <input 
              type="date" 
              className="w-full p-2 border rounded-lg text-sm bg-white"
              value={newPlan.endDate}
              onChange={(e) => setNewPlan({...newPlan, endDate: e.target.value})}
             />
           </div>
        </div>
        <div className="md:col-span-7">
           <label className="text-xs text-slate-500 block mb-1">Kegiatan</label>
           <input 
            type="text" 
            className="w-full p-2 border rounded-lg bg-white" 
            placeholder="Review Kertas Kerja..."
            value={newPlan.activity}
            onChange={(e) => setNewPlan({...newPlan, activity: e.target.value})}
            onKeyDown={(e) => {
                if(e.key === 'Enter') addPlan();
            }}
           />
        </div>
        <div className="md:col-span-1 flex items-end">
          <button 
            onClick={addPlan}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 w-full flex justify-center items-center h-[42px]"
          >
            <PlusCircle size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-slate-100 text-slate-600 uppercase">
            <tr>
              <th className="p-4 w-48">Waktu Pelaksanaan</th>
              <th className="p-4">Kegiatan</th>
              <th className="p-4 w-16 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {project.plans.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 align-top">
                  {formatDateRange(p.startDate || p.date, p.endDate)}
                </td>
                <td className="p-4 text-slate-800 align-top">{p.activity}</td>
                <td className="p-4 text-center align-top">
                  <button onClick={() => removePlan(p.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
