import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '../../atom/Checkout/Input';
import { SelectorDropdown } from '../../atom/Checkout/SelectorDropdown';
import { Checkbox } from '../../atom/Checkout/Checkbox';
import { useLocation } from '../../../hook/useLocation';
import { SavedAddressModal } from './SavedAddressModal';
import { useToast } from '../../../context/ToastContext';

export const CheckoutShippingForm = ({ control, watch, setValue, onReset }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { addToast } = useToast();

  const cityId = watch('cityId');
  const districtId = watch('districtId');

  const { cities, districts, wards, isLoadingCities, isLoadingDistricts, isLoadingWards } = useLocation(cityId, districtId);

  // When city changes, reset district and ward
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'cityId' && type === 'change') {
        setValue('districtId', '', { shouldValidate: true });
        setValue('wardId', '', { shouldValidate: true });
      }
      if (name === 'districtId' && type === 'change') {
        setValue('wardId', '', { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleSelectAddress = (address) => {
    // Fill the form fields using RHF setValue
    setValue('contact_name', address.name, { shouldValidate: true });
    setValue('contact_phone', address.phone, { shouldValidate: true });
    setValue('shipping_address', address.shipping_address_text, { shouldValidate: true });
    
    // Set location dropdowns. Ensure we set them in order or just set all directly 
    // since useLocation handles the fetching based on watch, but the values will be stored in RHF.
    setValue('cityId', address.cityId, { shouldValidate: true });
    setValue('districtId', address.districtId, { shouldValidate: true });
    setValue('wardId', address.wardId, { shouldValidate: true });
    
    addToast('Đã áp dụng địa chỉ giao hàng thành công!', 'success');
  };

  return (
    <>
    <div className="flex flex-col w-full gap-4 rounded-[12px] bg-white p-[24px] shadow-[0px_4px_20px_0px_rgba(27,67,50,0.06)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-be-vietnam text-[24px] font-bold text-text-main">
            Địa chỉ giao hàng
          </h2>
          <button type="button" onClick={onReset} className="text-text-light hover:text-primary transition-colors" title="Làm mới form">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M4.06189 13C4.55399 16.9463 7.92038 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <button 
          type="button" 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-primary font-be-vietnam font-bold hover:underline"
        >
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10C9.65685 10 11 8.65685 11 7C11 5.34315 9.65685 4 8 4C6.34315 4 5 5.34315 5 7C5 8.65685 6.34315 10 8 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 18C10.7614 15.619 14 11.8333 14 7.5C14 4.46243 11.3137 2 8 2C4.68629 2 2 4.46243 2 7.5C2 11.8333 5.23858 15.619 8 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Chọn từ địa chỉ đã lưu
        </button>
      </div>

      <div className="flex w-full flex-col gap-4">
        <div className="flex w-full gap-4">
          <div className="flex-1">
            <Controller
              name="contact_name"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Họ và tên người nhận"
                  placeholder="Nguyễn Văn A"
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Controller
              name="contact_phone"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  error={fieldState.error}
                  label="Số điện thoại"
                  placeholder="090xxxxxxx"
                  type="tel"
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="shipping_address"
          control={control}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              error={fieldState.error}
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường, tòa nhà..."
            />
          )}
        />

        <div className="flex w-full gap-4">
          <div className="flex-1">
            <Controller
              name="cityId"
              control={control}
              render={({ field, fieldState }) => (
                <SelectorDropdown
                  {...field}
                  error={fieldState.error}
                  label="Tỉnh/Thành phố"
                  placeholder={isLoadingCities ? "Đang tải..." : "Chọn tỉnh/thành"}
                  options={cities}
                  disabled={isLoadingCities}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Controller
              name="districtId"
              control={control}
              render={({ field, fieldState }) => (
                <SelectorDropdown
                  {...field}
                  error={fieldState.error}
                  label="Quận/Huyện"
                  placeholder={isLoadingDistricts ? "Đang tải..." : "Chọn quận/huyện"}
                  options={districts}
                  disabled={isLoadingDistricts || !cityId}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Controller
              name="wardId"
              control={control}
              render={({ field, fieldState }) => (
                <SelectorDropdown
                  {...field}
                  error={fieldState.error}
                  label="Phường/Xã"
                  placeholder={isLoadingWards ? "Đang tải..." : "Chọn phường/xã"}
                  options={wards}
                  disabled={isLoadingWards || !districtId}
                />
              )}
            />
          </div>
        </div>

        <Controller
          name="isDefaultAddress"
          control={control}
          render={({ field }) => (
            <Checkbox
              {...field}
              label="Đặt làm địa chỉ mặc định"
            />
          )}
        />
      </div>

      <div className="mt-4 flex items-center gap-4 rounded-[12px] border border-[rgba(15,82,56,0.2)] bg-[rgba(45,106,79,0.1)] p-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#0F5238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 6V12L16 14" stroke="#0F5238" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="flex flex-col">
          <span className="font-be-vietnam text-[16px] font-normal text-brand-main">
            Thời gian giao hàng dự kiến
          </span>
          <span className="font-be-vietnam text-[16px] font-bold text-text-main">
            10:30 - 11:00 (Hôm nay)
          </span>
        </div>
      </div>
    </div>
    <SavedAddressModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      onSelectAddress={handleSelectAddress} 
    />
    </>
  );
};
