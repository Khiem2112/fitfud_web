import React from 'react';

export const AddressBadge = ({ isDefault }) => {
  if (!isDefault) return null;
  return (
    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ml-2">
      Mặc định
    </span>
  );
};
