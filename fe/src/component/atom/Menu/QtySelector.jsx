import React from 'react';

/**
 * Quantity Selector Atom
 * @param {{ quantity: number, setQuantity: function, min?: number, max?: number }} props
 */
export default function QtySelector({ quantity, setQuantity, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-bg-main p-2 border border-border-light shadow-sm">
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.max(min, q - 1))}
        className="text-sm font-bold text-text-muted hover:text-primary px-2 py-0.5"
      >
        -
      </button>
      <span className="text-sm font-bold text-text-main w-6 text-center">{quantity}</span>
      <button
        type="button"
        onClick={() => setQuantity((q) => Math.min(max, q + 1))}
        className="text-sm font-bold text-text-muted hover:text-primary px-2 py-0.5"
      >
        +
      </button>
    </div>
  );
}
