import React, { useState, useEffect } from 'react';
import { OrderStatusBadge } from '../../atom/Orders/OrderStatusBadge';
import { useOrderDetail } from '../../../hook/useOrderDetail';
import { DishReviewModal } from './DishReviewModal';
import { getOrderReviews, createDishReview } from '../../../service/reviewService';
import { useToast } from '../../../context/ToastContext';

export const OrderDetailModal = ({ order: initialOrder, onClose, onReorder }) => {
  const { data: order, isLoading: loading, error } = useOrderDetail(initialOrder?.id);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewedDishIds, setReviewedDishIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (order?.id) {
      getOrderReviews(order.id).then(reviews => {
        setReviewedDishIds(reviews.map(r => r.dishId));
      });
    }
  }, [order?.id]);

  const handleReviewSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createDishReview({
        orderId: order.id,
        dishId: data.item.dish_id,
        rating: data.rating,
        comment: data.comment
      });
      setReviewedDishIds(prev => [...prev, data.item.dish_id]);
      setReviewingItem(null);
      addToast('Gửi đánh giá thành công', 'success');
    } catch (err) {
      addToast(err.message || 'Lỗi khi gửi đánh giá.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialOrder) return null;
  // If we have an error, we should still show the modal shell so the user can read the error and close it
  if (!loading && !order && !error) return null;

  const totalCalories = order?.totalCalories || 0;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm modal-overlay-enter" onClick={onClose}>
      <div className="flex items-stretch gap-3 h-[min(86vh,680px)] w-full max-w-[760px] justify-center">

        {/* Left: Order Detail Panel */}
        <div
          className="w-full max-w-[420px] rounded-2xl bg-bg-card shadow-2xl modal-enter relative overflow-hidden flex flex-col h-full"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-border-light/80 shrink-0">
            <h2 className="text-base font-bold text-text-main flex items-center gap-2">
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
          <div className="p-4 pb-3 flex flex-col flex-1 min-h-0 overflow-hidden">
            {error && (
              <div className="rounded-[12px] bg-red-100 border border-red-200 p-4 mb-4 text-[14px] font-medium text-red-600 shrink-0">
                {error.message || 'Lỗi khi tải dữ liệu đơn hàng.'}
              </div>
            )}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : !error && order ? (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Order Info */}
                <div className="flex justify-between items-start mb-4 shrink-0">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider mb-1">MÃ ĐƠN HÀNG</p>
                    <h3 className="font-extrabold text-primary text-base">#{order.order_code}</h3>
                  </div>
                  <div className="h-fit">
                    <OrderStatusBadge status={order.order_status} />
                  </div>
                </div>

                {/* Additional Details grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4 p-3 rounded-xl bg-bg-main border border-border-light shrink-0">
                  <div>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Thời gian giao</p>
                    <p className="text-xs font-bold text-text-main">{order.estimated_shipped_time?.split('T')[0] || '11:30, Hôm nay'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Thanh toán</p>
                    <p className="text-xs font-bold text-text-main">{order.payment_method || 'Thanh toán tiền mặt'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-1">Tổng lượng Calo</p>
                    <p className="text-xs font-bold text-primary">
                      {totalCalories > 0 ? totalCalories : 'Đang tính...'} kcal
                    </p>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex flex-col flex-1 min-h-0">
                  <p className="text-sm font-bold text-text-main mb-2 shrink-0">Danh sách món ăn</p>
                  <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-[#F5F5F5] rounded-xl p-2.5 border border-border-light/50">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.dish_name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-border-light flex items-center justify-center">
                            <span className="text-[10px] text-text-muted">Ảnh</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-text-main text-xs truncate">{item.dish_name}</p>
                          <p className="text-[11px] text-text-muted mt-0.5">
                            {item.quantity} x {item.unit_price.toLocaleString()}đ <span className="mx-1">•</span> Size: {item.size_name}
                          </p>
                        </div>

                        {order.order_status === 'Completed' && !reviewedDishIds.includes(item.dish_id) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setReviewingItem(item); }}
                            className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition flex items-center gap-1 shadow-sm shrink-0"
                          >
                            ★ Đánh giá
                          </button>
                        )}
                        {order.order_status === 'Completed' && reviewedDishIds.includes(item.dish_id) && (
                          <span className="text-xs font-bold text-primary px-4 py-2 bg-primary/10 rounded-lg shrink-0 flex items-center gap-1">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Đã đánh giá
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t border-dashed border-border-light pt-3 mt-3 shrink-0">
                  <div className="flex justify-between text-sm font-bold text-text-main">
                    <span>Tổng tiền</span>
                    <span className="text-[#925C19] font-extrabold">{order.total_amount.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="p-4 pt-0 mt-2 bg-bg-card shrink-0">
            <button
              onClick={() => onReorder(order)}
              disabled={loading || !!error || !order}
              className="w-full rounded-xl bg-[#925C19] py-2.5 text-xs font-bold text-white shadow-premium hover:bg-[#7a4c14] transition disabled:opacity-50"
            >
              Đặt lại đơn này
            </button>
          </div>

        </div>

        {/* Right: Dish Review Panel */}
        {reviewingItem && (
          <DishReviewModal
            item={reviewingItem}
            onClose={() => setReviewingItem(null)}
            onSubmit={handleReviewSubmit}
          />
        )}
      </div>
    </div>
  );
};
