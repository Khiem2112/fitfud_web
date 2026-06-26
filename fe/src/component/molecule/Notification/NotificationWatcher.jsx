import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHasDraft as useHasCheckoutDraft, useCheckoutDraft } from '../../../hook/useCheckoutDraft';
import { useHasSurveyDraft, useSurveyDraft } from '../../../hook/useSurveyDraft';
import { useNotificationStore } from '../../../store/notificationStore';
import { useApp } from '../../../context/AppContext';

let hasDismissedSurveySession = false;

export const NotificationWatcher = () => {
  const navigate = useNavigate();
  const hasCheckoutDraft = useHasCheckoutDraft();
  const { clearDraft: clearCheckoutDraft } = useCheckoutDraft();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const { user, updateSurveyStatus, isAIAnalyzing, cart } = useApp();

  // Watch for Checkout Draft
  useEffect(() => {
    if (hasCheckoutDraft && cart.length > 0) {
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
  }, [hasCheckoutDraft, cart.length, navigate, clearCheckoutDraft, addNotification, removeNotification]);

  // Watch for Survey
  const hasSurveyDraft = useHasSurveyDraft();
  const { clearDraft: clearSurveyDraft } = useSurveyDraft();
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

  const location = useLocation();

  useEffect(() => {
    if (!hasDismissedSurveySession && ((user && user.has_surveyed === false) || (!user && hasSurveyDraft))) {
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
              hasDismissedSurveySession = true;
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
  }, [hasSurveyDraft, user, location.pathname, navigate, clearSurveyDraft, addNotification, removeNotification]);

  return null;
};
