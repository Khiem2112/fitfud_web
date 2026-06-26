import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../context/ToastContext';
import { useApp } from '../../../context/AppContext';
import { addAddress, fetchCities, fetchDistricts, fetchWards } from '../../../service/checkoutService';

export default function AddAddressPopup({ isOpen, onClose, onSuccess }) {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const { addToast } = useToast();
  const { user } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    fetchCities().then(setCities);
  }, []);

  const selectedCityId = watch('city');
  const selectedDistrictId = watch('district');

  const [prevCityId, setPrevCityId] = useState('');
  useEffect(() => {
    if (selectedCityId !== prevCityId) {
      setValue('district', '');
      setValue('ward', '');
      if (selectedCityId) {
        fetchDistricts(selectedCityId).then(setDistricts);
      } else {
        setDistricts([]);
      }
      setPrevCityId(selectedCityId);
    }
  }, [selectedCityId, prevCityId, setValue]);

  const [prevDistrictId, setPrevDistrictId] = useState('');
  useEffect(() => {
    if (selectedDistrictId !== prevDistrictId) {
      setValue('ward', '');
      if (selectedDistrictId) {
        fetchWards(selectedDistrictId).then(setWards);
      } else {
        setWards([]);
      }
      setPrevDistrictId(selectedDistrictId);
    }
  }, [selectedDistrictId, prevDistrictId, setValue]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const cityName = cities.find(c => c.id === data.city)?.name || '';
      const districtName = districts.find(d => d.id === data.district)?.name || '';
      const wardName = wards.find(w => w.id === data.ward)?.name || '';

      await addAddress(user.id, {
        name: data.receiver_name,
        phone: data.receiver_phone,
        shipping_address_text: data.street,
        wardId: data.ward,
        districtId: data.district,
        cityId: data.city,
        wardName: wardName,
        districtName: districtName,
        cityName: cityName,
        isDefault: data.is_default
      });
      
      addToast('Đã thêm địa chỉ thành công!', 'success');
      setIsLoading(false);
      onClose();
      reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      addToast('Có lỗi xảy ra khi thêm địa chỉ!', 'error');
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
      <div className="fixed left-1/2 top-1/2 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-border-light bg-bg-card p-5 shadow-premium max-h-[calc(100vh-2rem)] overflow-y-auto">
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
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {errors.city && <p className="text-[10px] text-danger mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-text-main mb-1">Quận/Huyện *</label>
              <select 
                {...register('district', { required: 'Vui lòng chọn Quận/Huyện' })}
                className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.district ? 'border-danger' : 'border-border-light'}`}
                disabled={!selectedCityId}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.district && <p className="text-[10px] text-danger mt-1">{errors.district.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-main mb-1">Phường/Xã *</label>
            <select 
              {...register('ward', { required: 'Vui lòng chọn Phường/Xã' })}
              className={`w-full rounded-xl border bg-bg-main px-4 py-2.5 text-sm focus:outline-none focus:border-primary ${errors.ward ? 'border-danger' : 'border-border-light'}`}
              disabled={!selectedDistrictId}
            >
              <option value="">Chọn Phường/Xã</option>
              {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
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
    </div>,
    document.body
  );
}
