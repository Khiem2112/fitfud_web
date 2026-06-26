import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * DishCard Molecule
 * @param {{ dish: import('../../../type/menu.types').DishItem, onOpenQuickView: function }} props
 */
export default function DishCard({ dish, onOpenQuickView }) {
  const navigate = useNavigate();
  const isOutOfStock = dish.status === 'Out of Stock';
  const defaultSize = dish.sizes.find((s) => s.size_name === 'M') || dish.sizes[0];

  // Derive price display like '74k' or '115k'
  const priceDisplay = defaultSize.price >= 1000 ? `${Math.floor(defaultSize.price / 1000)}k` : defaultSize.price;

  return (
    <div
      onClick={() => !isOutOfStock && navigate(`/dish/${dish.id}`)}
      className="group flex flex-col justify-between overflow-hidden rounded-lg border border-gray-100 bg-white hover:shadow-lg transition duration-300 relative cursor-pointer h-full"
    >
      {/* Image block */}
      <div className="relative overflow-hidden bg-gray-100 h-[180px]">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.dish_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
            <span className="bg-white/80 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase">
              HẾT HÀNG
            </span>
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="flex flex-col p-4 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-1">
            {dish.dish_name}
          </h3>
          <div className="flex items-center text-[11px] font-bold text-gray-700 gap-1">
            <i className="bi bi-star-fill text-[#f59e0b] text-[10px]" aria-hidden="true" />
            <span>{dish.rating_avg || '4.8'}</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
          {dish.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4">
          <span className="text-[11px] font-bold text-[#194b33]">{defaultSize.calories} kcal</span>
          <span className="text-[12px] font-extrabold text-gray-900">{priceDisplay}</span>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(dish);
          }}
          disabled={isOutOfStock}
          className={`w-full mt-4 rounded border border-transparent py-2 text-center text-[12px] font-bold transition-colors ${isOutOfStock
            ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
            : 'bg-[#194b33] text-white hover:bg-[#123825]'
            }`}
        >
          {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}
