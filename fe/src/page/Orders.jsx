import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getUserOrders, lookupGuestOrders, requestCancelOrder, confirmCancelOrder } from '../service/ordersService';

export default function Orders() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const successCode = searchParams.get('success_code');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Guest lookup states
  const [guestPhone, setGuestPhone] = useState('');
  const [guestOrders, setGuestOrders] = useState(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  // Cancel order state machine
  const [cancellingOrder, setCancellingOrder] = useState(null); // Order object being cancelled
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [cancelLoading, setCancelLoading] = useState(false);

  // General detail modal
  const [viewingDetailOrder, setViewingDetailOrder] = useState(null);

  // Load orders for logged in users
  const loadUserOrders = async () => {
    if (user) {
      setLoading(true);
      try {
        const data = await getUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserOrders();
  }, [user]);

  const handleGuestLookup = async (e) => {
    e.preventDefault();
    if (!guestPhone) return;
    setLookupLoading(true);
    try {
      const data = await lookupGuestOrders(guestPhone);
      setGuestOrders(data);
    } catch (err) {
      alert('Không tìm thấy đơn hàng của số điện thoại này.');
    } finally {
      setLookupLoading(false);
    }
  };

  const handleStartCancel = async (order) => {
    setCancelError('');
    setCancelSuccess('');
    setOtpSent(false);
    setOtpCode('');

    setCancelLoading(true);
    try {
      const res = await requestCancelOrder(order.id);
      if (res.success) {
        setCancellingOrder(order);
        setOtpSent(true);
      } else {
        // Figma logic: Show the custom cooking warning
        alert(res.message);
      }
    } catch (err) {
      alert(err.message || 'Lỗi khi yêu cầu hủy đơn.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleConfirmCancelSubmit = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setCancelLoading(true);
    setCancelError('');
    try {
      const res = await confirmCancelOrder(cancellingOrder.id, otpCode);
      if (res.success) {
        setCancelSuccess(res.message);

        // Reload order list
        await loadUserOrders();
        if (guestOrders) {
          // Reload guest lookup too
          const data = await lookupGuestOrders(guestPhone);
          setGuestOrders(data);
        }

        setTimeout(() => {
          setCancellingOrder(null);
          setOtpSent(false);
        }, 1500);
      }
    } catch (err) {
      setCancelError(err.message || 'Mã OTP không đúng.');
    } finally {
      setCancelLoading(false);
    }
  };

  const getTimelineProgress = (status) => {
    const steps = ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Completed'];
    const currentIdx = steps.indexOf(status);
    if (currentIdx === -1) return 0;
    return (currentIdx / (steps.length - 1)) * 100;
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Confirmed': return 'Đã nhận';
      case 'Preparing': return 'Đang chế biến';
      case 'Delivering': return 'Đang giao';
      case 'Completed': return 'Hoàn tất';
      case 'Cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 page-enter space-y-8">

      {/* 1. ORDER SUCCESS HIGHLIGHT BANNER */}
      {successCode && (
        <div className="rounded-3xl bg-primary-light border-2 border-primary/20 p-6 sm:p-8 shadow-premium text-center space-y-4 page-enter">
          <span className="text-4xl block">🎉</span>
          <h1 className="text-2xl font-extrabold text-primary">Đặt hàng thành công!</h1>
          <p className="text-sm text-text-main font-medium">
            Cảm ơn bạn đã tin tưởng lựa chọn FitFud cho hành trình sống khỏe.
          </p>
          <div className="max-w-md mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-primary/10 text-left text-xs">
            <div>
              <span className="text-text-muted block">Mã đơn hàng</span>
              <span className="font-extrabold text-text-main text-sm">#{successCode}</span>
            </div>
            <div>
              <span className="text-text-muted block">Dự kiến giao hàng</span>
              <span className="font-bold text-text-main text-sm">11:30 - 12:00, Hôm nay</span>
            </div>
          </div>
          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchParams({});
                loadUserOrders();
              }}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-premium hover:bg-primary-dark transition"
            >
              Theo dõi đơn hàng
            </button>
            <button
              onClick={() => {
                setSearchParams({});
                navigate('/');
              }}
              className="rounded-xl border border-border-light bg-bg-card px-6 py-2.5 text-xs font-bold text-text-main hover:bg-bg-main transition"
            >
              Tiếp tục xem thực đơn
            </button>
          </div>
        </div>
      )}

      {/* Title */}
      {!successCode && (
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Lịch sử & Trạng thái đơn hàng</h1>
          <p className="text-xs text-text-muted mt-0.5">Theo dõi các bữa ăn dinh dưỡng đang đến với bạn.</p>
        </div>
      )}

      {/* 2. LOGGED-IN USERS SCREEN */}
      {user && !successCode && (
        <div className="space-y-8">

          {/* Active order panel */}
          {loading ? (
            <div className="animate-pulse rounded-2xl border border-border-light bg-bg-card p-6 h-40"></div>
          ) : (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-main mb-4">Đơn hàng hiện tại</h2>
              {orders.filter((o) => o.order_status !== 'Completed' && o.order_status !== 'Cancelled').length === 0 ? (
                <div className="rounded-2xl border border-border-light bg-bg-card p-6 text-center text-text-muted text-xs shadow-sm">
                  Hiện không có đơn hàng nào đang trong quá trình xử lý.
                </div>
              ) : (
                <div className="space-y-6">
                  {orders
                    .filter((o) => o.order_status !== 'Completed' && o.order_status !== 'Cancelled')
                    .map((order) => (
                      <div key={order.id} className="rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium space-y-6">

                        {/* Header details */}
                        <div className="flex justify-between items-start gap-4 flex-wrap border-b border-border-light pb-4">
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold">Mã đơn hàng</span>
                            <h3 className="font-extrabold text-text-main text-base">#{order.order_code}</h3>
                          </div>
                          <div>
                            <span className="text-[10px] text-text-muted uppercase font-bold">Dự kiến giao</span>
                            <p className="font-bold text-text-main text-xs">{order.estimated_shipped_time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingDetailOrder(order)}
                              className="rounded-xl border border-border-light bg-bg-card px-4 py-2 text-xs font-bold text-text-main hover:bg-bg-main transition"
                            >
                              Xem chi tiết
                            </button>
                            <button
                              onClick={() => handleStartCancel(order)}
                              className="rounded-xl bg-danger-light border border-danger/20 px-4 py-2 text-xs font-bold text-danger hover:bg-danger hover:text-white transition"
                            >
                              Hủy đơn
                            </button>
                          </div>
                        </div>

                        {/* Interactive timeline tracking map */}
                        <div className="space-y-4">
                          <p className="text-xs font-bold text-text-main">Tiến trình vận đơn:</p>
                          <div className="relative pt-2">
                            {/* Track bar background */}
                            <div className="absolute top-4 left-0 right-0 h-1 bg-border-light rounded-full -translate-y-1/2"></div>
                            {/* Active track bar fill */}
                            <div
                              className="absolute top-4 left-0 h-1 bg-primary rounded-full -translate-y-1/2 transition-all duration-500"
                              style={{ width: `${getTimelineProgress(order.order_status)}%` }}
                            ></div>

                            {/* Timeline checkpoints */}
                            <div className="flex justify-between relative">
                              {['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Completed'].map((s, idx) => {
                                const steps = ['Pending', 'Confirmed', 'Preparing', 'Delivering', 'Completed'];
                                const isPassed = steps.indexOf(order.order_status) >= idx;
                                const isActive = order.order_status === s;

                                return (
                                  <div key={s} className="text-center flex flex-col items-center max-w-[80px]">
                                    <div
                                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition duration-300 ${isPassed
                                        ? 'bg-primary border-primary text-white'
                                        : 'bg-bg-card border-border-light text-text-muted'
                                        } ${isActive ? 'ring-4 ring-primary-light ring-offset-0 scale-110' : ''}`}
                                    >
                                      {idx + 1}
                                    </div>
                                    <span className={`text-[10px] mt-2 block ${isPassed ? 'text-text-main font-bold' : 'text-text-muted'}`}>
                                      {translateStatus(s)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Past orders History lists */}
          {(!loading) && (
            <div>
              <div className="flex items-center justify-between border-b border-border-light pb-3 mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-text-main">Lịch sử đơn hàng</h2>
                <span className="text-xs text-text-muted">Lọc theo tháng (Gần nhất)</span>
              </div>

              {orders.filter((o) => o.order_status === 'Completed' || o.order_status === 'Cancelled').length === 0 ? (
                <div className="rounded-2xl border border-border-light bg-bg-card p-6 text-center text-text-muted text-xs shadow-sm">
                  Bạn chưa mua đơn hàng nào trước đây.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders
                    .filter((o) => o.order_status === 'Completed' || o.order_status === 'Cancelled')
                    .map((order) => {
                      const completed = order.order_status === 'Completed';
                      return (
                        <div key={order.id} className="rounded-2xl border border-border-light bg-bg-card p-5 shadow-premium flex flex-col justify-between gap-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] text-text-muted font-bold">15 Tháng 5, 2026</p>
                              <h4 className="text-sm font-bold text-text-main mt-0.5">Đơn hàng #{order.order_code}</h4>
                            </div>
                            <span className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase ${completed ? 'bg-primary-light text-primary' : 'bg-danger-light text-danger'
                              }`}>
                              {translateStatus(order.order_status)}
                            </span>
                          </div>

                          <div className="text-xs text-text-muted space-y-1">
                            <p>{order.items.length} món ăn</p>
                            <p className="font-bold text-text-main">{order.total_amount.toLocaleString('vi-VN')}đ</p>
                          </div>

                          <div className="flex items-center gap-2 border-t border-border-light pt-3">
                            <button
                              onClick={() => setViewingDetailOrder(order)}
                              className="flex-1 rounded-lg border border-border-light bg-bg-card py-2 text-xs font-bold text-text-main hover:bg-bg-main transition"
                            >
                              Chi tiết
                            </button>
                            <button
                              onClick={() => {
                                // Add items back to cart
                                alert('Đã thêm các món của đơn hàng này vào giỏ!');
                                navigate('/checkout');
                              }}
                              className="flex-1 rounded-lg bg-primary py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-dark transition"
                            >
                              Đặt lại
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 3. GUEST (UNAUTHENTICATED) ORDERS LOOKUP SCREEN */}
      {!user && (
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

          {/* Guest lookup results listing */}
          {guestOrders !== null && (
            <div className="border-t border-border-light pt-6 mt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-main">
                Kết quả tra cứu ({guestOrders.length} đơn)
              </h3>

              {guestOrders.length === 0 ? (
                <p className="text-xs text-text-muted text-center py-4">Chưa có thông tin tra cứu cho số điện thoại này.</p>
              ) : (
                <div className="space-y-4">
                  {guestOrders.map((order) => (
                    <div key={order.id} className="border border-border-light rounded-xl p-4 bg-bg-main space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-text-main">#{order.order_code}</span>
                        <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${order.order_status === 'Completed' ? 'bg-primary-light text-primary' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {translateStatus(order.order_status)}
                        </span>
                      </div>
                      <div className="text-[11px] text-text-muted leading-relaxed">
                        <p>Người nhận: {order.contact_name}</p>
                        <p>Địa chỉ: {order.shipping_address}</p>
                        <p className="font-bold text-text-main mt-1">Tổng cộng: {order.total_amount.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingDetailOrder(order)}
                          className="w-full rounded bg-bg-card border py-1.5 text-[10px] font-bold text-text-main hover:bg-border-light transition"
                        >
                          Xem chi tiết
                        </button>
                        {(order.order_status === 'Pending' || order.order_status === 'Confirmed') && (
                          <button
                            onClick={() => handleStartCancel(order)}
                            className="w-full rounded bg-danger-light border border-danger/10 py-1.5 text-[10px] font-bold text-danger hover:bg-danger hover:text-white transition"
                          >
                            Hủy đơn
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* OTP VERIFICATION MODAL FOR CANCELLATION */}
      {cancellingOrder && otpSent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancellingOrder(null)}></div>

          <div className="relative w-full max-w-sm rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium-lg page-enter space-y-5 text-center">
            <h3 className="text-base font-bold text-text-main">Xác thực hủy đơn hàng</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Vui lòng nhập mã OTP vừa được gửi đến số điện thoại <span className="font-bold text-text-main">{cancellingOrder.contact_phone}</span> để xác minh hủy đơn hàng <span className="font-bold text-text-main">#{cancellingOrder.order_code}</span>.
            </p>

            {cancelError && (
              <div className="rounded-lg bg-danger-light border border-danger/30 p-2 text-[10px] font-bold text-danger">
                ⚠️ {cancelError}
              </div>
            )}
            {cancelSuccess && (
              <div className="rounded-lg bg-primary-light border border-primary/30 p-2 text-[10px] font-bold text-primary">
                ✓ {cancelSuccess}
              </div>
            )}

            <form onSubmit={handleConfirmCancelSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Mã OTP thử nghiệm: 1234"
                  maxLength={6}
                  className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-3 text-center text-sm font-bold focus:border-primary focus:outline-none tracking-widest transition"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="w-full rounded-xl border border-border-light bg-bg-card py-2.5 text-xs font-bold text-text-main hover:bg-bg-main transition"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={cancelLoading}
                  className="w-full rounded-xl bg-danger py-2.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition"
                >
                  {cancelLoading ? 'Đang xử lý...' : 'Xác nhận hủy đơn'}
                </button>
              </div>
            </form>
            <p className="text-[10px] text-text-muted">Chưa nhận được mã? Gửi lại mã (59s)</p>
          </div>
        </div>
      )}

      {/* GENERAL ORDER DETAILS VIEW MODAL */}
      {viewingDetailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewingDetailOrder(null)}></div>

          <div className="relative w-full max-w-md rounded-2xl border border-border-light bg-bg-card p-6 shadow-premium-lg page-enter space-y-5">
            <button
              onClick={() => setViewingDetailOrder(null)}
              className="absolute top-4 right-4 rounded-full p-2 text-text-muted hover:bg-bg-main transition"
            >
              ✕
            </button>

            <div className="border-b border-border-light pb-3">
              <h3 className="text-base font-bold text-text-main">Chi tiết đơn hàng</h3>
              <p className="text-[10px] text-text-muted mt-0.5">Mã đơn: #{viewingDetailOrder.order_code}</p>
            </div>

            {/* Dish lists */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-text-main">Danh sách món ăn:</p>
              {viewingDetailOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-border-light pb-2">
                  <div>
                    <p className="font-bold text-text-main">{item.dish_name}</p>
                    <p className="text-[10px] text-text-muted">Kích cỡ: {item.size_name} | SL: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-text-main">{item.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            {/* Recipient Details */}
            <div className="text-xs text-text-muted space-y-1 bg-bg-main p-3 rounded-xl border border-border-light">
              <p className="font-bold text-text-main text-[11px] mb-1">Thông tin giao nhận:</p>
              <p>Người nhận: <span className="text-text-main font-medium">{viewingDetailOrder.contact_name}</span></p>
              <p>Số điện thoại: <span className="text-text-main font-medium">{viewingDetailOrder.contact_phone}</span></p>
              <p className="leading-relaxed">Địa chỉ: <span className="text-text-main font-medium">{viewingDetailOrder.shipping_address}</span></p>
            </div>

            {/* Cost Summary */}
            <div className="text-xs text-text-muted space-y-2 border-t border-border-light pt-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{(viewingDetailOrder.total_amount - 15000).toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span>15.000đ</span>
              </div>
              <div className="flex justify-between font-bold text-text-main pt-2 border-t border-border-light text-sm">
                <span>Tổng cộng</span>
                <span className="text-primary">{viewingDetailOrder.total_amount.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            <button
              onClick={() => setViewingDetailOrder(null)}
              className="w-full rounded-xl bg-primary py-2.5 text-center text-xs font-bold text-white hover:bg-primary-dark transition"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
