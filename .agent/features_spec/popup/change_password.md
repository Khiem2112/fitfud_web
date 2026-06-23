# Mô tả popup: Đổi mật khẩu

---

# A. Tổng quan nghiệp vụ

**Mô tả**

## Luồng tiếp cận

- Người dùng đã đăng nhập truy cập trang Hồ sơ cá nhân qua icon tài khoản trên Header.
- Trong trang Hồ sơ cá nhân, người dùng click nút "Đổi mật khẩu" tại khu vực quản lý tài khoản.
- Popup này không được mở từ trang Đăng nhập/Đăng ký.
- Popup này không dùng cho luồng Quên mật khẩu.
**Đối tượng**

- Người dùng đã đăng nhập.

**Mục đích**

Hỗ trợ người dùng bảo mật tài khoản mà không cần rời khỏi trang Hồ sơ cá nhân.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=352-1536` (Popup đổi mật khẩu)

---

## Luồng tiếp cận

- Click "Đổi mật khẩu" trong trang Hồ sơ cá nhân.

---

## Luồng giao diện

```text
Mở Popup đổi mật khẩu
    ↓
Nhập mật khẩu hiện tại, mật khẩu mới, xác nhận mật khẩu mới
    ↓
Validate dữ liệu
    ↓
Submit đổi mật khẩu
    ↓
Thành công -> Đóng popup và hiển thị thông báo thành công
Thất bại -> Hiển thị lỗi tương ứng
```

---

## Tính năng tương tác

- Cho phép hiện/ẩn từng trường mật khẩu.
- Mật khẩu mới và xác nhận mật khẩu mới phải trùng nhau.
- Nếu mật khẩu hiện tại sai, hiển thị lỗi từ API.
- Không lưu mật khẩu trong client state lâu hơn cần thiết.

---

## Phân rã theo Atomic Design

### Atoms
- Password Input
- Visibility Toggle Button
- Error Text
- Submit Button

### Molecules
- Password Form Group

### Organisms
- Change Password Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| UserExtended | Auth Entity |

---

# Types & Services

> File: `type/auth.types.ts`

```ts
export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
```

---

# API Services

## API 1 - Đổi mật khẩu

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/change-password` |
| Service | `changePassword(params)` |
| Input | `ChangePasswordInput` |
| Output | `{ success: boolean, message: string }` |
