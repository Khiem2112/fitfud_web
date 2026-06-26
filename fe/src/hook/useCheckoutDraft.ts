import { useCheckoutStore } from '../store/checkoutStore';
import { CheckoutDraft, CheckoutFormData } from '../type/checkout';
import { useApp } from '../context/AppContext';
import { useCallback } from 'react';

export const useCheckoutDraft = () => {
  const { user } = useApp();
  const userId = user?.id || 'guest';
  
  const saveDraft = useCheckoutStore((state) => state.saveDraft);
  const clearDraft = useCheckoutStore((state) => state.clearDraft);

  // useCheckoutStore.getState() prevents reactive subscriptions which cause re-renders
  const hasDraft = () => {
    return useCheckoutStore.getState().drafts[userId] !== undefined;
  };

  const getDraftFormData = (): CheckoutFormData | null => {
    const draft = useCheckoutStore.getState().drafts[userId];
    return draft ? draft.formData : null;
  };

  const updateDraft = useCallback((formData?: CheckoutFormData) => {
    saveDraft(userId, {
      ...(formData && { formData }),
    });
  }, [userId, saveDraft]);

  const executeClearDraft = useCallback(() => {
    clearDraft(userId);
  }, [userId, clearDraft]);

  return {
    hasDraft,
    getDraftFormData,
    updateDraft,
    clearDraft: executeClearDraft,
  };
};

// Separate hook for reactive subscriptions (e.g. for DraftNotification)
export const useHasDraft = () => {
  const { user } = useApp();
  const userId = user?.id || 'guest';
  return useCheckoutStore((state) => state.drafts[userId] !== undefined);
};


