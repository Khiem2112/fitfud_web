import React from 'react';

export default function AllergyWarning({ allergens, isLoading, isError, className = '' }) {
  if (isLoading) {
    return (
      <div className={`rounded-2xl bg-orange-50 border border-orange-100 p-4 animate-pulse flex items-start gap-3 ${className}`}>
        <div className="w-6 h-6 bg-orange-200 rounded-full mt-0.5 shrink-0"></div>
        <div className="space-y-2 flex-1 pt-1">
          <div className="h-3 bg-orange-200 rounded w-1/3"></div>
          <div className="h-3 bg-orange-200 rounded w-full"></div>
          <div className="h-3 bg-orange-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (isError || !allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] p-4 flex items-start gap-3 shadow-sm ${className}`}>
      <span className="text-[#EA580C] mt-0.5 text-lg leading-none">⚠️</span>
      <div>
        <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider block mb-1">
          Cảnh báo dị ứng
        </span>
        <p className="text-sm text-[#9A3412] leading-relaxed mb-2">
          Món ăn này có chứa{' '}
          {allergens.map((a, i) => (
            <span key={i} className="font-extrabold underline uppercase">
              {a.clashingIngredient}
              {i < allergens.length - 1 ? ', ' : ''}
            </span>
          ))}
          . Hồ sơ sức khỏe của bạn ghi nhận dị ứng với{' '}
          {allergens.map((a) => a.allergyName).join(', ')}. Sử dụng món ăn này có thể gây kích ứng.
        </p>
        <button className="text-sm font-bold text-[#EA580C] underline hover:text-[#C2410C] transition">
          Xem thành phần gây dị ứng
        </button>
      </div>
    </div>
  );
}
