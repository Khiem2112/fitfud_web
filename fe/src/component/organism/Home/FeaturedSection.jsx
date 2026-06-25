import React from 'react';
import { useNavigate } from 'react-router-dom';
import FeaturedDishCard from '../../molecule/Home/FeaturedDishCard';

/**
 * @param {{ dishes: DishItem[], onOpenQuickView: function }} props
 */
const FeaturedSection = ({ dishes, onOpenQuickView }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-12 md:py-16 px-6 md:px-12 flex justify-center border-b border-dashed border-blue-500">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl md:text-[28px] font-extrabold text-[#194b33]">Món ngon tiêu biểu</h2>
            <p className="text-gray-500 text-sm font-medium">
              Lựa chọn hàng đầu giúp bạn duy trì cân nặng và năng lượng.
            </p>
          </div>
          <button 
            onClick={() => navigate('/menu')}
            className="flex items-center gap-1.5 text-[#194b33] text-sm font-bold hover:opacity-80 transition-opacity"
          >
            Khám phá tất cả
            <i className="bi bi-arrow-right leading-none" aria-hidden="true" />
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
          {dishes.slice(0, 3).map((dish) => (
            <FeaturedDishCard 
              key={dish.id} 
              dish={dish} 
              onOpenQuickView={onOpenQuickView}
            />
          ))}

          {/* View More Card */}
          <div 
            onClick={() => navigate('/menu')}
            className="flex flex-col justify-center items-center overflow-hidden rounded-2xl border border-gray-200 bg-[#f8f9f9] p-6 hover:shadow-lg transition-shadow cursor-pointer h-full min-h-[280px]"
          >
            <div className="flex flex-col items-center gap-3 flex-1 justify-center">
              <div className="text-gray-400 text-3xl font-light leading-none">+</div>
              <span className="font-bold text-gray-700 text-xs text-center">Xem thêm món khác</span>
            </div>
            <button className="mt-4 w-full py-2 bg-white rounded-lg border border-[#194b33] text-[#194b33] font-bold text-xs hover:bg-gray-50 transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
