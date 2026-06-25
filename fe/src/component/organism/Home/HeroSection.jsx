import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../../../assets/salmon-bowl.png';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-bg-main px-4 py-5 md:px-8 md:py-8 flex justify-center">
      <div className="relative max-w-7xl w-full min-h-[440px] overflow-hidden rounded-3xl bg-primary-dark shadow-premium-lg">
        <img
          src={heroImage}
          alt="Healthy Meal"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/5" />
        {/* Text Content */}
        <div className="relative z-10 flex min-h-[440px] max-w-2xl flex-col justify-center px-6 py-10 md:px-10">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 backdrop-blur">
            <div className="h-2 w-2 rounded-full bg-accent"></div>
            <span className="text-xs font-bold text-white">Sống khỏe cùng FitFud</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Ăn sạch không có<br className="hidden md:block" /> nghĩa là ăn chán.
          </h1>
          
          <p className="mt-4 text-sm md:text-lg max-w-xl leading-relaxed text-white/90">
            Cá nhân hóa bữa ăn hàng ngày của bạn với sự hỗ trợ từ AI
            và đội ngũ chuyên gia dinh dưỡng hàng đầu Việt Nam.
          </p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate('/menu')}
              className="flex items-center justify-center gap-2 bg-white text-primary px-5 py-3 rounded-xl font-bold text-sm hover:bg-primary-light transition-colors shadow-lg hover:shadow-xl"
            >
              Xem Thực Đơn
              <i className="bi bi-arrow-right text-xl leading-none" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/survey')}
              className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 px-5 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur"
            >
              <i className="bi bi-stars text-xl leading-none text-white" aria-hidden="true" />
              Tạo Hồ Sơ AI
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
