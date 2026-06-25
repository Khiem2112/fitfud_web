import React, { useState } from 'react';

export default function ProfileCard({ dashboardData, onChangePassword, onUpdateHealth }) {
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [weight, setWeight] = useState(dashboardData?.weight || '');
  const [height, setHeight] = useState(dashboardData?.height || '');

  if (!dashboardData) return null;

  const handleSaveHealth = async () => {
    await onUpdateHealth({ weight: Number(weight), height: Number(height) });
    setIsEditingHealth(false);
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-2xl p-4 shadow-premium flex flex-col items-center text-center space-y-3 relative">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-sm">
          {dashboardData.avatar ? (
            <img src={dashboardData.avatar} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <i className="bi bi-person text-4xl leading-none text-primary" aria-hidden="true" />
          )}
        </div>
        <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary-dark transition text-xs">
          <i className="bi bi-pencil" aria-hidden="true" />
        </button>
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-text-main">{dashboardData.fullName}</h2>
      </div>

      <button
        onClick={onChangePassword}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition"
      >
        <i className="bi bi-arrow-clockwise text-sm leading-none" aria-hidden="true" />
        <span>Đổi mật khẩu</span>
      </button>

      <div className="grid grid-cols-2 gap-2 w-full pt-2">
        <div className="bg-bg-main rounded-xl p-2.5 flex flex-col items-center">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Cân nặng</span>
          {isEditingHealth ? (
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 w-20 rounded-lg border border-border-light bg-white px-2 py-1 text-center text-sm font-bold text-text-main"
            />
          ) : (
            <div className="text-sm font-extrabold text-text-main mt-0.5">
              {dashboardData.weight} <span className="text-[10px] font-bold">kg</span>
            </div>
          )}
        </div>
        <div className="bg-bg-main rounded-xl p-2.5 flex flex-col items-center">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Chiều cao</span>
          {isEditingHealth ? (
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 w-20 rounded-lg border border-border-light bg-white px-2 py-1 text-center text-sm font-bold text-text-main"
            />
          ) : (
            <div className="text-sm font-extrabold text-text-main mt-0.5">
              {dashboardData.height} <span className="text-[10px] font-bold">cm</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex w-full gap-2">
        {isEditingHealth ? (
          <>
            <button
              type="button"
              onClick={() => setIsEditingHealth(false)}
              className="flex-1 rounded-xl border border-border-light py-2 text-xs font-bold text-text-muted hover:bg-bg-main"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSaveHealth}
              className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-white hover:bg-primary-dark"
            >
              Lưu chỉ số
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditingHealth(true)}
            className="w-full rounded-xl border border-primary/30 py-2 text-xs font-bold text-primary hover:bg-primary/5"
          >
            <i className="bi bi-pencil-square mr-1" aria-hidden="true" />
            Chỉnh chiều cao/cân nặng
          </button>
        )}
      </div>
    </div>
  );
}
