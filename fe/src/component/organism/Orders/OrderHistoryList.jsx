import React from 'react';
import { PastOrderCard } from '../../molecule/Orders/PastOrderCard';

export const OrderHistoryList = ({ orders, onViewDetail, onReorder }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border-light bg-bg-card p-6 text-center text-text-muted text-xs shadow-sm">
        Bạn chưa có đơn hàng nào trong lịch sử.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <PastOrderCard
          key={order.id}
          order={order}
          onViewDetail={onViewDetail}
          onReorder={onReorder}
        />
      ))}
    </div>
  );
};
