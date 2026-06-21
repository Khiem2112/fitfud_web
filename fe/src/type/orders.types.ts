export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Delivering' | 'Completed' | 'Cancelled';

export type TrackingLog = {
  status: OrderStatus;
  logged_at: string;
};

export type OrderItemDetail = {
  dish_id: string;
  dish_name: string;
  size_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  image_url?: string;
};

export type OrderDetail = {
  id: string;
  order_code: string;
  order_status: OrderStatus;
  total_amount: number;
  contact_name: string;
  contact_phone: string;
  shipping_address: string;
  created_at: string;
  estimated_shipped_time?: string;
  items: OrderItemDetail[];
  tracking_logs: TrackingLog[];
  payment_method: 'COD' | 'Online';
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
};

export type GuestLookupInput = {
  phone: string;
};

export type OrderHistorySummary = {
  id: string;
  order_code: string;
  order_status: OrderStatus;
  total_amount: number;
  created_at: string;
  items_count: number;
  first_item_name: string;
  first_item_image: string;
  estimated_shipped_time?: string;
  userId?: string;
};
