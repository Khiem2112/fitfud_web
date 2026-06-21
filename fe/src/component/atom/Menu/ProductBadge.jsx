import React from 'react';

/**
 * Reusable Product Badge
 * @param {{ type: 'discount' | 'out-of-stock' | 'keto', label?: string }} props
 */
export default function ProductBadge({ type, label }) {
  if (type === 'out-of-stock') {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
        <span className="rounded-lg bg-danger px-3 py-1.5 text-[10px] font-extrabold text-white tracking-widest uppercase">
          {label || 'Hết hàng'}
        </span>
      </div>
    );
  }

  if (type === 'discount') {
    return (
      <span className="absolute top-6 left-6 z-10 rounded-lg bg-danger px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
        {label}
      </span>
    );
  }

  return null;
}
