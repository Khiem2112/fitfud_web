import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNotificationStore } from '../../../store/notificationStore';

export const GlobalNotification = () => {
  const location = useLocation();
  const notifications = useNotificationStore((state) => state.notifications);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center gap-4 pb-6 pointer-events-none px-4">
      {notifications.map((notif) => {
        // Check if notification should be hidden on current path
        if (notif.hideOnPaths && notif.hideOnPaths.includes(location.pathname)) {
          return null;
        }

        return (
          <div
            key={notif.id}
            className="pointer-events-auto flex w-full max-w-lg items-center justify-between gap-4 rounded-[12px] bg-primary-dark p-[16px] text-white shadow-premium-lg animate-bounce sm:animate-none"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-white/20">
                {notif.icon || (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-be-vietnam text-[14px] font-bold">
                  {notif.title}
                </span>
                <span className="font-be-vietnam text-[12px] font-normal text-white/80">
                  {notif.description}
                </span>
              </div>
            </div>

            {notif.actions && notif.actions.length > 0 && (
              <div className="flex items-center gap-2">
                {notif.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className={`flex h-[36px] items-center justify-center rounded-[8px] px-[12px] font-be-vietnam text-[14px] font-bold transition ${action.primary
                        ? 'bg-accent-base text-white hover:bg-accent-dark'
                        : 'font-medium text-white hover:bg-white/10'
                      }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
