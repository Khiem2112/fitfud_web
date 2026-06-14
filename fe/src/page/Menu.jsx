import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchHealthyMenu, mockMasterData } from '../service/menuService';
import { getCustomerProfile } from '../service/surveyService';

export default function Menu() {
  const { user, addToCart } = useApp();
  const navigate = useNavigate();

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [minCal, setMinCal] = useState('');
  const [maxCal, setMaxCal] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 6;

  // Active filters applied to query
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    categories: [],
    diets: [],
    allergiesExclude: [],
    minCal: undefined,
    maxCal: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStockOnly: true,
    page: 1,
    limit
  });

  // Keep page index synced with applied filters
  useEffect(() => {
    setAppliedFilters((prev) => ({ ...prev, page }));
  }, [page]);

  // Tanstack Query for menu list
  const { data: menuData, isLoading, isError } = useQuery({
    queryKey: ['healthyMenu', appliedFilters],
    queryFn: () => fetchHealthyMenu(appliedFilters),
    keepPreviousData: true
  });

  // Customer Profile for Allergen Matches
  const profile = user ? getCustomerProfile(user.id) : null;

  // Quick View Popup States
  const [selectedDish, setSelectedDish] = useState(null);
  const [quickViewSize, setQuickViewSize] = useState('M'); // S, M, L
  const [removedIngredients, setRemovedIngredients] = useState([]);
  const [chefNotes, setChefNotes] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [allergenAlert, setAllergenAlert] = useState(null);

  // Triggered when a dish card or "Thêm vào giỏ" is clicked
  const handleOpenQuickView = (dish) => {
    setSelectedDish(dish);
    setQuickViewSize('M');
    setRemovedIngredients([]);
    setChefNotes('');
    setQuantity(1);

    // Allergen detection: check if dish ingredients clash with user profile allergies
    if (profile && profile.allergyIds && profile.allergyIds.length > 0) {
      // Map allergy IDs to names
      const userAllergyNames = mockMasterData.allergies
        .filter((a) => profile.allergyIds.includes(a.id))
        .map((a) => a.name);

      // Simple keyword matching helper (e.g. Allergy "Cá" matches Ingredient "Cá hồi")
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
  };

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters({
      search,
      categories: selectedCats,
      diets: selectedDiets,
      allergiesExclude: selectedAllergies,
      minCal: minCal ? Number(minCal) : undefined,
      maxCal: maxCal ? Number(maxCal) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly,
      page: 1,
      limit
    });
  };

  const handleClearAllFilters = () => {
    setSearch('');
    setSelectedCats([]);
    setSelectedDiets([]);
    setSelectedAllergies([]);
    setMinCal('');
    setMaxCal('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(true);
    setPage(1);
    setAppliedFilters({
      search: '',
      categories: [],
      diets: [],
      allergiesExclude: [],
      minCal: undefined,
      maxCal: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: true,
      page: 1,
      limit
    });
  };

  const handleToggleCat = (catName) => {
    setSelectedCats((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  const handleToggleDiet = (dietName) => {
    setSelectedDiets((prev) =>
      prev.includes(dietName) ? prev.filter((d) => d !== dietName) : [...prev, dietName]
    );
  };

  const handleToggleAllergenExclude = (allergyName) => {
    setSelectedAllergies((prev) =>
      prev.includes(allergyName) ? prev.filter((a) => a !== allergyName) : [...prev, allergyName]
    );
  };

  const handleIngredientRemoveToggle = (ing) => {
    setRemovedIngredients((prev) =>
      prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
    );
  };

  const handleConfirmAddToCart = () => {
    if (!selectedDish) return;
    const selectedSizeInfo =
      selectedDish.sizes.find((s) => s.size_name === quickViewSize) || selectedDish.sizes[0];

    addToCart({
      dish_id: selectedDish.id,
      dish_name: selectedDish.dish_name,
      image_url: selectedDish.image_url,
      size_name: quickViewSize,
      price: selectedSizeInfo.price,
      quantity,
      chef_notes: chefNotes + (removedIngredients.length > 0 ? ` (Không lấy: ${removedIngredients.join(', ')})` : ''),
      calories: selectedSizeInfo.calories,
      protein: selectedSizeInfo.protein,
      fat: selectedSizeInfo.fat,
      carb: selectedSizeInfo.carb
    });

    setSelectedDish(null);
  };

  // Get current active price and calories for quick view dialog
  const activeSizeObj = selectedDish
    ? selectedDish.sizes.find((s) => s.size_name === quickViewSize) || selectedDish.sizes[0]
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 page-enter">
      
      {/* Grid container with sidebar and content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTER (Left) */}
        <aside className="lg:col-span-1 bg-bg-card rounded-2xl border border-border-light p-6 shadow-premium self-start space-y-6">
          <div className="flex items-center justify-between border-b border-border-light pb-4">
            <h2 className="text-base font-bold text-text-main">Bộ lọc tìm kiếm</h2>
            <button
              onClick={handleClearAllFilters}
              className="text-xs font-semibold text-text-muted hover:text-danger hover:underline transition"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Search bar */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Từ khóa</label>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tên món hoặc nguyên liệu..."
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Loại món</label>
            <div className="space-y-2">
              {mockMasterData.categories.map((c) => (
                <label key={c.id} className="flex items-center gap-2.5 text-xs font-medium text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(c.name)}
                    onChange={() => handleToggleCat(c.name)}
                    className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  <span className={selectedCats.includes(c.name) ? 'text-text-main font-bold' : ''}>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Diets */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Chế độ ăn</label>
            <div className="space-y-2">
              {mockMasterData.diets.map((d) => (
                <label key={d.id} className="flex items-center gap-2.5 text-xs font-medium text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDiets.includes(d.name)}
                    onChange={() => handleToggleDiet(d.name)}
                    className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  <span className={selectedDiets.includes(d.name) ? 'text-text-main font-bold' : ''}>{d.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Calorie Range */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Lượng calo (kcal)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minCal}
                onChange={(e) => setMinCal(e.target.value)}
                placeholder="Từ"
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                value={maxCal}
                onChange={(e) => setMaxCal(e.target.value)}
                placeholder="Đến"
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Khoảng giá (đ)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Từ"
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
              />
              <span className="text-text-muted">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Đến"
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2 text-xs text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Exclude Allergies */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Loại trừ dị ứng</label>
            <div className="space-y-2">
              {mockMasterData.allergies.map((a) => (
                <label key={a.id} className="flex items-center gap-2.5 text-xs font-medium text-text-muted cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAllergies.includes(a.name)}
                    onChange={() => handleToggleAllergenExclude(a.name)}
                    className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
                  />
                  <span>Không chứa {a.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status filter toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-border-light">
            <label htmlFor="inStock" className="text-xs font-bold text-text-main cursor-pointer">
              Chỉ hiển thị món đang bán
            </label>
            <input
              id="inStock"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
            />
          </div>

          {/* Apply button */}
          <button
            onClick={handleApplyFilters}
            className="w-full rounded-xl bg-primary py-3 text-center text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition"
          >
            Áp dụng bộ lọc
          </button>
        </aside>

        {/* FOOD LIST SECTION (Right) */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Header & Meta */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Thực đơn lành mạnh</h1>
              <p className="text-xs text-text-muted mt-0.5">
                Tìm thấy {menuData?.totalItems || 0} món ăn sức khỏe được tuyển chọn
              </p>
            </div>
          </div>

          {/* LOADING STATE */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="animate-pulse rounded-2xl border border-border-light bg-bg-card p-4 space-y-4">
                  <div className="bg-border-light rounded-xl h-44 w-full"></div>
                  <div className="h-4 bg-border-light rounded w-3/4"></div>
                  <div className="h-3 bg-border-light rounded w-1/2"></div>
                  <div className="h-8 bg-border-light rounded w-full pt-4"></div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {isError && (
            <div className="rounded-2xl border border-danger/30 bg-danger-light p-12 text-center text-danger">
              <span className="text-3xl block mb-2">⚠️</span>
              <p className="font-bold text-sm">Có lỗi xảy ra khi tải dữ liệu thực đơn!</p>
              <button
                onClick={handleApplyFilters}
                className="mt-4 text-xs font-bold text-white bg-danger rounded-lg px-4 py-2 hover:bg-red-700 transition"
              >
                Tải lại trang
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && menuData?.dishes.length === 0 && (
            <div className="rounded-2xl border border-border-light bg-bg-card p-16 text-center text-text-muted space-y-4">
              <span className="text-5xl block">🥗</span>
              <p className="font-semibold text-sm text-text-main">Không tìm thấy món ăn nào khớp với bộ lọc của bạn.</p>
              <p className="text-xs max-w-sm mx-auto leading-relaxed">
                Vui lòng thử xóa bớt các tiêu chí lọc hoặc thay đổi từ khóa tìm kiếm để khám phá thêm món ngon khác nhé.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="rounded-xl border border-border-light px-5 py-2.5 text-xs font-bold text-text-main bg-bg-card hover:bg-bg-main transition"
              >
                Xóa toàn bộ lọc
              </button>
            </div>
          )}

          {/* DISHES LIST GRID */}
          {!isLoading && !isError && menuData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {menuData.dishes.map((dish) => {
                const isOutOfStock = dish.status === 'Out of Stock';
                const defaultSize = dish.sizes.find((s) => s.size_name === 'M') || dish.sizes[0];

                return (
                  <div
                    key={dish.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border-light bg-bg-card p-4 hover:shadow-premium hover:-translate-y-0.5 transition duration-300 relative"
                  >
                    {/* Discount tag (Figma mock -13%) */}
                    {dish.id === 'dish_2' && (
                      <span className="absolute top-6 left-6 z-10 rounded-lg bg-danger px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                        -13%
                      </span>
                    )}

                    {/* Image block */}
                    <div className="relative overflow-hidden rounded-xl bg-bg-main h-44 mb-4">
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

                      {/* Out of stock overlay */}
                      {isOutOfStock && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                          <span className="rounded-lg bg-danger px-3 py-1.5 text-[10px] font-extrabold text-white tracking-widest uppercase">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {dish.category_name}
                          </span>
                          <div className="flex items-center text-[10px] text-accent font-semibold gap-0.5">
                            ⭐ {dish.rating_avg}
                          </div>
                        </div>

                        {/* Title click goes to details page */}
                        <h3
                          onClick={() => !isOutOfStock && navigate(`/dish/${dish.id}`)}
                          className={`text-sm font-bold text-text-main leading-snug ${
                            isOutOfStock ? 'opacity-60' : 'cursor-pointer hover:text-primary transition'
                          }`}
                        >
                          {dish.dish_name}
                        </h3>

                        <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      {/* Nutrient specs & Price */}
                      <div className="pt-4 mt-3 border-t border-border-light flex items-center justify-between">
                        <div className="text-left">
                          <span className="block text-[10px] text-text-muted font-medium">Lượng calo (M)</span>
                          <span className="text-xs font-bold text-text-main">{defaultSize.calories} kcal</span>
                        </div>

                        <div className="text-right">
                          <span className="block text-[10px] text-text-muted font-medium">Giá tiền</span>
                          <span className="text-sm font-extrabold text-primary">
                            {defaultSize.price.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart button */}
                      <button
                        onClick={() => handleOpenQuickView(dish)}
                        disabled={isOutOfStock}
                        className={`w-full mt-4 rounded-xl py-3 text-center text-xs font-bold shadow-sm transition ${
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
              })}
            </div>
          )}

          {/* PAGINATION */}
          {!isLoading && !isError && menuData && menuData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-8 border-t border-border-light">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-xl border border-border-light bg-bg-card p-2 text-xs font-bold text-text-main hover:bg-bg-main transition disabled:opacity-30 disabled:hover:bg-bg-card"
              >
                ◀
              </button>
              {[...Array(menuData.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`rounded-xl h-8 w-8 text-xs font-bold transition ${
                    page === i + 1
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border-light bg-bg-card text-text-main hover:bg-bg-main'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(menuData.totalPages, p + 1))}
                disabled={page === menuData.totalPages}
                className="rounded-xl border border-border-light bg-bg-card p-2 text-xs font-bold text-text-main hover:bg-bg-main transition disabled:opacity-30 disabled:hover:bg-bg-card"
              >
                ▶
              </button>
            </div>
          )}
        </section>
      </div>

      {/* QUICK VIEW POPUP MODAL */}
      {selectedDish && activeSizeObj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedDish(null)}
          ></div>

          {/* Modal Card */}
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium-lg page-enter space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-text-muted hover:bg-bg-main hover:text-text-main transition"
            >
              ✕
            </button>

            {/* Dish Head Info */}
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {selectedDish.category_name}
              </span>
              <h2 className="text-xl font-bold text-text-main mt-0.5">{selectedDish.dish_name}</h2>
              <p className="text-xs text-text-muted max-w-sm mx-auto mt-2 leading-relaxed">
                {selectedDish.description}
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
            {allergenAlert && (
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
                {selectedDish.sizes.map((s) => {
                  const sizeAddPrice = s.price - selectedDish.sizes[0].price;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setQuickViewSize(s.size_name)}
                      className={`flex-1 rounded-xl border p-3.5 text-center transition ${
                        quickViewSize === s.size_name
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
                {selectedDish.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => handleIngredientRemoveToggle(ing)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                        isRemoved
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
              {/* Quantity counter */}
              <div className="flex items-center gap-3 rounded-xl bg-bg-main p-2 border border-border-light shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-sm font-bold text-text-muted hover:text-primary px-2 py-0.5"
                >
                  -
                </button>
                <span className="text-sm font-bold text-text-main w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-sm font-bold text-text-muted hover:text-primary px-2 py-0.5"
                >
                  +
                </button>
              </div>

              {/* Confirm add to cart */}
              <button
                onClick={handleConfirmAddToCart}
                className={`flex-1 rounded-xl py-3.5 text-center text-sm font-bold text-white shadow-premium transition ${
                  allergenAlert
                    ? 'bg-danger hover:bg-red-700 shadow-red-100 dark:shadow-none'
                    : 'bg-primary hover:bg-primary-dark'
                }`}
              >
                {allergenAlert ? 'Tôi hiểu cảnh báo - tiếp tục' : 'Thêm vào giỏ hàng'} •{' '}
                {(activeSizeObj.price * quantity).toLocaleString('vi-VN')}đ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
