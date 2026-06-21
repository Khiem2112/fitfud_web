import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApp } from '../context/AppContext';
import { createOrder } from '../service/checkoutService';
import { checkoutSchema } from '../util/checkout.schema';
import { CheckoutShippingForm } from '../component/organism/Checkout/CheckoutShippingForm';
import { PaymentMethodSelectorBox } from '../component/organism/Checkout/PaymentMethodSelectorBox';
import { OrderSummarySidebarCard } from '../component/organism/Checkout/OrderSummarySidebarCard';
import { OrderSuccessModal } from '../component/organism/Checkout/OrderSuccessModal';
import { useCheckoutDraft } from '../hook/useCheckoutDraft';

export default function Checkout() {
  const { user, cart, updateCartQty, clearCart, selectedCartItemIds, toggleSelectAllCartItems, toggleSelectCartItem } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [orderSuccessData, setOrderSuccessData] = useState(null);

  // Use checkout draft hook
  const { getDraftFormData, updateDraft, clearDraft } = useCheckoutDraft();

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: getDraftFormData() || {
      contact_name: user?.full_name || '',
      contact_phone: user?.phone || '',
      shipping_address: '',
      cityId: '',
      districtId: '',
      wardId: '',
      delivery_time: '',
      isDefaultAddress: false,
      payment_method: 'COD',
      has_transferred: false,
    },
    mode: 'onBlur',
  });

  const handleResetForm = () => {
    clearDraft();
    methods.reset({
      contact_name: user?.full_name || '',
      contact_phone: user?.phone || '',
      shipping_address: '',
      cityId: '',
      districtId: '',
      wardId: '',
      delivery_time: '',
      isDefaultAddress: false,
      payment_method: 'COD',
      has_transferred: false,
    });
  };

  // Auto-save draft on changes
  const formValues = methods.watch();
  const formValuesString = JSON.stringify(formValues);

  useEffect(() => {
    // Only save if form has been initialized with data
    if (formValuesString && formValuesString !== '{}') {
      updateDraft(JSON.parse(formValuesString));
    }
  }, [formValuesString, updateDraft]);



  const onSubmit = async (data) => {
    setGlobalError('');

    setIsSubmitting(true);
    try {
      // Calculate totals ONLY for selected items
      const selectedItems = cart.filter(item => selectedCartItemIds.includes(item.id));

      const totals = selectedItems.reduce(
        (acc, item) => {
          acc.amount += item.price * item.quantity;
          acc.calories += (item.calories || 0) * item.quantity;
          acc.protein += (item.protein || 0) * item.quantity;
          acc.carb += (item.carb || 0) * item.quantity;
          acc.fat += (item.fat || 0) * item.quantity;
          return acc;
        },
        { amount: 0, calories: 0, protein: 0, carb: 0, fat: 0 }
      );

      const payload = {
        contact_name: data.contact_name,
        contact_phone: data.contact_phone,
        shipping_address: data.shipping_address,
        wardId: data.wardId,
        delivery_time: data.delivery_time,
        payment_method: data.payment_method,
        items: selectedItems.map((item) => ({
          dish_size_id: item.id,
          dish_id: item.dish_id,
          image_url: item.image_url,
          dish_name: item.dish_name,
          size_name: item.size_name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        total_amount: totals.amount,
        nutrition_summary: {
          calories: totals.calories,
          protein: totals.protein,
          carb: totals.carb,
          fat: totals.fat,
        },
      };

      const orderUserId = user ? user.id : `guest_${Date.now()}`;
      const res = await createOrder(payload, orderUserId);

      clearCart();
      clearDraft(); // Wipe draft on success
      setOrderSuccessData(res);
    } catch (err) {
      setGlobalError(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-[40px]">
      <div className="flex flex-col gap-8 w-full bg-[#FAFAFA] rounded-xl px-[24px] py-[32px] pt-[79px]">
        <div className="flex items-center justify-between">
          <h1 className="font-be-vietnam text-[32px] font-bold leading-[41.6px] text-brand-main">
            Hoàn tất đơn hàng
          </h1>
        </div>

        {globalError && (
          <div className="rounded-[12px] bg-red-100 border border-red-200 p-4 text-[14px] font-medium text-red-600">
            {globalError}
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Checkout Details */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <CheckoutShippingForm
                control={methods.control}
                watch={methods.watch}
                setValue={methods.setValue}
                onReset={handleResetForm}
              />
              <PaymentMethodSelectorBox
                control={methods.control}
                errors={methods.formState.errors}
              />
            </div>

            {/* Right Column: Cart Summary */}
            <div className="lg:col-span-4 sticky top-[100px]">
              <Controller
                name="payment_method"
                control={methods.control}
                render={({ field }) => (
                  <OrderSummarySidebarCard
                    cartItems={cart}
                    onUpdateQuantity={updateCartQty}
                    isSubmitting={isSubmitting}
                    paymentMethod={field.value}
                    selectedItemIds={selectedCartItemIds}
                    onToggleSelectAll={toggleSelectAllCartItems}
                    onToggleSelect={toggleSelectCartItem}
                  />
                )}
              />
            </div>

          </form>
        </FormProvider>
      </div>

      <OrderSuccessModal
        isOpen={!!orderSuccessData}
        data={orderSuccessData}
      />
    </div>
  );
}
