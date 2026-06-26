import { useState, useRef } from 'react';
import { saveAvatarToDB } from '../service/avatarService';
import { useApp } from '../context/AppContext';

export const useAvatarUpload = (onSuccess: () => void, onError: (err: Error) => void) => {
  const { user } = useApp() as any;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError(new Error('Vui lòng chọn file hình ảnh hợp lệ.'));
      return;
    }
    
    // Validate file size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError(new Error('Kích thước ảnh không được vượt quá 5MB.'));
      return;
    }

    try {
      setIsUploading(true);
      await saveAvatarToDB(user.id, file);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      onError(err);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return {
    isUploading,
    fileInputRef,
    triggerUpload,
    handleFileChange
  };
};
