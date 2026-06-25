import React from 'react';

export const CartLineItem = ({ item, onUpdateQuantity, onRemove, onEdit, isSelected, onToggleSelect }) => {
  return (
    <div className="flex w-full items-start justify-between gap-3 py-3 border-b border-border-light last:border-b-0">
      <div className="flex gap-3">
        {/* Checkbox selector */}
        <button
          type="button"
          onClick={() => onToggleSelect(item.id)}
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[4px] border transition-colors ${
            isSelected ? 'border-primary bg-primary' : 'border-border-light bg-white'
          }`}
        >
          {isSelected && (
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6667 1.5L4.25001 7.91667L1.33334 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        
        <img
          src={item.image_url || 'https://via.placeholder.com/64'}
          alt={item.dish_name}
          className="h-14 w-14 rounded-[8px] object-cover"
        />
        
        <div className="flex flex-col gap-1">
          <h3 className="font-be-vietnam text-[13px] font-semibold text-text-main">
            {item.dish_name}
          </h3>
          <span className="font-be-vietnam text-[12px] font-medium text-text-light">
            Size: {item.size_name}
          </span>
          <div className="mt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark"
              aria-label={`Sửa ${item.dish_name}`}
            >
              <i className="bi bi-pencil-square" aria-hidden="true" />
              Sửa
            </button>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-danger hover:text-danger/80"
              aria-label={`Xóa ${item.dish_name}`}
            >
              <i className="bi bi-trash3" aria-hidden="true" />
              Xóa
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end justify-between h-14 shrink-0">
        {/* Quantity Controls */}
        <div className="flex h-[24px] items-center rounded-[8px] border border-border-light p-1">
          <button 
            type="button"
            disabled={item.quantity <= 1}
            className="flex h-[16px] w-[16px] items-center justify-center text-primary disabled:cursor-not-allowed disabled:text-text-light"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <i className="bi bi-dash" aria-hidden="true" />
          </button>
          <span className="w-[20px] text-center font-be-vietnam text-[14px] font-bold text-text-main">
            {item.quantity}
          </span>
          <button 
            type="button"
            className="flex h-[16px] w-[16px] items-center justify-center text-primary"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <i className="bi bi-plus" aria-hidden="true" />
          </button>
        </div>
        
        <span className="font-be-vietnam text-[13px] font-bold text-text-main">
          {(item.price * item.quantity).toLocaleString('vi-VN')}đ
        </span>
      </div>
    </div>
  );
};
