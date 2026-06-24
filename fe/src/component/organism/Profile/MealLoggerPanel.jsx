import React from 'react';
import AILogger from './AILogger';
import FitFudLogger from './FitFudLogger';
import TextLogger from './TextLogger';
import ManualLogger from './ManualLogger';

export default function MealLoggerPanel({ onLogMeal }) {
  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium">
      <h2 className="text-xl font-bold text-primary-dark flex items-center gap-2 mb-6">
        <span>🍽️</span> Nhật ký bữa ăn
      </h2>

      <div className="border-t border-border-light pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[300px]">
          <AILogger onLogMeal={onLogMeal} />
          <FitFudLogger onLogMeal={onLogMeal} />
          <TextLogger onLogMeal={onLogMeal} />
          <ManualLogger onLogMeal={onLogMeal} />
        </div>
      </div>
    </div>
  );
}
