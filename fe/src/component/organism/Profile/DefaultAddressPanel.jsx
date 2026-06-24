import React from 'react';

export default function DefaultAddressPanel({ defaultAddress, onChangeAddress }) {
  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-4">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
        <span>📍</span> Địa chỉ giao hàng
      </h3>
      
      {defaultAddress ? (
        <div className="border border-border-light rounded-xl p-4 bg-[#F8FAFC] relative">
          <div className="flex items-center gap-2 mb-2">
            <p className="font-extrabold text-xs text-text-main">{defaultAddress.receiver_name || 'Nhà riêng'}</p>
            <span className="rounded bg-primary-dark text-[8px] font-extrabold text-white px-2 py-0.5 tracking-widest">
              MẶC ĐỊNH
            </span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            {defaultAddress.full_address}
          </p>
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed border-border-light rounded-xl bg-bg-main">
          <p className="text-xs text-text-muted mb-2">Chưa có địa chỉ mặc định</p>
        </div>
      )}

      <button 
        onClick={onChangeAddress}
        className="w-full rounded-xl border border-primary-dark py-2.5 text-xs font-bold text-primary-dark hover:bg-bg-main transition"
      >
        <span>📍</span> Đổi địa chỉ
      </button>
    </div>
  );
}
