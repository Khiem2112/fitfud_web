import React from 'react';
import { useFormContext } from 'react-hook-form';

const goalIconClasses = {
  'Weight Loss': 'bi-graph-down-arrow',
  'Muscle Gain': 'bi-activity',
  'Healthy Eating': 'bi-leaf',
  'Calorie Control': 'bi-calculator',
  'Maintain Weight': 'bi-person-check',
  'Convenience': 'bi-lightning-charge'
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
          <i className="bi bi-arrow-counterclockwise text-sm leading-none" aria-hidden="true" />
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
              <i
                className={`bi ${goalIconClasses[g.id] || 'bi-stars'} text-2xl leading-none`}
                aria-hidden="true"
              />
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
