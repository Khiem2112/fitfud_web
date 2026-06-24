import React from 'react';

export default function ProfileCard({ dashboardData, onChangePassword }) {
  if (!dashboardData) return null;

  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium flex flex-col items-center text-center space-y-4 relative">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-sm">
          {dashboardData.avatar ? (
            <img src={dashboardData.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            '👩‍💼'
          )}
        </div>
        <button className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary-dark transition text-[10px]">
          ✏️
        </button>
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-text-main">{dashboardData.fullName}</h2>
      </div>

      <button
        onClick={onChangePassword}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition"
      >
        <span>🔄</span> Đổi mật khẩu
      </button>

      <div className="grid grid-cols-2 gap-3 w-full pt-4">
        <div className="bg-bg-main rounded-xl p-3 flex flex-col items-center">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Cân nặng</span>
          <div className="text-sm font-extrabold text-text-main mt-0.5">
            {dashboardData.weight} <span className="text-[10px] font-bold">kg</span>
          </div>
        </div>
        <div className="bg-bg-main rounded-xl p-3 flex flex-col items-center">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Chiều cao</span>
          <div className="text-sm font-extrabold text-text-main mt-0.5">
            {dashboardData.height} <span className="text-[10px] font-bold">cm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
