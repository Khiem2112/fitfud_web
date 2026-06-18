# Mô tả popup: OTP xác nhận đơn hàng

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup OTP yêu cầu người dùng nhập mã xác nhận khi thực hiện thao tác nhạy cảm liên quan đến đơn hàng.

**Đối tượng**

- Người dùng đang xác nhận đơn hàng hoặc xác nhận thao tác với đơn hàng theo yêu cầu bảo mật của hệ thống.

**Mục đích**

Giảm rủi ro thao tác nhầm hoặc giả mạo khi xác nhận đơn hàng, hủy đơn hoặc thay đổi trạng thái quan trọng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=349-1250` (Popup OTP xác nhận đơn hàng)

---

## Luồng tiếp cận

- Hiển thị sau khi hệ thống gửi OTP cho thao tác đơn hàng cần xác nhận.
- Với luồng hủy đơn, popup được mở sau khi người dùng bấm "Hủy đơn hàng" và API gửi OTP thành công.

---

## Luồng giao diện

```text
Người dùng thực hiện thao tác cần OTP
    ↓
API gửi OTP tới số điện thoại
    ↓
Hiển thị Popup OTP
    ↓
Người dùng nhập mã OTP
    ↓
Click "Xác nhận"
    ↓
Nếu hợp lệ -> Hoàn tất thao tác
Nếu sai/hết hạn -> Hiển thị lỗi trong popup hoặc Popup lỗi dùng chung
```

---

## Tính năng tương tác

- OTP gồm 4 hoặc 6 số tùy cấu hình backend.
- Chỉ cho phép nhập chữ số.
- Có hành động gửi lại mã sau khi hết thời gian đếm ngược.
- Không đóng popup tự động khi OTP sai; người dùng cần sửa mã hoặc hủy thao tác.

---

## Phân rã theo Atomic Design

### Atoms
- OTP Digit Input
- Countdown Text
- Resend Button
- Error Text

### Molecules
- OTP Input Group
- OTP Action Group

### Organisms
- OTP Verification Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Order ↔ UserExtended | Many-to-One |

---

# Types & Services

> File: `type/otp.types.ts`

```ts
export type OtpPurpose = 'ORDER_CONFIRM' | 'ORDER_CANCEL';

export type VerifyOrderOtpInput = {
  order_id: string;
  otp_code: string;
  purpose: OtpPurpose;
};
```

---

# API Services

## API 1 - Gửi và xác thực OTP

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/orders/{id}/otp/send`, `/api/orders/{id}/otp/verify` |
| Service | `sendOrderOtp(orderId, purpose)`, `verifyOrderOtp(params)` |
| Input | `orderId`, `VerifyOrderOtpInput` |
| Output | `{ success: boolean, message: string }` |
