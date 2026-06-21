import React from 'react';

export const BankTransferInfo = () => {
  return (
    <div className="flex flex-col gap-4 p-4 mt-2 bg-primary/5 border border-primary/20 rounded-xl">
      <div className="flex gap-4 items-start">
        {/* QR Code Placeholder */}
        <div className="w-[120px] h-[120px] bg-white rounded-lg p-2 border border-border-light shadow-sm flex items-center justify-center shrink-0">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          {/* In a real app, this would be an actual QR Code image */}
        </div>
        
        {/* Bank Details */}
        <div className="flex flex-col gap-2 flex-1">
          <h3 className="text-sm font-bold text-text-main">Thông tin chuyển khoản</h3>
          
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between border-b border-border-light pb-1">
              <span className="text-text-muted">Ngân hàng:</span>
              <span className="font-bold text-text-main">Vietcombank</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-1">
              <span className="text-text-muted">Chủ tài khoản:</span>
              <span className="font-bold text-text-main">NGUYEN VAN A</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-1">
              <span className="text-text-muted">Số tài khoản:</span>
              <span className="font-bold text-text-main">0123456789</span>
            </div>
            <div className="flex justify-between border-b border-border-light pb-1">
              <span className="text-text-muted">Nội dung:</span>
              <span className="font-bold text-primary">FITFUD [SĐT CỦA BẠN]</span>
            </div>
          </div>
          
          <p className="text-xs text-text-muted mt-1 italic">
            * Vui lòng chuyển khoản đúng nội dung để chúng tôi xác nhận nhanh nhất.
          </p>
        </div>
      </div>
    </div>
  );
};
