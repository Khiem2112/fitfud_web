# Mô tả popup: Giỏ hàng nhanh

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup giỏ hàng nhanh hiển thị các món đã chọn ngay tại Header, cho phép xem tạm tính, chỉnh số lượng, xóa món và đi tới trang thanh toán.

**Đối tượng**

- Khách vãng lai.
- Người dùng đã đăng nhập.

**Mục đích**

Giúp người dùng kiểm tra và chỉnh giỏ hàng nhanh mà không phải rời khỏi trang đang xem.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-26` (Popup giỏ hàng)

---

## Luồng tiếp cận

- Hover vào biểu tượng giỏ hàng trên Header.
- Click biểu tượng giỏ hàng trên Header.
- Sau khi thêm món thành công từ Popup chi tiết món ăn.

---

## Luồng giao diện

```text
Hover biểu tượng giỏ hàng
    ↓
Mở Popup giỏ hàng ở trạng thái tạm thời
    ↓
Nếu rê chuột ra khỏi vùng popup/header -> Tự đóng

Click biểu tượng giỏ hàng
    ↓
Mở Popup giỏ hàng ở trạng thái ghim
    ↓
Rê chuột ra ngoài không làm popup biến mất
    ↓
Người dùng chỉnh số lượng/xóa món hoặc bấm Thanh toán
```

---

## Tính năng tương tác

- Trạng thái `hover` mở popup tạm thời.
- Trạng thái `pinned` được kích hoạt khi người dùng click biểu tượng giỏ hàng.
- Khi `pinned`, popup chỉ đóng khi người dùng click nút đóng, click lại biểu tượng giỏ hàng, hoặc chuyển route.
- Cho phép tăng/giảm số lượng và xóa item.
- Nút thanh toán điều hướng tới `/checkout`.
- Nếu giỏ hàng rỗng, hiển thị trạng thái rỗng và CTA quay lại Menu.

---

## Phân rã theo Atomic Design

### Atoms
- Cart Icon
- Quantity Button
- Remove Button
- Price Text

### Molecules
- Cart Line Item
- Cart Subtotal Row
- Empty Cart State

### Organisms
- Header Cart Popup

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| CartState ↔ DishSize | Client State / LocalStorage hoặc Backend Cart |

---

# Types & Services

> File: `type/cart.types.ts`

```ts
export type CartPopupMode = 'hover' | 'pinned';

export type CartLineItem = {
  dish_size_id: string;
  dish_name: string;
  size_name: string;
  image_url?: string;
  unit_price: number;
  quantity: number;
  chef_notes?: string;
};
```

---

# API Services

## API 1 - Đồng bộ giỏ hàng

| Thuộc tính | Giá trị |
|------------|----------|
| API | Client State hoặc REST `/api/cart` nếu backend hỗ trợ |
| Service | `useCartStore()` / `syncCart()` |
| Input | `CartLineItem[]` |
| Output | `CartLineItem[]` |
