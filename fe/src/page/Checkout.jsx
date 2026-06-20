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
import { useCheckoutDraft } from '../hook/useCheckoutDraft';

export default function Checkout() {
  const { user, cart, updateCartQty, clearCart } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Use checkout draft hook
  const { getDraftFormData, updateDraft, clearDraft } = useCheckoutDraft();

  // Selection state: defaults to all cart items
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [hasInitializedSelection, setHasInitializedSelection] = useState(false);

  useEffect(() => {
    // Initialize selection when cart loads only ONCE
    if (cart.length > 0 && !hasInitializedSelection) {
      setSelectedItemIds(cart.map(item => item.id));
      setHasInitializedSelection(true);
    }
  }, [cart, hasInitializedSelection]);

  const handleToggleSelectAll = () => {
    if (selectedItemIds.length === cart.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(cart.map(item => item.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItemIds(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: getDraftFormData() || {
      contact_name: user?.full_name || '',
      contact_phone: user?.phone || '',
      shipping_address: '',
      cityId: '',
      districtId: '',
      wardId: '',
      isDefaultAddress: false,
      payment_method: 'COD',
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
      isDefaultAddress: false,
      payment_method: 'COD',
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

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const onSubmit = async (data) => {
    setGlobalError('');

    if (!user) {
      setGlobalError('Bạn cần đăng nhập để đặt hàng.');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculate totals ONLY for selected items
      const selectedItems = cart.filter(item => selectedItemIds.includes(item.id));

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
        payment_method: data.payment_method,
        items: selectedItems.map((item) => ({
          dish_size_id: item.id,
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

      const res = await createOrder(payload, user.id);

      clearCart();
      clearDraft(); // Wipe draft on success
      navigate(`/orders?success_code=${res.order_code}`);
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
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center gap-2 px-4 py-2 rounded-[8px] border border-border-light bg-white text-text-secondary hover:text-primary hover:border-primary transition-colors shadow-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M4.06189 13C4.55399 16.9463 7.92038 20 12 20C15.3574 20 18.2317 17.9318 19.4185 15M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-be-vietnam text-[14px] font-medium">Làm mới form</span>
          </button>
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
                    selectedItemIds={selectedItemIds}
                    onToggleSelectAll={handleToggleSelectAll}
                    onToggleSelect={handleToggleSelect}
                  />
                )}
              />
            </div>

          </form>
        </FormProvider>
      </div>
    </div>
  );
}

