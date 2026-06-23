import React from 'react';
import { useFormContext } from 'react-hook-form';

export const BodyMetricsForm = ({ activityLevels = [] }) => {
  const { register, watch, setValue, clearErrors, formState: { errors } } = useFormContext();
  const gender = watch('gender');
  const currentActivity = watch('activity_level');

  return (
    <div className="bg-white rounded-2xl border border-border-light p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
            2
          </div>
          <h2 className="text-lg font-bold text-primary-dark">Chỉ số cơ thể</h2>
        </div>
        <button 
          type="button" 
          onClick={() => {
            setValue('gender', '');
            setValue('age', '');
            setValue('height', '');
            setValue('weight', '');
            setValue('activity_level', '');
            clearErrors(['gender', 'age', 'height', 'weight', 'activity_level']);
          }}
          className="text-xs font-semibold text-text-muted hover:text-primary transition flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Đặt lại
        </button>
      </div>

      <div className="space-y-6">
        {/* Gender, Height, Weight inline if possible, or Gender then Height/Weight/Age */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">

          {/* Gender Segmented Control */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-text-main mb-2">
              Giới tính
            </label>
            <div className="flex rounded-lg border border-border-light overflow-hidden">
              {['Male', 'Female', 'Other'].map((g, idx) => {
                const label = g === 'Male' ? 'Nam' : g === 'Female' ? 'Nữ' : 'Khác';
                const isSelected = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue('gender', g, { shouldValidate: true })}
                    className={`flex-1 py-2.5 text-sm font-semibold transition border-r last:border-r-0 border-border-light ${isSelected ? 'bg-primary/10 text-primary' : 'bg-white text-text-main hover:bg-bg-main'
                      }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Age, Height, Weight */}
          <div className="md:col-span-3 grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-2">
                Tuổi
              </label>
              <input
                type="number"
                placeholder="Ví dụ: 25"
                {...register('age')}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none transition ${errors.age ? 'border-danger focus:border-danger' : 'border-border-light focus:border-primary'
                  }`}
              />
              {errors.age && <p className="mt-1 text-xs text-danger">{errors.age.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-text-main mb-2">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                placeholder="170"
                {...register('height')}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none transition ${errors.height ? 'border-danger focus:border-danger' : 'border-border-light focus:border-primary'
                  }`}
              />
              {errors.height && <p className="mt-1 text-xs text-danger">{errors.height.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-text-main mb-2">
                Cân nặng (kg)
              </label>
              <input
                type="number"
                placeholder="65"
                {...register('weight')}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none transition ${errors.weight ? 'border-danger focus:border-danger' : 'border-border-light focus:border-primary'
                  }`}
              />
              {errors.weight && <p className="mt-1 text-xs text-danger">{errors.weight.message}</p>}
            </div>
          </div>

        </div>

        {/* Activity Level List */}
        <div>
          <label className="block text-xs font-bold text-text-main mb-3">
            Cường độ vận động
          </label>
          <div className="space-y-3">
            {activityLevels.map((act) => {
              const isSelected = currentActivity === act.id;
              return (
                <label
                  key={act.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${isSelected ? 'border-primary bg-primary/5' : 'border-border-light hover:border-primary/50'
                    }`}
                  onClick={() => setValue('activity_level', act.id, { shouldValidate: true, shouldDirty: true })}
                >
                  <div className="mt-0.5">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-border-light'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isSelected ? 'text-primary-dark' : 'text-text-main'}`}>
                      {act.name}
                    </h4>
                    {act.description && (
                      <p className="text-xs text-text-muted mt-1 leading-relaxed">
                        {act.description}
                      </p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
