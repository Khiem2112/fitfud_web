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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
  const { user, updateSurveyStatus } = useApp();

  useEffect(() => {
    // Luôn hiện nếu chưa làm khảo sát (has_surveyed = false) HOẶC có draft
    if ((user && user.has_surveyed === false) || hasSurveyDraft) {
      addNotification({
        id: 'survey_draft',
        title: 'Khảo sát sức khỏe chưa hoàn tất',
        description: 'Hãy hoàn thành khảo sát để FitFud có thể lên thực đơn tốt nhất cho bạn.',
        hideOnPaths: ['/survey', '/auth'],
        icon: (
          <span className="text-xl leading-none">🌱</span>
        ),
        actions: [
          {
            label: 'Để sau',
            onClick: () => {
              // Nếu người dùng ẩn đi thì xoá draft, nhưng notification sẽ vẫn hiện lại nếu navigate vì has_surveyed vẫn false.
              // Tốt nhất là chỉ ẩn thông báo (removeNotification), nhưng lần sau render lại nó sẽ hiện tiếp.
              removeNotification('survey_draft');
            },
          },
          {
            label: 'Tiếp tục',
            primary: true,
            onClick: () => navigate('/survey'),
          },
        ],
      });
    } else {
      removeNotification('survey_draft');
    }
  }, [hasSurveyDraft, user, navigate, clearSurveyDraft, addNotification, removeNotification]);

  return null;
};
