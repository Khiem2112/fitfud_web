# Mô tả popup: Đặt đơn thành công

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup xác nhận đơn hàng đã được tạo thành công, hiển thị mã đơn và hành động tiếp theo cho người dùng.

**Đối tượng**

- Người dùng vừa hoàn tất thanh toán hoặc đặt hàng COD.

**Mục đích**

Xác nhận trạng thái đặt hàng thành công và dẫn người dùng tới trang theo dõi đơn hàng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=0-1` (Popup đặt đơn thành công)

---

## Luồng tiếp cận

- Hiển thị sau khi API tạo đơn hàng trả về thành công.

---

## Luồng giao diện

```text
Người dùng bấm "Thanh toán ngay"
    ↓
API tạo đơn hàng thành công
    ↓
Hiển thị Popup đặt đơn thành công
    ↓
Người dùng chọn:
  ↳ Theo dõi đơn hàng -> Điều hướng `/orders`
  ↳ Tiếp tục mua hàng -> Điều hướng `/menu`
```

---

## Tính năng tương tác

- Hiển thị mã đơn hàng và thời gian giao dự kiến nếu API trả về.
- Không hiển thị popup này nếu API tạo đơn thất bại; trường hợp lỗi dùng Popup lỗi.
- Sau khi xác nhận thành công, giỏ hàng hiện tại được làm rỗng.

---

## Phân rã theo Atomic Design

### Atoms
- Success Icon
- Order Code Text
- Button

### Molecules
- Success Message Block
- Next Action Group

### Organisms
- Order Success Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Order ↔ OrderItem | One-to-Many |
| Order ↔ Payment | One-to-One |

---

# Types & Services

> File: `type/checkout.types.ts`

```ts
export type OrderSuccessPopupData = {
  order_id: string;
  order_code: string;
  estimated_shipped_time?: string;
};
```

---

# API Services

## API 1 - Nhận kết quả tạo đơn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/orders` |
| Service | `createOrder(params)` |
| Input | `CheckoutInput` |
| Output | `CheckoutOutput` |
