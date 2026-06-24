import React from 'react';

export default function NutritionChartGrid({ weeklyTrend }) {
  if (!weeklyTrend || weeklyTrend.length === 0) return null;

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
      <div className="flex justify-between items-end h-44 pt-4 px-2">
        {weeklyTrend.map((t) => {
          // Dummy logic to show 2 bars per day to mimic Figma
          const calPercent = Math.min(100, Math.round((t.calories / 2500) * 100));
          const proPercent = Math.min(100, Math.round((t.calories * 0.4 / 2500) * 100)); // just a dummy mock for the second bar
          
          return (
            <div key={t.day} className="flex flex-col items-center gap-2 flex-1 group">
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
      
      {/* Legend below the chart */}
      <div className="flex justify-center gap-4 text-[9px] font-bold text-text-muted mt-2 border-t border-border-light pt-4">
         <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary-dark rounded-sm"></span> Calo
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-accent rounded-sm"></span> Protein
          </div>
      </div>
    </div>
  );
}
