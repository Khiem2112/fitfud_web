import React, { useState } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function HealthGoalPanel() {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateGoal = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      addToast('Đổi mục tiêu sức khỏe thành công!', 'success');
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-5">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
        <span>🎯</span> Mục tiêu sức khỏe
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mục tiêu hiện tại</label>
          <select className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none relative">
            <option>Giảm mỡ & Tăng cơ</option>
            <option>Giảm cân</option>
            <option>Tăng cân</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mức độ hoạt động</label>
          <select className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none">
            <option>Nhẹ (1-3 buổi/tuần)</option>
            <option>Vừa (3-5 buổi/tuần)</option>
            <option>Nặng (6-7 buổi/tuần)</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Chế độ ăn</label>
          <select className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none">
            <option>Bình thường</option>
            <option>Eat Clean</option>
            <option>Keto</option>
            <option>Chay</option>
          </select>
        </div>

        <button 
          onClick={handleUpdateGoal}
          disabled={isLoading}
          className="w-full rounded-xl bg-primary-dark text-white py-2.5 text-xs font-bold hover:bg-primary transition shadow-md disabled:opacity-50"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật mục tiêu'}
        </button>
      </div>
    </div>
  );
}
