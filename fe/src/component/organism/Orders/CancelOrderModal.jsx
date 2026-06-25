import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const CancelOrderModal = ({ 
  order, 
  onClose, 
  onConfirm 
}) => {
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOtp = () => {
    setCountdown(60);
    // Add resend logic here if needed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode) {
      onConfirm(otpCode);
    }
  };

  if (!order) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm modal-overlay-enter">
      <div className="fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-bg-card p-6 shadow-2xl modal-enter relative text-center">
        <h2 className="text-lg font-extrabold text-text-main mb-2">Xác nhận hủy đơn</h2>
        <p className="text-xs text-text-muted mb-6">
          Chúng tôi đã gửi mã OTP gồm 4 số đến số điện thoại <span className="font-bold text-text-main">{order.contact_phone}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-3">
            <input
              type="text"
              maxLength="4"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full text-center tracking-[1em] text-lg font-bold rounded-xl border border-border-light bg-bg-main px-4 py-3 focus:border-primary focus:outline-none transition"
              placeholder="----"
            />
          </div>

          <div className="text-xs text-center mt-2">
            <button 
              type="button" 
              onClick={handleResendOtp} 
              disabled={countdown > 0}
              className={`font-bold transition ${countdown > 0 ? 'text-text-muted cursor-not-allowed' : 'text-primary hover:underline'}`}
            >
              Gửi lại mã OTP {countdown > 0 ? `(${countdown}s)` : ''}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border-light bg-bg-card py-3 text-xs font-bold text-text-main hover:bg-bg-main transition"
            >
              Bỏ qua
            </button>
            <button
              type="submit"
              disabled={!otpCode}
              className="flex-1 rounded-xl bg-danger py-3 text-xs font-bold text-white shadow hover:bg-danger/90 transition disabled:opacity-50"
            >
              Xác nhận hủy
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
