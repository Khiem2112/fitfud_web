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
  const [itemToRemove, setItemToRemove] = useState(null); // ID of item to remove, triggers modal if cart.length === 1
  const navigate = useNavigate();

  // Use checkout draft hook
  const { getDraftFormData, updateDraft, clearDraft } = useCheckoutDraft();

  const handleRemoveItem = (id) => {
    if (cart.length === 1) {
      setItemToRemove(id);
    } else {
      removeFromCart(id);
    }
  };

  const confirmRemoveLastItem = () => {
    clearDraft();
    clearCart();
    setItemToRemove(null);
    navigate('/menu');
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

      const orderUserId = user ? user.id : 'guest';
      const res = await createOrder(payload, orderUserId);

      clearCart();
      clearDraft(); // Wipe draft on success
      setOrderSuccessData({ ...res, contact_phone: payload.contact_phone });
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
                      onRemoveItem={handleRemoveItem}
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

      {/* Remove Last Item Warning Modal */}
      {itemToRemove && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="relative bg-white rounded-2xl w-full max-w-[400px] flex flex-col shadow-premium-lg animate-fade-in-up p-6 items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 shadow-sm border border-red-100">
              <i className="bi bi-exclamation-triangle text-2xl text-red-500"></i>
            </div>
            <h2 className="text-xl font-bold text-text-main mb-2">Huỷ thanh toán?</h2>
            <p className="text-text-muted text-sm mb-6">
              Bạn có chắc chắn muốn xoá sản phẩm cuối cùng và hủy thanh toán không? Thông tin giao hàng của bạn cũng sẽ bị xoá.
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl border border-border-light text-text-main font-semibold hover:bg-bg-main transition-colors text-sm"
                onClick={() => setItemToRemove(null)}
              >
                Không, giữ lại
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors shadow-sm text-sm"
                onClick={confirmRemoveLastItem}
              >
                Có, huỷ thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
