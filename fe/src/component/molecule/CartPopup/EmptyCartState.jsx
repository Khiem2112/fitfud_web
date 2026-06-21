import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmptyCartState = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-3 text-center">
      <span className="text-4xl">🥗</span>
      <p className="text-sm font-medium text-text-muted">Giỏ hàng của bạn đang trống.</p>
      <button
        onClick={() => {
          onClose();
          navigate('/');
        }}
        className="mt-2 text-xs font-semibold text-primary hover:underline"
      >
        Xem thực đơn ngay
      </button>
    </div>
  );
};
