import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function HealthGoalPanel({ dashboardData, onUpdateGoal }) {
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [goal, setGoal] = useState('Weight Loss');
  const [activity, setActivity] = useState('Moderately Active');
  const [diet, setDiet] = useState('Bình thường');

  useEffect(() => {
    if (dashboardData) {
      setGoal(dashboardData.health_goal || 'Weight Loss');
      setActivity(dashboardData.activity_level || 'Moderately Active');
      setDiet(dashboardData.diet_preference || 'Bình thường');
    }
  }, [dashboardData]);

  const handleUpdateGoal = async () => {
    setIsLoading(true);
    try {
      if (onUpdateGoal) {
        await onUpdateGoal({
          health_goal: goal,
          activity_level: activity,
          diet_preference: diet
        });
      }
    } catch (error) {
      addToast('Cập nhật thất bại', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium space-y-3">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
        <i className="bi bi-bullseye text-base leading-none text-primary" aria-hidden="true" />
        <span>Mục tiêu sức khỏe</span>
      </h3>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mục tiêu hiện tại</label>
          <select 
            className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none relative"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          >
            <option value="Weight Loss">Giảm cân</option>
            <option value="Muscle Gain">Tăng cơ</option>
            <option value="Healthy Eating">Ăn uống lành mạnh</option>
            <option value="Calorie Control">Kiểm soát calories</option>
            <option value="Maintain Weight">Duy trì vóc dáng</option>
            <option value="Convenience">Tiện lợi / tiết kiệm</option>
          </select>
        </div>
        
        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Mức độ hoạt động</label>
          <select 
            className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none relative"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
          >
            <option value="Sedentary">Ít vận động (1-2 buổi/tuần)</option>
            <option value="Lightly Active">Vận động nhẹ (2-3 buổi/tuần)</option>
            <option value="Moderately Active">Vận động vừa (3-4 buổi/tuần)</option>
            <option value="Very Active">Vận động nhiều (5-6 buổi/tuần)</option>
            <option value="Extra Active">Vận động rất nhiều</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Chế độ ăn</label>
          <select 
            className="w-full rounded-xl border border-border-light bg-bg-card px-3 py-2 text-xs text-text-main focus:outline-none focus:border-primary appearance-none relative"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
          >
            <option value="Bình thường">Bình thường</option>
            <option value="Eat Clean">Eat Clean</option>
            <option value="Keto">Keto</option>
            <option value="Chay">Chay</option>
          </select>
        </div>

        <button 
          onClick={handleUpdateGoal}
          disabled={isLoading}
          className="w-full rounded-xl bg-primary-dark text-white py-2 text-xs font-bold hover:bg-primary transition shadow-md disabled:opacity-50"
        >
          {isLoading ? 'Đang cập nhật...' : 'Cập nhật mục tiêu'}
        </button>
      </div>
    </div>
  );
}
