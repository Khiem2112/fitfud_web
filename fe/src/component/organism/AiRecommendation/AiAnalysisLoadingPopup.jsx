import React from 'react';

export default function AiAnalysisLoadingPopup() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-bg-card border border-border-light rounded-3xl p-8 max-w-sm w-full shadow-premium text-center flex flex-col items-center">
        
        {/* Lottie or CSS animation simulation for AI Scanning */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping"></div>
          <div className="absolute inset-4 border-4 border-accent/50 rounded-full animate-spin"></div>
          <div className="absolute inset-8 border-4 border-primary rounded-full flex items-center justify-center bg-bg-main shadow-inner">
            <span className="text-3xl">🤖</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-text-main mb-2">AI Đang Phân Tích...</h3>
        <p className="text-sm text-text-muted mb-6 px-4">
          Hệ thống đang quét hồ sơ sức khỏe và mục tiêu dinh dưỡng của bạn để tìm ra món ăn phù hợp nhất.
        </p>

        <div className="flex flex-col gap-3 w-full text-left text-xs font-medium text-text-muted">
          <div className="flex items-center gap-2 animate-pulse">
            <span className="w-4 text-center">✓</span> Đọc mục tiêu dinh dưỡng...
          </div>
          <div className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <span className="w-4 text-center">✓</span> Lọc các món dị ứng...
          </div>
          <div className="flex items-center gap-2 animate-pulse" style={{ animationDelay: '1s' }}>
            <span className="w-4 text-center">✓</span> Đánh giá lượng calo & protein...
          </div>
        </div>
      </div>
    </div>
  );
}
