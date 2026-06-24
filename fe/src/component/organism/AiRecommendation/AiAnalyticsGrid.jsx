import React from 'react';

export default function AiAnalyticsGrid({ dashboardData, profile }) {
  if (!dashboardData || !profile) return null;

  // Derived logic for percentages (mocking carb/fat since it's not fully in dashboardData)
  const caloriesPercent = Math.min(100, Math.round((dashboardData.today_calories_logged / dashboardData.target_calories) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((dashboardData.today_protein_logged / dashboardData.target_protein) * 100)) || 0;
  
  // Mock carb and fat target if not present, assume some defaults
  const carbPercent = 40;
  const fatPercent = 80;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {/* Calories Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-4 right-4 text-gray-300 opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
        </div>
        <h3 className="text-[10px] font-bold text-text-muted tracking-widest uppercase mb-4">Mục tiêu hằng ngày</h3>
        
        {/* Circle Progress */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" 
              strokeDasharray={351.8} 
              strokeDashoffset={351.8 - (351.8 * caloriesPercent) / 100} 
              className="text-[#12563F] transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-[#12563F] leading-none">{dashboardData.target_calories.toLocaleString()}</span>
            <span className="text-[10px] text-text-muted font-bold mt-1 uppercase">Kcal</span>
          </div>
        </div>

        <p className="mt-4 text-[11px] font-bold text-[#12563F]">Trạng thái: Tối ưu</p>
      </div>

      {/* Macro Cards */}
      <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Protein */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-between border-l-4 border-l-[#12563F]">
          <div>
            <div className="flex items-center gap-2 text-[#12563F] mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v18M18 3v18M3 6h6M3 18h6M15 6h6M15 18h6M6 12h12"></path></svg>
            </div>
            <h4 className="text-sm font-bold text-text-main">Protein</h4>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-extrabold text-[#12563F]">{dashboardData.target_protein}g</span>
              <span className="text-[10px] text-text-muted font-bold">{proteinPercent}% mục tiêu</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#12563F] rounded-full" style={{ width: `${proteinPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-between border-l-4 border-l-orange-400">
          <div>
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 22h20L12 2z"></path></svg>
            </div>
            <h4 className="text-sm font-bold text-text-main">Carbohydrates</h4>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-extrabold text-orange-400">200g</span>
              <span className="text-[10px] text-text-muted font-bold">{carbPercent}% mục tiêu</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full" style={{ width: `${carbPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Chất béo */}
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-between border-l-4 border-l-gray-600">
          <div>
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"></path></svg>
            </div>
            <h4 className="text-sm font-bold text-text-main">Chất béo</h4>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-extrabold text-gray-700">50g</span>
              <span className="text-[10px] text-text-muted font-bold">{fatPercent}% mục tiêu</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gray-600 rounded-full" style={{ width: `${fatPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
