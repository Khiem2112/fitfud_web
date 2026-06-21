import React from 'react';
import { OrderStatusBadge } from '../../atom/Orders/OrderStatusBadge';
import { useOrderDetail } from '../../../hook/useOrderDetail';

export const OrderDetailModal = ({ order: initialOrder, onClose, onReorder }) => {
  const { data: order, isLoading: loading, error } = useOrderDetail(initialOrder?.id);

  if (!initialOrder) return null;
  // If we have an error, we should still show the modal shell so the user can read the error and close it
  if (!loading && !order && !error) return null;

  const totalCalories = order?.totalCalories || 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-overlay-enter">
      <div className="w-full max-w-md rounded-3xl bg-bg-card shadow-2xl modal-enter relative overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border-light/80 shrink-0">
          <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Chi tiết đơn hàng
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main transition p-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="rounded-[12px] bg-red-100 border border-red-200 p-4 mb-4 text-[14px] font-medium text-red-600">
              {error.message || 'Lỗi khi tải dữ liệu đơn hàng.'}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : !error && order ? (
            <>
              {/* Order Info */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">MÃ ĐƠN HÀNG</p>
                  <h3 className="font-extrabold text-primary text-lg">#{order.order_code}</h3>
                </div>
                <div className="h-fit">
                  <OrderStatusBadge status={order.order_status} />
                </div>
              </div>

              {/* Additional Details grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 mb-6 p-4 rounded-xl bg-bg-main border border-border-light">
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Thời gian giao</p>
                  <p className="text-sm font-bold text-text-main">{order.estimated_shipped_time?.split('T')[0] || '11:30, Hôm nay'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Thanh toán</p>
                  <p className="text-sm font-bold text-text-main">{order.payment_method || 'Thanh toán tiền mặt'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Tổng lượng Calo</p>
                  <p className="text-sm font-bold text-primary">
                    {totalCalories > 0 ? totalCalories : 'Đang tính...'} kcal
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-8">
                <p className="text-sm text-text-main mb-2">Danh sách món ăn</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-[#F5F5F5] rounded-xl p-3 border border-border-light/50">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.dish_name} className="w-16 h-16 rounded-xl object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-border-light flex items-center justify-center">
                        <span className="text-[10px] text-text-muted">Ảnh</span>
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-bold text-text-main text-sm">{item.dish_name}</p>
                      <p className="text-xs text-text-muted mt-1">
                        {item.quantity} x {item.unit_price.toLocaleString()}đ <span className="mx-1">•</span> Size: {item.size_name}
                      </p>
                    </div>

                    <button className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition flex items-center gap-1 shadow-sm shrink-0">
                      ★ Đánh giá
                    </button>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-dashed border-border-light pt-6 space-y-4">
                <div className="flex justify-between text-base font-bold text-text-main">
                  <span>Tổng tiền</span>
                  <span className="text-[#925C19] font-extrabold">{order.total_amount.toLocaleString()}đ</span>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-4 bg-bg-card shrink-0">
          <button
            onClick={() => onReorder(order)}
            disabled={loading || !!error || !order}
            className="w-full rounded-xl bg-[#925C19] py-3.5 text-sm font-bold text-white shadow-premium hover:bg-[#7a4c14] transition disabled:opacity-50"
          >
            Đặt lại đơn này
          </button>
        </div>

      </div>
    </div>
  );
};
