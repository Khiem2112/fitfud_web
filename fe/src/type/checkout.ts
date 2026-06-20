export interface CheckoutFormData {
  contact_name: string;
  contact_phone: string;
  shipping_address: string;
  cityId: string;
  districtId: string;
  wardId: string;
  delivery_time: string;
  isDefaultAddress: boolean;
  payment_method: 'COD' | 'Online';
}

export interface CheckoutDraft {
  formData: CheckoutFormData;
  updatedAt: number;
}

export interface CheckoutStore {
  draft: CheckoutDraft | null;
  saveDraft: (data: Partial<CheckoutDraft>) => void;
  clearDraft: () => void;
}
