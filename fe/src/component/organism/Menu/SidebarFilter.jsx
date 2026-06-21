import React from 'react';
import SearchBox from '../../molecule/Menu/SearchBox';
import FilterSection from '../../molecule/Menu/FilterSection';
import { useMenuFilters } from '../../../hook/useMenuFilters';
import { mockMasterData } from '../../../service/menuService';

export default function SidebarFilter() {
  const {
    search, setSearch,
    categories, toggleCategory,
    diets, toggleDiet,
    allergiesExclude, toggleAllergy,
    minCal, setMinCal,
    maxCal, setMaxCal,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    inStockOnly, setInStockOnly,
    clearAll
  } = useMenuFilters();

  return (
    <aside className="lg:col-span-1 bg-bg-card rounded-2xl border border-border-light p-6 shadow-premium self-start space-y-6">
      <div className="flex items-center justify-between border-b border-border-light pb-4">
        <h2 className="text-base font-bold text-text-main">Bộ lọc tìm kiếm</h2>
        <button
          onClick={clearAll}
          className="text-xs font-semibold text-text-muted hover:text-danger hover:underline transition"
        >
          Xóa tất cả
        </button>
      </div>

      <SearchBox search={search} setSearch={setSearch} />

      <FilterSection
        title="Loại món"
        items={mockMasterData.categories}
        selectedItems={categories}
        onToggle={toggleCategory}
      />

      <FilterSection
        title="Chế độ ăn"
        items={mockMasterData.diets}
        selectedItems={diets}
        onToggle={toggleDiet}
      />

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

      <FilterSection
        title="Loại trừ dị ứng"
        items={mockMasterData.allergies}
        selectedItems={allergiesExclude}
        onToggle={toggleAllergy}
        labelPrefix="Không chứa"
      />

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
    </aside>
  );
}
