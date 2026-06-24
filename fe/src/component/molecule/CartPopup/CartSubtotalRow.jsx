import React from 'react';

export const CartSubtotalRow = ({ totals, disabled, onCheckout }) => (
  <div className="border-t border-border-light bg-bg-main p-3.5 shrink-0 rounded-b-[14px]">
    <div className="flex items-center justify-between text-sm font-bold text-text-main mb-3">
      <span>Tạm tính ({totals.count} món):</span>
      <span className="text-base font-extrabold text-brand-main">
        {totals.amount.toLocaleString('vi-VN')}đ
      </span>
    </div>

    <button
      onClick={onCheckout}
      disabled={disabled}
      className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Tiến hành Thanh toán
    </button>
  </div>
);
