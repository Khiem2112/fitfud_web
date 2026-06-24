import React from 'react';
import ProductBadge from '../../atom/Menu/ProductBadge';

export default function SuggestedDishCard({ dish, onOpenQuickView }) {
  const isOutOfStock = dish.status === 'Out of Stock';
  const defaultSize = dish.sizes && dish.sizes.length > 0 
    ? (dish.sizes.find((s) => s.size_name === 'M') || dish.sizes[0])
    : { price: dish.price_from, calories: dish.calories, protein: dish.protein };

  return (
    <div
      onClick={() => !isOutOfStock && onOpenQuickView(dish)}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-white p-5 hover:shadow-premium hover:-translate-y-0.5 transition duration-300 relative cursor-pointer h-full"
    >
      {/* Badges */}
      {isOutOfStock && <ProductBadge type="out-of-stock" />}

      {/* Image block */}
      <div className="relative overflow-hidden rounded-xl bg-bg-main h-48 mb-4">
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
        
        {/* Recommendation Reason Badge (Top-left) */}
        <div className="absolute top-2 left-2 bg-[#12563F]/90 text-white px-2 py-1 rounded-md text-[10px] font-medium z-10">
          {dish.reason}
        </div>
      </div>

      {/* Content info */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3
            className={`text-lg font-bold text-text-main leading-snug flex-1 pr-2 ${
              isOutOfStock ? 'opacity-60' : 'group-hover:text-primary transition'
            }`}
          >
            {dish.dish_name}
          </h3>
          <span className="text-sm font-extrabold text-[#12563F] whitespace-nowrap">
            {defaultSize.price.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <p className="text-xs text-text-muted line-clamp-3 mb-4 flex-1">
          {dish.description}
        </p>

        {/* Nutrient specs */}
        <div className="flex items-center gap-6 mb-4">
          <div>
            <span className="block text-[9px] text-text-muted font-bold uppercase tracking-wider">Protein</span>
            <span className="text-sm font-bold text-[#12563F]">{defaultSize.protein}g</span>
          </div>
          <div className="w-px h-6 bg-border-light"></div>
          <div>
            <span className="block text-[9px] text-text-muted font-bold uppercase tracking-wider">Kcal</span>
            <span className="text-sm font-bold text-[#12563F]">{defaultSize.calories}</span>
          </div>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenQuickView(dish);
          }}
          disabled={isOutOfStock}
          className={`w-full rounded-xl py-3 text-center text-sm font-bold shadow-sm transition flex items-center justify-center gap-2 ${
            isOutOfStock
              ? 'bg-border-light text-text-muted cursor-not-allowed'
              : 'bg-[#12563F] text-white hover:bg-primary-dark hover:shadow-premium'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          {isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
}
