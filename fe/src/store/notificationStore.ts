import { create } from 'zustand';
import { NotificationStore, NotificationItem } from '../type/notification.types';

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => {
    const id = notification.id || `notif_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newNotif: NotificationItem = { ...notification, id };
    
    set((state) => {
      // If a notification with the same ID already exists, update it instead of adding a new one
      const existingIndex = state.notifications.findIndex((n) => n.id === id);
      if (existingIndex >= 0) {
        const newNotifications = [...state.notifications];
        newNotifications[existingIndex] = newNotif;
        return { notifications: newNotifications };
      }
      return { notifications: [...state.notifications, newNotif] };
    });

    if (newNotif.autoClose) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotif.autoClose);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));
