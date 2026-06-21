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
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium-lg page-enter space-y-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-text-muted hover:bg-bg-main hover:text-text-main transition"
        >
          ✕
        </button>

        {/* Dish Head Info */}
        <div className="text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {dish.category_name}
          </span>
          <h2 className="text-xl font-bold text-text-main mt-0.5">{dish.dish_name}</h2>
          <p className="text-xs text-text-muted max-w-sm mx-auto mt-2 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Nutrition Macro circular row */}
        <div className="grid grid-cols-4 gap-2 text-center bg-bg-main p-3.5 rounded-2xl border border-border-light">
          <div className="space-y-0.5">
            <span className="block text-[10px] font-bold text-text-muted uppercase">Calories</span>
            <span className="text-sm font-extrabold text-text-main">{activeSizeObj.calories}</span>
            <span className="text-[9px] text-text-muted block">kcal</span>
          </div>
          <div className="space-y-0.5 border-l border-border-light">
            <span className="block text-[10px] font-bold text-text-muted uppercase">Protein</span>
            <span className="text-sm font-extrabold text-primary">{activeSizeObj.protein}g</span>
            <span className="text-[9px] text-text-muted block">Đạm</span>
          </div>
          <div className="space-y-0.5 border-l border-border-light">
            <span className="block text-[10px] font-bold text-text-muted uppercase">Carbs</span>
            <span className="text-sm font-extrabold text-text-main">{activeSizeObj.carb}g</span>
            <span className="text-[9px] text-text-muted block">Tinh bột</span>
          </div>
          <div className="space-y-0.5 border-l border-border-light">
            <span className="block text-[10px] font-bold text-text-muted uppercase">Fats</span>
            <span className="text-sm font-extrabold text-text-main">{activeSizeObj.fat}g</span>
            <span className="text-[9px] text-text-muted block">Béo</span>
          </div>
        </div>

        {/* SMART ALLERGEN WARNING WARNING BANNERS */}
        {allergenAlert && allergenAlert.length > 0 && (
          <div className="rounded-xl bg-danger-light border-2 border-danger/30 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-danger">
              <span className="text-base leading-none">⚠️</span>
              <span>CẢNH BÁO DỊ ỨNG CÁ NHÂN HÓA</span>
            </div>
            <p className="text-xs text-danger leading-relaxed font-semibold">
              Món ăn này có chứa{' '}
              {allergenAlert.map((a, i) => (
                <span key={i} className="underline font-extrabold">
                  {a.clashingIngredient.toUpperCase()}
                  {i < allergenAlert.length - 1 ? ', ' : ''}
                </span>
              ))}
              . Hồ sơ sức khỏe của bạn ghi nhận bạn bị dị ứng với{' '}
              {allergenAlert.map((a, i) => (
                <span key={i} className="font-extrabold text-slate-900 dark:text-white">
                  {a.allergyName}
                  {i < allergenAlert.length - 1 ? ' và ' : ''}
                </span>
              ))}
              . Vui lòng cân nhắc kỹ trước khi đặt hoặc sử dụng tùy chỉnh loại bỏ nguyên liệu bên dưới.
            </p>
          </div>
        )}

        {/* Size modifiers */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-main">
            Chọn kích cỡ phần ăn
          </label>
          <div className="flex gap-3">
            {dish.sizes.map((s) => {
              const sizeAddPrice = s.price - dish.sizes[0].price;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setQuickViewSize(s.size_name)}
                  className={`flex-1 rounded-xl border p-3.5 text-center transition ${quickViewSize === s.size_name
                      ? 'border-primary bg-primary-light/40 text-primary font-bold shadow-sm'
                      : 'border-border-light bg-bg-card hover:bg-bg-main/50 text-text-main'
                    }`}
                >
                  <span className="block text-sm">{s.size_name}</span>
                  <span className="block text-[10px] text-text-muted font-normal mt-0.5">
                    {sizeAddPrice === 0 ? 'Giá gốc' : `+${sizeAddPrice.toLocaleString('vi-VN')}đ`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ingredients exclusion checkboxes */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-main">
            Loại bỏ nguyên liệu (Tùy chọn)
          </label>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.map((ing) => {
              const isRemoved = removedIngredients.includes(ing);
              return (
                <button
                  key={ing}
                  type="button"
                  onClick={() => handleIngredientRemoveToggle(ing)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${isRemoved
                      ? 'bg-danger/10 border-danger text-danger font-semibold'
                      : 'bg-bg-card border-border-light text-text-muted hover:border-primary hover:text-primary'
                    }`}
                >
                  {isRemoved ? '❌ Bỏ' : '✓'} {ing}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chef Notes */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-text-main">
            Ghi chú cho đầu bếp
          </label>
          <input
            type="text"
            value={chefNotes}
            onChange={(e) => setChefNotes(e.target.value)}
            placeholder="Ví dụ: để riêng nước sốt, nấu chín kỹ cá..."
            className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-xs focus:border-primary focus:outline-none transition"
          />
        </div>

        {/* Quantity Selector & Action buttons */}
        <div className="pt-4 border-t border-border-light flex items-center justify-between gap-4">
          <QtySelector quantity={quantity} setQuantity={setQuantity} />

          {/* Confirm add to cart */}
          <button
            onClick={handleConfirmAddToCart}
            className={`flex-1 rounded-xl py-3.5 text-center text-sm font-bold text-white shadow-premium transition ${allergenAlert && allergenAlert.length > 0
                ? 'bg-danger hover:bg-red-700 shadow-red-100 dark:shadow-none'
                : 'bg-primary hover:bg-primary-dark'
              }`}
          >
            {allergenAlert && allergenAlert.length > 0 ? 'Tôi hiểu cảnh báo - tiếp tục' : 'Thêm vào giỏ hàng'} •{' '}
            {(activeSizeObj.price * quantity).toLocaleString('vi-VN')}đ
          </button>
        </div>

      </div>
    </div>
  );
}
