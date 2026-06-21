import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductBadge from '../../atom/Menu/ProductBadge';

/**
 * DishCard Molecule
 * @param {{ dish: import('../../../type/menu.types').DishItem, onOpenQuickView: function }} props
 */
export default function DishCard({ dish, onOpenQuickView }) {
  const navigate = useNavigate();
  const isOutOfStock = dish.status === 'Out of Stock';
  const defaultSize = dish.sizes.find((s) => s.size_name === 'M') || dish.sizes[0];

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-bg-card p-4 hover:shadow-premium hover:-translate-y-0.5 transition duration-300 relative">
      {/* Badges */}
      {dish.id === 'dish_2' && <ProductBadge type="discount" label="-13%" />}
      {isOutOfStock && <ProductBadge type="out-of-stock" />}

      {/* Image block */}
      <div className="relative overflow-hidden rounded-xl bg-bg-main h-44 mb-4">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.dish_name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl bg-primary-light">
            🥗
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              {dish.category_name}
            </span>
            <div className="flex items-center text-[10px] text-accent font-semibold gap-0.5">
              ⭐ {dish.rating_avg}
            </div>
          </div>

          <h3
            onClick={() => !isOutOfStock && navigate(`/dish/${dish.id}`)}
            className={`text-sm font-bold text-text-main leading-snug ${
              isOutOfStock ? 'opacity-60' : 'cursor-pointer hover:text-primary transition'
            }`}
          >
            {dish.dish_name}
          </h3>

          <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Nutrient specs & Price */}
        <div className="pt-4 mt-3 border-t border-border-light flex items-center justify-between">
          <div className="text-left">
            <span className="block text-[10px] text-text-muted font-medium">Lượng calo (M)</span>
            <span className="text-xs font-bold text-text-main">{defaultSize.calories} kcal</span>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-text-muted font-medium">Giá tiền</span>
            <span className="text-sm font-extrabold text-primary">
              {defaultSize.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={() => onOpenQuickView(dish)}
          disabled={isOutOfStock}
          className={`w-full mt-4 rounded-xl py-3 text-center text-xs font-bold shadow-sm transition ${
            isOutOfStock
              ? 'bg-border-light text-text-muted cursor-not-allowed'
              : 'bg-primary-light text-primary hover:bg-primary hover:text-white hover:shadow-premium'
          }`}
        >
          {isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}
