import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { changePassword } from '../../../service/profileService';
import { useToast } from '../../../context/ToastContext';

export default function ChangePasswordPopup({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setApiError('');
    setIsLoading(true);
    try {
      const res = await changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword
      });
      if (res.success) {
        addToast('Đổi mật khẩu thành công!', 'success');
        onClose();
        reset();
      }
    } catch (err) {
      setApiError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-bg-card p-6 shadow-premium border border-border-light relative">
        <button 
          onClick={() => { onClose(); reset(); setApiError(''); }}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main"
        >
          ✕
        </button>
        <h2 className="text-lg font-extrabold text-text-main mb-4">Đổi mật khẩu</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Mật khẩu hiện tại</label>
            <input 
              type="password"
              {...register('currentPassword', { required: 'Vui lòng nhập mật khẩu hiện tại' })}
              className={`w-full rounded-xl border bg-bg-main px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.currentPassword ? 'border-danger' : 'border-border-light'}`}
            />
            {errors.currentPassword && <p className="text-[10px] text-danger mt-1">{errors.currentPassword.message}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Mật khẩu mới</label>
            <input 
              type="password"
              {...register('newPassword', { 
                required: 'Vui lòng nhập mật khẩu mới',
                minLength: { value: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              })}
              className={`w-full rounded-xl border bg-bg-main px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.newPassword ? 'border-danger' : 'border-border-light'}`}
            />
            {errors.newPassword && <p className="text-[10px] text-danger mt-1">{errors.newPassword.message}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Xác nhận mật khẩu mới</label>
            <input 
              type="password"
              {...register('confirmPassword', { 
                required: 'Vui lòng xác nhận mật khẩu mới',
                validate: (value) => value === watch('newPassword') || 'Mật khẩu xác nhận không khớp'
              })}
              className={`w-full rounded-xl border bg-bg-main px-4 py-2 text-sm focus:outline-none focus:border-primary ${errors.confirmPassword ? 'border-danger' : 'border-border-light'}`}
            />
            {errors.confirmPassword && <p className="text-[10px] text-danger mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {apiError && <p className="text-xs text-danger font-bold text-center">{apiError}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Đang xử lý...' : 'Xác nhận đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}
