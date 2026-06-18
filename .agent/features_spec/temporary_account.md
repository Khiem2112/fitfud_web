# Mô tả chức năng: Tài khoản tạm cho khách chưa đăng nhập

---

# A. Tổng quan nghiệp vụ

**Mô tả**

FitFud cho phép khách chưa đăng nhập mua hàng. Khi khách nhập số điện thoại, họ tên và địa chỉ trong bước thanh toán, hệ thống tạo hoặc tìm một tài khoản tạm tương ứng với số điện thoại đó. Tài khoản tạm giúp lưu lịch sử đơn hàng, địa chỉ và dữ liệu hành vi. Khi khách muốn tạo tài khoản chính thức, họ chỉ cần bổ sung mật khẩu và xác thực số điện thoại; dữ liệu cũ vẫn được giữ lại.

**Đối tượng**

- Khách chưa đăng nhập đặt hàng.
- Khách đã từng đặt hàng bằng số điện thoại nhưng chưa tạo mật khẩu.
- DEV backend/frontend xử lý auth, checkout và orders.

**Mục đích**

Giữ trải nghiệm mua hàng nhanh cho guest nhưng vẫn đảm bảo dữ liệu đơn hàng có chủ thể quản lý trong bảng `users`, từ đó hỗ trợ lịch sử mua hàng, tra cứu đơn, đặt lại đơn và nâng cấp tài khoản.

---

# B. Luồng nghiệp vụ

## Popup liên quan

- Popup gợi ý tạo tài khoản từ tài khoản tạm: `popup/temporary_account_signup_recommendation.md`

## Luồng tạo tài khoản tạm khi checkout

```text
Guest thêm món vào giỏ
    ↓
Guest vào /checkout
    ↓
Nhập họ tên, số điện thoại, địa chỉ nhận hàng
    ↓
Hệ thống kiểm tra users.phone
    ↓
Nếu chưa tồn tại:
  ↳ Tạo users với is_temporary = true, password_hash = null
Nếu tồn tại user tạm:
  ↳ Dùng user_id cũ để tạo đơn mới
Nếu tồn tại user chính thức:
  ↳ Có thể gợi ý đăng nhập, nhưng vẫn cho đặt nếu policy cho phép
    ↓
Tạo orders.user_id tương ứng
    ↓
Tạo order_items, payments, order_tracking_logs
```

## Luồng nâng cấp tài khoản tạm

```text
Khách truy cập Đăng ký hoặc được gợi ý "Tạo mật khẩu để giữ lịch sử đơn"
    ↓
Nhập số điện thoại, email nếu có, mật khẩu
    ↓
Hệ thống gửi OTP về số điện thoại
    ↓
Khách nhập OTP
    ↓
Nếu OTP đúng:
  ↳ Cập nhật users.password_hash
  ↳ Cập nhật email/full_name nếu cần
  ↳ is_temporary = false
    ↓
Đăng nhập và giữ toàn bộ đơn hàng cũ
```

## Luồng tra cứu đơn của khách tạm

```text
Guest vào /orders
    ↓
Nhập số điện thoại
    ↓
Hệ thống tìm user tạm hoặc user chính thức theo phone
    ↓
Hiển thị các đơn liên quan
    ↓
Nếu thao tác nhạy cảm như hủy đơn:
  ↳ Bắt buộc OTP qua số điện thoại của đơn
```

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu | Mô tả |
|---|---|---|
| `users` ↔ `orders` | One-to-Many | Guest cũng có `user_id` thông qua tài khoản tạm |
| `users` ↔ `cart_items` | One-to-Many | Nếu cần lưu giỏ server-side cho guest tạm |
| `orders` ↔ `order_items` | One-to-Many | Đơn của tài khoản tạm vẫn tạo item bình thường |
| `orders` ↔ `payments` | One-to-One | Thanh toán gắn với đơn |
| `orders` ↔ `order_tracking_logs` | One-to-Many | Theo dõi trạng thái đơn |

## Đề xuất bổ sung ERD

Trong bảng `users`:

```txt
is_temporary boolean
password_hash varchar [null]
temporary_created_from varchar [note: 'checkout, guest_lookup']
```

Nếu triển khai OTP:

```txt
Table otp_verifications {
  otp_id int [pk, increment]
  phone varchar
  otp_code_hash varchar
  purpose varchar [note: 'cancel_order, upgrade_account, guest_lookup']
  expires_at datetime
  verified_at datetime [null]
  created_at datetime
}
```

---

# Types & Services

```ts
export type EnsureTemporaryUserInput = {
  full_name: string;
  phone: string;
  email?: string;
};

export type EnsureTemporaryUserOutput = {
  user_id: number;
  is_temporary: boolean;
  existed: boolean;
};

export type UpgradeTemporaryAccountInput = {
  phone: string;
  email?: string;
  password: string;
  confirm_password: string;
  otp_code: string;
};

export type UpgradeTemporaryAccountOutput = {
  access_token: string;
  user: {
    user_id: number;
    full_name: string;
    phone: string;
    email?: string;
    is_temporary: false;
  };
};
```

---

# API Services

## API 1 - Tạo hoặc lấy tài khoản tạm

| Thuộc tính | Giá trị |
|---|---|
| API | REST / POST `/api/auth/ensure-temporary-user` |
| Service | `ensureTemporaryUser(payload)` |
| Input | `EnsureTemporaryUserInput` |
| Output | `EnsureTemporaryUserOutput` |

## API 2 - Gửi OTP nâng cấp tài khoản

| Thuộc tính | Giá trị |
|---|---|
| API | REST / POST `/api/auth/upgrade-temporary/request-otp` |
| Service | `requestUpgradeOtp(phone)` |
| Input | `{ phone: string }` |
| Output | `{ success: boolean; message: string }` |

## API 3 - Nâng cấp tài khoản tạm

| Thuộc tính | Giá trị |
|---|---|
| API | REST / POST `/api/auth/upgrade-temporary` |
| Service | `upgradeTemporaryAccount(payload)` |
| Input | `UpgradeTemporaryAccountInput` |
| Output | `UpgradeTemporaryAccountOutput` |

---

# D. Tóm tắt

Tài khoản tạm là cầu nối giữa guest checkout và tài khoản chính thức. Mọi đơn hàng của guest vẫn gắn với `users.user_id`, giúp dữ liệu không bị rời rạc và người dùng có thể nâng cấp tài khoản mà không mất lịch sử mua hàng.
