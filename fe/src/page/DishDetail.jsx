import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../context/AppContext';
import { fetchDishDetail, mockMasterData } from '../service/menuService';
import { getCustomerProfile } from '../service/surveyService';

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, addToCart } = useApp();

  const [sizeName, setSizeName] = useState('M');
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [chefNotes, setChefNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [allergenAlert, setAllergenAlert] = useState(null);

  // Tanstack Query for dish detail
  const { data: dish, isLoading, isError } = useQuery({
    queryKey: ['dishDetail', id],
    queryFn: () => fetchDishDetail(id),
    enabled: !!id
  });

  const profile = user ? getCustomerProfile(user.id) : null;

  // Set up allergen warning when dish data resolves
  useEffect(() => {
    if (dish && profile && profile.allergyIds && profile.allergyIds.length > 0) {
      const userAllergyNames = mockMasterData.allergies
        .filter((a) => profile.allergyIds.includes(a.id))
        .map((a) => a.name);

      const allergenMap = {
        'Cá': ['cá', 'cá hồi', 'cá ngừ'],
        'Trứng': ['trứng'],
        'Gluten': ['gạo lứt', 'mì ý', 'lúa mì', 'bột mì'],
        'Lạc': ['đậu phộng', 'lạc'],
        'Sữa': ['bơ', 'sữa', 'phô mai', 'bơ lạt'],
        'Hạt': ['óc chó', 'hướng dương', 'hạt dẻ', 'điều'],
        'Đậu nành': ['đậu nành', 'đậu hũ', 'tào phớ']
      };

      const matchedAllergens = [];
      userAllergyNames.forEach((allergyName) => {
        const triggers = allergenMap[allergyName] || [allergyName.toLowerCase()];
        const clashingIngredient = dish.ingredients.find((ing) =>
          triggers.some((trig) => ing.toLowerCase().includes(trig))
        );
        if (clashingIngredient) {
          matchedAllergens.push({ allergyName, clashingIngredient });
        }
      });

      if (matchedAllergens.length > 0) {
        setAllergenAlert(matchedAllergens);
      } else {
        setAllergenAlert(null);
      }
    } else {
      setAllergenAlert(null);
    }
  }, [dish, profile]);

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
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8 page-enter space-y-8">
      
      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[52fr_48fr] gap-8 items-start">
        
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-bg-main h-[400px] sm:h-[500px] border border-border-light shadow-sm">
            {dish.image_url ? (
              <img src={dish.image_url} alt={dish.dish_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl">🍲</div>
            )}
          </div>

          {/* Title & Description */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-main tracking-tight">
              {dish.dish_name}
            </h1>
            <p className="text-sm text-text-muted leading-relaxed">
              {dish.description}
            </p>
          </div>

          {/* Customer reviews */}
          <div className="bg-white border border-border-light rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-primary">{dish.rating_avg}</span>
                  <span className="text-sm text-text-muted">/5</span>
                </div>
                <div className="h-4 w-px bg-border-light"></div>
                <span className="text-sm text-text-muted">{dish.reviews_count} đánh giá</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {dish.reviews.length === 0 ? (
                <div className="text-center p-4 text-text-muted text-xs">
                  Món ăn này chưa có đánh giá nào.
                </div>
              ) : (
                <div className="space-y-4">
                  {dish.reviews.slice(0, 3).map((rev) => (
                    <div key={rev.id} className="space-y-2 pb-4 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-text-main">{rev.reviewer_name}</span>
                        <div className="text-xs text-accent">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="w-full text-center text-sm font-semibold text-primary hover:underline">
              Xem tất cả đánh giá
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Price & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-4xl font-extrabold text-primary">
              {activeSize.price.toLocaleString('vi-VN')}đ
            </span>
            <div className="flex items-center gap-1.5 bg-accent/20 px-3 py-1.5 rounded-lg">
              <span className="text-accent-dark text-sm">⭐</span>
              <span className="text-accent-dark font-bold text-sm">{dish.rating_avg}</span>
            </div>
          </div>

          {/* Nutrition Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Calories</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{activeSize.calories}</span>
                <span className="text-xs font-medium text-text-muted">kcal</span>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/10 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-accent-dark uppercase tracking-wider mb-1">Protein</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{activeSize.protein}</span>
                <span className="text-xs font-medium text-text-muted">g</span>
              </div>
            </div>
            <div className="bg-[#3F6754]/10 border border-[#3F6754]/10 rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-[#274F3D] uppercase tracking-wider mb-1">Carbs</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{activeSize.carb}</span>
                <span className="text-xs font-medium text-text-muted">g</span>
              </div>
            </div>
            <div className="bg-[#E8E8E8] border border-border-light rounded-xl p-3 flex flex-col justify-center">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1">Chất béo</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-text-main">{activeSize.fat}</span>
                <span className="text-xs font-medium text-text-muted">g</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-text-main">Nguyên liệu</h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ing) => {
                const isRemoved = removedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleIngredientToggle(ing)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      isRemoved
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
          {allergenAlert && allergenAlert.length > 0 && (
            <div className="rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-4 flex items-start gap-3">
              <span className="text-[#EA580C] mt-0.5 text-lg">⚠️</span>
              <div>
                <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block mb-1">
                  Cảnh báo dị ứng
                </span>
                <p className="text-sm text-[#9A3412] leading-relaxed mb-2">
                  Món ăn này có chứa{' '}
                  {allergenAlert.map((a, i) => (
                    <span key={i} className="font-extrabold underline uppercase">
                      {a.clashingIngredient}
                    </span>
                  ))}
                  . Hồ sơ sức khỏe của bạn ghi nhận dị ứng với{' '}
                  {allergenAlert.map((a) => a.allergyName).join(', ')}. Sử dụng món ăn này có thể gây kích ứng.
                </p>
                <button className="text-sm font-bold text-[#EA580C] underline">
                  Xem thành phần gây dị ứng
                </button>
              </div>
            </div>
          )}

          {/* Selection & CTA */}
          <div className="border-t border-border-light pt-6 space-y-6">
            <div className="flex items-center justify-between">
              {/* Sizes */}
              <div className="w-1/2">
                <span className="block text-base font-bold text-text-main mb-3">Kích cỡ</span>
                <div className="flex bg-[#EEEEEE] p-1 rounded-xl border border-border-light">
                  {dish.sizes.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSizeName(s.size_name)}
                      className={`flex-1 py-2 text-center rounded-lg text-base font-medium transition ${
                        sizeName === s.size_name
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-text-main hover:bg-white/50'
                      }`}
                    >
                      {s.size_name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="w-1/3 flex flex-col items-end">
                <span className="block text-base font-bold text-text-main mb-3">Số lượng</span>
                <div className="flex items-center justify-between bg-[#E8E8E8] border border-border-light rounded-xl p-1 w-full max-w-[120px]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-text-main hover:bg-white rounded-lg transition"
                  >
                    -
                  </button>
                  <span className="font-bold text-text-main">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-text-main hover:bg-white rounded-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Chef Notes */}
            <div>
              <span className="block text-sm font-semibold text-text-main mb-2">Ghi chú cho đầu bếp</span>
              <textarea
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="Ví dụ: Đừng cho quá nhiều sốt, làm chín kỹ cá hồi..."
                rows="2"
                className="w-full rounded-xl border border-border-light bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none transition resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full rounded-2xl py-4 text-center text-base font-bold text-white shadow-premium transition bg-primary hover:bg-primary-dark shadow-[0px_4px_6px_-1px_rgba(15,82,56,0.2)]`}
            >
              {allergenAlert && allergenAlert.length > 0 ? 'Tôi hiểu cảnh báo – tiếp tục' : 'Thêm vào giỏ hàng'}
            </button>
          </div>

        </div>
      </div>

      {/* Commitments banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-border-light">
        {[
          { title: '🔒 Minh bạch 100%', desc: 'Mọi thông tin dinh dưỡng và nguồn gốc nguyên liệu đều được kiểm chứng.' },
          { title: '⚡ Giao hàng nhanh', desc: 'Đảm bảo bữa ăn luôn nóng hổi và giữ trọn hương vị tươi ngon.' },
          { title: '📊 Cá nhân hóa', desc: 'Tự động tính toán calo và cập nhật nhật ký sức khỏe.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-bg-card border border-border-light rounded-2xl p-5 shadow-sm space-y-2">
            <h4 className="text-sm font-bold text-text-main">{item.title}</h4>
            <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
