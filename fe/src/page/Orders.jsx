import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { requestCancelOrder, confirmCancelOrder, getOrderDetail } from '../service/ordersService';
import { fetchDishDetail } from '../service/menuService';
import { useUserOrders, useGuestOrdersMutation } from '../hook/useOrders';
import { ActiveOrderPanel } from '../component/organism/Orders/ActiveOrderPanel';
import { OrderHistoryList } from '../component/organism/Orders/OrderHistoryList';
import { OrderDetailModal } from '../component/organism/Orders/OrderDetailModal';
import { CancelOrderModal } from '../component/organism/Orders/CancelOrderModal';
import { ReorderConfirmModal } from '../component/organism/Orders/ReorderConfirmModal';

export default function Orders() {
  const { user, addMultipleToCart } = useApp();
  const navigate = useNavigate();

  // Queries and mutations
  const { data: userOrdersData, isLoading: loading, refetch: refetchUserOrders } = useUserOrders(user?.id);
  const { mutateAsync: mutateGuestLookup, data: guestOrdersData, isPending: lookupLoading, reset: resetGuestOrders } = useGuestOrdersMutation();

  const orders = userOrdersData || { activeOrder: null, historyOrders: [] };

  // Guest lookup states
  const [guestPhone, setGuestPhone] = useState('');

  // Modals state
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [viewingDetailOrder, setViewingDetailOrder] = useState(null);
  const [reorderingOrder, setReorderingOrder] = useState(null);

  const [globalError, setGlobalError] = useState('');

  const handleGuestLookup = async (e) => {
    e.preventDefault();
    if (!guestPhone) return;
    setGlobalError('');
    try {
      await mutateGuestLookup(guestPhone);
    } catch {
      setGlobalError('Không tìm thấy đơn hàng của số điện thoại này.');
    }
  };

  const handleStartCancel = async (order) => {
    setGlobalError('');
    try {
      const res = await requestCancelOrder(order.id);
      if (res.success) {
        setCancellingOrder(order);
      } else {
        setGlobalError(res.message);
      }
    } catch (err) {
      setGlobalError(err.message || 'Lỗi khi yêu cầu hủy đơn.');
    }
  };

  const handleConfirmCancelSubmit = async (otpCode) => {
    setGlobalError('');
    try {
      const res = await confirmCancelOrder(cancellingOrder.id, otpCode);
      if (res.success) {
        await refetchUserOrders();
        if (guestOrdersData) {
          await mutateGuestLookup(guestPhone);
        }
        setCancellingOrder(null);
      }
    } catch (err) {
      setGlobalError(err.message || 'Mã OTP không đúng.');
    }
  };

  const handleStartReorder = async (summaryOrder) => {
    try {
      setGlobalError('');
      // Need full order detail to get items
      const fullOrder = await getOrderDetail(summaryOrder.id);
      setReorderingOrder(fullOrder);
      if (viewingDetailOrder) {
        setViewingDetailOrder(null);
      }
    } catch {
      setGlobalError('Lỗi khi tải chi tiết đơn hàng để đặt lại.');
    }
  };

  const handleConfirmReorder = async (order) => {
    try {
      setGlobalError('');

      const itemsToAdd = [];
      for (const item of order.items) {
        let calories = 0, protein = 0, fat = 0, carb = 0;
        let freshName = item.dish_name;
        let freshImage = item.image_url;

        if (item.dish_id) {
          try {
            const dish = await fetchDishDetail(item.dish_id);
            freshName = dish.dish_name;
            freshImage = dish.image_url;
            const sizeData = dish.sizes.find(s => s.size_name === item.size_name) || dish.sizes[0];
            if (sizeData) {
              calories = sizeData.calories;
              protein = sizeData.protein;
              fat = sizeData.fat;
              carb = sizeData.carb;
            }
          } catch(err) {
            console.error(err);
            // fallback to 0 if dish fetch fails
          }
        }

        itemsToAdd.push({
          dish_id: item.dish_id || `dish_${Date.now()}`,
          dish_name: freshName,
          image_url: freshImage,
          size_name: item.size_name,
          price: item.unit_price,
          quantity: item.quantity,
          calories,
          protein,
          fat,
          carb
        });
      }

      // Append new items to existing cart
      addMultipleToCart(itemsToAdd);

      setReorderingOrder(null);
      navigate('/menu');
    } catch (err) {
      console.error(err);
      setGlobalError('Lỗi khi thêm món vào giỏ hàng.');
    }
  };

  const formatGuestOrders = (gOrders) => {
    let parsed = { activeOrder: null, historyOrders: [] };
    if (gOrders && gOrders.length > 0) {
      const sorted = [...gOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const newestOrder = sorted[0];
      if (newestOrder.order_status !== 'Completed' && newestOrder.order_status !== 'Cancelled') {
        parsed.activeOrder = newestOrder;
        parsed.historyOrders = sorted.slice(1);
      } else {
        parsed.historyOrders = sorted;
      }
    }
    return parsed;
  };

  const renderOrdersDashboard = (dashboardOrders, isGuest = false) => (
    <div className="flex flex-col flex-1 min-h-0 bg-bg-main mt-4">
      {isGuest && (
        <div className="shrink-0 mb-6">
          <button
            onClick={() => { resetGuestOrders(); setGuestPhone(''); }}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 bg-primary/5 px-4 py-2 rounded-xl w-fit"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            Tra cứu số điện thoại khác
          </button>
        </div>
      )}

      {/* Active order panel */}
      <div className="shrink-0 mb-8">
        {!dashboardOrders.activeOrder ? (
          <div>
            <h2 className="text-sm font-bold text-text-main mb-4">Đơn hàng hiện tại</h2>
            <div className="rounded-2xl border border-border-light bg-bg-card p-6 text-center text-text-muted text-xs shadow-sm">
              Hiện không có đơn hàng nào đang trong quá trình xử lý.
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ActiveOrderPanel
              key={dashboardOrders.activeOrder.id}
              order={dashboardOrders.activeOrder}
              onViewDetail={setViewingDetailOrder}
              onCancel={handleStartCancel}
            />
          </div>
        )}
      </div>

      {/* Past orders list */}
      <div className="pt-4 border-t border-border-light flex flex-col flex-1 min-h-0">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-sm font-bold text-text-main">Lịch sử đơn hàng</h2>
          {!isGuest && (
            <button className="text-xs font-bold text-text-muted hover:text-text-main transition flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M7 12h10M10 18h4" /></svg> Lọc theo tháng
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-12 custom-scrollbar">
          <OrderHistoryList
            orders={dashboardOrders.historyOrders}
            onViewDetail={setViewingDetailOrder}
            onReorder={handleStartReorder}
          />
          {dashboardOrders.historyOrders.length > 0 && (
            <div className="text-center mt-6">
              <p className="text-xs text-text-muted">Đã xem hết đơn hàng</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-x-0 bottom-0 top-[80px] overflow-hidden flex flex-col bg-bg-main page-enter">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col h-full overflow-hidden">
        {globalError && (
          <div className="mb-4 rounded-xl bg-danger-light p-4 text-sm font-bold text-danger border border-danger/20 flex items-center gap-3 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {globalError}
          </div>
        )}

        {/* Title */}
        <div className="shrink-0 mb-2">
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Lịch sử & Trạng thái đơn hàng</h1>
          <p className="text-xs text-text-muted mt-0.5">Theo dõi các bữa ăn dinh dưỡng đang đến với bạn.</p>
        </div>

        {/* 2. LOGGED-IN USERS SCREEN */}
        {user && (
          loading ? (
            <div className="animate-pulse rounded-2xl border border-border-light bg-bg-card p-6 h-40 mt-8"></div>
          ) : (
            renderOrdersDashboard(orders, false)
          )
        )}

        {/* 3. GUEST (UNAUTHENTICATED) ORDERS LOOKUP SCREEN */}
        {!user && (
          guestOrdersData ? (
            renderOrdersDashboard(formatGuestOrders(guestOrdersData), true)
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0 pb-12 pt-8">
              <div className="max-w-md mx-auto bg-bg-card border border-border-light rounded-2xl p-6 sm:p-8 shadow-premium space-y-6">
                <div className="text-center space-y-1.5">
                  <h2 className="text-lg font-bold text-text-main">Tra cứu đơn hàng cho khách</h2>
                  <p className="text-xs text-text-muted">Nhập số điện thoại để xem trạng thái đơn hàng của bạn.</p>
                </div>

                <form onSubmit={handleGuestLookup} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                      Số điện thoại của bạn
                    </label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="Ví dụ: 0901234567"
                      className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="w-full rounded-xl bg-primary py-3 text-center text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition"
                  >
                    {lookupLoading ? 'Đang tra cứu...' : 'Tra cứu đơn hàng'}
                  </button>
                </form>
              </div>
            </div>
          )
        )}

      </div>

      {/* Modals rendered atomically */}
      <OrderDetailModal
        order={viewingDetailOrder}
        onClose={() => setViewingDetailOrder(null)}
        onReorder={handleStartReorder}
      />

      <CancelOrderModal
        order={cancellingOrder}
        onClose={() => setCancellingOrder(null)}
        onConfirm={handleConfirmCancelSubmit}
      />

      <ReorderConfirmModal
        order={reorderingOrder}
        onClose={() => setReorderingOrder(null)}
        onConfirm={handleConfirmReorder}
      />
    </div>
  );
}
