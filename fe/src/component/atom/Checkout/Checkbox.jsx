import React from 'react';

export const Checkbox = ({ value, onChange, label, name }) => {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div
        className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
          value ? 'border-primary bg-primary' : 'border-border-light bg-white'
        }`}
      >
        {value && (
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.6667 1.5L4.25001 7.91667L1.33334 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      {/* hidden input for accessibility */}
      <input 
        name={name}
        type="checkbox" 
        className="sr-only" 
        checked={!!value} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <span className="font-be-vietnam text-[16px] font-normal leading-[24px] text-text-main">
        {label}
      </span>
    </label>
  );
};
