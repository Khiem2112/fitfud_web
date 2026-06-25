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
    <div
      onClick={() => !isOutOfStock && navigate(`/dish/${dish.id}`)}
      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border-light bg-bg-card p-2.5 hover:shadow-premium hover:-translate-y-0.5 transition duration-300 relative cursor-pointer"
    >
      {/* Badges */}
      {dish.id === 'dish_2' && <ProductBadge type="discount" label="-13%" />}
      {isOutOfStock && <ProductBadge type="out-of-stock" />}

      {/* Image block */}
      <div className="relative overflow-hidden rounded-lg bg-bg-main h-28 mb-2">
        {dish.image_url ? (
          <img
            src={dish.image_url}
            alt={dish.dish_name}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl bg-primary-light">
            <i className="bi bi-egg-fried leading-none text-primary" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[8px] font-bold uppercase tracking-wider text-primary">
              {dish.category_name}
            </span>
            <div className="flex items-center text-[9px] text-accent font-semibold gap-0.5">
              <i className="bi bi-star-fill" aria-hidden="true" />
              <span>{dish.rating_avg}</span>
            </div>
          </div>

          <h3
            className={`text-[13px] font-bold text-text-main leading-tight line-clamp-1 ${
              isOutOfStock ? 'opacity-60' : 'group-hover:text-primary transition'
            }`}
          >
            {dish.dish_name}
          </h3>

          <p className="text-[9px] text-text-muted line-clamp-1 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Nutrient specs & Price */}
        <div className="pt-2 mt-2 border-t border-border-light flex items-center justify-between">
          <div className="text-left">
            <span className="block text-[9px] text-text-muted font-medium">Calo (M)</span>
            <span className="text-[10px] font-bold text-text-main">{defaultSize.calories} kcal</span>
          </div>

          <div className="text-right">
            <span className="block text-[9px] text-text-muted font-medium">Giá tiền</span>
            <span className="text-[11px] font-extrabold text-primary">
              {defaultSize.price.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(dish);
          }}
          disabled={isOutOfStock}
          className={`w-full mt-2 rounded-lg py-2 text-center text-[11px] font-bold shadow-sm transition ${
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
