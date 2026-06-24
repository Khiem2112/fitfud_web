import React from 'react';
import { CartCheckbox } from '../../atom/CartPopup/CartCheckbox';
import { QuantitySelector } from '../../atom/CartPopup/QuantitySelector';
import { RemoveButton } from '../../atom/CartPopup/RemoveButton';

export const CartPopupLineItem = ({ item, isSelected, onToggleSelect, onUpdateQty, onRemove, onEdit }) => {
  return (
    <div className={`flex gap-2.5 border-b border-border-light pb-2.5 transition-opacity ${!isSelected && 'opacity-60'}`}>
      <div className="pt-1.5">
        <CartCheckbox isSelected={isSelected} onClick={() => onToggleSelect(item.id)} />
      </div>

      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.dish_name}
          className="h-12 w-12 rounded-lg object-cover border border-border-light"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-xl">
          🍲
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-xs font-bold text-text-main line-clamp-1 pr-2">{item.dish_name}</h3>
            <RemoveButton onClick={() => onRemove(item.id)} />
          </div>
          <p className="text-[11px] text-text-muted mt-0.5">
            Size: <span className="font-semibold text-text-main">{item.size_name}</span>
          </p>
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:text-primary-dark"
          >
            <i className="bi bi-pencil-square" aria-hidden="true" />
            Sửa món
          </button>
        </div>

        <div className="flex items-center justify-between mt-1.5">
          <QuantitySelector 
            quantity={item.quantity} 
            onDecrease={() => onUpdateQty(item.id, item.quantity - 1)}
            onIncrease={() => onUpdateQty(item.id, item.quantity + 1)}
          />
          <span className="text-xs font-extrabold text-primary">
            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
};
