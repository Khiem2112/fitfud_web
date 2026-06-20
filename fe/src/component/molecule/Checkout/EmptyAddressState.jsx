import React from 'react';
import { useToast } from '../../../context/ToastContext';

export const EmptyAddressState = () => {
  const { addToast } = useToast();

  const handleAddNew = () => {
    addToast('Chức năng "Thêm địa chỉ mới" đang được phát triển.', 'warning');
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-4">
      <div className="w-16 h-16 rounded-full bg-bg-main flex items-center justify-center">
        <span className="text-2xl">📍</span>
      </div>
      <p className="text-text-muted font-medium">Bạn chưa có địa chỉ nào được lưu.</p>
      <button 
        type="button" 
        onClick={handleAddNew}
        className="px-6 py-2 bg-primary/10 text-primary font-bold rounded-lg hover:bg-primary/20 transition-colors"
      >
        Thêm địa chỉ mới ngay
      </button>
    </div>
  );
};
