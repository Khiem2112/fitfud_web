# Mô tả chức năng: Xác thực (Authentication)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện hỗ trợ người dùng đăng nhập, đăng ký tài khoản mới và khôi phục mật khẩu. Đồng bộ hóa thông tin người dùng với cơ sở dữ liệu Strapi.

**Đối tượng**

- Khách vãng lai chưa có tài khoản.
- Người dùng đã có tài khoản cần đăng nhập lại.

**Mục đích**

Quản lý quyền truy cập của người dùng, làm cơ sở để cá nhân hóa chỉ số sức khỏe, thực đơn và quản lý lịch sử đơn hàng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=42-258` (Đăng ký)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=42-377` (Đăng nhập)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=352-1441` (Quên mật khẩu)
- Spec popup liên quan: `popup/error.md`

---

## Luồng tiếp cận

- Click nút "Đăng nhập" trên Thanh điều hướng (Header Navigation).
- Tự động chuyển hướng từ các trang yêu cầu quyền đăng nhập (Checkout, Hồ sơ cá nhân, Nhật ký sức khỏe).
- Click link "Đăng ký ngay" từ trang Đăng nhập hoặc ngược lại.

---

## Luồng giao diện

```text
Truy cập Trang đăng nhập / Đăng ký
    ↓
Điền thông tin form và kiểm tra Validation (Zod)
    ↓
Nhấn nút submit ("Đăng nhập" hoặc "Đăng ký")
    ↓
Gọi Auth Service (Lưu token vào LocalStorage/Context)
    ↓
Chuyển hướng đến trang Khảo sát AI (nếu đăng ký mới) hoặc Trang chủ
```

---

## Tính năng tương tác

### Đăng ký (Register)
- Nhập các trường: Họ và tên, Email, Số điện thoại, Mật khẩu, Xác nhận mật khẩu.
- Đồng ý với điều khoản dịch vụ (Checkbox).
- Validation:
  - Email đúng định dạng.
  - SĐT Việt Nam hợp lệ (10 số).
  - Mật khẩu tối thiểu 6 ký tự.
  - Trùng khớp mật khẩu xác nhận.
- Đăng ký qua bên thứ ba (Google, Facebook) trên Mobile.

### Đăng nhập (Login)
- Nhập Email và Mật khẩu.
- Toggle "Ghi nhớ tôi" (Remember me).
- Redirect sang trang "Quên mật khẩu".

### Quên mật khẩu (Forgot Password)
- Nhập SĐT đã đăng ký.
- Hệ thống gửi OTP xác thực tới SĐT.
- Người dùng nhập OTP hợp lệ rồi chuyển sang bước đặt mật khẩu mới.
- Luồng này dùng cho khôi phục mật khẩu trước đăng nhập, tách biệt với Popup đổi mật khẩu trong Hồ sơ cá nhân.

---

## Phân rã theo Atomic Design

### Atoms
- Input field (Text, Email, Password)
- Checkbox (Remember me, Điều khoản)
- Button (Đăng nhập, Đăng ký, Google/Facebook login)
- Alert message (Hiển thị lỗi Validation hoặc thông báo thành công)

### Molecules
- Form Group (Label + Input + Error Message)
- Third-party login block

### Organisms
- Register Form
- Login Form
- Forgot Password Form

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| UsersExtended ↔ CustomerProfile | One-to-One |
| UsersExtended ↔ Orders | One-to-Many |

---

# Types & Services

> File: `type/auth.types.ts`

```ts
export type LoginInput = {
  email: string;
  password_hash: string; // Tương ứng trường password_hash trong DB
};

export type LoginOutput = {
  jwt: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
  };
};

export type RegisterInput = {
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
};

export type RegisterOutput = LoginOutput;

export type ForgotPasswordRequestInput = {
  phone: string;
};

export type ResetPasswordInput = {
  phone: string;
  otp_code: string;
  new_password: string;
  confirm_password: string;
};
```

---

# API Services

## API 1 - Đăng nhập

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/local` hoặc custom endpoint |
| Service | `loginUser(params)` |
| Input | `LoginInput` |
| Output | `LoginOutput` |

## API 2 - Đăng ký

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST |
| Service | `registerUser(params)` |
| Input | `RegisterInput` |
| Output | `RegisterOutput` |

## API 3 - Gửi OTP quên mật khẩu

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/forgot-password/request-otp` |
| Service | `requestForgotPasswordOtp(params)` |
| Input | `ForgotPasswordRequestInput` |
| Output | `{ success: boolean, message: string }` |

## API 4 - Đặt lại mật khẩu bằng OTP

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/forgot-password/reset` |
| Service | `resetPasswordWithOtp(params)` |
| Input | `ResetPasswordInput` |
| Output | `{ success: boolean, message: string }` |
