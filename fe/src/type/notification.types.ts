import { ReactNode } from 'react';

export type NotificationAction = {
  label: string;
  onClick: () => void;
  primary?: boolean;
};

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode; // Optional SVG icon or React element
  actions?: NotificationAction[];
  autoClose?: number; // Optional ms to auto close
  hideOnPaths?: string[]; // Hide notification on specific paths
};

export type NotificationStore = {
  notifications: NotificationItem[];
  addNotification: (notification: Omit<NotificationItem, 'id'> & { id?: string }) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
};
