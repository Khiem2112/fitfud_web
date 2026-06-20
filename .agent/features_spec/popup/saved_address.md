# Mô tả popup: Chọn địa chỉ đã lưu

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup cho phép người dùng chọn nhanh một địa chỉ giao hàng đã lưu để điền vào form thanh toán.

**Đối tượng**

- Người dùng đã đăng nhập và có danh sách địa chỉ nhận hàng.

**Mục đích**

Giảm thời gian nhập liệu khi thanh toán và hạn chế sai sót địa chỉ.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=351-1283` (Popup chọn địa chỉ đã lưu)

---

## Luồng tiếp cận

- Click "Chọn từ địa chỉ đã lưu" trong trang Checkout.

---

## Luồng giao diện

```text
Mở popup địa chỉ đã lưu
    ↓
Load danh sách AddressProfile của người dùng
    ↓
Người dùng chọn một địa chỉ
    ↓
Click "Sử dụng địa chỉ này"
    ↓
Đóng popup và điền dữ liệu vào form Checkout
```

---

## Tính năng tương tác

- Hiển thị địa chỉ mặc định ở đầu danh sách nếu có.
- Cho phép chọn một địa chỉ tại một thời điểm.
- Nếu chưa có địa chỉ, hiển thị trạng thái rỗng và CTA mở Popup thêm địa chỉ mới.
- Không tự tạo địa chỉ mới trong popup này.

---

## Phân rã theo Atomic Design

### Atoms
- Radio Button
- Address Badge
- Button

### Molecules
- Saved Address Item
- Empty Address State

### Organisms
- Saved Address Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| AddressProfile ↔ CustomerProfile | Many-to-One |
| AddressProfile ↔ Ward ↔ District ↔ City | Many-to-One / Chain |

---

# Types & Services

> File: `type/address.types.ts`

```ts
export type SavedAddressItem = {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  address_line: string;
  ward_name: string;
  district_name: string;
  city_name: string;
  is_default: boolean;
};
```

---

# API Services

## API 1 - Lấy địa chỉ đã lưu

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/address-profiles` |
| Service | `fetchSavedAddresses()` |
| Input | `void` |
| Output | `SavedAddressItem[]` |
