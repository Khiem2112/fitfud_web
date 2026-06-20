# Mô tả popup: Chi tiết lịch sử đơn

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup hiển thị chi tiết một đơn hàng trong lịch sử, bao gồm danh sách món, thông tin giao hàng, trạng thái và tổng tiền.

**Đối tượng**

- Người dùng đã đăng nhập.
- Khách vãng lai tra cứu đơn bằng số điện thoại nếu hệ thống cho phép xem chi tiết.

**Mục đích**

Giúp người dùng kiểm tra lại nội dung đơn hàng cũ và thực hiện thao tác đặt lại nếu cần.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-135` (Popup chi tiết lịch sử đơn)

---

## Luồng tiếp cận

- Click "Xem chi tiết" trên đơn hàng trong trang Lịch sử & Theo dõi Đơn hàng.

---

## Luồng giao diện

```text
Click "Xem chi tiết"
    ↓
Mở popup và load orderId
    ↓
Hiển thị thông tin đơn hàng, món, phí và trạng thái
    ↓
Người dùng chọn:
  ↳ Đặt lại đơn này -> Thêm món vào giỏ hàng nếu còn bán
  ↳ Đóng popup -> Quay lại danh sách đơn
```

---

## Tính năng tương tác

- Hiển thị mã đơn, ngày đặt, trạng thái, thông tin nhận hàng.
- Hiển thị từng món gồm size, số lượng, đơn giá, ghi chú nếu có.
- Nút đặt lại chỉ thêm được các món còn bán; món hết hàng cần báo lỗi hoặc bỏ qua theo xác nhận của người dùng.

---

## Phân rã theo Atomic Design

### Atoms
- Status Badge
- Price Text
- Close Button

### Molecules
- Order Item Row
- Order Summary Row
- Shipping Info Block

### Organisms
- Order History Detail Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Order ↔ OrderItem | One-to-Many |
| Order ↔ UserExtended | Many-to-One |
| OrderItem ↔ DishSize | Many-to-One |

---

# Types & Services

> File: `type/orders.types.ts`

```ts
export type OrderHistoryDetailInput = {
  order_id: string;
};
```

---

# API Services

## API 1 - Lấy chi tiết lịch sử đơn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/orders/{id}` |
| Service | `getOrderDetail(id)` |
| Input | `id: string` |
| Output | `OrderDetail` |
