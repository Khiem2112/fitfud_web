import React, { useState } from 'react';

export default function ManualLogger({ onLogMeal }) {
  const [name, setName] = useState('');
  const [cal, setCal] = useState('');
  const [pro, setPro] = useState('');

  const handleSave = async () => {
    if (!name || !cal || !pro) return;
    try {
      await onLogMeal({
        dish_name: name,
        calories: Number(cal),
        protein: Number(pro),
        source: 'Manual'
      });
      setName('');
      setCal('');
      setPro('');
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-bg-card relative">
      <div className="text-sm font-bold text-text-muted uppercase mb-4 px-2">Nhập chỉ số</div>
      
      <div className="flex-1 flex flex-col space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên bữa ăn"
          className="w-full rounded-lg border border-border-light bg-bg-main px-4 py-3 text-sm focus:outline-none focus:border-primary"
        />
        <div className="flex gap-4">
          <input
            type="number"
            value={cal}
            onChange={(e) => setCal(e.target.value)}
            placeholder="Calo"
            className="flex-1 w-full rounded-lg border border-border-light bg-bg-main px-3 py-3 text-sm focus:outline-none focus:border-primary text-center"
          />
          <input
            type="number"
            value={pro}
            onChange={(e) => setPro(e.target.value)}
            placeholder="Pro (g)"
            className="flex-1 w-full rounded-lg border border-border-light bg-bg-main px-3 py-3 text-sm focus:outline-none focus:border-primary text-center"
          />
        </div>
        
        <div className="flex-1 flex flex-col justify-end">
          <button
            onClick={handleSave}
            disabled={!name || !cal || !pro}
            className="w-full py-2.5 mt-4 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary-light transition disabled:opacity-50"
          >
            Lưu trực tiếp
          </button>
        </div>
      </div>
    </div>
  );
}
