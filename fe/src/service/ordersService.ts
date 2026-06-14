import { OrderDetail, OrderStatus } from '../type/orders.types';

const ORDERS_KEY = 'fitfud_orders';

const getMockInitialOrders = (userId: string): OrderDetail[] => {
  return [
    {
      id: 'ord_active_1',
      order_code: 'FF9921',
      order_status: 'Preparing', // Match Figma active order
      total_amount: 145000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
      estimated_shipped_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      items: [
        {
          dish_name: 'Salad Cá Hồi Áp Chảo',
          size_name: 'L',
          quantity: 1,
          unit_price: 145000,
          subtotal: 145000
        }
      ],
      tracking_logs: [
        { status: 'Pending', logged_at: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { status: 'Confirmed', logged_at: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
        { status: 'Preparing', logged_at: new Date(Date.now() - 20 * 60 * 1000).toISOString() }
      ],
      payment_method: 'Online',
      payment_status: 'Paid'
    },
    {
      id: 'ord_past_1',
      order_code: 'FF036',
      order_status: 'Completed',
      total_amount: 145000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      items: [
        {
          dish_name: 'Salad Cá Hồi Áp Chảo',
          size_name: 'L',
          quantity: 1,
          unit_price: 145000,
          subtotal: 145000
        }
      ],
      tracking_logs: [
        { status: 'Pending', logged_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { status: 'Completed', logged_at: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString() }
      ],
      payment_method: 'COD',
      payment_status: 'Paid'
    },
    {
      id: 'ord_past_2',
      order_code: 'FF034',
      order_status: 'Completed',
      total_amount: 210000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      items: [
        {
          dish_name: 'Ức Gà Nướng',
          size_name: 'M',
          quantity: 1,
          unit_price: 85000,
          subtotal: 85000
        },
        {
          dish_name: 'Salad Cá Hồi',
          size_name: 'L',
          quantity: 1,
          unit_price: 125000,
          subtotal: 125000
        }
      ],
      tracking_logs: [
        { status: 'Pending', logged_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'Completed', logged_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString() }
      ],
      payment_method: 'Online',
      payment_status: 'Paid'
    },
    {
      id: 'ord_past_3',
      order_code: 'FF01',
      order_status: 'Cancelled',
      total_amount: 85000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          dish_name: 'Ức Gà Nướng',
          size_name: 'M',
          quantity: 1,
          unit_price: 85000,
          subtotal: 85000
        }
      ],
      tracking_logs: [
        { status: 'Pending', logged_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { status: 'Cancelled', logged_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString() }
      ],
      payment_method: 'COD',
      payment_status: 'Failed'
    }
  ];
};

export const getUserOrders = async (userId: string): Promise<OrderDetail[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stored = localStorage.getItem(ORDERS_KEY);
  if (!stored) {
    const initial = getMockInitialOrders(userId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(initial));
    return initial;
  }

  const allOrders: any[] = JSON.parse(stored);
  return allOrders.filter((o) => o.userId === userId || !o.userId); // Show mock template orders too
};

export const lookupGuestOrders = async (phone: string): Promise<OrderDetail[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const stored = localStorage.getItem(ORDERS_KEY);
  const allOrders: any[] = stored ? JSON.parse(stored) : getMockInitialOrders('default');

  // Filter orders matching the phone number
  return allOrders.filter((o) => o.contact_phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));
};

export const requestCancelOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const stored = localStorage.getItem(ORDERS_KEY);
  const orders: any[] = stored ? JSON.parse(stored) : [];
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng!');
  }

  // Figma Business Logic: Cannot cancel once Cooking (Preparing) or later
  if (order.order_status !== 'Pending' && order.order_status !== 'Confirmed') {
    return {
      success: false,
      message: 'Đơn hàng này không thể hủy vì đang trong quá trình chế biến. Chúng tôi cam kết mang đến bữa ăn tươi ngon nhất nên quy trình chuẩn bị đã được bắt đầu ngay lập tức.'
    };
  }

  return {
    success: true,
    message: 'OTP_SENT'
  };
};

export const confirmCancelOrder = async (orderId: string, otpCode: string): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (otpCode !== '1234') {
    throw new Error('Mã OTP không đúng! Vui lòng thử lại với mã OTP thử nghiệm: 1234');
  }

  const stored = localStorage.getItem(ORDERS_KEY);
  const orders: any[] = stored ? JSON.parse(stored) : [];
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng!');
  }

  // Update order status to Cancelled
  order.order_status = 'Cancelled';
  order.tracking_logs.push({
    status: 'Cancelled',
    logged_at: new Date().toISOString()
  });

  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  return {
    success: true,
    message: 'Hủy đơn hàng thành công!'
  };
};
