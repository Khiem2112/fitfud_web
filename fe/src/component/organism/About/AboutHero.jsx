import React from 'react';
import Button from '../../atom/About/Button';

export default function AboutHero() {
  return (
    <section className="relative flex flex-col justify-center items-center w-full min-h-[600px] py-16 px-6 lg:px-8 bg-black/60 bg-blend-overlay bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070')] bg-cover bg-center opacity-70" />

      <div className="relative z-10 max-w-4xl w-full mx-auto space-y-6 lg:space-y-8 flex flex-col items-start">
        <div className="bg-accent px-4 py-1.5 rounded-full shadow-sm">
          <span className="text-sm font-semibold text-[#663B00]">
            Câu chuyện của chúng tôi
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-2xl" style={{ textShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)' }}>
          Hành trình mang lại sức khỏe cho người Việt
        </h1>

        <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
          Chúng tôi tin rằng bữa ăn ngon không chỉ làm hài lòng vị giác mà còn phải là nguồn năng lượng thuần khiết để bạn chinh phục mọi thử thách mỗi ngày.
        </p>

        <div className="pt-4">
          <Button to="/menu" variant="primary">Khám phá ngay</Button>
        </div>
      </div>
    </section>
  );
}
