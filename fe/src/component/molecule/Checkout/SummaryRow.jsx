import React from 'react';

export const SummaryRow = ({ label, value, isBold = false, isHighlight = false }) => {
  return (
    <div className="flex w-full items-center justify-between py-1">
      <span
        className={`font-be-vietnam text-[16px] leading-[26px] ${
          isBold ? 'font-bold text-text-main' : 'font-normal text-text-secondary'
        }`}
      >
        {label}
      </span>
      <span
        className={`font-be-vietnam text-[16px] leading-[26px] ${
          isBold ? 'font-bold' : 'font-normal'
        } ${isHighlight ? 'text-brand-main' : isBold ? 'text-text-main' : 'text-text-secondary'}`}
      >
        {value}
      </span>
    </div>
  );
};
