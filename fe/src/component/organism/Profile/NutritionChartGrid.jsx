import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNutritionHistory } from '../../../service/profileService';
import { useApp } from '../../../context/AppContext';

export default function NutritionChartGrid() {
  const { user } = useApp();

  const { data: weeklyTrend, isLoading } = useQuery({
    queryKey: ['nutritionHistory', user?.id],
    queryFn: () => getNutritionHistory(user?.id),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium h-[300px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
      </div>
    );
  }

  if (!weeklyTrend || weeklyTrend.length === 0) {
    return (
      <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium text-center text-text-muted h-[300px] flex flex-col justify-center">
        Chưa có dữ liệu biểu đồ
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <span>📊</span> Lịch sử dinh dưỡng (7 ngày qua)
        </h3>
        <div className="flex gap-4 text-[10px] font-bold text-text-main">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-dark"></span> Calo
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent"></span> Protein
          </div>
        </div>
      </div>

      {/* Custom Responsive HTML/CSS Chart bars */}
      <div className="flex justify-between items-end h-64 pt-4 px-2">
        {weeklyTrend.map((t) => {
          // Calculate percentages based on 2500 max cal and 150g max protein
          const calPercent = Math.max(5, Math.min(100, Math.round((t.calories / 2500) * 100)));
          const proPercent = Math.max(5, Math.min(100, Math.round((t.protein / 150) * 100)));

          return (
            <div key={t.day} className="flex flex-col items-center justify-end gap-2 flex-1 group h-full">
              <div className="flex items-end gap-1 h-full w-full justify-center relative">
                {/* Hover tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition absolute z-10 bg-text-main text-white text-[9px] px-1.5 py-0.5 rounded -translate-y-8 font-bold shadow-md whitespace-nowrap">
                  {t.calories} kcal
                </div>
                {/* Calo bar */}
                <div
                  style={{ height: `${calPercent}%` }}
                  className="w-4 bg-primary-dark rounded-t-sm transition-all duration-500 ease-out shadow-sm"
                ></div>
                {/* Pro bar */}
                <div
                  style={{ height: `${proPercent}%` }}
                  className="w-4 bg-accent rounded-t-sm transition-all duration-500 ease-out shadow-sm"
                ></div>
              </div>
              {/* Label */}
              <span className="text-[10px] text-text-muted font-bold">{t.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
