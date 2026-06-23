import React, { useState, useEffect } from 'react';

const loadingSteps = [
  'Phân tích hồ sơ sức khỏe...',
  'Tính toán định mức Calo & Macro dinh dưỡng...',
  'Lọc các món ăn phù hợp khẩu vị Việt...',
  'Xây dựng lộ trình thực đơn đề xuất...',
  'Sẵn sàng!'
];

export const AIAnalyzerScreen = () => {
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTextIndex((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 page-enter">
      <div className="relative mb-8">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
        <span className="absolute inset-0 flex items-center justify-center text-3xl">🌱</span>
      </div>
      <h2 className="text-xl font-bold text-text-main mb-2">FitFud đang tạo thực đơn cho riêng bạn...</h2>
      <p className="text-sm text-text-muted max-w-sm mb-6">
        AI của chúng tôi đang tính toán tỉ lệ dinh dưỡng dựa trên chỉ số cơ thể của bạn.
      </p>

      {/* Dynamic loading process details */}
      <div className="w-full max-w-xs bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium text-left">
        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Premium Nutrition Engine</p>
        <div className="space-y-2">
          {loadingSteps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className={idx <= loadingTextIndex ? 'text-primary font-bold' : 'text-text-muted'}>
                {idx < loadingTextIndex ? '✓' : idx === loadingTextIndex ? '⊙' : '○'}
              </span>
              <span className={idx === loadingTextIndex ? 'text-text-main font-semibold' : 'text-text-muted'}>
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
