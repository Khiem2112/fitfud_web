import React from 'react';

export const SelectorDropdown = ({ value, onChange, onBlur, name, label, options, placeholder, disabled, error }) => {
  return (
    <div className="flex flex-col items-stretch gap-1 w-full">
      {label && (
        <label className="font-be-vietnam text-[16px] font-normal leading-[24px] text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-1 w-full">
        <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`w-full appearance-none rounded-[8px] border bg-white px-[16px] py-[15px] font-be-vietnam text-[16px] font-normal outline-none transition-colors 
            ${error ? 'border-red-500 text-red-500' : 'border-border-light text-text-main focus:border-primary'}
            ${disabled ? 'bg-bg-main cursor-not-allowed text-text-light' : ''}
            ${!value ? 'text-text-light' : ''}`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id} className="text-text-main">
                {opt.name}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <div className="pointer-events-none absolute right-[16px] top-1/2 -translate-y-1/2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9L12 16L5 9" stroke={error ? "#EF4444" : "#404943"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {error && (
          <span className="font-be-vietnam text-[12px] font-medium text-red-500">
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};
