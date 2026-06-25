import React from 'react';

export const Input = ({ value, onChange, onBlur, name, label, placeholder, type = 'text', error }) => {
  return (
    <div className="flex flex-col items-stretch gap-1 w-full">
      {label && (
        <label className="font-be-vietnam text-sm font-medium leading-5 text-text-secondary">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-1 w-full">
        <input
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-[8px] border bg-white px-3 py-2.5 font-be-vietnam text-sm font-normal outline-none transition-colors 
          ${error ? 'border-red-500 text-red-500 placeholder-red-300' : 'border-border-light text-text-main placeholder-text-placeholder focus:border-primary'}
          `}
        />
        {error && (
          <span className="font-be-vietnam text-[12px] font-medium text-red-500">
            {error.message}
          </span>
        )}
      </div>
    </div>
  );
};
