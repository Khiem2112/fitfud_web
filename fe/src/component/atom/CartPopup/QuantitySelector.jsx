import React from 'react';

export const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => (
  <div className="flex items-center gap-2 rounded-md bg-bg-main px-1.5 py-0.5 border border-border-light">
    <button
      onClick={onDecrease}
      className="text-xs font-bold text-text-muted hover:text-primary px-1"
    >
      -
    </button>
    <span className="text-xs font-bold text-text-main w-4 text-center">
      {quantity}
    </span>
    <button
      onClick={onIncrease}
      className="text-xs font-bold text-text-muted hover:text-primary px-1"
    >
      +
    </button>
  </div>
);
