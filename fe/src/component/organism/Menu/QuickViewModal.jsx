import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';
import QtySelector from '../../atom/Menu/QtySelector';

/**
 * QuickViewModal Organism
 * @param {{ dish: import('../../../type/menu.types').DishItem, onClose: function, onAddToCart: function, allergenAlert: any }} props
 */
export default function QuickViewModal({ dish, onClose, onAddToCart, allergenAlert }) {
  const { addToast } = useToast();

  const [quickViewSize, setQuickViewSize] = useState('M');
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [chefNotes, setChefNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Reset state when dish changes
  useEffect(() => {
    setQuickViewSize('M');
    setRemovedIngredients([]);
    setChefNotes('');
    setQuantity(1);
  }, [dish]);

  const handleIngredientRemoveToggle = (ing) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const activeSizeObj = dish.sizes.find((s) => s.size_name === quickViewSize) || dish.sizes[0];

  const handleConfirmAddToCart = () => {
    const finalNotes = chefNotes + (removedIngredients.length > 0 ? ` (Không lấy: ${removedIngredients.join(', ')})` : '');

    onAddToCart({
      dish_id: dish.id,
      dish_name: dish.dish_name,
      image_url: dish.image_url,
      size_name: quickViewSize,
      price: activeSizeObj.price,
      quantity,
      chef_notes: finalNotes,
      calories: activeSizeObj.calories,
      protein: activeSizeObj.protein,
      fat: activeSizeObj.fat,
      carb: activeSizeObj.carb
    });

    addToast('Đã thêm vào giỏ hàng', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-[1000px] flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border-light bg-bg-card shadow-premium-lg page-enter max-h-[90vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 rounded-full p-2 bg-white/80 backdrop-blur-sm text-text-muted hover:bg-bg-main hover:text-text-main transition shadow-sm"
        >
          ✕
        </button>

        {/* LEFT COLUMN: Visual & Macros */}
        <div className="relative w-full md:w-[45%] bg-bg-main flex-shrink-0 min-h-[300px] md:min-h-full">
          {dish.image_url ? (
            <img src={dish.image_url} alt={dish.dish_name} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🍲</div>
          )}
          
          {/* Macro Summary Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-24">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-[10px] text-text-muted font-bold tracking-wider">KCAL</span>
                <span className="text-base font-bold text-primary">{activeSizeObj.calories}</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-[10px] text-text-muted font-bold tracking-wider">PROTEIN</span>
                <span className="text-base font-bold text-primary">{activeSizeObj.protein}g</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-[10px] text-text-muted font-bold tracking-wider">CARBS</span>
                <span className="text-base font-bold text-primary">{activeSizeObj.carb}g</span>
              </div>
              <div className="flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm">
                <span className="text-[10px] text-text-muted font-bold tracking-wider">FAT</span>
                <span className="text-base font-bold text-primary">{activeSizeObj.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization */}
        <div className="w-full md:w-[55%] flex flex-col bg-white overflow-y-auto">
          <div className="p-6 md:p-8 space-y-8 flex-1">
            {/* Dish Head Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  {dish.category_name}
                </span>
                <span className="text-sm font-extrabold text-accent-dark">
                  {dish.sizes[0].price.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <h2 className="text-2xl font-bold text-text-main mt-1 leading-tight">{dish.dish_name}</h2>
              <p className="text-sm text-text-muted mt-2 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Size modifiers */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-main">
                <span className="text-lg">⚖️</span> Chọn kích cỡ phần ăn
              </label>
              <div className="flex gap-3">
                {dish.sizes.map((s) => {
                  const sizeAddPrice = s.price - dish.sizes[0].price;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQuickViewSize(s.size_name)}
                      className={`flex-1 rounded-xl border p-3 text-center transition ${quickViewSize === s.size_name
                          ? 'border-primary bg-primary-light/20 text-primary font-bold shadow-sm'
                          : 'border-border-light bg-bg-card hover:bg-bg-main/50 text-text-main'
                        }`}
                    >
                      <span className="block text-sm">{s.size_name}</span>
                      <span className="block text-[10px] text-text-muted font-normal mt-0.5">
                        {sizeAddPrice === 0 ? '+0đ' : `+${sizeAddPrice.toLocaleString('vi-VN')}đ`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients exclusion */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-main">
                <span className="text-lg">🥗</span> Nguyên liệu
              </label>
              <div className="flex flex-wrap gap-2">
                {dish.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => handleIngredientRemoveToggle(ing)}
                      className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${isRemoved
                          ? 'bg-danger/10 text-danger font-semibold border border-danger/30'
                          : 'bg-bg-main text-text-main border border-transparent hover:bg-border-light'
                        }`}
                    >
                      {isRemoved ? '❌ Bỏ' : ''} {ing}
                    </button>
                  );
                })}
              </div>
              
              {/* SMART ALLERGEN WARNING */}
              {allergenAlert && allergenAlert.length > 0 && (
                <div className="mt-4 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-4 flex items-start gap-3 shadow-sm">
                  <span className="text-[#EA580C] mt-0.5">⚠️</span>
                  <div>
                    <span className="text-[11px] font-bold text-[#EA580C] uppercase tracking-wider block mb-1">CẢNH BÁO DỊ ỨNG</span>
                    <p className="text-xs text-[#9A3412] leading-relaxed">
                      Món ăn này có chứa{' '}
                      {allergenAlert.map((a, i) => (
                        <span key={i} className="font-extrabold underline">
                          {a.clashingIngredient.toUpperCase()}
                        </span>
                      ))}
                      . Hồ sơ sức khỏe của bạn ghi nhận dị ứng với{' '}
                      {allergenAlert.map((a) => a.allergyName).join(', ')}. Sử dụng món ăn này có thể gây kích ứng.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chef Notes */}
            <div className="space-y-3 pb-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-main">
                <span className="text-lg">📝</span> Ghi chú cho đầu bếp
              </label>
              <textarea
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="Ví dụ: Đừng cho quá nhiều sốt, làm chín kỹ cá hồi..."
                rows="2"
                className="w-full rounded-xl border border-border-light bg-bg-card px-4 py-3 text-sm text-text-main focus:border-primary focus:outline-none transition resize-none shadow-sm"
              />
            </div>
          </div>

          {/* Sticky Footer CTA */}
          <div className="sticky bottom-0 bg-[#F9F9F9] border-t border-border-light p-6 mt-auto">
            <div className="flex items-center gap-4">
              <div className="bg-[#E8E8E8] rounded-full flex-shrink-0">
                <QtySelector quantity={quantity} setQuantity={setQuantity} />
              </div>
              <button
                onClick={handleConfirmAddToCart}
                className="flex-1 rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm font-bold text-white shadow-premium transition bg-primary hover:bg-primary-dark"
              >
                <span>{allergenAlert && allergenAlert.length > 0 ? 'Tôi hiểu cảnh báo - tiếp tục' : 'Thêm vào giỏ hàng'}</span>
                <span className="opacity-50">•</span>
                <span>{(activeSizeObj.price * quantity).toLocaleString('vi-VN')}đ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
