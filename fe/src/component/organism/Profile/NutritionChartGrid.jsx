import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getNutritionHistory } from '../../../service/profileService';
import { useApp } from '../../../context/AppContext';

export default function NutritionChartGrid() {
  const { user } = useApp();

  const { data: nutritionHistory, isLoading } = useQuery({
    queryKey: ['nutritionHistory', user?.id],
    queryFn: () => getNutritionHistory(user?.id),
    enabled: !!user?.id,
  });
  const weeklyTrend = nutritionHistory?.weekly_trend || [];
  const targetCalories = nutritionHistory?.target_calories || 2200;
  const targetProtein = nutritionHistory?.target_protein || 120;
  const chartMaxCalories = Math.max(targetCalories, ...weeklyTrend.map((t) => t.calories), 1);
  const chartMaxProtein = Math.max(targetProtein, ...weeklyTrend.map((t) => t.protein), 1);
  const calorieTargetTop = 100 - Math.min(100, Math.round((targetCalories / chartMaxCalories) * 100));
  const proteinTargetTop = 100 - Math.min(100, Math.round((targetProtein / chartMaxProtein) * 100));

  if (isLoading) {
    return (
      <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium h-[240px] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-light border-t-primary"></div>
      </div>
    );
  }

  if (!weeklyTrend || weeklyTrend.length === 0) {
    return (
      <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium text-center text-text-muted h-[240px] flex flex-col justify-center">
        Chưa có dữ liệu biểu đồ
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-text-main flex items-center gap-2">
          <i className="bi bi-bar-chart-line text-base leading-none text-primary" aria-hidden="true" />
          <span>Lịch sử dinh dưỡng (7 ngày qua)</span>
        </h3>
        <div className="flex gap-4 text-[10px] font-bold text-text-main">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary-dark"></span> Calo
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent"></span> Protein
          </div>
          <div className="flex items-center gap-1">
            <span className="w-4 border-t border-dashed border-primary"></span> Mục tiêu
          </div>
        </div>
      </div>

      {/* Custom Responsive HTML/CSS Chart bars */}
      <div className="relative flex justify-between items-end h-56 pt-7 px-2">
        <div
          className="absolute left-2 right-2 border-t border-dashed border-primary/70"
          style={{ top: `${calorieTargetTop}%` }}
        >
          <span className="absolute -top-5 right-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
            {targetCalories} kcal/ngày
          </span>
        </div>
        <div
          className="absolute left-2 right-2 border-t border-dashed border-accent/80"
          style={{ top: `${proteinTargetTop}%` }}
        >
          <span className="absolute -bottom-5 right-0 rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold text-accent-dark">
            {targetProtein}g protein/ngày
          </span>
        </div>
        {weeklyTrend.map((t) => {
          const calPercent = Math.max(5, Math.min(100, Math.round((t.calories / chartMaxCalories) * 100)));
          const proPercent = Math.max(5, Math.min(100, Math.round((t.protein / chartMaxProtein) * 100)));

          return (
            <div key={t.day} className="flex flex-col items-center justify-end gap-2 flex-1 group h-full">
              <div className="flex items-end gap-1 h-full w-full justify-center relative">
                {/* Calo bar */}
                <div className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[9px] font-bold text-primary-dark whitespace-nowrap">{t.calories}</span>
                  <div
                    style={{ height: `${calPercent}%` }}
                    className="w-4 bg-primary-dark rounded-t-sm transition-all duration-500 ease-out shadow-sm"
                    title={`${t.calories} kcal`}
                  ></div>
                </div>
                {/* Pro bar */}
                <div className="flex h-full flex-col items-center justify-end gap-1">
                  <span className="text-[9px] font-bold text-accent-dark whitespace-nowrap">{t.protein}g</span>
                  <div
                    style={{ height: `${proPercent}%` }}
                    className="w-4 bg-accent rounded-t-sm transition-all duration-500 ease-out shadow-sm"
                    title={`${t.protein}g protein`}
                  ></div>
                </div>
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
