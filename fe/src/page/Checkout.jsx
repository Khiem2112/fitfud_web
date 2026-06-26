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
import QuickViewModal from '../component/organism/Menu/QuickViewModal';
import { fetchDishDetail } from '../service/menuService';

export default function Checkout() {
  const { user, cart, updateCartQty, removeFromCart, addToCart, clearCart, selectedCartItemIds, toggleSelectAllCartItems, toggleSelectCartItem } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [editingCartItem, setEditingCartItem] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const navigate = useNavigate();

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

  const handleEditCartItem = async (item) => {
    try {
      const dish = await fetchDishDetail(item.dish_id);
      setEditingCartItem(item);
      setEditingDish(dish);
    } catch {
      setGlobalError('Không thể mở chi tiết món để chỉnh sửa.');
    }
  };

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
    <div className="mx-auto max-w-[1280px] px-3 py-4 lg:py-5">
      <div className="flex flex-col gap-4 w-full bg-[#FAFAFA] rounded-xl p-3 sm:p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <h1 className="font-be-vietnam text-[24px] font-bold leading-tight text-brand-main">
            Hoàn tất đơn hàng
          </h1>
        </div>

        {globalError && (
          <div className="rounded-[12px] bg-red-100 border border-red-200 p-4 text-[14px] font-medium text-red-600">
            {globalError}
          </div>
        )}
        {!user && (
          <div className="rounded-[12px] border border-primary/20 bg-primary/5 p-4 text-sm text-primary-dark">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">FitFud đã giữ sẵn tài khoản tạm cho bạn.</p>
                <p className="text-text-muted">Xác thực lại để lưu đơn hàng, địa chỉ và thông tin mua hàng vào tài khoản mới.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const values = methods.getValues();
                  const params = new URLSearchParams({
                    mode: 'register',
                    name: values.contact_name || '',
                    phone: values.contact_phone || ''
                  });
                  navigate(`/auth?${params.toString()}`);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition"
              >
                <i className="bi bi-person-plus" aria-hidden="true" />
                Tạo tài khoản từ thông tin này
              </button>
            </div>
          </div>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative">

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
            <div className="lg:col-span-4 relative">
              <div className="sticky top-[88px]">
                <Controller
                  name="payment_method"
                  control={methods.control}
                  render={({ field }) => (
                    <OrderSummarySidebarCard
                      cartItems={cart}
                      onUpdateQuantity={updateCartQty}
                      onRemoveItem={removeFromCart}
                      onEditItem={handleEditCartItem}
                      isSubmitting={isSubmitting}
                      paymentMethod={field.value}
                      selectedItemIds={selectedCartItemIds}
                      onToggleSelectAll={toggleSelectAllCartItems}
                      onToggleSelect={toggleSelectCartItem}
                    />
                  )}
                />
              </div>
            </div>

          </form>
        </FormProvider>
      </div>

      <OrderSuccessModal
        isOpen={!!orderSuccessData}
        data={orderSuccessData}
      />
      {editingCartItem && editingDish && (
        <QuickViewModal
          dish={editingDish}
          initialCartItem={editingCartItem}
          submitLabel="Lưu thay đổi"
          successMessage={`Đã cập nhật ${editingDish.dish_name} thành công`}
          onClose={() => {
            setEditingCartItem(null);
            setEditingDish(null);
          }}
          onAddToCart={(updatedItem) => {
            removeFromCart(editingCartItem.id);
            addToCart(updatedItem, false);
            setEditingCartItem(null);
            setEditingDish(null);
          }}
        />
      )}
    </div>
  );
}
