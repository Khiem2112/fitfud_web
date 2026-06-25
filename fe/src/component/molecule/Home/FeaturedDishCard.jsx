import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedDishCard({ dish, onOpenQuickView }) {
  const navigate = useNavigate();
  const defaultSize = dish.sizes.find((s) => s.size_name === 'M') || dish.sizes[0];
  const isOutOfStock = dish.status === 'Out of Stock';

  // In the image, the top left badge is "GIÀU ĐẠM", "PHỔ BIẾN", "ÍT TINH BỘT"
  // Let's derive it from tags or category if not available.
  let badgeLabel = dish.category_name || 'GIÀU ĐẠM';
  let badgeColor = 'bg-white text-[#194b33]';
  if (dish.dish_name.includes('Cơm')) {
    badgeLabel = 'PHỔ BIẾN';
    badgeColor = 'bg-[#f59e0b] text-white';
  } else if (dish.dish_name.includes('Salad')) {
    badgeLabel = 'ÍT TINH BỘT';
    badgeColor = 'bg-white text-[#194b33]';
  }

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      onOpenQuickView(dish);
    }
  };

  return (
    <div
      onClick={() => !isOutOfStock && navigate(`/dish/${dish.id}`)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-shadow relative"
    >
      {/* Image Block */}
      <div className="relative h-48 w-full bg-gray-100">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.dish_name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {/* Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase rounded-full shadow-sm ${badgeColor}`}>
          {badgeLabel}
        </div>
      </div>

      {/* Content Block */}
      <div className="flex flex-col p-4 bg-white">
        <h3 className="text-[15px] font-bold text-gray-900 line-clamp-1 mb-4">
          {dish.dish_name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-500 tracking-wider">CAL</span>
              <span className="text-[13px] font-bold text-gray-900">{defaultSize.calories}</span>
            </div>
            <div className="flex flex-col border-l border-gray-200 pl-6">
              <span className="text-[9px] font-bold text-gray-500 tracking-wider">PROTEIN</span>
              <span className="text-[13px] font-bold text-gray-900">{defaultSize.protein || '20g'}</span>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-transform hover:scale-110 ${
              isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#194b33] text-white'
            }`}
            title={isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          >
            <i className="bi bi-cart-plus leading-none text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}
