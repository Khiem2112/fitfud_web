import React, { useState } from 'react';

export const DishReviewModal = ({ item, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;
    onSubmit({ item, rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div 
      className="relative bg-bg-card rounded-3xl w-full md:w-[400px] flex flex-col shadow-2xl animate-fade-in-left h-full"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between p-6 border-b border-border-light shrink-0">
        <h2 className="text-xl font-bold text-text-main">Đánh giá món ăn</h2>
        <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:bg-bg-main hover:text-text-main transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col items-center gap-3">
          {item.image_url ? (
            <img src={item.image_url} alt={item.dish_name} className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-border-light flex items-center justify-center">
              <span className="text-xs text-text-muted">Ảnh</span>
            </div>
          )}
          <h3 className="font-bold text-text-main text-center text-lg">{item.dish_name}</h3>
        </div>

        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`transition-all hover:scale-110 ${star <= rating ? 'text-[#FFD700]' : 'text-gray-200'} hover:text-[#FFD700]`}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-text-main">Nhận xét của bạn (Tùy chọn)</label>
          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về món ăn này..."
            className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-sm focus:border-primary focus:outline-none transition resize-none h-32"
          />
        </div>

        <button 
          type="submit"
          disabled={rating === 0}
          className="mt-auto w-full py-3.5 rounded-xl bg-primary text-white font-bold shadow-premium hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Gửi đánh giá
        </button>
      </form>
    </div>
  );
};
