import React from 'react';
import { useFormContext } from 'react-hook-form';

const goalIcons = {
  'Weight Loss': '📉',
  'Muscle Gain': '🏋️',
  'Healthy Eating': '🍃',
  'Calorie Control': '🧮',
  'Maintain Weight': '🧍',
  'Convenience': '⚡'
};

export const HealthGoalForm = ({ healthGoals = [] }) => {
  const { watch, setValue, clearErrors } = useFormContext();
  const currentVal = watch('health_goal');

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            1
          </div>
          <h2 className="text-lg font-bold text-primary-dark">Mục tiêu sức khỏe</h2>
        </div>
        <button 
          type="button" 
          onClick={() => {
            setValue('health_goal', '');
            clearErrors('health_goal');
          }}
          className="text-xs font-semibold text-text-muted hover:text-primary transition flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Đặt lại
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {healthGoals.map((g) => {
          const isSelected = currentVal === g.id;
          return (
            <div
              key={g.id}
              onClick={() => setValue('health_goal', g.id, { shouldValidate: true, shouldDirty: true })}
              className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center justify-center gap-2 transition text-center ${isSelected
                  ? 'border-primary bg-primary-light/10 shadow-sm'
                  : 'border-border-light hover:border-primary/50'
                }`}
            >
              <span className="text-2xl">{goalIcons[g.id] || '✨'}</span>
              <span className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-text-main'}`}>
                {g.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
