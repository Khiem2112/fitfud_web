import React from 'react';
import ProcessCard from '../../molecule/About/ProcessCard';

export default function HowItWorksSection() {
  const steps = [
    {
      title: '1. Phân tích thể trạng',
      desc: 'Dựa trên các chỉ số cá nhân, FitFud tính toán chính xác nhu cầu dinh dưỡng mà cơ thể bạn cần.',
      icon: '📊'
    },
    {
      title: '2. Thiết kế thực đơn',
      desc: 'Chuyên gia dinh dưỡng xây dựng thực đơn đa dạng, cân bằng macro để đạt mục tiêu sức khỏe.',
      icon: '📋'
    },
    {
      title: '3. Giao tận tay',
      desc: 'Món ăn tươi ngon được chế biến và giao nóng hổi mỗi sáng, đảm bảo sự tiện lợi tối đa.',
      icon: '🛵'
    }
  ];

  return (
    <section className="flex flex-col items-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary">Cách thức hoạt động</h2>
        <div className="w-20 h-1 bg-accent rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 w-full pt-4">
        {steps.map((item, index) => (
          <ProcessCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
