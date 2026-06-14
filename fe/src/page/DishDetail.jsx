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
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 page-enter space-y-12">
      
      {/* Product presentation card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-bg-card border border-border-light rounded-3xl p-6 sm:p-8 shadow-premium">
        
        {/* Gallery */}
        <div className="rounded-2xl overflow-hidden bg-bg-main h-80 sm:h-96 border border-border-light shadow-sm">
          {dish.image_url ? (
            <img src={dish.image_url} alt={dish.dish_name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-6xl">🍲</div>
          )}
        </div>

        {/* Content Details */}
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary-light px-2.5 py-1 rounded">
              {dish.category_name}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main mt-3 tracking-tight">
              {dish.dish_name}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-2">
              <span className="text-accent font-bold">⭐ {dish.rating_avg}</span>
              <span>•</span>
              <span>{dish.reviews_count} đánh giá khách hàng</span>
            </div>
          </div>

          <p className="text-xs text-text-muted leading-relaxed">{dish.description}</p>

          {/* Pricing & size selector */}
          <div className="flex items-center justify-between border-y border-border-light py-4">
            <div>
              <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Kích cỡ</span>
              <div className="flex gap-2.5 mt-1.5">
                {dish.sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSizeName(s.size_name)}
                    className={`h-9 w-9 rounded-xl border text-xs font-bold transition ${
                      sizeName === s.size_name
                        ? 'border-primary bg-primary-light text-primary'
                        : 'border-border-light bg-bg-card hover:bg-bg-main text-text-main'
                    }`}
                  >
                    {s.size_name}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right">
              <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">Giá tiền</span>
              <span className="text-2xl font-extrabold text-primary">
                {activeSize.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          </div>

          {/* Macro nutrients layout */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-main">Hàm lượng dinh dưỡng</h3>
            <div className="grid grid-cols-4 gap-2 text-center bg-bg-main p-3.5 rounded-2xl border border-border-light shadow-sm">
              <div>
                <span className="block text-[9px] font-bold text-text-muted">CALO</span>
                <span className="text-sm font-extrabold text-text-main">{activeSize.calories}</span>
                <span className="text-[9px] text-text-muted block">kcal</span>
              </div>
              <div className="border-l border-border-light">
                <span className="block text-[9px] font-bold text-text-muted">ĐẠM</span>
                <span className="text-sm font-extrabold text-primary">{activeSize.protein}g</span>
                <span className="text-[9px] text-text-muted block">Protein</span>
              </div>
              <div className="border-l border-border-light">
                <span className="block text-[9px] font-bold text-text-muted">CARB</span>
                <span className="text-sm font-extrabold text-text-main">{activeSize.carb}g</span>
                <span className="text-[9px] text-text-muted block">Tinh bột</span>
              </div>
              <div className="border-l border-border-light">
                <span className="block text-[9px] font-bold text-text-muted">BÉO</span>
                <span className="text-sm font-extrabold text-text-main">{activeSize.fat}g</span>
                <span className="text-[9px] text-text-muted block">Lipid</span>
              </div>
            </div>
          </div>

          {/* SMART ALLERGEN WARNING BANNERS */}
          {allergenAlert && (
            <div className="rounded-xl bg-danger-light border border-danger/30 p-4 space-y-1.5 shadow-sm">
              <p className="text-xs font-bold text-danger">⚠️ CẢNH BÁO DỊ ỨNG THỰC PHẨM</p>
              <p className="text-xs text-danger leading-relaxed font-semibold">
                Món ăn này có chứa{' '}
                {allergenAlert.map((a, i) => (
                  <span key={i} className="underline font-extrabold">
                    {a.clashingIngredient.toUpperCase()}
                  </span>
                ))}
                . Hồ sơ y tế cá nhân của bạn ghi nhận bị dị ứng với{' '}
                {allergenAlert.map((a) => a.allergyName)}. Ăn món này có thể gây kích ứng nghiêm trọng.
              </p>
            </div>
          )}

          {/* Quantity Selector & Chef notes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              {/* Qty count */}
              <div className="flex items-center gap-3 rounded-xl bg-bg-main p-2 border border-border-light">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-sm font-bold text-text-muted hover:text-primary px-2"
                >
                  -
                </button>
                <span className="text-sm font-bold text-text-main w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-sm font-bold text-text-muted hover:text-primary px-2"
                >
                  +
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 rounded-xl py-3.5 text-center text-sm font-bold text-white shadow-premium transition ${
                  allergenAlert ? 'bg-danger hover:bg-red-700' : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {allergenAlert ? 'Tôi hiểu cảnh báo – tiếp tục' : 'Thêm vào giỏ hàng'}
              </button>
            </div>

            {/* Chef Notes input */}
            <div>
              <input
                type="text"
                value={chefNotes}
                onChange={(e) => setChefNotes(e.target.value)}
                placeholder="Ghi chú thêm cho đầu bếp (ví dụ: không lấy hành tây, ít muối...)"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients exclusion grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-text-main">Nguyên liệu chế biến</h2>
        <div className="bg-bg-card border border-border-light rounded-2xl p-6 shadow-premium">
          <p className="text-xs text-text-muted mb-4">
            Click vào nguyên liệu bên dưới để tùy chỉnh loại bỏ khỏi món ăn của bạn:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {dish.ingredients.map((ing) => {
              const isRemoved = removedIngredients.includes(ing);
              return (
                <button
                  key={ing}
                  onClick={() => handleIngredientToggle(ing)}
                  className={`rounded-full px-4.5 py-2 text-xs font-semibold border transition ${
                    isRemoved
                      ? 'bg-danger/10 border-danger text-danger'
                      : 'bg-bg-card border-border-light text-text-muted hover:border-primary hover:text-primary'
                  }`}
                >
                  {isRemoved ? '❌ Không lấy' : '✓'} {ing}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Customer reviews timeline */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-text-main">Khách hàng đánh giá</h2>
        
        <div className="space-y-4">
          {dish.reviews.length === 0 ? (
            <div className="text-center p-8 bg-bg-card border rounded-2xl border-border-light text-text-muted text-xs">
              Món ăn này chưa có đánh giá nào. Hãy là người đầu tiên thưởng thức và nhận xét!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dish.reviews.map((rev) => (
                <div key={rev.id} className="bg-bg-card border border-border-light rounded-2xl p-5 shadow-premium space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-main">{rev.reviewer_name}</span>
                    <span className="text-[10px] text-text-muted font-medium">{rev.date}</span>
                  </div>
                  <div className="text-xs text-accent">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</div>
                  <p className="text-xs text-text-muted leading-relaxed italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Commitments banner */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border-light">
        {[
          { title: '🔒 Minh bạch 100%', desc: 'Mọi thông tin dinh dưỡng và nguồn gốc nguyên liệu đều được kiểm chứng bởi chuyên gia.' },
          { title: '⚡ Giao hàng nhanh', desc: 'Đảm bảo bữa ăn luôn nóng hổi và giữ trọn hương vị tươi ngon khi đến tay bạn.' },
          { title: '📊 Cá nhân hóa', desc: 'Tự động tính toán calo và cập nhật nhật ký sức khỏe khi bạn dùng bữa.' }
        ].map((item, idx) => (
          <div key={idx} className="bg-bg-card border border-border-light rounded-2xl p-5 shadow-premium text-center space-y-2">
            <h4 className="text-xs font-bold text-text-main">{item.title}</h4>
            <p className="text-[11px] text-text-muted leading-normal">{item.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
