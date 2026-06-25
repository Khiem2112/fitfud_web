import React from 'react';
import SuggestedDishCard from '../../molecule/AiRecommendation/SuggestedDishCard';

export default function AiRecommendationResultList({ dishes, onOpenQuickView }) {
  if (!dishes || dishes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-bg-card border border-border-light rounded-3xl mt-6">
        <i className="bi bi-egg-fried mb-4 text-4xl leading-none text-primary" aria-hidden="true" />
        <h3 className="text-lg font-bold text-text-main mb-2">Không tìm thấy món ăn phù hợp</h3>
        <p className="text-sm text-text-muted">
          Rất tiếc, AI chưa thể tìm thấy món ăn nào khớp 100% với mục tiêu và dị ứng của bạn lúc này.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="flex flex-col md:flex-row justify-between items-end mb-3 border-b border-border-light pb-2">
        <h2 className="text-lg font-extrabold text-text-main">
          3 Món ăn gợi ý cho hôm nay
        </h2>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#12563F]">
          <i className="bi bi-stars text-base leading-none" aria-hidden="true" />
          <span>Dựa trên sở thích: Low Carb & High Protein</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.slice(0, 3).map((dish) => (
          <SuggestedDishCard 
            key={dish.id} 
            dish={dish} 
            onOpenQuickView={onOpenQuickView} 
          />
        ))}
      </div>
    </div>
  );
}
