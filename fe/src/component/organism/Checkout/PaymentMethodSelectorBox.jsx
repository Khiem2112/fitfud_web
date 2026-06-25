import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { RadioButton } from '../../atom/Checkout/RadioButton';
import { BankTransferInfo } from '../../molecule/Checkout/BankTransferInfo';
import { Checkbox } from '../../atom/Checkout/Checkbox';

export const PaymentMethodSelectorBox = ({ control, errors }) => {
  const { watch } = useFormContext();
  const paymentMethod = watch('payment_method');
  const hasTransferred = watch('has_transferred');

  return (
    <div className="flex flex-col w-full gap-3 rounded-[12px] bg-white p-4 shadow-[0px_4px_20px_0px_rgba(27,67,50,0.06)]">
      <div className="flex items-center gap-2 text-text-main">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="#1A1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 10H23" stroke="#1A1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h2 className="font-be-vietnam text-[18px] font-semibold leading-tight">
          Phương thức thanh toán
        </h2>
      </div>

      <div className="flex w-full flex-col gap-3">
        <Controller
          name="payment_method"
          control={control}
          render={({ field }) => (
            <div className="flex w-full gap-4">
              <RadioButton
                name={field.name}
                checked={field.value === 'COD'}
                onChange={() => field.onChange('COD')}
                value="COD"
                label="Thanh toán khi nhận hàng (COD)"
                disabled={hasTransferred}
              />
              <RadioButton
                name={field.name}
                checked={field.value === 'Online'}
                onChange={() => field.onChange('Online')}
                value="Online"
                label="Thanh toán trực tuyến"
              />
            </div>
          )}
        />
        
        {paymentMethod === 'Online' && (
          <div className="flex flex-col gap-4 animate-fade-in-up">
            <BankTransferInfo />
            <Controller
              name="has_transferred"
              control={control}
              render={({ field }) => (
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <Checkbox
                    name={field.name}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    label="Tôi đã chuyển khoản thành công"
                    disabled={field.value} // Lock checkbox once checked
                  />
                  {field.value && (
                    <p className="text-xs text-primary mt-2 ml-7 italic">
                      ✓ Đã khoá phương thức thanh toán. Bạn có thể tiến hành đặt đơn.
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        )}
        
        {errors.payment_method && (
          <span className="font-be-vietnam text-[12px] font-medium text-red-500 mt-[-8px]">
            {errors.payment_method.message}
          </span>
        )}
      </div>
    </div>
  );
};
