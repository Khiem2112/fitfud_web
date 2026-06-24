import React, { useState, useEffect } from 'react';

const defaultLoadingSteps = [
  'Phân tích hồ sơ sức khỏe...',
  'Tính toán định mức Calo & Macro dinh dưỡng...',
  'Lọc các món ăn phù hợp khẩu vị Việt...',
  'Xây dựng lộ trình thực đơn đề xuất...',
  'Sẵn sàng!'
];

export const AIAnalyzerScreen = ({
  steps = defaultLoadingSteps,
  title = "FitFud đang tạo thực đơn cho riêng bạn...",
  description = "AI của chúng tôi đang tính toán tỉ lệ dinh dưỡng dựa trên chỉ số cơ thể của bạn.",
  durationPerStep = 800
}) => {
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingTextIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, durationPerStep);
    return () => clearInterval(timer);
  }, [steps.length, durationPerStep]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4 page-enter">
      <div className="relative mb-8">
        <div className="h-20 w-20 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
        <i className="bi bi-leaf absolute inset-0 flex items-center justify-center text-3xl leading-none text-primary" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-bold text-text-main mb-2">{title}</h2>
      <p className="text-sm text-text-muted max-w-sm mb-6">
        {description}
      </p>

      {/* Dynamic loading process details */}
      <div className="w-full max-w-xs bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium text-left">
        <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Premium Nutrition Engine</p>
        <div className="space-y-2">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className={idx <= loadingTextIndex ? 'text-primary font-bold' : 'text-text-muted'}>
                {idx < loadingTextIndex ? (
                  <i className="bi bi-check-circle-fill" aria-hidden="true" />
                ) : idx === loadingTextIndex ? (
                  <i className="bi bi-record-circle" aria-hidden="true" />
                ) : (
                  <i className="bi bi-circle" aria-hidden="true" />
                )}
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
