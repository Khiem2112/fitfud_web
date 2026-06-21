import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckoutStore } from '../type/checkout';

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (data) =>
        set((state) => ({
          draft: {
            formData: data.formData || state.draft?.formData || {
              contact_name: '',
              contact_phone: '',
              shipping_address: '',
              cityId: '',
              districtId: '',
              wardId: '',
              isDefaultAddress: false,
              payment_method: 'COD',
            },
            updatedAt: Date.now(),
          },
        })),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'checkout-draft-storage',
    }
  )
);
