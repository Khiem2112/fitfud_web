import React from 'react';

export const CartCheckbox = ({ isSelected, onClick, className = '' }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-border-light bg-white'} ${className}`}
  >
    {isSelected && (
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.6667 1.5L4.25001 7.91667L1.33334 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </button>
);
