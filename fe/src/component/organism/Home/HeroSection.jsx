import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '../../../assets/hero.png';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-bg-main py-12 md:py-24 px-6 md:px-12 flex justify-center">
      <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="flex-1 flex flex-col items-start gap-6">
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="text-primary font-bold text-sm">Sống khỏe cùng FitFud</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-primary leading-tight tracking-tight">
            Ăn sạch không có<br className="hidden md:block" /> nghĩa là ăn chán.
          </h1>
          
          <p className="text-text-muted text-lg md:text-xl max-w-lg leading-relaxed">
            Cá nhân hóa bữa ăn hàng ngày của bạn với sự hỗ trợ từ AI
            và đội ngũ chuyên gia dinh dưỡng hàng đầu Việt Nam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Xem Thực Đơn
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/survey')}
              className="flex items-center justify-center gap-2 bg-transparent text-primary border-2 border-primary/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/5 transition-colors"
            >
              <Sparkles className="w-5 h-5 text-primary" />
              Tạo Hồ Sơ AI
            </button>
          </div>
        </div>
        
        {/* Image Content */}
        <div className="flex-1 flex justify-center md:justify-end w-full">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3"></div>
            <img
              src={heroImage}
              alt="Healthy Meal"
              className="relative z-10 w-full h-full object-cover rounded-3xl shadow-premium-lg"
              onError={(e) => {
                // Fallback if hero.png is not properly loaded or is missing
                e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
