import React from 'react';
import { useFormContext } from 'react-hook-form';

export const AllergensForm = ({ allergies = [] }) => {
  const { watch, setValue, clearErrors } = useFormContext();
  const allergyIds = watch('allergyIds') || [];

  const handleAllergyToggle = (id) => {
    const newAllergies = allergyIds.includes(id)
      ? allergyIds.filter((item) => item !== id)
      : [...allergyIds, id];
    setValue('allergyIds', newAllergies, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            3
          </div>
          <h2 className="text-lg font-bold text-primary-dark">Dị ứng cần tránh</h2>
        </div>
        <button 
          type="button" 
          onClick={() => {
            setValue('allergyIds', []);
            clearErrors('allergyIds');
          }}
          className="text-xs font-semibold text-text-muted hover:text-primary transition flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Đặt lại
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allergies.map((allergy) => {
          const isSelected = allergyIds.includes(allergy.id);
          return (
            <button
              key={allergy.id}
              type="button"
              onClick={() => handleAllergyToggle(allergy.id)}
              className={`rounded-lg py-3 px-2 text-sm font-semibold border transition ${isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-light text-text-main hover:border-primary/50'
                }`}
            >
              {allergy.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
