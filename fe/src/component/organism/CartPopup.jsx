import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CartMode } from '../../type/cart';
import { EmptyCartState } from '../molecule/CartPopup/EmptyCartState';
import { CartPopupLineItem } from '../molecule/CartPopup/CartPopupLineItem';
import { CartSubtotalRow } from '../molecule/CartPopup/CartSubtotalRow';
import QuickViewModal from './Menu/QuickViewModal';
import { fetchDishDetail } from '../../service/menuService';

export const CartPopup = ({ mode, onClose }) => {
  const { cart, selectedCartItemIds, updateCartQty, removeFromCart, addToCart, getCartTotals, toggleSelectCartItem, toggleSelectAllCartItems } = useApp();
  const navigate = useNavigate();
  const totals = getCartTotals(true); // only calculate totals for selected items
  const popupRef = useRef(null);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [editingDish, setEditingDish] = useState(null);

  const isPinned = mode === CartMode.PINNED;
  const isAllSelected = cart.length > 0 && selectedCartItemIds.length === cart.length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If pinned and clicked outside of popup, close it
      if (isPinned && popupRef.current && !popupRef.current.contains(e.target)) {
        // Only close if we didn't click on the cart icon itself (handled in Header)
        if (!e.target.closest('[data-cart-icon]')) {
          onClose();
        }
      }
    };
    if (isPinned) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPinned, onClose]);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleEditCartItem = async (item) => {
    const dish = await fetchDishDetail(item.dish_id);
    setEditingCartItem(item);
    setEditingDish(dish);
  };

  return (
    <div
      ref={popupRef}
      className={`absolute right-0 top-[calc(100%+8px)] z-50 w-[340px] rounded-[14px] bg-bg-card shadow-premium border border-border-light transition-all duration-300 transform origin-top-right ${mode !== CartMode.CLOSED ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'}`}
    >
      <div className="flex flex-col max-h-[min(460px,calc(100vh-96px))] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-light px-4 py-3 shrink-0">
          <h2 className="text-base font-bold text-text-main flex items-center gap-2">
            Giỏ hàng
            <span className="text-sm font-medium text-text-muted bg-bg-main px-2 py-0.5 rounded-full">{cart.length}</span>
          </h2>
          {isPinned && (
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-text-muted hover:bg-bg-main hover:text-text-main transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-1.5 min-h-[180px] custom-scrollbar">
          {cart.length === 0 ? (
            <EmptyCartState onClose={onClose} />
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={toggleSelectAllCartItems}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${isAllSelected ? 'border-primary bg-primary' : 'border-border-light bg-white'
                    }`}
                >
                  {isAllSelected && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.6667 1.5L4.25001 7.91667L1.33334 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
                <span className="font-be-vietnam text-sm font-medium text-text-main cursor-pointer select-none" onClick={toggleSelectAllCartItems}>
                  Chọn tất cả ({selectedCartItemIds.length}/{cart.length})
                </span>
              </div>

              {cart.map((item) => (
                <CartPopupLineItem
                  key={item.id}
                  item={item}
                  isSelected={selectedCartItemIds.includes(item.id)}
                  onToggleSelect={toggleSelectCartItem}
                  onUpdateQty={updateCartQty}
                  onRemove={removeFromCart}
                  onEdit={handleEditCartItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <CartSubtotalRow
            totals={totals}
            disabled={selectedCartItemIds.length === 0}
            onCheckout={handleCheckout}
          />
        )}
      </div>
      {editingCartItem && editingDish && (
        <QuickViewModal
          dish={editingDish}
          initialSize={editingCartItem.size_name}
          initialQuantity={editingCartItem.quantity}
          initialChefNotes={editingCartItem.chef_notes || ''}
          submitLabel="Lưu thay đổi"
          onClose={() => {
            setEditingCartItem(null);
            setEditingDish(null);
          }}
          onAddToCart={(updatedItem) => {
            removeFromCart(editingCartItem.id);
            addToCart(updatedItem);
            setEditingCartItem(null);
            setEditingDish(null);
          }}
        />
      )}
    </div>
  );
};
