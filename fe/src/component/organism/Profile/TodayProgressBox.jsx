import React from 'react';

export default function TodayProgressBox({ dashboardData }) {
  if (!dashboardData) return null;

  const caloriesPercent = Math.min(
    100,
    Math.round((dashboardData.today_calories_logged / dashboardData.target_calories) * 100)
  );
  
  const proteinPercent = Math.min(
    100,
    Math.round((dashboardData.today_protein_logged / dashboardData.target_protein) * 100)
  );

  return (
    <div className="bg-primary-dark text-white rounded-3xl p-6 shadow-premium relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">Hôm nay</span>
        <span className="text-[9px] bg-black/20 px-2 py-1 rounded-full font-bold">{caloriesPercent}% Hoàn thành</span>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold">{dashboardData.today_calories_logged.toLocaleString()}</span>
          <span className="text-sm opacity-80">/ {dashboardData.target_calories.toLocaleString()} kcal</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-wider mb-2 opacity-90">
          <span>Protein ({dashboardData.today_protein_logged}g/{dashboardData.target_protein}g)</span>
          <span>{proteinPercent}%</span>
        </div>
        <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-accent h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${proteinPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
