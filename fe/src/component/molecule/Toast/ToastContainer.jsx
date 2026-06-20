import React from 'react';
import { useToast } from '../../../context/ToastContext';

const typeStyles = {
  info: 'bg-bg-main border-border-light text-text-main',
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
};

const iconMap = {
  info: 'ℹ️',
  success: '✅',
  error: '❌',
  warning: '⚠️'
};

const ToastItem = ({ toast, onRemove }) => {
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 shadow-premium transition-all min-w-[300px] ${typeStyles[toast.type] || typeStyles.info}`}>
      <span className="text-xl">{iconMap[toast.type] || iconMap.info}</span>
      <p className="text-sm font-medium flex-1">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-text-muted hover:text-text-main">
        ✕
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto animate-fade-in-up">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};
