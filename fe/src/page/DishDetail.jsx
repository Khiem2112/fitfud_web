import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { fetchDishDetail } from '../service/menuService';
import { useToast } from '../context/ToastContext';
import { useAllergyCheck } from '../hook/useAllergyCheck';
import Breadcrumb from '../component/molecule/Menu/Breadcrumb';
import ChefNoteInput from '../component/molecule/Menu/ChefNoteInput';
import AllergyWarning from '../component/molecule/Menu/AllergyWarning';

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useApp();

  const [sizeName, setSizeName] = useState('M');
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [chefNotes, setChefNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { addToast } = useToast();

  // Tanstack Query for dish detail
  const { data: dish, isLoading, isError } = useQuery({
    queryKey: ['dishDetail', id],
    queryFn: () => fetchDishDetail(id),
    enabled: !!id
  });

  const { data: allergens, isLoading: isAllergyLoading, isError: isAllergyError } = useAllergyCheck(user?.id, dish?.ingredients);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
      </div>
    );
  }

  if (isError || !dish) {
    return (
      <div className="mx-auto max-w-md my-12 text-center p-8 bg-bg-card border rounded-2xl border-border-light shadow-premium page-enter space-y-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-lg font-bold text-text-main">Không tìm thấy sản phẩm!</h2>
        <p className="text-xs text-text-muted">Món ăn này không tồn tại hoặc đã bị ẩn.</p>
        <Link to="/" className="inline-block text-xs font-bold text-primary hover:underline">
          Quay lại thực đơn
        </Link>
      </div>
    );
  }

  const activeSize = dish.sizes.find((s) => s.size_name === sizeName) || dish.sizes[0];

  const handleIngredientToggle = (ing) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      dish_id: dish.id,
      dish_name: dish.dish_name,
      image_url: dish.image_url,
      size_name: sizeName,
      price: activeSize.price,
      quantity,
      chef_notes: chefNotes + (removedIngredients.length > 0 ? ` (Không lấy: ${removedIngredients.join(', ')})` : ''),
      calories: activeSize.calories,
      protein: activeSize.protein,
      fat: activeSize.fat,
      carb: activeSize.carb
    });
    addToast('Đã thêm vào giỏ hàng', 'success');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6 lg:px-8 page-enter space-y-3">

      <Breadcrumb dishName={dish?.dish_name} />

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[45fr_55fr] gap-4 items-start">

        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-bg-main h-[220px] sm:h-[300px] border border-border-light shadow-sm">
            {dish.image_url ? (
              <img src={dish.image_url} alt={dish.dish_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl">🍲</div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight leading-tight">
              {dish.dish_name}
            </h1>
            <p className="text-xs text-text-muted leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Customer reviews */}
          <div className="bg-white border border-border-light rounded-2xl p-3 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-primary">{dish.rating_avg}</span>
                  <span className="text-xs text-text-muted">/5</span>
                </div>
                <div className="h-4 w-px bg-border-light"></div>
                <span className="text-xs text-text-muted">{dish.reviews_count} đánh giá</span>
              </div>
            </div>

            <div className="space-y-3">
              {dish.reviews.length === 0 ? (
                <div className="text-center p-3 text-text-muted text-xs">
                  Món ăn này chưa có đánh giá nào.
                </div>
              ) : (
                <div className="space-y-3">
                  {dish.reviews.slice(0, 2).map((rev) => (
                    <div key={rev.id} className="space-y-1 pb-2 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-text-main">{rev.reviewer_name}</span>
                        <div className="text-[10px] text-accent">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed italic line-clamp-2">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="w-full text-center text-xs font-semibold text-primary hover:underline">
              Xem tất cả đánh giá
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">

          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-3xl font-extrabold text-primary">
              {activeSize.price.toLocaleString('vi-VN')}đ
            </span>
            <div className="flex items-center gap-1.5 bg-accent/20 px-2.5 py-1 rounded-lg">
              <span className="text-accent-dark text-xs">⭐</span>
              <span className="text-accent-dark font-bold text-xs">{dish.rating_avg}</span>
            </div>
          </div>

          {/* Nutrition Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Calories</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-main">{activeSize.calories}</span>
                <span className="text-[10px] font-medium text-text-muted">kcal</span>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/10 rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-accent-dark uppercase tracking-wider mb-1">Protein</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-main">{activeSize.protein}</span>
                <span className="text-[10px] font-medium text-text-muted">g</span>
              </div>
            </div>
            <div className="bg-[#3F6754]/10 border border-[#3F6754]/10 rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-[#274F3D] uppercase tracking-wider mb-1">Carbs</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-main">{activeSize.carb}</span>
                <span className="text-[10px] font-medium text-text-muted">g</span>
              </div>
            </div>
            <div className="bg-[#E8E8E8] border border-border-light rounded-xl p-2.5 flex flex-col justify-center">
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Chất béo</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-text-main">{activeSize.fat}</span>
                <span className="text-[10px] font-medium text-text-muted">g</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-text-main">Nguyên liệu</h3>
            <div className="flex flex-wrap gap-1.5">
              {dish.ingredients.map((ing) => {
                const isRemoved = removedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleIngredientToggle(ing)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${isRemoved
                      ? 'bg-danger/10 border border-danger/30 text-danger'
                      : 'bg-bg-main border border-transparent text-text-main hover:bg-border-light'
                      }`}
                  >
                    {isRemoved ? '❌' : ''} {ing}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ALLERGEN WARNING */}
          <AllergyWarning
            allergens={allergens}
            isLoading={isAllergyLoading}
            isError={isAllergyError}
          />

          {/* Chef Notes */}
          <div className="pt-1">
            <ChefNoteInput value={chefNotes} onChange={setChefNotes} />
          </div>

          {/* Selection & CTA */}
          <div className="pt-3 space-y-3 border-t border-border-light mt-1">
            <div className="flex items-end justify-between">
              {/* Sizes */}
              <div className="w-[55%]">
                <span className="block text-xs font-bold text-text-main mb-1.5">Kích cỡ</span>
                <div className="flex gap-2">
                  {dish.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSizeName(s.size_name)}
                      className={`flex-1 py-1.5 text-center rounded-lg text-xs font-bold transition border ${sizeName === s.size_name
                        ? 'border-primary text-primary bg-primary-light/10 shadow-sm'
                        : 'border-border-light text-text-main hover:bg-bg-main'
                        }`}
                    >
                      {s.size_name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="w-[35%] flex flex-col items-end">
                <span className="block text-xs font-bold text-text-main mb-1.5 w-full text-right">Số lượng</span>
                <div className="flex items-center justify-between bg-[#E8E8E8] border border-border-light rounded-lg p-1 w-full">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 flex items-center justify-center font-bold text-text-main hover:bg-white rounded-md transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-text-main">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center font-bold text-text-main hover:bg-white rounded-md transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full rounded-xl py-3 text-center text-xs font-bold text-white shadow-premium transition bg-primary hover:bg-primary-dark`}
            >
              {allergens && allergens.length > 0 ? 'Tôi hiểu cảnh báo – tiếp tục' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
