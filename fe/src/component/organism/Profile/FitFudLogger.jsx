import React, { useState, useEffect } from 'react';
import { searchFitFudDishForLog } from '../../../service/profileService';
import { useDebounce } from '../../../hook/useDebounce';

export default function FitFudLogger({ onLogMeal }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);
  const [fitfudDishes, setFitfudDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);

  useEffect(() => {
    if (debouncedKeyword) {
      searchFitFudDishForLog(debouncedKeyword).then(res => {
        setFitfudDishes(res.dishes);
      });
    } else {
      setFitfudDishes([]);
    }
  }, [debouncedKeyword]);

  const handleSelect = (dish) => {
    setSelectedDish(dish);
    setSearchKeyword(dish.dish_name); // Optional: populate input
    setFitfudDishes([]); // Hide dropdown
  };

  const handleSave = async () => {
    if (!selectedDish) return;
    try {
      await onLogMeal({
        dish_name: selectedDish.dish_name,
        calories: selectedDish.calories,
        protein: selectedDish.protein,
        source: 'FitFudDish',
        dish_id: selectedDish.id
      });
      setSelectedDish(null);
      setSearchKeyword('');
    } catch (err) {
      // Handle error
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-bg-card relative">
      <div className="text-sm font-bold text-text-muted uppercase mb-4 px-2">Thực đơn FitFud</div>
      
      <div className="flex-1 flex flex-col relative">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setSelectedDish(null); // Reset selection if user types
            }}
            placeholder="Tìm món ăn..."
            className="w-full rounded-lg border border-border-light bg-bg-main pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary transition"
          />
          <i className="bi bi-search absolute left-4 top-3.5 text-sm leading-none text-text-muted" aria-hidden="true" />
        </div>

        {/* Dropdown search results */}
        {fitfudDishes.length > 0 && !selectedDish && (
          <div className="absolute top-9 left-0 right-0 bg-bg-card border border-border-light rounded-lg shadow-lg max-h-32 overflow-y-auto z-10">
            {fitfudDishes.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleSelect(d)}
                className="p-3 text-sm hover:bg-bg-main cursor-pointer border-b border-border-light last:border-b-0"
              >
                <div className="font-bold text-text-main">{d.dish_name}</div>
                <div className="text-xs text-text-muted">{d.calories} kcal • {d.protein}g Pro</div>
              </div>
            ))}
          </div>
        )}

        {/* Selected preview */}
        {selectedDish ? (
          <div className="flex-1 flex flex-col justify-between p-4 rounded-lg bg-bg-main border border-primary-light">
            <div>
              <span className="text-sm font-bold text-text-main block mb-1">{selectedDish.dish_name}</span>
              <span className="text-xs text-text-muted">{selectedDish.calories} kcal • {selectedDish.protein}g Pro</span>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-2.5 mt-4 rounded-lg bg-primary-light text-primary-dark text-sm font-bold shadow-sm hover:bg-primary/20 transition"
            >
              Chọn món
            </button>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-border-light rounded-lg">
            <span className="text-xs text-text-muted text-center px-4 italic">Nhập tên món ăn từ menu FitFud để ghi nhận calo</span>
          </div>
        )}
      </div>
    </div>
  );
}
