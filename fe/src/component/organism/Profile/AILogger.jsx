import React from 'react';
import { useApp } from '../../../context/AppContext';

export default function AILogger() {
  const { startAILogMeal, isAIAnalyzing } = useApp();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      startAILogMeal(file);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-bg-card relative">
      <div className="text-sm font-bold text-text-muted uppercase mb-4 px-2">Chụp ảnh AI</div>
      
      {!isAIAnalyzing ? (
        <div className="flex-1 border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:bg-bg-main transition relative">
          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          <i className="bi bi-camera text-4xl leading-none text-primary" aria-hidden="true" />
          <span className="text-sm font-bold text-text-main text-center">Chụp/Tải ảnh</span>
          <span className="text-xs text-text-muted text-center">AI nhận diện tự động</span>
        </div>
      ) : (
        <div className="flex-1 border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-light border-t-primary mb-2"></div>
          <span className="text-[9px] text-text-muted">Đang phân tích...</span>
        </div>
      )}
    </div>
  );
}
