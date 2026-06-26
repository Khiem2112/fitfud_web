import { CartItemState, CheckoutInput, CheckoutOutput, SavedAddress } from '../type/checkout.types';
import citiesData from '../seed/cities';
import districtsData from '../seed/districts';
import wardsData from '../seed/wards';

const CART_KEY = 'fitfud_cart';
const ORDERS_KEY = 'fitfud_orders';

// --- Cart management (LocalStorage wrapper) ---

export const getCart = (): CartItemState[] => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

const sortCart = (cart: CartItemState[]) => {
  const sizeOrder: Record<string, number> = { 'S': 1, 'M': 2, 'L': 3 };
  return cart.sort((a, b) => {
    const nameCmp = (a.dish_name || '').localeCompare(b.dish_name || '');
    if (nameCmp !== 0) return nameCmp;
    const sizeA = sizeOrder[a.size_name || ''] || 99;
    const sizeB = sizeOrder[b.size_name || ''] || 99;
    return sizeA - sizeB;
  });
};

export const saveCart = (cart: CartItemState[]): void => {
  const sortedCart = sortCart(cart);
  localStorage.setItem(CART_KEY, JSON.stringify(sortedCart));
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
  const cart = getCart();
  const item = cart.find((c) => c.id === id);
  if (item) {
    item.quantity = Math.max(1, qty);
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

export const fetchCities = async () => {
  return Object.values(citiesData).map((city: any) => ({
    id: city.code,
    name: city.name_with_type
  })).sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchDistricts = async (cityId: string) => {
  if (!cityId) return [];
  return Object.values(districtsData)
    .filter((district: any) => district.parent_code === cityId)
    .map((district: any) => ({
      id: district.code,
      name: district.name_with_type
    })).sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchWards = async (districtId: string) => {
  if (!districtId) return [];
  return Object.values(wardsData)
    .filter((ward: any) => ward.parent_code === districtId)
    .map((ward: any) => ({
      id: ward.code,
      name: ward.name_with_type
    })).sort((a, b) => a.name.localeCompare(b.name));
};

// --- Saved Addresses Mock Store ---

const mockAddresses: SavedAddress[] = [
  {
    id: 'addr_1',
    name: 'Nguyễn Minh Tuấn',
    phone: '0901234567',
    shipping_address_text: '123 Đường ABC',
    wardId: '26734',
    districtId: '760',
    cityId: '79',
    wardName: 'Phường Bến Nghé',
    districtName: 'Quận 1',
    cityName: 'Thành phố Hồ Chí Minh',
    isDefault: true
  },
  {
    id: 'addr_2',
    name: 'Trần Thị Bé Hai',
    phone: '0987654321',
    shipping_address_text: 'Tầng 15, Tòa nhà Landmark 81, 720A Điện Biên Phủ',
    wardId: '26920',
    districtId: '765',
    cityId: '79',
    wardName: 'Phường 22',
    districtName: 'Quận Bình Thạnh',
    cityName: 'Thành phố Hồ Chí Minh',
    isDefault: false
  }
];

const ADDRESSES_KEY_PREFIX = 'fitfud_addresses_';

export const getSavedAddresses = async (userId: string): Promise<SavedAddress[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const stored = localStorage.getItem(ADDRESSES_KEY_PREFIX + userId);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Set mock as initial state
  localStorage.setItem(ADDRESSES_KEY_PREFIX + userId, JSON.stringify(mockAddresses));
  return mockAddresses;
};

export const addAddress = async (userId: string, input: Omit<SavedAddress, 'id'>): Promise<SavedAddress> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const addresses = await getSavedAddresses(userId);
  
  // If this is set to default, unset others
  if (input.isDefault) {
    addresses.forEach(a => a.isDefault = false);
  } else if (addresses.length === 0) {
    input.isDefault = true; // First address is always default
  }

  const newAddress: SavedAddress = {
    ...input,
    id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  };

  addresses.unshift(newAddress);
  localStorage.setItem(ADDRESSES_KEY_PREFIX + userId, JSON.stringify(addresses));

  return newAddress;
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
    estimated_shipped_time: input.delivery_time || new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Use form input if available
    items: input.items.map((item) => {
      // Find details from cart item (in a real app, this would query backend)
      return {
        dish_id: item.dish_id,
        dish_name: item.dish_name || 'Cơm Cá Hồi Áp Chảo',
        size_name: item.size_name || 'M',
        quantity: item.quantity,
        unit_price: item.price || 99000,
        subtotal: item.subtotal,
        image_url: item.image_url
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
