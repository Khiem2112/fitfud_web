# Mô tả chức năng: Sidebar/Header & Footer dùng chung

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Sidebar/Header và Footer là các thành phần điều hướng dùng chung trên toàn website FitFud, giúp người dùng truy cập nhanh tới các trang chính, quản lý tài khoản và thao tác với giỏ hàng.

**Đối tượng**

- Khách vãng lai.
- Người dùng đã đăng nhập.

**Mục đích**

Đảm bảo điều hướng nhất quán, giúp người dùng luôn truy cập được Menu, Gợi ý AI, Đơn hàng, Hồ sơ cá nhân và các thông tin hỗ trợ quan trọng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=141-132` (Sidebar/Header)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2577` (Footer)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=323-26` (Popup giỏ hàng)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=462-143` (Popup recommend tạo tài khoản)
- Spec popup liên quan: `popup/cart_hover.md`, `popup/temporary_account_signup_recommendation.md`
- Spec nghiệp vụ liên quan: `temporary_account.md`

---

## Luồng tiếp cận

- Sidebar/Header hiển thị trên các trang chính của website.
- Footer hiển thị cuối các trang nội dung và trang mua hàng, trừ khi màn hình đặc biệt yêu cầu layout tối giản.

---

## Luồng giao diện

```text
Người dùng truy cập website
    ↓
Sidebar/Header hiển thị Logo, Navigation, tài khoản và giỏ hàng
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

### Sidebar/Header Navigation
- Logo FitFud điều hướng về `/`.
- Menu chính gồm các khu vực: Trang chủ, Thực đơn, Gợi ý AI, Về FitFud, Đơn hàng.
- Nếu chưa đăng nhập, hiển thị hành động Đăng nhập/Đăng ký.
- Nếu đã đăng nhập, hiển thị Avatar hoặc tên người dùng và liên kết tới Hồ sơ cá nhân.

### Giỏ hàng trên Header
- Hiển thị biểu tượng giỏ hàng và số lượng món hiện có.
- Hover vào biểu tượng giỏ hàng mở Popup giỏ hàng.
- Click biểu tượng giỏ hàng chuyển Popup giỏ hàng sang trạng thái ghim, không tự đóng khi rê chuột ra ngoài.
- Popup giỏ hàng được mô tả chi tiết tại `popup/cart_hover.md`.

### Gợi ý tạo tài khoản từ tài khoản tạm
- Nếu người dùng đang ở trạng thái tài khoản tạm, khu vực tài khoản trong sidebar/header có thể hiển thị Popup recommend tạo tài khoản.
- Popup này dùng luồng nâng cấp tài khoản tạm, không tạo user mới tách rời dữ liệu cũ.
- Chi tiết hành vi tại `popup/temporary_account_signup_recommendation.md`.

### Footer
- Hiển thị thông tin thương hiệu, địa chỉ, số điện thoại, email hỗ trợ.
- Nhóm liên kết nhanh: Thực đơn, Gợi ý AI, Về chúng tôi, Chính sách, Đơn hàng.
- Các liên kết Footer phải điều hướng đúng route và không mở popup ngoài ý muốn.

---

## Phân rã theo Atomic Design

### Atoms
- Logo
- Icon giỏ hàng
- Avatar
- Navigation Link
- Footer Link

### Molecules
- Sidebar/Header Nav Group
- Account Menu Trigger
- Cart Icon Button
- Footer Link Column

### Organisms
- Global Sidebar/Header
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
