import { CartItemState, CheckoutInput, CheckoutOutput, SavedAddress } from '../type/checkout.types';

const CART_KEY = 'fitfud_cart';
const ORDERS_KEY = 'fitfud_orders';

// --- Cart management (LocalStorage wrapper) ---

export const getCart = (): CartItemState[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItemState[]): void => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (item: Omit<CartItemState, 'id'>): CartItemState[] => {
  const cart = getCart();

  // Find if same dish + size + notes combo exists
  const existing = cart.find(
    (c) =>
      c.dish_id === item.dish_id &&
      c.size_name === item.size_name &&
      c.chef_notes === item.chef_notes
  );

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push({
      ...item,
      id: `cart_item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
    });
  }

  saveCart(cart);
  return cart;
};

export const updateCartQty = (id: string, qty: number): CartItemState[] => {
  let cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) {
    item.quantity = qty;
    if (item.quantity <= 0) {
      cart = cart.filter((c) => c.id !== id);
    }
  }
  saveCart(cart);
  return cart;
};

export const removeFromCart = (id: string): CartItemState[] => {
  let cart = getCart();
  cart = cart.filter((c) => c.id !== id);
  saveCart(cart);
  return cart;
};

export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};

// --- Vietnam Administrative Divisions Mock Data ---

export const mockCities = [
  { id: 'city_hcm', name: 'TP. Hồ Chí Minh' },
  { id: 'city_hn', name: 'Hà Nội' },
  { id: 'city_dn', name: 'Đà Nẵng' }
];

export const mockDistricts: Record<string, { id: string; name: string }[]> = {
  city_hcm: [
    { id: 'dist_q1', name: 'Quận 1' },
    { id: 'dist_q3', name: 'Quận 3' },
    { id: 'dist_q10', name: 'Quận 10' },
    { id: 'dist_qbt', name: 'Quận Bình Thạnh' }
  ],
  city_hn: [
    { id: 'dist_cg', name: 'Quận Cầu Giấy' },
    { id: 'dist_bd', name: 'Quận Ba Đình' },
    { id: 'dist_hk', name: 'Quận Hoàn Kiếm' }
  ],
  city_dn: [
    { id: 'dist_hc', name: 'Quận Hải Châu' },
    { id: 'dist_st', name: 'Quận Sơn Trà' }
  ]
};

export const mockWards: Record<string, { id: string; name: string }[]> = {
  dist_q1: [
    { id: 'ward_bn', name: 'Phường Bến Nghé' },
    { id: 'ward_bt', name: 'Phường Bến Thành' },
    { id: 'ward_cg', name: 'Phường Cô Giang' }
  ],
  dist_q10: [
    { id: 'ward_p12', name: 'Phường 12' },
    { id: 'ward_p14', name: 'Phường 14' }
  ],
  dist_cg: [
    { id: 'ward_dvh', name: 'Phường Dịch Vọng Hậu' },
    { id: 'ward_yh', name: 'Phường Yên Hòa' }
  ]
};

export const fetchCities = async () => mockCities;
export const fetchDistricts = async (cityId: string) => mockDistricts[cityId] || [];
export const fetchWards = async (districtId: string) => mockWards[districtId] || [];

// --- Saved Addresses Mock Store ---

const mockAddresses: SavedAddress[] = [
  {
    id: 'addr_1',
    name: 'Nguyễn Minh Tuấn',
    phone: '0901234567',
    shipping_address_text: '123 Đường ABC',
    wardName: 'Phường Bến Nghé',
    districtName: 'Quận 1',
    cityName: 'TP. Hồ Chí Minh',
    isDefault: true
  },
  {
    id: 'addr_2',
    name: 'Trần Thị Bé Hai',
    phone: '0987654321',
    shipping_address_text: 'Tầng 15, Tòa nhà Landmark 81, 720A Điện Biên Phủ',
    wardName: 'Phường 22',
    districtName: 'Quận Bình Thạnh',
    cityName: 'TP. Hồ Chí Minh',
    isDefault: false
  }
];

export const getSavedAddresses = async (userId: string): Promise<SavedAddress[]> => {
  return mockAddresses;
};

// --- Checkout and Order Creation ---

export const createOrder = async (input: CheckoutInput, userId: string): Promise<CheckoutOutput> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const orderId = 'order_' + Date.now();
  const orderCode = 'FF' + Math.floor(10000 + Math.random() * 90000);

  // Look up Ward/District/City names from IDs
  let fullAddress = input.shipping_address;

  // Store new order in LocalStorage
  const newOrder = {
    id: orderId,
    order_code: orderCode,
    order_status: 'Pending',
    total_amount: input.total_amount,
    contact_name: input.contact_name,
    contact_phone: input.contact_phone,
    shipping_address: fullAddress,
    created_at: new Date().toISOString(),
    estimated_shipped_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour later
    items: input.items.map((item: any) => {
      // Find details from cart item (in a real app, this would query backend)
      return {
        dish_name: item.dish_name || 'Cơm Cá Hồi Áp Chảo',
        size_name: item.size_name || 'M',
        quantity: item.quantity,
        unit_price: item.price || 99000,
        subtotal: item.subtotal
      };
    }),
    tracking_logs: [
      { status: 'Pending', logged_at: new Date().toISOString() }
    ],
    userId: userId,
    payment_method: input.payment_method,
    payment_status: input.payment_method === 'Online' ? 'Paid' : 'Pending'
  };

  const storedOrders = localStorage.getItem(ORDERS_KEY);
  const orders = storedOrders ? JSON.parse(storedOrders) : [];
  orders.unshift(newOrder); // Add to beginning of array
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

  // Clear cart upon order completion
  clearCart();

  return {
    order_id: orderId,
    order_code: orderCode,
    payment_status: newOrder.payment_status as any,
    estimated_shipped_time: newOrder.estimated_shipped_time
  };
};
