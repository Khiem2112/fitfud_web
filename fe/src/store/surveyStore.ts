import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SurveyStore } from '../type/survey.types';

export const useSurveyStore = create<SurveyStore>()(
  persist(
    (set) => ({
      draft: null,
      saveDraft: (data) =>
        set((state) => {
          const newFormData = { ...state.draft?.formData, ...data.formData };
          return {
            draft: {
              step: data.step !== undefined ? data.step : (state.draft?.step || 1),
              formData: newFormData,
              updatedAt: Date.now(),
            },
          };
        }),
      clearDraft: () => set({ draft: null }),
    }),
    {
      name: 'survey-draft-storage',
    }
  )
);
