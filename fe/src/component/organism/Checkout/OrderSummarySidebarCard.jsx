import React from 'react';
import { CartLineItem } from '../../molecule/Checkout/CartLineItem';
import { SummaryRow } from '../../molecule/Checkout/SummaryRow';

export const OrderSummarySidebarCard = ({ cartItems, onUpdateQuantity, isSubmitting, selectedItemIds, onToggleSelectAll, onToggleSelect }) => {
  // Compute totals ONLY for selected items
  const selectedItems = cartItems.filter(item => selectedItemIds.includes(item.id));
  const grandTotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCalories = selectedItems.reduce((acc, item) => acc + (item.calories || 0) * item.quantity, 0);
  const totalProtein = selectedItems.reduce((acc, item) => acc + (item.protein || 0) * item.quantity, 0);
  const totalCarb = selectedItems.reduce((acc, item) => acc + (item.carb || 0) * item.quantity, 0);

  const isAllSelected = cartItems.length > 0 && selectedItemIds.length === cartItems.length;

  return (
    <div className="flex flex-col w-full rounded-[12px] bg-white shadow-[0px_4px_20px_0px_rgba(27,67,50,0.06)] overflow-hidden">
      <div className="p-[24px]">
        <h2 className="font-be-vietnam text-[24px] font-bold text-text-main mb-[16px]">
          Tóm tắt đơn hàng
        </h2>

        {/* Select all header */}
        <div className="flex items-center gap-2 pb-4 border-b border-border-light">
          <button
            type="button"
            onClick={onToggleSelectAll}
            className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
              isAllSelected ? 'border-primary bg-primary' : 'border-border-light bg-white'
            }`}
          >
            {isAllSelected && (
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.6667 1.5L4.25001 7.91667L1.33334 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <span className="font-be-vietnam text-[16px] font-normal text-text-main cursor-pointer" onClick={onToggleSelectAll}>
            Chọn tất cả ({selectedItemIds.length}/{cartItems.length})
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex flex-col py-4 border-b border-border-light">
          {cartItems.map((item) => (
            <CartLineItem
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              isSelected={selectedItemIds.includes(item.id)}
              onToggleSelect={onToggleSelect}
            />
          ))}
        </div>

        {/* Macros Summary */}
        <div className="mt-4 flex flex-col gap-2 rounded-[12px] border border-border-light bg-[#F9F9F9] p-[16px]">
          <span className="font-be-vietnam text-[12px] font-bold tracking-[0.05em] text-text-main uppercase">
            TỔNG DINH DƯỠNG
          </span>
          <div className="flex w-full justify-between items-center mt-2">
            <div className="flex flex-col items-center flex-1">
              <span className="font-be-vietnam text-[24px] font-bold text-text-main">
                {totalCalories}
              </span>
              <span className="font-be-vietnam text-[12px] font-medium text-text-light">
                Kcal
              </span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-be-vietnam text-[24px] font-bold text-accent-dark">
                {totalProtein}g
              </span>
              <span className="font-be-vietnam text-[12px] font-medium text-text-light">
                Protein
              </span>
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="font-be-vietnam text-[24px] font-bold text-primary-dark">
                {totalCarb}g
              </span>
              <span className="font-be-vietnam text-[12px] font-medium text-text-light">
                Carbs
              </span>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div className="mt-4 flex flex-col gap-2 pt-4">
          <SummaryRow
            label="Tổng cộng"
            value={`${grandTotal.toLocaleString('vi-VN')}đ`}
            isBold={true}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || selectedItemIds.length === 0}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-[12px] bg-accent-dark py-[16px] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="font-be-vietnam text-[16px] font-bold text-white">
            {isSubmitting ? 'Đang xử lý...' : 'Thanh toán ngay'}
          </span>
          {!isSubmitting && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.33334 8H12.6667M12.6667 8L8.00001 3.33333M12.6667 8L8.00001 12.6667" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="mt-4 flex items-center justify-center gap-2">
          <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5V4C1 2.89543 1.89543 2 3 2H7C8.10457 2 9 2.89543 9 4V5M1 5V10C1 10.5523 1.44772 11 2 11H8C8.55228 11 9 10.5523 9 10V5M1 5H9" stroke="#707973" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-be-vietnam text-[12px] font-medium text-text-light">
            Thanh toán bảo mật bởi SSL
          </span>
        </div>
      </div>
    </div>
  );
};
