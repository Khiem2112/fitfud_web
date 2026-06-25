import React from 'react';
import { createPortal } from 'react-dom';

export const ReorderConfirmModal = ({ order, onConfirm, onClose }) => {
  if (!order) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm modal-overlay-enter">
      <div className="fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-bg-card p-6 shadow-2xl modal-enter relative text-center">
        <h2 className="text-lg font-extrabold text-text-main mb-2">Xác nhận đặt lại</h2>
        <p className="text-sm text-text-muted mb-6">
          Liệu bạn có muốn đặt lại đơn này không? Các sản phẩm trong đơn sẽ được ghi thêm vào giỏ hàng hiện tại của bạn và chuyển đến trang Menu.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border-light bg-bg-card py-3 text-xs font-bold text-text-main hover:bg-bg-main transition"
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(order)}
            className="flex-1 rounded-xl bg-primary py-3 text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
