import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckoutStore } from '../type/checkout';

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      drafts: {},
      saveDraft: (userId, data) =>
        set((state) => {
          const existingDraft = state.drafts[userId];
          return {
            drafts: {
              ...state.drafts,
              [userId]: {
                formData: data.formData || existingDraft?.formData || {
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
            },
          };
        }),
      clearDraft: (userId) =>
        set((state) => {
          const newDrafts = { ...state.drafts };
          delete newDrafts[userId];
          return { drafts: newDrafts };
        }),
      migrateDraft: (fromUserId, toUserId) =>
        set((state) => {
          const draftToMigrate = state.drafts[fromUserId];
          if (!draftToMigrate) return state;

          const newDrafts = { ...state.drafts };
          newDrafts[toUserId] = draftToMigrate;
          delete newDrafts[fromUserId];
          return { drafts: newDrafts };
        }),
    }),
    {
      name: 'checkout-draft-storage',
    }
  )
);
