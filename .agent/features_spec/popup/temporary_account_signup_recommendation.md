# Mô tả popup: Gợi ý tạo tài khoản từ tài khoản tạm

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup gợi ý người dùng tạo tài khoản chính thức từ tài khoản tạm. Popup hiển thị dưới khu vực tài khoản ở sidebar/header, dành cho khách đã từng đặt hàng hoặc có dữ liệu tạm theo số điện thoại/session.

**Đối tượng**

- Guest đã checkout và được tạo tài khoản tạm.
- Người dùng có tài khoản tạm nhưng chưa tạo mật khẩu.

**Mục đích**

Khuyến khích người dùng nâng cấp tài khoản để giữ lịch sử đơn hàng, địa chỉ, dữ liệu hành vi và nhận gợi ý món cá nhân hóa mà không làm mất dữ liệu đã phát sinh trước đó.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=462-143` (Popup recommend tạo tài khoản)
- Spec nghiệp vụ liên quan: `temporary_account.md`

---

## Luồng tiếp cận

- Hiển thị dưới khu vực tài khoản ở sidebar/header khi phát hiện người dùng đang là tài khoản tạm.
- Hiển thị sau checkout thành công nếu đơn hàng được gắn với tài khoản tạm.
- Có thể hiển thị khi guest tra cứu đơn bằng số điện thoại có tài khoản tạm.

---

## Luồng giao diện

```text
Người dùng mở sidebar/header account area
    ↓
Hệ thống kiểm tra trạng thái user/session
    ↓
Nếu là tài khoản tạm -> Hiển thị popup gợi ý tạo tài khoản
    ↓
Người dùng chọn:
  ↳ Tạo tài khoản -> Điều hướng hoặc mở form nâng cấp tài khoản tạm
  ↳ Để sau -> Đóng popup, giữ tài khoản tạm
    ↓
Nếu chọn tạo tài khoản:
  Nhập email/mật khẩu nếu cần
    ↓
  Gửi OTP xác thực số điện thoại
    ↓
  OTP đúng -> Cập nhật is_temporary = false và giữ dữ liệu cũ
```

---

## Tính năng tương tác

- Popup phải gắn với account area của sidebar/header, không che toàn bộ màn hình nếu thiết kế là popover.
- Nội dung nhấn mạnh lợi ích: giữ lịch sử đơn, địa chỉ, gợi ý cá nhân hóa.
- Nếu người dùng chọn "Để sau", không xóa dữ liệu tài khoản tạm.
- Nếu người dùng chọn tạo tài khoản, dùng luồng nâng cấp tài khoản tạm thay vì tạo user mới rời rạc.
- Nếu số điện thoại cần xác thực, dùng OTP theo spec OTP hiện có.
- Nếu người dùng đã là tài khoản chính thức, không hiển thị popup này.

---

## Phân rã theo Atomic Design

### Atoms
- Account Icon
- Close Button
- Primary Button
- Secondary Button
- Benefit Text

### Molecules
- Signup Recommendation Message
- Temporary Account Benefit List
- Account Upgrade Action Row

### Organisms
- Temporary Account Signup Recommendation Popup
- Account Sidebar/Header Area

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| User ↔ Orders | One-to-Many |
| User ↔ AddressProfile | One-to-Many hoặc qua CustomerProfile |
| User ↔ UserPreferenceEvent | One-to-Many |
| User ↔ OTPVerification | One-to-Many |

---

# Types & Services

> File: `type/temporary-account.types.ts`

```ts
export type TemporaryAccountPromptState = {
  shouldShow: boolean;
  phone?: string;
  orderCount?: number;
  hasSavedAddress?: boolean;
};

export type UpgradeTemporaryAccountStartInput = {
  phone: string;
  email?: string;
};
```

---

# API Services

## API 1 - Kiểm tra có nên hiển thị gợi ý tạo tài khoản

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/auth/temporary-account/prompt-state` |
| Service | `fetchTemporaryAccountPromptState()` |
| Input | token/session/phone context |
| Output | `TemporaryAccountPromptState` |

## API 2 - Nâng cấp tài khoản tạm

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/upgrade-temporary` |
| Service | `upgradeTemporaryAccount(payload)` |
| Input | `UpgradeTemporaryAccountInput` |
| Output | `UpgradeTemporaryAccountOutput` |
