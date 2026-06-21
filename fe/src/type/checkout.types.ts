export type CartItemState = {
  id: string; // Unique item instance ID in cart
  dish_id: string;
  dish_name: string;
  image_url?: string;
  size_name: string; // S, M, L
  price: number;
  quantity: number;
  chef_notes?: string;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

export type CheckoutInput = {
  contact_name: string;
  contact_phone: string;
  shipping_address: string;
  wardId: string;
  delivery_time: string;
  payment_method: 'COD' | 'Online';
  items: {
    dish_size_id: string;
    quantity: number;
    subtotal: number;
  }[];
  total_amount: number;
  nutrition_summary: {
    calories: number;
    protein: number;
    carb: number;
    fat: number;
  };
};

export type CheckoutOutput = {
  order_id: string;
  order_code: string;
  payment_status: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  estimated_shipped_time: string;
};

export type SavedAddress = {
  id: string;
  name: string;
  phone: string;
  shipping_address_text: string;
  wardId: string;
  districtId: string;
  cityId: string;
  wardName: string;
  districtName: string;
  cityName: string;
  isDefault: boolean;
};
