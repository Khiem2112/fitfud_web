import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Minicart() {
  const { cart, cartOpen, setCartOpen, updateCartQty, removeFromCart, getCartTotals } = useApp();
  const navigate = useNavigate();
  const totals = getCartTotals();

  if (!cartOpen) return null;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setCartOpen(false)}
      ></div>

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-bg-card shadow-premium-lg transition-transform duration-300 ease-in-out">
          <div className="flex h-full flex-col justify-between overflow-y-scroll py-6 px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-light pb-5">
              <h2 className="text-lg font-bold text-text-main">Giỏ hàng của bạn ({totals.count} món)</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-text-muted hover:bg-bg-main hover:text-text-main transition"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1">
              {cart.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
                  <span className="text-4xl">🥗</span>
                  <p className="text-sm font-medium text-text-muted">Giỏ hàng của bạn đang trống.</p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-2 text-xs font-semibold text-primary hover:underline"
                  >
                    Xem thực đơn ngay
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b border-border-light pb-4">
                      {/* Dish Image */}
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.dish_name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light text-xl">
                          🍲
                        </div>
                      )}

                      {/* Detail info */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-bold text-text-main">{item.dish_name}</h3>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-xs text-text-muted hover:text-danger ml-2"
                              title="Xóa món"
                            >
                              🗑️
                            </button>
                          </div>
                          <p className="text-xs text-text-muted mt-0.5">
                            Kích cỡ: <span className="font-semibold text-text-main">{item.size_name}</span>
                          </p>
                          {item.chef_notes && (
                            <p className="text-[11px] text-accent-dark bg-yellow-50 dark:bg-yellow-950/20 px-2 py-0.5 rounded mt-1 border border-yellow-100 dark:border-yellow-900/30 italic">
                              ✍️ Ghi chú: {item.chef_notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          {/* Qty Selector */}
                          <div className="flex items-center gap-2 rounded-lg bg-bg-main px-2 py-1 border border-border-light">
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity - 1)}
                              className="text-xs font-bold text-text-muted hover:text-primary px-1"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-text-main w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(item.id, item.quantity + 1)}
                              className="text-xs font-bold text-text-muted hover:text-primary px-1"
                            >
                              +
                            </button>
                          </div>
                          {/* Price */}
                          <span className="text-sm font-extrabold text-primary">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {cart.length > 0 && (
              <div className="border-t border-border-light pt-5 mt-6">
                {/* Nutrients summary */}
                <div className="mb-4 bg-primary-light/50 rounded-xl p-3 border border-primary-light">
                  <h4 className="text-xs font-bold text-primary mb-1">Tổng dinh dưỡng trong giỏ:</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="bg-bg-card rounded py-1 px-1.5 shadow-sm">
                      <span className="block text-text-muted">Năng lượng</span>
                      <span className="font-bold text-text-main">{totals.calories} Kcal</span>
                    </div>
                    <div className="bg-bg-card rounded py-1 px-1.5 shadow-sm">
                      <span className="block text-text-muted">Đạm (Pro)</span>
                      <span className="font-bold text-primary">{totals.protein}g</span>
                    </div>
                    <div className="bg-bg-card rounded py-1 px-1.5 shadow-sm">
                      <span className="block text-text-muted">Carbs / Fat</span>
                      <span className="font-bold text-text-main">{totals.carb}g / {totals.fat}g</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-base font-bold text-text-main mb-6">
                  <span>Tổng tiền thanh toán</span>
                  <span className="text-xl font-extrabold text-primary">
                    {totals.amount.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition"
                >
                  Xem giỏ hàng & Thanh toán
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
