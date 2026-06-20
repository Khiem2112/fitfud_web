import React from 'react';
import Button from '../../atom/About/Button';

export default function CTASection() {
  return (
    <section className="bg-primary-forest py-16 px-6 sm:px-10 text-center flex flex-col items-center gap-8">
      <div className="max-w-2xl space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-light leading-tight">
          Bắt đầu hành trình sống khỏe cùng FitFud
        </h2>
        <p className="text-lg text-primary-light/80">
          Chọn gói thực đơn phù hợp nhất với thể trạng và mục tiêu của bạn ngay hôm nay.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-2">
        <Button to="/menu" variant="accent">Xem các gói ăn</Button>
        <Button to="/contact" variant="outline">Tư vấn miễn phí</Button>
      </div>
    </section>
  );
}
