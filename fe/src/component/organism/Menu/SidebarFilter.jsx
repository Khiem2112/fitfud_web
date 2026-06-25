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
    <aside className="lg:col-span-1 bg-bg-card rounded-xl border border-border-light p-3 shadow-premium self-start space-y-2.5 lg:sticky lg:top-24">
      <div className="flex items-center justify-between border-b border-border-light pb-2">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-text-main">
          <i className="bi bi-sliders2 text-primary" aria-hidden="true" />
          Bộ lọc
        </h2>
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
      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-main">Lượng calo</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minCal}
            onChange={(e) => setMinCal(e.target.value)}
            placeholder="Từ"
            className="w-full rounded-lg border border-border-light bg-bg-main px-2 py-1.5 text-xs text-center focus:outline-none"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            value={maxCal}
            onChange={(e) => setMaxCal(e.target.value)}
            placeholder="Đến"
            className="w-full rounded-lg border border-border-light bg-bg-main px-2 py-1.5 text-xs text-center focus:outline-none"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-main">Khoảng giá</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Từ"
            className="w-full rounded-lg border border-border-light bg-bg-main px-2 py-1.5 text-xs text-center focus:outline-none"
          />
          <span className="text-text-muted">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Đến"
            className="w-full rounded-lg border border-border-light bg-bg-main px-2 py-1.5 text-xs text-center focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-main">Loại trừ dị ứng</label>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {mockMasterData.allergies.map((item) => (
            <label key={item.id} className="flex items-center gap-1.5 text-[11px] font-medium text-text-muted cursor-pointer">
              <input
                type="checkbox"
                checked={allergiesExclude.includes(item.name)}
                onChange={() => toggleAllergy(item.name)}
                className="h-3.5 w-3.5 rounded border-border-light text-primary focus:ring-primary"
              />
              <span className={allergiesExclude.includes(item.name) ? 'text-text-main font-bold' : ''}>
                {item.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Status filter toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-border-light">
        <label htmlFor="inStock" className="text-xs font-bold text-text-main cursor-pointer">
          Đang bán
        </label>
        <button
          id="inStock"
          type="button"
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`relative h-5 w-9 rounded-full transition ${inStockOnly ? 'bg-primary' : 'bg-border-light'}`}
          aria-pressed={inStockOnly}
        >
          <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition ${inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
        </button>
      </div>
    </aside>
  );
}
