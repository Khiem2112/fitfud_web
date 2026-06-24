import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';

export default function AddAddressPopup({ isOpen, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    setIsLoading(true);
    
    // Mock API call to save address
    setTimeout(() => {
      addToast('Đã thêm địa chỉ thành công!', 'success');
      setIsLoading(false);
      onClose();
      reset();
      
      // In a real app, this should trigger a re-fetch of the dashboard data
      // or call a callback to update the UI
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-bg-card p-6 shadow-premium border border-border-light relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => { onClose(); reset(); }}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main"
        >
          ✕
        </button>
        <h2 className="text-lg font-extrabold text-text-main mb-6">Thêm địa chỉ giao hàng</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Họ và tên *</label>
              <input 
                type="text"
                {...register('receiver_name', { required: 'Vui lòng nhập họ tên' })}
                placeholder="Ví dụ: Nguyễn Văn A"
                className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.receiver_name ? 'border-danger' : 'border-border-light'}`}
              />
              {errors.receiver_name && <p className="text-[10px] text-danger mt-1">{errors.receiver_name.message}</p>}
            </div>
            
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Số điện thoại *</label>
              <input 
                type="text"
                {...register('receiver_phone', { 
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: { value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/, message: 'Số điện thoại không hợp lệ' }
                })}
                placeholder="Ví dụ: 0912345678"
                className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.receiver_phone ? 'border-danger' : 'border-border-light'}`}
              />
              {errors.receiver_phone && <p className="text-[10px] text-danger mt-1">{errors.receiver_phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Tỉnh/Thành phố *</label>
              <select 
                {...register('city', { required: 'Vui lòng chọn Tỉnh/Thành phố' })}
                className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.city ? 'border-danger' : 'border-border-light'}`}
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
              </select>
              {errors.city && <p className="text-[10px] text-danger mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Quận/Huyện *</label>
              <select 
                {...register('district', { required: 'Vui lòng chọn Quận/Huyện' })}
                className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.district ? 'border-danger' : 'border-border-light'}`}
              >
                <option value="">Chọn Quận/Huyện</option>
                <option value="Quận 1">Quận 1</option>
                <option value="Quận 2">Quận 2</option>
                <option value="Quận 3">Quận 3</option>
              </select>
              {errors.district && <p className="text-[10px] text-danger mt-1">{errors.district.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Phường/Xã *</label>
            <select 
              {...register('ward', { required: 'Vui lòng chọn Phường/Xã' })}
              className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.ward ? 'border-danger' : 'border-border-light'}`}
            >
              <option value="">Chọn Phường/Xã</option>
              <option value="Phường Bến Nghé">Phường Bến Nghé</option>
              <option value="Phường Bến Thành">Phường Bến Thành</option>
            </select>
            {errors.ward && <p className="text-[10px] text-danger mt-1">{errors.ward.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Địa chỉ cụ thể *</label>
            <input 
              type="text"
              {...register('street', { required: 'Vui lòng nhập địa chỉ cụ thể' })}
              placeholder="Số nhà, tên đường..."
              className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.street ? 'border-danger' : 'border-border-light'}`}
            />
            {errors.street && <p className="text-[10px] text-danger mt-1">{errors.street.message}</p>}
          </div>
          
          <div className="flex items-center gap-2 mt-2">
             <input type="checkbox" id="default-address" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" {...register('is_default')} />
             <label htmlFor="default-address" className="text-xs font-medium text-text-main">Đặt làm địa chỉ mặc định</label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark transition disabled:opacity-50 shadow-sm"
            >
              {isLoading ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
