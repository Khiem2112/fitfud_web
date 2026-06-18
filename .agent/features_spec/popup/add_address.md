# Mô tả popup: Thêm địa chỉ mới

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup cho phép người dùng thêm địa chỉ giao hàng mới từ trang Checkout hoặc Hồ sơ cá nhân.

**Đối tượng**

- Người dùng đã đăng nhập.

**Mục đích**

Giúp người dùng quản lý địa chỉ nhận hàng linh hoạt và tái sử dụng địa chỉ cho các đơn sau.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=351-1364` (Popup thêm địa chỉ mới)

---

## Luồng tiếp cận

- Click "Thêm địa chỉ mới" trong Popup chọn địa chỉ đã lưu.
- Click thêm địa chỉ trong trang Checkout hoặc Hồ sơ cá nhân.

---

## Luồng giao diện

```text
Mở Popup thêm địa chỉ mới
    ↓
Nhập người nhận, số điện thoại, địa chỉ chi tiết
    ↓
Chọn Tỉnh/TP -> Quận/Huyện -> Phường/Xã
    ↓
Tùy chọn đặt làm địa chỉ mặc định
    ↓
Submit
    ↓
Thành công -> Đóng popup và cập nhật danh sách địa chỉ
Thất bại -> Hiển thị lỗi
```

---

## Tính năng tương tác

- Dropdown địa giới load theo cấp phụ thuộc.
- Số điện thoại cần đúng định dạng số điện thoại Việt Nam.
- Có checkbox đặt làm địa chỉ mặc định.
- Khi tạo từ Checkout, địa chỉ mới có thể được tự động chọn cho đơn hiện tại sau khi lưu thành công.

---

## Phân rã theo Atomic Design

### Atoms
- Text Input
- Phone Input
- Select Dropdown
- Checkbox
- Button

### Molecules
- Address Form Group
- Administrative Area Selector

### Organisms
- Add Address Modal

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
export type AddAddressInput = {
  receiver_name: string;
  receiver_phone: string;
  address_line: string;
  wardId: string;
  is_default: boolean;
};
```

---

# API Services

## API 1 - Thêm địa chỉ mới

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/address-profiles` |
| Service | `createAddress(params)` |
| Input | `AddAddressInput` |
| Output | `SavedAddressItem` |
