import { useCheckoutStore } from '../store/checkoutStore';
import { CheckoutDraft, CheckoutFormData } from '../type/checkout';

export const useCheckoutDraft = () => {
  const saveDraft = useCheckoutStore((state) => state.saveDraft);
  const clearDraft = useCheckoutStore((state) => state.clearDraft);

  // useCheckoutStore.getState() prevents reactive subscriptions which cause re-renders
  const hasDraft = () => {
    return useCheckoutStore.getState().draft !== null;
  };

  const getDraftFormData = (): CheckoutFormData | null => {
    const draft = useCheckoutStore.getState().draft;
    return draft ? draft.formData : null;
  };

  const updateDraft = (formData?: CheckoutFormData) => {
    saveDraft({
      ...(formData && { formData }),
    });
  };

  return {
    hasDraft,
    getDraftFormData,
    updateDraft,
    clearDraft,
  };
};

// Separate hook for reactive subscriptions (e.g. for DraftNotification)
export const useHasDraft = () => {
  return useCheckoutStore((state) => state.draft !== null);
};
