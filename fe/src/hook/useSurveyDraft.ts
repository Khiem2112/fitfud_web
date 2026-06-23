import { useSurveyStore } from '../store/surveyStore';
import { SurveyInput } from '../type/survey.types';

export const useSurveyDraft = () => {
  const saveDraft = useSurveyStore((state) => state.saveDraft);
  const clearDraft = useSurveyStore((state) => state.clearDraft);

  const hasDraft = () => {
    return useSurveyStore.getState().draft !== null;
  };

  const getDraftData = () => {
    return useSurveyStore.getState().draft;
  };

  const updateDraft = (step?: number, formData?: Partial<SurveyInput>) => {
    saveDraft({
      ...(step !== undefined && { step }),
      ...(formData && { formData }),
    });
  };

  return {
    hasDraft,
    getDraftData,
    updateDraft,
    clearDraft,
  };
};

export const useHasSurveyDraft = () => {
  return useSurveyStore((state) => state.draft !== null);
};
