import React from 'react';

export default function AIRecommendedMealsPanel({ recommendedDishes }) {
  if (!recommendedDishes || recommendedDishes.length === 0) return null;

  // For this mock, we just take the first recommended dish to display as a large card.
  const dish = recommendedDishes[0];

  return (
    <div className="bg-[#FFF8E7] rounded-3xl p-6 space-y-4 h-full flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-accent flex items-center gap-2 mb-4">
          <span>✨</span> Gợi ý bữa tối AI
        </h3>

        <div className="relative rounded-2xl overflow-hidden bg-white aspect-[4/3] mb-4">
          {dish.image_url ? (
            <img src={dish.image_url} alt={dish.dish_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">🥗</div>
          )}
          <span className="absolute top-3 right-3 bg-white text-primary-dark font-bold text-[9px] px-2 py-1 rounded-md shadow-sm">
            Healthy Choice
          </span>
        </div>

        <h4 className="font-extrabold text-sm text-text-main leading-tight mb-2">{dish.dish_name}</h4>
        <p className="text-[11px] text-text-muted leading-relaxed">
          {dish.reason}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 flex justify-between items-center shadow-sm">
        <div>
          <p className="text-[9px] text-text-muted uppercase font-bold tracking-wider mb-0.5">Giá niêm yết</p>
          <p className="text-sm font-extrabold text-accent-dark">{dish.price_from.toLocaleString()}đ</p>
        </div>
      </div>
      
      <button 
        disabled={dish.status !== 'Active'}
        className="w-full rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-md hover:opacity-90 transition disabled:opacity-50"
      >
        {dish.status === 'Active' ? 'Đặt ngay' : 'Hết hàng'}
      </button>
    </div>
  );
}
