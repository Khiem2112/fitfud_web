import React from 'react';
import { OrderStatusBadge } from '../../atom/Orders/OrderStatusBadge';

export const PastOrderCard = ({ order, onViewDetail, onReorder }) => {
  return (
    <div className="rounded-2xl border border-border-light bg-bg-card p-4 shadow-premium flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      
      {/* Left side: Image and Info */}
      <div className="flex items-center gap-4 flex-1">
        {(order.first_item_image || (order.items && order.items[0]?.image_url)) ? (
          <img src={order.first_item_image || order.items[0].image_url} alt={order.first_item_name || 'Order item'} className="w-[72px] h-[72px] rounded-xl object-cover" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-xl bg-border-light flex items-center justify-center">
            <span className="text-[10px] text-text-muted">Ảnh</span>
          </div>
        )}
        
        <div className="flex flex-col justify-center h-[72px] py-1">
          <p className="text-[10px] text-text-muted font-bold mb-1">
            {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
          <h4 className="text-base font-bold text-text-main">Đơn hàng #{order.order_code}</h4>
          
          <div className="flex items-center gap-2 mt-auto">
            <OrderStatusBadge status={order.order_status} />
            <p className="text-xs text-text-muted font-bold">
              {order.items_count || order.items?.length || 0} món • {order.total_amount.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => onViewDetail(order)}
          className="flex-1 sm:flex-none rounded-xl border border-border-light bg-bg-card px-6 py-2.5 text-sm font-bold text-text-main hover:bg-bg-main transition"
        >
          Xem chi tiết
        </button>
        <button
          onClick={() => onReorder(order)}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-[#925C19] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#7a4c14] transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
          Đặt lại
        </button>
      </div>

    </div>
  );
};
