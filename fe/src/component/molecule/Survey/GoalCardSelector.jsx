import React from 'react';
import { useFormContext } from 'react-hook-form';

export const GoalCardSelector = ({ value, label, description }) => {
  const { watch, setValue } = useFormContext();
  const selectedGoal = watch('health_goal');
  const isSelected = selectedGoal === value;

  return (
    <div
      onClick={() => setValue('health_goal', value, { shouldValidate: true, shouldDirty: true })}
      className={`cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-premium ${
        isSelected
          ? 'border-primary bg-primary-light/40 shadow-sm'
          : 'border-border-light bg-bg-card'
      }`}
    >
      <p className="font-bold text-sm text-text-main">{label}</p>
      <p className="text-xs text-text-muted mt-1 leading-normal">{description}</p>
    </div>
  );
};
