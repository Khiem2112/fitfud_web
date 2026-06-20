# Mô tả chức năng: Header & Footer dùng chung

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Header và Footer là các thành phần điều hướng dùng chung trên toàn website FitFud. Header chỉ gồm logo, các link điều hướng chính, icon giỏ hàng và icon tài khoản.

**Đối tượng**

- Khách vãng lai.
- Người dùng đã đăng nhập.

**Mục đích**

Đảm bảo người dùng luôn truy cập nhanh được Trang chủ, Thực đơn, Đơn hàng, Về chúng tôi, Giỏ hàng và Tài khoản.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=141-132` (Header)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2577` (Footer)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-26` (Popup giỏ hàng)
- Spec popup liên quan: `popup/cart_hover.md`

---

## Luồng tiếp cận

- Header hiển thị trên các trang chính của website.
- Footer hiển thị cuối các trang nội dung và trang mua hàng, trừ khi màn hình đặc biệt yêu cầu layout tối giản.

---

## Luồng giao diện

```text
Người dùng truy cập website
    ↓
Header hiển thị Logo, Navigation, icon giỏ hàng và icon tài khoản
    ↓
Click Logo -> Về Trang chủ
Click Navigation -> Điều hướng đến trang tương ứng
Hover giỏ hàng -> Mở Popup giỏ hàng tạm thời
Click giỏ hàng -> Ghim Popup giỏ hàng để chỉnh sửa
    ↓
Cuộn cuối trang -> Footer hiển thị thông tin hỗ trợ và liên kết phụ
```

---

## Tính năng tương tác

### Header Navigation
- Logo FitFud -> điều hướng về `/`.
- Header gồm đúng các nút/link chính:
  - "Trang chủ" -> `/`
  - "Thực đơn" -> `/menu`
  - "Đơn hàng" -> `/orders`
  - "Về chúng tôi" -> `/about`
- Icon giỏ hàng:
  - Hover -> mở Popup giỏ hàng tạm thời.
  - Click -> ghim Popup giỏ hàng để người dùng chỉnh số lượng/xóa món/bấm thanh toán.
- Icon tài khoản:
  - Nếu chưa đăng nhập -> điều hướng tới trang Đăng nhập `/login`.
  - Nếu đã đăng nhập -> điều hướng tới Hồ sơ cá nhân `/profile`.

### Giỏ hàng trên Header
- Hiển thị biểu tượng giỏ hàng và số lượng món hiện có.
- Hover vào biểu tượng giỏ hàng mở Popup giỏ hàng.
- Click biểu tượng giỏ hàng chuyển Popup giỏ hàng sang trạng thái ghim, không tự đóng khi rê chuột ra ngoài.
- Popup giỏ hàng được mô tả chi tiết tại `popup/cart_hover.md`.

### Footer
- Hiển thị thông tin thương hiệu, địa chỉ, số điện thoại, email hỗ trợ.
- Nhóm liên kết nhanh: Trang chủ, Thực đơn, Đơn hàng, Về chúng tôi, Chính sách.
- Các liên kết Footer phải điều hướng đúng route và không mở popup ngoài ý muốn.

---

## Phân rã theo Atomic Design

### Atoms
- Logo
- Icon giỏ hàng
- Icon tài khoản
- Navigation Link
- Footer Link

### Molecules
- Header Nav Group
- Account Menu Trigger
- Cart Icon Button
- Footer Link Column

### Organisms
- Global Header
- Cart Hover Popup
- Global Footer

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| UserExtended ↔ CustomerProfile | One-to-One |
| CartState ↔ DishSize | Client State / LocalStorage hoặc Backend Cart |

---

# Types & Services

> File: `type/layout.types.ts`

```ts
export type HeaderUserState = {
  isAuthenticated: boolean;
  fullName?: string;
  avatarUrl?: string;
};

export type HeaderCartState = {
  totalItems: number;
  subtotal: number;
};

export type FooterLink = {
  label: string;
  href: string;
};
```

---

# API Services

## API 1 - Lấy trạng thái người dùng hiện tại

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/users/me` hoặc Auth Context |
| Service | `getCurrentUser()` |
| Input | `void` |
| Output | `HeaderUserState` |

**Mô tả**

Header ưu tiên đọc dữ liệu từ Auth Context; chỉ gọi API khi cần đồng bộ lại phiên đăng nhập.
