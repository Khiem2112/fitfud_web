import React from 'react';

export default function ChefNoteInput({ value, onChange, placeholder = "Ví dụ: Đừng cho quá nhiều sốt, làm chín kỹ cá hồi...", className = '' }) {
  return (
    <div className={className}>
      <span className="flex items-center gap-2 text-sm font-bold text-text-main mb-3">
        <span className="text-lg leading-none">📝</span> Ghi chú cho đầu bếp
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border-light bg-white px-4 py-4 text-sm text-text-main focus:border-primary focus:outline-none transition resize-none shadow-sm min-h-[120px]"
      />
    </div>
  );
}
