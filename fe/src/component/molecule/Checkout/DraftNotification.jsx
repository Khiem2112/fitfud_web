import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCheckoutDraft, useHasDraft } from '../../../hook/useCheckoutDraft';

export const DraftNotification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearDraft } = useCheckoutDraft();
  const hasDraft = useHasDraft();

  // Do not show on the checkout page itself or if there is no draft
  if (location.pathname === '/checkout' || !hasDraft) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 pointer-events-none px-4">
      <div className="pointer-events-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-[12px] bg-primary-dark p-[16px] text-white shadow-premium-lg animate-bounce sm:animate-none">
        <div className="flex items-center gap-3">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-white/20">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-be-vietnam text-[14px] font-bold">
              Đơn hàng đang chờ thanh toán
            </span>
            <span className="font-be-vietnam text-[12px] font-normal text-white/80">
              Bạn có đơn hàng chưa hoàn tất.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => clearDraft()}
            className="flex h-[36px] items-center justify-center rounded-[8px] px-[12px] font-be-vietnam text-[14px] font-medium text-white transition hover:bg-white/10"
          >
            Bỏ qua
          </button>
          <button
            onClick={() => navigate('/checkout')}
            className="flex h-[36px] items-center justify-center rounded-[8px] bg-accent-base px-[16px] font-be-vietnam text-[14px] font-bold text-white transition hover:bg-accent-dark"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};
