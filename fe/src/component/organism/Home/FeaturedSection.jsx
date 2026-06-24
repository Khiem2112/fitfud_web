import React from 'react';
import { useNavigate } from 'react-router-dom';
import DishCard from '../../molecule/Menu/DishCard';

/**
 * @param {{ dishes: DishItem[], onOpenQuickView: function }} props
 */
const FeaturedSection = ({ dishes, onOpenQuickView }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white py-16 md:py-24 px-6 md:px-12 flex justify-center">
      <div className="max-w-7xl w-full flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Món ngon tiêu biểu</h2>
            <p className="text-text-muted text-lg">
              Lựa chọn hàng đầu giúp bạn duy trì cân nặng và năng lượng.
            </p>
          </div>
          <button 
            onClick={() => navigate('/menu')}
            className="flex items-center gap-2 text-primary font-bold hover:text-primary-dark group"
          >
            Khám phá tất cả
            <i className="bi bi-arrow-right text-xl leading-none transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dishes.slice(0, 3).map((dish) => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onOpenQuickView={onOpenQuickView} 
            />
          ))}

          {/* View More Card */}
          <div 
            onClick={() => navigate('/menu')}
            className="flex flex-col justify-center items-center overflow-hidden rounded-2xl border border-border-light bg-bg-main p-8 hover:shadow-premium hover:-translate-y-0.5 transition duration-300 cursor-pointer min-h-[380px]"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <i className="bi bi-arrow-right text-3xl leading-none text-primary" aria-hidden="true" />
              </div>
              <span className="font-bold text-primary text-center">Xem thêm món khác</span>
            </div>
            <button className="mt-6 px-6 py-2 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
