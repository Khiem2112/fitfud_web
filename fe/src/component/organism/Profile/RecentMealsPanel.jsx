import React from 'react';

export default function RecentMealsPanel({ recentMeals }) {
  if (!recentMeals || recentMeals.length === 0) {
    return <p className="text-[10px] text-text-muted italic text-center py-4">Chưa ghi nhận bữa ăn nào hôm nay.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {recentMeals.map((log) => (
        <div key={log.id} className="flex items-center gap-3 bg-bg-main p-4 rounded-2xl border border-border-light shadow-sm">
          <div className="h-10 w-10 bg-white border border-border-light rounded-xl flex items-center justify-center text-primary text-xl flex-shrink-0">
            🍔
          </div>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <p className="font-extrabold text-xs text-text-main leading-tight">{log.dish_name}</p>
              <p className="text-[10px] text-text-muted mt-0.5">
                {new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Hôm nay
              </p>
            </div>
            <div className="text-right flex flex-col items-end pl-2">
              <span className="font-extrabold text-primary-dark text-sm leading-tight">{log.calories}</span>
              <span className="text-[10px] font-bold text-primary-dark">kcal</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
