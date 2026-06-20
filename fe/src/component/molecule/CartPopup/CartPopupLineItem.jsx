import React from 'react';
import { CartCheckbox } from '../../atom/CartPopup/CartCheckbox';
import { QuantitySelector } from '../../atom/CartPopup/QuantitySelector';
import { RemoveButton } from '../../atom/CartPopup/RemoveButton';

export const CartPopupLineItem = ({ item, isSelected, onToggleSelect, onUpdateQty, onRemove }) => {
  return (
    <div className={`flex gap-3 border-b border-border-light pb-4 transition-opacity ${!isSelected && 'opacity-60'}`}>
      <div className="pt-2">
        <CartCheckbox isSelected={isSelected} onClick={() => onToggleSelect(item.id)} />
      </div>

      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.dish_name}
          className="h-16 w-16 rounded-xl object-cover border border-border-light"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light text-xl">
          🍲
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-bold text-text-main line-clamp-1 pr-2">{item.dish_name}</h3>
            <RemoveButton onClick={() => onRemove(item.id)} />
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Size: <span className="font-semibold text-text-main">{item.size_name}</span>
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <QuantitySelector 
            quantity={item.quantity} 
            onDecrease={() => onUpdateQty(item.id, item.quantity - 1)}
            onIncrease={() => onUpdateQty(item.id, item.quantity + 1)}
          />
          <span className="text-sm font-extrabold text-primary">
            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
};
