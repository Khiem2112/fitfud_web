import React from 'react';

export const translateStatus = (status) => {
  const map = {
    'Pending': 'Chờ xác nhận',
    'Confirmed': 'Đã xác nhận',
    'Preparing': 'Đang chế biến',
    'Delivering': 'Đang giao',
    'Completed': 'Hoàn thành',
    'Cancelled': 'Đã hủy'
  };
  return map[status] || status;
};

export const OrderStatusBadge = ({ status }) => {
  const getBadgeStyle = (s) => {
    switch (s) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Preparing':
        return 'bg-orange-100 text-orange-800';
      case 'Delivering':
        return 'bg-indigo-100 text-indigo-800';
      case 'Completed':
        return 'bg-[#E8F3ED] text-primary border border-primary/20';
      case 'Cancelled':
        return 'bg-danger-light text-danger border border-danger/20';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase ${getBadgeStyle(status)}`}>
      {translateStatus(status)}
    </span>
  );
};
