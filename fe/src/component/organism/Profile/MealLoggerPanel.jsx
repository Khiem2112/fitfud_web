import React, { useState } from 'react';
import AILogger from './AILogger';
import FitFudLogger from './FitFudLogger';
import TextLogger from './TextLogger';
import ManualLogger from './ManualLogger';

export default function MealLoggerPanel({ onLogMeal }) {
  const [logMode, setLogMode] = useState('fitfud');

  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-5">
      <h2 className="text-base font-bold text-text-main flex items-center gap-2">
        <span>🍴</span> Nhật ký bữa ăn
      </h2>

      <div className="grid grid-cols-4 gap-2 bg-bg-main p-1.5 rounded-xl border border-border-light text-xs font-bold text-center">
        <button
          onClick={() => setLogMode('ai')}
          className={`rounded-lg py-2 transition ${logMode === 'ai' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          📷 Quét ảnh
        </button>
        <button
          onClick={() => setLogMode('fitfud')}
          className={`rounded-lg py-2 transition ${logMode === 'fitfud' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          🥗 FitFud
        </button>
        <button
          onClick={() => setLogMode('text')}
          className={`rounded-lg py-2 transition ${logMode === 'text' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          📝 Văn bản
        </button>
        <button
          onClick={() => setLogMode('manual')}
          className={`rounded-lg py-2 transition ${logMode === 'manual' ? 'bg-bg-card text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
        >
          🔢 Nhập tay
        </button>
      </div>

      <div className="h-64">
        {logMode === 'ai' && <AILogger onLogMeal={onLogMeal} />}
        {logMode === 'fitfud' && <FitFudLogger onLogMeal={onLogMeal} />}
        {logMode === 'text' && <TextLogger onLogMeal={onLogMeal} />}
        {logMode === 'manual' && <ManualLogger onLogMeal={onLogMeal} />}
      </div>
    </div>
  );
}
