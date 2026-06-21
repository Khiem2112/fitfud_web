import { OrderDetail, OrderStatus, OrderHistorySummary } from '../type/orders.types';

const ORDERS_KEY = 'fitfud_orders';

const getMockInitialOrders = (userId: string): OrderDetail[] => {
  return [
    {
      id: 'ord_active_1',
      order_code: 'FF9921',
      order_status: 'Preparing', // Match Figma active order
      total_amount: 114000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
      estimated_shipped_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      items: [
        {
          dish_id: 'dish_1',
          dish_name: 'Cơm cá hồi áp chảo',
          size_name: 'L',
          quantity: 1,
          unit_price: 114000,
          subtotal: 114000,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
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
      total_amount: 114000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      items: [
        {
          dish_id: 'dish_1',
          dish_name: 'Cơm cá hồi áp chảo',
          size_name: 'L',
          quantity: 1,
          unit_price: 114000,
          subtotal: 114000,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
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
      total_amount: 214000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      items: [
        {
          dish_id: 'dish_2',
          dish_name: 'Cơm gà gạo lứt',
          size_name: 'L',
          quantity: 1,
          unit_price: 89000,
          subtotal: 89000,
          image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_55nsrg0LXovyH5MSSz6LaNVrGZdzqFHD0JS_sszQFJwN3fL9XndBRZ0&s=10'
        },
        {
          dish_id: 'dish_5',
          dish_name: 'Salmon Poke Bowl',
          size_name: 'M',
          quantity: 1,
          unit_price: 125000,
          subtotal: 125000,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
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
      total_amount: 74000,
      contact_name: 'Nguyễn Minh Tuấn',
      contact_phone: '0901234567',
      shipping_address: '123 Đường ABC, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          dish_id: 'dish_2',
          dish_name: 'Cơm gà gạo lứt',
          size_name: 'M',
          quantity: 1,
          unit_price: 74000,
          subtotal: 74000,
          image_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_55nsrg0LXovyH5MSSz6LaNVrGZdzqFHD0JS_sszQFJwN3fL9XndBRZ0&s=10'
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

export const getOrderDetail = async (orderId: string): Promise<OrderDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const stored = localStorage.getItem(ORDERS_KEY);
  const allOrders: OrderDetail[] = stored ? JSON.parse(stored) : getMockInitialOrders('default');

  const order = allOrders.find(o => o.id === orderId);
  if (!order) throw new Error('Không tìm thấy đơn hàng');
  return order;
};

export const getUserOrders = async (userId: string): Promise<{ activeOrder: OrderHistorySummary | null, historyOrders: OrderHistorySummary[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const stored = localStorage.getItem(ORDERS_KEY);
  let allOrders: OrderDetail[] = [];

  if (!stored) {
    allOrders = getMockInitialOrders(userId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(allOrders));
  } else {
    allOrders = JSON.parse(stored);
  }

  const userOrders = allOrders.filter((o) => (o as any).userId === userId || !(o as any).userId);

  // Sort descending by created_at (newest first)
  userOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Convert OrderDetail to OrderHistorySummary
  const summaryOrders: OrderHistorySummary[] = userOrders.map(o => ({
    id: o.id,
    order_code: o.order_code,
    order_status: o.order_status,
    total_amount: o.total_amount,
    created_at: o.created_at,
    items_count: o.items.length,
    first_item_name: o.items[0]?.dish_name || '',
    first_item_image: o.items[0]?.image_url || '',
    estimated_shipped_time: o.estimated_shipped_time
  }));

  // Logic: Active order is the newest order ONLY IF it is not completed or cancelled
  let activeOrder = null;
  let historyOrders = summaryOrders;

  if (summaryOrders.length > 0) {
    const newestOrder = summaryOrders[0];
    if (newestOrder.order_status !== 'Completed' && newestOrder.order_status !== 'Cancelled') {
      activeOrder = newestOrder;
      historyOrders = summaryOrders.slice(1); // The rest goes to history
    }
  }

  return { activeOrder, historyOrders };
};

export const lookupGuestOrders = async (phone: string): Promise<OrderHistorySummary[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const stored = localStorage.getItem(ORDERS_KEY);
  const allOrders: OrderDetail[] = stored ? JSON.parse(stored) : getMockInitialOrders('default');

  // Filter orders matching the phone number
  const matched = allOrders.filter((o) => o.contact_phone.replace(/\s+/g, '') === phone.replace(/\s+/g, ''));

  return matched.map(o => ({
    id: o.id,
    order_code: o.order_code,
    order_status: o.order_status,
    total_amount: o.total_amount,
    created_at: o.created_at,
    items_count: o.items.length,
    first_item_name: o.items[0]?.dish_name || '',
    first_item_image: o.items[0]?.image_url || '',
    estimated_shipped_time: o.estimated_shipped_time
  }));
};

export const requestCancelOrder = async (orderId: string): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const stored = localStorage.getItem(ORDERS_KEY);
  const orders: OrderDetail[] = stored ? JSON.parse(stored) : [];
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

  // CREATE OTP RECORD TO MOCK DATA FOLDER (Simulated by LocalStorage so it works in browser)
  const otpData = localStorage.getItem('fitfud_otp_data') ? JSON.parse(localStorage.getItem('fitfud_otp_data')!) : [];
  otpData.push({
    orderId,
    otp: '1234',
    createdAt: new Date().toISOString()
  });
  localStorage.setItem('fitfud_otp_data', JSON.stringify(otpData));

  return {
    success: true,
    message: 'OTP_SENT'
  };
};

export const confirmCancelOrder = async (orderId: string, otpCode: string): Promise<{ success: boolean; message: string }> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  // VERIFY OTP FROM MOCK DATA FOLDER (Simulated by LocalStorage)
  const otpData = localStorage.getItem('fitfud_otp_data') ? JSON.parse(localStorage.getItem('fitfud_otp_data')!) : [];
  const validRecord = otpData.find((r: any) => r.orderId === orderId && r.otp === otpCode);

  if (!validRecord) {
    throw new Error('Mã OTP không đúng hoặc đã hết hạn! Vui lòng thử lại.');
  }

  const stored = localStorage.getItem(ORDERS_KEY);
  const orders: OrderDetail[] = stored ? JSON.parse(stored) : [];
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

  // Remove used OTP
  const newOtpData = otpData.filter((r: any) => r !== validRecord);
  localStorage.setItem('fitfud_otp_data', JSON.stringify(newOtpData));

  return {
    success: true,
    message: 'Hủy đơn hàng thành công!'
  };
};
