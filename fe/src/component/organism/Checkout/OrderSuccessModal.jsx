import React from 'react';
import { useNavigate } from 'react-router-dom';

export const OrderSuccessModal = ({ data, isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative bg-white rounded-2xl w-full max-w-[480px] flex flex-col shadow-premium-lg animate-fade-in-up p-8 items-center text-center"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Message Group */}
        <h2 className="text-2xl font-bold text-text-main mb-2">Đặt hàng thành công!</h2>
        <p className="text-text-muted mb-6">
          Cảm ơn bạn đã tin tưởng và sử dụng FitFud. Đơn hàng của bạn đang được xử lý.
        </p>

        {/* Order Details Badge */}
        <div className="bg-bg-main px-6 py-4 rounded-xl border border-border-light mb-8 w-full text-left">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-border-light border-dashed">
            <span className="text-sm font-bold text-text-muted">Mã đơn hàng</span>
            <span className="text-lg font-bold text-primary tracking-wider">#{data.order_code}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-text-muted">Dự kiến giao</span>
            <span className="text-sm font-bold text-text-main">{data.estimated_shipped_time}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => navigate(`/orders`)}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-colors"
          >
            Theo dõi đơn hàng
          </button>
          <button
            onClick={() => navigate('/menu')}
            className="w-full py-3.5 bg-white text-text-main font-bold rounded-xl border border-border-light hover:border-primary hover:text-primary transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  );
};
