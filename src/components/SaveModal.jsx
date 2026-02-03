import React, { useState } from 'react';

export default function SaveModal({ isOpen, onClose, onSave }) {
  const [saveType, setSaveType] = useState('pt'); // 'pt' or 'kt'

  if (!isOpen) return null;

  const handleSaveClick = () => {
    onSave({
      includePT: saveType === 'pt',
      includeKT: saveType === 'kt',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Opsi Simpan Proyek</h2>
        <p className="text-gray-600 mb-6">Pilih data catatan yang ingin Anda sertakan dalam file <strong>.supervisi</strong>. Pilihan ini bersifat eksklusif.</p>
        
        <div className="space-y-4">
          <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
            <input
              type="radio"
              name="save-option"
              value="pt"
              checked={saveType === 'pt'}
              onChange={(e) => setSaveType(e.target.value)}
              className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700 font-medium">Hanya sertakan Catatan Pengendali Teknis (PT)</span>
          </label>
          <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer has-[:checked]:bg-blue-50 has-[:checked]:border-blue-300">
            <input
              type="radio"
              name="save-option"
              value="kt"
              checked={saveType === 'kt'}
              onChange={(e) => setSaveType(e.target.value)}
              className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-700 font-medium">Hanya sertakan Tanggapan Ketua Tim (KT)</span>
          </label>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Batal
          </button>
          <button
            onClick={handleSaveClick}
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition"
          >
            Simpan File
          </button>
        </div>
      </div>
    </div>
  );
}
