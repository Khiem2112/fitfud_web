import React from 'react';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import { useToast } from '../../../context/ToastContext';

export default function AvatarUpload({ avatar, onAvatarChange }) {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast('Đã cập nhật ảnh đại diện!', 'success');
    if (onAvatarChange) onAvatarChange();
  };

  const handleError = (err) => {
    addToast(err.message || 'Có lỗi xảy ra khi tải ảnh lên.', 'error');
  };

  const { isUploading, fileInputRef, triggerUpload, handleFileChange } = useAvatarUpload(handleSuccess, handleError);

  return (
    <div className="relative">
      <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-sm">
        {isUploading ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        ) : avatar ? (
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <i className="bi bi-person text-4xl leading-none text-primary" aria-hidden="true" />
        )}
      </div>
      
      <button 
        onClick={triggerUpload}
        disabled={isUploading}
        className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-1.5 shadow-md hover:bg-primary-dark transition text-xs disabled:opacity-50"
      >
        <i className="bi bi-pencil" aria-hidden="true" />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
