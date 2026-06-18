# Mô tả chức năng: Lịch sử & Theo dõi Đơn hàng (Orders & Tracking)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện quản lý toàn bộ đơn hàng của người dùng. Cho phép theo dõi tiến trình giao hàng theo thời gian thực (real-time timeline), xem lịch sử các đơn hàng cũ, thực hiện đặt lại nhanh (Reorder) hoặc hủy đơn hàng (kèm popup OTP xác nhận). Hỗ trợ tra cứu đơn cho khách hàng chưa đăng nhập thông qua số điện thoại.

**Đối tượng**

- Khách hàng đã đăng nhập.
- Khách vãng lai muốn tra cứu nhanh đơn hàng bằng Số điện thoại.

**Mục đích**

Mang đến sự yên tâm và minh bạch về trạng thái giao nhận bữa ăn nóng hổi, đồng thời nâng cao doanh số thông qua nút Đặt lại đơn hàng cũ tiện lợi.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=6-532` (Lịch sử & Trạng thái đơn)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-4891` (Đặt hàng thành công & Theo dõi đơn)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=349-1250` (Popup OTP hủy đơn)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=352-1601` (Đơn hàng chưa đăng nhập)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-135` (Popup chi tiết lịch sử đơn)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=141-2` (Popup đánh giá món ăn)
- Spec popup liên quan: `popup/order_history_detail.md`, `popup/otp_order_confirm.md`, `popup/dish_review.md`, `popup/error.md`

---

## Luồng tiếp cận

- Click link "Đơn hàng" trên Header Navigation.
- Chuyển hướng tự động sau khi click "Đặt hàng thành công".
- Truy cập trực tiếp qua URL `/orders` hoặc `/orders/track`.

---

## Luồng giao diện

### Khách hàng đã đăng nhập
```text
Tải trang Quản lý đơn hàng `/orders`
    ↓
Đọc thông tin đơn hàng hiện tại đang xử lý (Mã đơn, dự kiến giao)
    ↓
Xem Timeline trạng thái đơn (Đã nhận -> Đang chế biến -> Đang giao -> Đã hoàn thành)
    ↓
Cuộn xuống xem Lịch sử đơn hàng cũ (Lọc theo tháng)
    ↓
Click "Xem chi tiết" -> Mở modal chi tiết đơn hàng (các món, giá, tổng cộng)
    ↓
Bấm "Đặt lại đơn này" -> Thêm lại toàn bộ món trong đơn vào giỏ hàng
```

### Khách hàng chưa đăng nhập (Tra cứu nhanh)
```text
Truy cập `/orders` ở trạng thái Guest
    ↓
Hiển thị form "Tra cứu đơn hàng cho khách"
    ↓
Nhập số điện thoại -> Nhấn "Tra cứu đơn hàng"
    ↓
Hiển thị danh sách các đơn hàng tương ứng kèm trạng thái giao hàng.
```

---

## Tính năng tương tác

### Theo dõi đơn hàng thời gian thực (Live Timeline)
- Thanh trạng thái trực quan kết nối dữ liệu từ `OrderTrackingLogs`.
- Trạng thái cập nhật động:
  - **Pending** (Đang chờ duyệt)
  - **Confirmed** (Đã nhận đơn)
  - **Preparing** (Đang chế biến - đầu bếp chuẩn bị)
  - **Delivering** (Đang giao - tài xế đang giao hàng, hiển thị khoảng cách)
  - **Completed** (Đã giao hàng thành công)
  - **Cancelled** (Đã hủy đơn)

### Hủy đơn & Popup OTP (Order Cancellation)
- Nút "Hủy đơn hàng" chỉ xuất hiện khi đơn đang ở trạng thái `Pending` hoặc `Confirmed`.
- Nếu đơn hàng đã sang trạng thái `Preparing` (Đang chế biến), khi click hủy đơn hệ thống hiển thị Popup lỗi: *"Đơn hàng này không thể hủy vì đang trong quá trình chế biến. Chúng tôi cam kết mang đến bữa ăn tươi ngon nhất..."*
- Nếu hợp lệ, mở Popup OTP: yêu cầu nhập mã OTP (4 hoặc 6 số) gửi qua số điện thoại để hoàn tất việc hủy đơn bảo mật.

### Đặt lại đơn hàng cũ (Reorder)
- Nút "Đặt lại" ở mỗi thẻ đơn hàng cũ trong lịch sử sẽ tự động copy tất cả món ăn (đúng kích cỡ size) và thêm vào giỏ hàng hiện tại, điều hướng nhanh tới trang Checkout.
- Chi tiết popup lịch sử đơn được mô tả tại `popup/order_history_detail.md`.

### Đánh giá món ăn
- Với đơn hàng đã hoàn thành, người dùng có thể mở Popup đánh giá món ăn từ lịch sử đơn hoặc chi tiết đơn.
- Chi tiết hành vi tại `popup/dish_review.md`.

---

## Phân rã theo Atomic Design

### Atoms
- Status Badge (Hoàn tất, Đang chế biến, Đã hủy)
- OTP Input field (6 ô nhập số rời)
- Input Phone number (Guest lookup)
- Timeline Node (Mốc thời gian giao)

### Molecules
- Current Order Status Panel (Mã đơn + Dự kiến giao + Timeline)
- Past Order Card (Ngày mua, Mã đơn, số món, số tiền, nút Xem chi tiết/Đặt lại)

### Organisms
- Guest Order Lookup Panel
- Active Order Tracker Panel
- Order History List
- OTP Cancellation Verification Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Order ↔ UserExtended | Many-to-One |
| Order ↔ OrderItem | One-to-Many |
| Order ↔ OrderTrackingLog | One-to-Many |

---

# Types & Services

> File: `type/orders.types.ts`

```ts
export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Delivering' | 'Completed' | 'Cancelled';

export type TrackingLog = {
  status: OrderStatus;
  logged_at: string;
};

export type OrderItemDetail = {
  dish_name: string;
  size_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type OrderDetail = {
  id: string;
  order_code: string;
  order_status: OrderStatus;
  total_amount: number;
  contact_name: string;
  contact_phone: string;
  shipping_address: string;
  created_at: string;
  estimated_shipped_time?: string;
  items: OrderItemDetail[];
  tracking_logs: TrackingLog[];
};

export type GuestLookupInput = {
  phone: string;
};
```

---

# API Services

## API 1 - Lấy danh sách đơn hàng của người dùng đăng nhập

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/orders` (populate items & tracking logs) |
| Service | `getUserOrders()` |
| Input | `void` |
| Output | `OrderDetail[]` |

## API 2 - Tra cứu đơn hàng dành cho khách (Guest lookup)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/orders/guest-lookup?phone={phone}` |
| Service | `lookupGuestOrders(phone)` |
| Input | `phone: string` |
| Output | `OrderDetail[]` |

## API 3 - Hủy đơn hàng & Gửi OTP

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/orders/{id}/cancel-request` và `/api/orders/{id}/cancel-confirm` |
| Service | `requestCancelOrder(id)`, `confirmCancelOrder(id, otpCode)` |
| Input | `id: string`, `otpCode?: string` |
| Output | `{ success: boolean, message: string }` |
