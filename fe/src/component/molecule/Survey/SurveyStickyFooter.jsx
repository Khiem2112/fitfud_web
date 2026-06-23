import React from 'react';
import { createPortal } from 'react-dom';

export const SurveyStickyFooter = ({ onSkip }) => {
  const footerContent = (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-border-light shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-[100]">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Content */}
        <div className="text-left flex-1 hidden sm:block">
          <h3 className="text-sm font-bold text-text-main">Hầu hết các trường hợp hoàn thành trong 2 phút.</h3>
          <p className="text-xs text-text-muted mt-0.5">Bằng cách tiếp tục, bạn đồng ý với Điều khoản của chúng tôi.</p>
        </div>
        
        {/* Right Buttons */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="flex-1 sm:flex-none rounded-xl border border-border-light bg-white px-6 py-3.5 text-sm font-bold text-text-main hover:bg-bg-main transition"
          >
            Bỏ qua và khám phá thực đơn
          </button>
          <button
            type="submit"
            form="survey-form"
            className="flex-1 sm:flex-none rounded-xl bg-[#F59E0B] px-8 py-3.5 text-sm font-bold text-white shadow-premium hover:bg-[#D97706] transition flex items-center justify-center gap-2"
          >
            Hoàn tất khảo sát <span className="text-lg leading-none">✨</span>
          </button>
        </div>

      </div>
    </div>
  );

  return createPortal(footerContent, document.body);
};
