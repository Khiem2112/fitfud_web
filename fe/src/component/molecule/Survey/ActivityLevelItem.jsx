import React from 'react';
import { useFormContext } from 'react-hook-form';

export const ActivityLevelItem = ({ value, label, description }) => {
  const { watch, setValue } = useFormContext();
  const selectedActivity = watch('activity_level');
  const isSelected = selectedActivity === value;

  return (
    <div
      onClick={() => setValue('activity_level', value, { shouldValidate: true, shouldDirty: true })}
      className={`cursor-pointer rounded-xl border p-3 flex justify-between items-center transition ${
        isSelected
          ? 'border-primary bg-primary-light/30'
          : 'border-border-light hover:bg-bg-main/50'
      }`}
    >
      <div>
        <p className="font-bold text-xs text-text-main">{label}</p>
        <p className="text-[11px] text-text-muted mt-0.5 leading-normal">{description}</p>
      </div>
      <input
        type="radio"
        checked={isSelected}
        readOnly
        className="h-4 w-4 border-border-light text-primary"
      />
    </div>
  );
};
