import React from 'react';
import AILogger from './AILogger';
import FitFudLogger from './FitFudLogger';
import TextLogger from './TextLogger';
import ManualLogger from './ManualLogger';

export default function MealLoggerPanel({ onLogMeal }) {
  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium">
      <h2 className="text-lg font-bold text-primary-dark flex items-center gap-2 mb-4">
        <i className="bi bi-journal-text text-xl leading-none text-primary" aria-hidden="true" />
        <span>Nhật ký bữa ăn</span>
      </h2>

      <div className="border-t border-border-light pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[240px]">
          <AILogger onLogMeal={onLogMeal} />
          <FitFudLogger onLogMeal={onLogMeal} />
          <TextLogger onLogMeal={onLogMeal} />
          <ManualLogger onLogMeal={onLogMeal} />
        </div>
      </div>
    </div>
  );
}
