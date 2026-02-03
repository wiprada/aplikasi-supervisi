import React from 'react';
import { CheckCircle, Trash2, MessageSquare } from 'lucide-react';

export default function NoteItem({ note, onUpdate, onDelete }) {
  const isResolved = note.status === 'resolved';

  return (
    <div className={`p-4 rounded-lg border ${isResolved ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex justify-between items-start mb-2">
            <p className={`font-medium text-sm leading-relaxed ${isResolved ? 'text-emerald-800' : 'text-slate-800'}`}>{note.content}</p>
            <div className="flex gap-2 ml-2 flex-shrink-0">
                <button 
                    onClick={() => onUpdate(note.id, { status: isResolved ? 'pending' : 'resolved' })}
                    title={isResolved ? "Tandai Belum Selesai" : "Tandai Selesai"}
                    className={`p-1 rounded transition-colors ${isResolved ? 'text-emerald-600 hover:bg-emerald-200' : 'text-slate-400 hover:bg-slate-200'}`}
                >
                    <CheckCircle size={18} className={isResolved ? 'fill-emerald-600 text-white' : ''} />
                </button>
                <button 
                   onClick={() => onDelete(note.id)}
                   className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
        
        <div className="mt-2 pl-4 border-l-2 border-slate-200">
            <div className="flex items-center gap-2 mb-1">
               <MessageSquare size={12} className="text-slate-400"/>
               <p className="text-xs text-slate-500">Tindak Lanjut Ketua Tim:</p>
            </div>
            <textarea 
                value={note.followUp}
                onChange={(e) => onUpdate(note.id, { followUp: e.target.value })}
                placeholder="Belum ada tindak lanjut..."
                className="w-full bg-transparent text-sm text-slate-600 focus:bg-white focus:ring-1 focus:ring-blue-300 rounded p-1 outline-none resize-none overflow-hidden"
                rows={note.followUp ? 2 : 1}
            />
        </div>
    </div>
  );
}
