import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../../../context/ToastContext';
import QtySelector from '../../atom/Menu/QtySelector';
import { useApp } from '../../../context/AppContext';
import { useAllergyCheck } from '../../../hook/useAllergyCheck';
import ChefNoteInput from '../../molecule/Menu/ChefNoteInput';
import AllergyWarning from '../../molecule/Menu/AllergyWarning';

/**
 * QuickViewModal Organism
 * @param {{ dish: import('../../../type/menu.types').DishItem, onClose: function, onAddToCart: function }} props
 */
export default function QuickViewModal({ dish, onClose, onAddToCart }) {
  const { addToast } = useToast();
  const { user } = useApp();
  
  const { data: allergens, isLoading: isAllergyLoading, isError: isAllergyError } = useAllergyCheck(user?.id, dish?.ingredients);

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

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border-light bg-bg-card shadow-premium-lg page-enter max-h-[90vh]">

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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-32">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar justify-start">
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-[9px] text-text-muted font-bold tracking-wider leading-none mb-0.5">KCAL</span>
                <span className="text-sm font-bold text-primary leading-none">{activeSizeObj.calories}</span>
              </div>
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-[9px] text-text-muted font-bold tracking-wider leading-none mb-0.5">PROTEIN</span>
                <span className="text-sm font-bold text-primary leading-none">{activeSizeObj.protein}g</span>
              </div>
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-[9px] text-text-muted font-bold tracking-wider leading-none mb-0.5">CARBS</span>
                <span className="text-sm font-bold text-primary leading-none">{activeSizeObj.carb}g</span>
              </div>
              <div className="w-14 h-14 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-[9px] text-text-muted font-bold tracking-wider leading-none mb-0.5">FAT</span>
                <span className="text-sm font-bold text-primary leading-none">{activeSizeObj.fat}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customization */}
        <div className="w-full md:w-[55%] flex flex-col bg-white overflow-y-auto">
          <div className="p-6 md:p-8 space-y-8 flex-1">
            {/* Dish Head Info */}
            <div className="pr-10">
              <h2 className="text-2xl font-bold text-text-main mb-2 leading-tight">{dish.dish_name}</h2>
              <div className="flex justify-between items-start">
                <p className="text-sm text-text-muted leading-relaxed max-w-[70%]">
                  {dish.description}
                </p>
                <span className="text-xl font-extrabold text-accent-dark whitespace-nowrap">
                  {dish.sizes[0].price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Size modifiers */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-text-main">
                <span className="text-lg leading-none">📏</span> Chọn kích cỡ phần ăn
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
              <div className="mt-4">
                <AllergyWarning 
                  allergens={allergens} 
                  isLoading={isAllergyLoading} 
                  isError={isAllergyError} 
                />
              </div>
            </div>

            {/* Chef Notes */}
            <div className="pb-4">
              <ChefNoteInput value={chefNotes} onChange={setChefNotes} />
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
                <span>{allergens && allergens.length > 0 ? 'Tôi hiểu cảnh báo - tiếp tục' : 'Thêm vào giỏ hàng'}</span>
                <span className="opacity-50">•</span>
                <span>{(activeSizeObj.price * quantity).toLocaleString('vi-VN')}đ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
