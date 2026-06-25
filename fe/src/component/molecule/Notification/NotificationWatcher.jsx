import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHasDraft as useHasCheckoutDraft, useCheckoutDraft } from '../../../hook/useCheckoutDraft';
import { useHasSurveyDraft, useSurveyDraft } from '../../../hook/useSurveyDraft';
import { useNotificationStore } from '../../../store/notificationStore';
import { useApp } from '../../../context/AppContext';

export const NotificationWatcher = () => {
  const navigate = useNavigate();
  const hasCheckoutDraft = useHasCheckoutDraft();
  const { clearDraft: clearCheckoutDraft } = useCheckoutDraft();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  // Watch for Checkout Draft
  useEffect(() => {
    if (hasCheckoutDraft) {
      addNotification({
        id: 'checkout_draft',
        title: 'Đơn hàng đang chờ thanh toán',
        description: 'Bạn có đơn hàng chưa hoàn tất.',
        hideOnPaths: ['/checkout'],
        icon: (
          <i className="bi bi-bag-check text-xl leading-none" aria-hidden="true" />
        ),
        actions: [
          {
            label: 'Bỏ qua',
            onClick: () => clearCheckoutDraft(),
          },
          {
            label: 'Tiếp tục',
            primary: true,
            onClick: () => navigate('/checkout'),
          },
        ],
      });
    } else {
      removeNotification('checkout_draft');
    }
  }, [hasCheckoutDraft, navigate, clearCheckoutDraft, addNotification, removeNotification]);

  // Watch for Survey
  const hasSurveyDraft = useHasSurveyDraft();
  const { clearDraft: clearSurveyDraft } = useSurveyDraft();
  const { user, updateSurveyStatus, isAIAnalyzing } = useApp();
  const surveyPromptKey = user ? `fitfud_survey_prompt_seen_${user.id}` : 'fitfud_survey_prompt_seen_guest';

  // Watch for AI analyzing
  useEffect(() => {
    if (isAIAnalyzing) {
      addNotification({
        id: 'ai_analyzing',
        title: 'Đang phân tích món ăn từ ảnh...',
        description: 'AI đang nhận diện và tính toán dinh dưỡng, sẽ mất vài giây...',
        hideOnPaths: [],
        icon: (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-light border-t-primary"></div>
        ),
        actions: [],
      });
    } else {
      removeNotification('ai_analyzing');
    }
  }, [isAIAnalyzing, addNotification, removeNotification]);

  useEffect(() => {
    const hasSeenSurveyPrompt = localStorage.getItem(surveyPromptKey) === 'true';
    if (((user && user.has_surveyed === false) || hasSurveyDraft) && !hasSeenSurveyPrompt) {
      localStorage.setItem(surveyPromptKey, 'true');
      addNotification({
        id: 'survey_draft',
        title: 'Khảo sát sức khỏe chưa hoàn tất',
        description: 'Hãy hoàn thành khảo sát để FitFud có thể lên thực đơn tốt nhất cho bạn.',
        hideOnPaths: ['/survey', '/auth'],
        icon: (
          <i className="bi bi-leaf text-xl leading-none" aria-hidden="true" />
        ),
        actions: [
          {
            label: 'Để sau',
            onClick: () => {
              removeNotification('survey_draft');
            },
          },
          {
            label: 'Tiếp tục',
            primary: true,
            onClick: () => {
              removeNotification('survey_draft');
              navigate('/survey');
            },
          },
        ],
      });
    } else {
      removeNotification('survey_draft');
    }
  }, [hasSurveyDraft, user, surveyPromptKey, navigate, clearSurveyDraft, addNotification, removeNotification]);

  return null;
};
