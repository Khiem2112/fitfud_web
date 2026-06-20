import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { fetchCities, fetchDistricts, fetchWards, createOrder } from '../service/checkoutService';

export default function Checkout() {
  const { user, cart, clearCart, getCartTotals } = useApp();
  const navigate = useNavigate();
  const totals = getCartTotals();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  // Recipient details states
  const [name, setName] = useState(user ? user.full_name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('10:30 - 11:00 (Hôm nay)');
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'Online'

  // Vietnam Administrative Divisions States
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Statuses
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState('');

  // Fetch Cities on mount
  useEffect(() => {
    fetchCities().then(setCities);
  }, []);

  // Fetch Districts when City changes
  const handleCityChange = async (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);
    setSelectedDistrict('');
    setSelectedWard('');
    setWards([]);
    if (cityId) {
      const data = await fetchDistricts(cityId);
      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  // Fetch Wards when District changes
  const handleDistrictChange = async (e) => {
    const distId = e.target.value;
    setSelectedDistrict(distId);
    setSelectedWard('');
    if (distId) {
      const data = await fetchWards(distId);
      setWards(data);
    } else {
      setWards([]);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrors('');

    if (!name || !phone || !shippingAddress || !selectedCity || !selectedDistrict || !selectedWard) {
      setErrors('Vui lòng nhập đầy đủ thông tin giao hàng cá nhân.');
      return;
    }

    if (!user) {
      setErrors('Bạn cần đăng nhập để đặt hàng.');
      navigate('/auth');
      return;
    }

    setLoading(true);
    try {
      const cityObj = cities.find((c) => c.id === selectedCity);
      const distObj = districts.find((d) => d.id === selectedDistrict);
      const wardObj = wards.find((w) => w.id === selectedWard);

      const fullAddressText = `${shippingAddress}, ${wardObj?.name}, ${distObj?.name}, ${cityObj?.name}`;

      const res = await createOrder(
        {
          contact_name: name,
          contact_phone: phone,
          shipping_address: fullAddressText,
          wardId: selectedWard,
          payment_method: paymentMethod,
          items: cart.map((item) => ({
            dish_size_id: item.id,
            dish_name: item.dish_name,
            size_name: item.size_name,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
          })),
          total_amount: totals.amount + 15000, // Subtotal + 15k delivery fee
          nutrition_summary: {
            calories: totals.calories,
            protein: totals.protein,
            carb: totals.carb,
            fat: totals.fat
          }
        },
        user.id
      );

      // Order created, clear cart state in context
      clearCart();
      // Redirect to Order Success tracking page
      navigate(`/orders?success_code=${res.order_code}`);
    } catch (err) {
      setErrors(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 page-enter space-y-8">
      
      <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Hoàn tất đơn hàng</h1>

      {errors && (
        <div className="rounded-xl bg-danger-light border border-danger/30 p-4 text-xs font-semibold text-danger text-center">
          ⚠️ {errors}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SHIPPING FORM (Left) */}
        <div className="lg:col-span-2 bg-bg-card border border-border-light rounded-2xl p-6 sm:p-8 shadow-premium space-y-6">
          <h2 className="text-base font-bold text-text-main border-b border-border-light pb-3">
            Địa chỉ giao hàng
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Họ và tên người nhận
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập họ và tên người nhận"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
              />
            </div>
          </div>

          {/* Vietnam Divisions selects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Tỉnh/Thành phố
              </label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2.5 text-xs focus:border-primary focus:outline-none transition"
              >
                <option value="">Chọn tỉnh/thành</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Quận/Huyện
              </label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedCity}
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2.5 text-xs focus:border-primary focus:outline-none transition disabled:opacity-40"
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
                Phường/Xã
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedDistrict}
                className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2.5 text-xs focus:border-primary focus:outline-none transition disabled:opacity-40"
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
              Địa chỉ cụ thể (Số nhà, tên đường, ngõ...)
            </label>
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Ví dụ: Số 285 Cách Mạng Tháng Tám"
              className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
            />
          </div>

          {/* Delivery window */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main mb-1.5">
              Khung giờ nhận hàng mong muốn
            </label>
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full rounded-xl border border-border-light bg-bg-main px-3 py-2.5 text-xs focus:border-primary focus:outline-none transition"
            >
              <option>10:30 - 11:00 (Hôm nay)</option>
              <option>11:00 - 11:30 (Hôm nay)</option>
              <option>11:30 - 12:00 (Hôm nay)</option>
              <option>17:30 - 18:30 (Hôm nay)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-main">
              Phương thức thanh toán
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`cursor-pointer rounded-xl border-2 p-4 flex justify-between items-center transition ${
                  paymentMethod === 'COD'
                    ? 'border-primary bg-primary-light/30'
                    : 'border-border-light hover:bg-bg-main/50'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-text-main">💵 Tiền mặt khi nhận hàng (COD)</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Thanh toán trực tiếp cho shipper khi giao đồ.</p>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === 'COD'}
                  readOnly
                  className="h-4 w-4 border-border-light text-primary focus:ring-primary"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('Online')}
                className={`cursor-pointer rounded-xl border-2 p-4 flex justify-between items-center transition ${
                  paymentMethod === 'Online'
                    ? 'border-primary bg-primary-light/30'
                    : 'border-border-light hover:bg-bg-main/50'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-text-main">💳 Thanh toán trực tuyến</p>
                  <p className="text-[10px] text-text-muted mt-0.5">Hỗ trợ thẻ Visa/Mastercard hoặc Ví MoMo.</p>
                </div>
                <input
                  type="radio"
                  checked={paymentMethod === 'Online'}
                  readOnly
                  className="h-4 w-4 border-border-light text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY (Right) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-bg-card border border-border-light rounded-2xl p-6 shadow-premium space-y-6">
            <h2 className="text-base font-bold text-text-main border-b border-border-light pb-3">
              Tóm tắt đơn hàng
            </h2>

            {/* Cart listing */}
            <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start gap-4 border-b border-border-light pb-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-text-main">{item.dish_name}</p>
                    <p className="text-[10px] text-text-muted">
                      Kích cỡ: {item.size_name} | SL: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-text-main">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>

            {/* Nutritional aggregate */}
            <div className="bg-primary-light/60 border border-primary-light rounded-xl p-3.5 space-y-2">
              <span className="block text-[10px] font-bold text-primary uppercase tracking-widest">
                Tổng Dinh Dưỡng Đơn
              </span>
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span className="text-text-muted">Năng lượng:</span>
                <span>{totals.calories} Kcal</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-text-main">
                <span className="text-text-muted">Đạm (Protein):</span>
                <span className="text-primary font-bold">{totals.protein}g</span>
              </div>
              <div className="flex justify-between text-xs text-text-muted text-[11px]">
                <span>Carbs: {totals.carb}g</span>
                <span>Fat: {totals.fat}g</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-text-muted border-t border-border-light pt-4">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span className="font-semibold text-text-main">{totals.amount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span className="font-semibold text-text-main">15.000đ</span>
              </div>
              {paymentMethod === 'Online' && (
                <div className="flex justify-between text-primary font-bold">
                  <span>Ưu đãi thanh toán Online (-5%)</span>
                  <span>-{(totals.amount * 0.05).toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              
              {/* Grand Total */}
              <div className="flex justify-between text-sm font-bold text-text-main pt-3 border-t border-border-light">
                <span>Tổng thanh toán</span>
                <span className="text-base font-extrabold text-primary">
                  {Math.round(
                    totals.amount + 15000 - (paymentMethod === 'Online' ? totals.amount * 0.05 : 0)
                  ).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            {/* Place Order submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3.5 text-center text-sm font-bold text-white shadow-premium hover:bg-primary-dark transition disabled:opacity-50"
            >
              {loading ? 'Đang gửi đơn hàng...' : 'Đặt hàng ngay'}
            </button>
            <p className="text-[10px] text-text-muted text-center italic">
              🔒 Giao dịch bảo mật chuẩn SSL mã hóa
            </p>
          </div>
        </div>

      </form>
    </div>
  );
}
