import React from 'react';

export const RadioButton = ({ name, checked, onChange, value, label, icon }) => {
  return (
    <label
      className={`flex flex-1 cursor-pointer items-center gap-2 rounded-[12px] border p-2 pr-3 transition-colors ${
        checked
          ? 'border-primary bg-primary-light/30'
          : 'border-border-light bg-white'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[16px] border ${
          checked ? 'border-primary bg-primary' : 'border-text-light bg-white'
        }`}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5" cy="5" r="5" fill="white" />
          </svg>
        )}
      </div>
      {icon && <div className="flex h-[24px] w-[24px] items-center justify-center">{icon}</div>}
      <span className="font-be-vietnam text-sm font-medium leading-5 text-text-main">
        {label}
      </span>
    </label>
  );
};
