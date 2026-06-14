# Mô tả chức năng: Giỏ hàng & Thanh toán (Cart & Checkout)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện quản lý các món ăn đã chọn mua (tăng/giảm số lượng, xóa món), điền thông tin giao hàng cá nhân, tích hợp dữ liệu địa lý 3 cấp (Tỉnh -> Quận -> Phường) để đặt hàng và thanh toán (COD hoặc Online).

**Đối tượng**

- Khách hàng đã có tài khoản (đã đăng nhập) hoặc khách vãng lai (nếu cho phép mua nhanh).

**Mục đích**

Hoàn tất quy trình mua sắm, tạo đơn hàng mới trên hệ thống backend Strapi và điều hướng người dùng tới trang theo dõi đơn.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-26` (Giỏ hàng thu nhỏ / Drawer)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=327-229` (Màn hình Thanh toán)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=351-1283` (Popup địa chỉ đã lưu)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=351-1364` (Popup Thêm địa chỉ mới)

---

## Luồng tiếp cận

- Click biểu tượng Giỏ hàng trên thanh điều hướng để mở Drawer Giỏ hàng nhanh.
- Click nút "Xem giỏ hàng & Thanh toán" trên Giỏ hàng nhanh để sang trang Thanh toán chính thức.

---

## Luồng giao diện

```text
Xem danh sách món ăn trong Giỏ hàng nhanh (Drawer)
    ↓
Click "Xem giỏ hàng & Thanh toán" -> Chuyển hướng sang trang `/checkout`
    ↓
Lựa chọn địa chỉ đã lưu (nhấn "Chọn từ địa chỉ đã lưu") hoặc Nhập địa chỉ mới
    ↓
Nếu nhập mới: Chọn Tỉnh/TP -> Chọn Quận/Huyện -> Chọn Phường/Xã -> Nhập địa chỉ chi tiết
    ↓
Chọn ngày giao hàng & Phương thức thanh toán (COD, Momo, Thẻ)
    ↓
Xem Tóm tắt đơn hàng (Tổng calo/protein, tạm tính, phí ship, tổng tiền)
    ↓
Bấm "Thanh toán ngay" -> Chờ xử lý -> Chuyển hướng đến màn Đặt hàng thành công
```

---

## Tính năng tương tác

### Giỏ hàng nhanh (Minicart Drawer)
- Dạng bảng trượt từ cạnh phải màn hình.
- Cho phép chỉnh sửa số lượng nhanh (`+` / `-`) hoặc nhấn xóa sản phẩm.
- Tự động tính toán tổng tiền tạm tính.

### Form thông tin giao hàng
- Form thu thập: Họ tên người nhận, Số điện thoại, Địa chỉ chi tiết.
- **Dropdown Địa giới Hành chính**:
  - Load danh sách City (Tỉnh/Thành phố) -> Khi chọn, tự động gọi API load District (Quận/Huyện) tương ứng -> Tiếp tục gọi API load Ward (Phường/Xã) tương ứng.
- Lưu địa chỉ: Có checkbox "Đặt làm địa chỉ mặc định".
- Cho phép chọn từ danh sách địa chỉ đã lưu thông qua một pop-up modal.

### Tóm tắt tổng dinh dưỡng đơn hàng (Nutrition Summary)
- Điểm đặc biệt: Hiển thị tổng Calo, Protein, Carbs của toàn bộ giỏ hàng để người dùng tự kiểm soát chế độ dinh dưỡng hàng ngày của mình.

### Phương thức thanh toán
- Chọn COD (Giao hàng thu tiền hộ) hoặc Online (Visa/Mastercard hoặc Ví điện tử MoMo).

---

## Phân rã theo Atomic Design

### Atoms
- Selector Dropdown (City, District, Ward)
- Radio button (COD, Online)
- Remove Item Trash Icon
- Checkbox "Lưu địa chỉ mặc định"

### Molecules
- Cart Line Item (Ảnh, Tên, Size, Ghi chú, Giá, Bộ tăng giảm số lượng)
- Summary Row (Label + Value)

### Organisms
- Minicart Drawer Sidebar
- Checkout Shipping Form
- Payment Method Selector Box
- Order Summary Sidebar card

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Order ↔ UserExtended | Many-to-One |
| Order ↔ OrderItem | One-to-Many |
| Order ↔ Ward ↔ District ↔ City | Many-to-One / Chain |
| Order ↔ Payment | One-to-One |
| AddressProfile ↔ CustomerProfile | Many-to-One |

---

# Types & Services

> File: `type/checkout.types.ts`

```ts
export type CartItemState = {
  dish_size_id: string; // ID của DishSize biến thể
  name: string;
  size: string;
  price: number;
  quantity: number;
  chef_notes?: string;
};

export type CheckoutInput = {
  contact_name: string;
  contact_phone: string;
  shipping_address: string; // Số nhà, tên đường
  wardId: string; // ID của Ward trong DB
  payment_method: 'COD' | 'Online';
  items: {
    dish_size_id: string;
    quantity: number;
    subtotal: number;
  }[];
  total_amount: number;
};

export type CheckoutOutput = {
  order_id: string;
  order_code: string; // Mã đơn tự động sinh dạng FFxxxxx
  payment_status: 'Pending' | 'Paid';
  estimated_shipped_time: string;
};
```

---

# API Services

## API 1 - Đặt hàng & Tạo Payment

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/orders` |
| Service | `createOrder(params)` |
| Input | `CheckoutInput` |
| Output | `CheckoutOutput` |

## API 2 - Lấy danh mục địa giới (Tỉnh/Quận/Phường)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET |
| Service | `fetchCities()`, `fetchDistricts(cityId)`, `fetchWards(districtId)` |
| Input | `id` tương ứng |
| Output | Lưới danh sách chứa { id, name } |
