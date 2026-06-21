import React from 'react';
import { OrderTimeline } from '../../molecule/Orders/OrderTimeline';

export const ActiveOrderPanel = ({ order, onViewDetail, onCancel }) => {
  const isCancelled = order.order_status === 'Cancelled';

  const containerClass = isCancelled
    ? 'rounded-2xl border border-danger/30 bg-danger/10 p-6 shadow-premium cursor-pointer hover:opacity-95 transition relative overflow-hidden'
    : 'rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium cursor-pointer hover:opacity-95 transition';

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold text-text-main">Đơn hàng hiện tại</h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isCancelled ? 'text-danger bg-danger/10' : 'text-primary bg-primary/10'}`}>
          {isCancelled ? '1 đơn hàng đã hủy' : '1 đơn hàng đang xử lý'}
        </span>
      </div>
      <div 
        className={containerClass}
        onClick={() => onViewDetail(order)}
      >
        
        <div className="flex flex-col lg:flex-row items-center gap-6 justify-between relative z-10">
          
          {/* Left: Order Info */}
          <div className="flex items-center gap-4">
            {(order.first_item_image || (order.items && order.items[0]?.image_url)) ? (
              <img src={order.first_item_image || order.items[0].image_url} alt="Order item" className={`w-24 h-24 rounded-xl object-cover ${isCancelled ? 'grayscale opacity-70' : ''}`} />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-border-light flex items-center justify-center">
                <span className="text-xs text-text-muted">Ảnh</span>
              </div>
            )}
            
            <div className="flex flex-col justify-center h-24 py-1">
              <div>
                <p className="text-[10px] text-text-muted uppercase font-bold mb-1">ẤN ĐỂ XEM CHI TIẾT ĐƠN HÀNG</p>
                <h3 className={`font-extrabold text-lg ${isCancelled ? 'text-danger line-through opacity-80' : 'text-text-main'}`}>
                  Mã đơn: {order.order_code}
                </h3>
              </div>
              <p className="text-xs text-text-muted mt-auto">
                Dự kiến giao: <span className="font-bold text-text-main">{order.estimated_shipped_time?.split('T')[0] || '11:30, Hôm nay'}</span>
              </p>
            </div>
          </div>

          {/* Middle: Timeline */}
          <div className="flex-1 w-full max-w-lg px-4">
            <OrderTimeline status={order.order_status} />
          </div>

          {/* Right: Cancel button */}
          <div className="flex-shrink-0">
            {(order.order_status === 'Pending' || order.order_status === 'Confirmed') ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(order);
                }}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white hover:bg-primary-dark transition shadow-sm"
              >
                Hủy đơn
              </button>
            ) : (
              <div className="w-[100px]"></div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
