import React from 'react';
import { useApp } from '../../../context/AppContext';
import { useToast } from '../../../context/ToastContext';

export default function AIRecommendedMealsPanel({ recommendedDishes }) {
  if (!recommendedDishes || recommendedDishes.length === 0) return null;

  const { addToCart } = useApp();
  const { addToast } = useToast();

  // For this mock, we just take the first recommended dish to display as a large card.
  const dish = recommendedDishes[0];

  const handleOrder = () => {
    if (!dish.originalDish) return;

    // Default size is the first size or M size if we want to be safe
    const defaultSize = dish.originalDish.sizes.find(s => s.size_name === 'M') || dish.originalDish.sizes[0];

    const cartItem = {
      dish_id: dish.originalDish.id,
      dish_name: dish.originalDish.dish_name,
      size_id: defaultSize.id,
      size_name: defaultSize.size_name,
      price: defaultSize.price,
      calories: defaultSize.calories,
      protein: defaultSize.protein,
      quantity: 1,
      image_url: dish.originalDish.image_url,
      chef_notes: ''
    };

    addToCart(cartItem);
    addToast(`Đã thêm ${dish.originalDish.dish_name} vào giỏ hàng!`, 'success');
  };

  return (
    <div className="bg-[#FFF8E7] rounded-2xl p-4 flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2 mb-3">
          <i className="bi bi-stars text-base leading-none" aria-hidden="true" />
          <span>Gợi ý bữa tối AI</span>
        </h3>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white relative">
            {dish.image_url ? (
              <img src={dish.image_url} alt={dish.dish_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-3xl">
                <i className="bi bi-egg-fried leading-none text-primary" aria-hidden="true" />
              </div>
            )}
          </div>
          <div>
            <span className="inline-block mb-1 bg-white text-primary-dark font-bold text-[13px] px-2 py-1 rounded-md shadow-sm">
              Healthy Choice
            </span>
            <h4 className="font-extrabold text-base text-text-main leading-tight mb-1">{dish.dish_name}</h4>
            <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
              {dish.reason}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-white rounded-xl p-3 flex justify-between items-center shadow-sm">
          <div>
            <p className="text-[9px] text-text-muted uppercase font-bold tracking-wider mb-0.5">Giá niêm yết</p>
            <p className="text-sm font-extrabold text-accent-dark">{dish.price_from.toLocaleString()}đ</p>
          </div>
        </div>

        <button
          disabled={dish.status !== 'Active'}
          onClick={handleOrder}
          className="w-full rounded-xl bg-accent py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {dish.status === 'Active' ? 'Đặt ngay' : 'Hết hàng'}
        </button>
      </div>
    </div>
  );
}
