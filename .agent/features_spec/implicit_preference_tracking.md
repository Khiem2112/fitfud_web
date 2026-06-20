# Mô tả chức năng: Thu thập sở thích ngầm từ hành vi lọc món

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Ngoài form khảo sát trực tiếp, FitFud có thể thu thập tín hiệu sở thích từ hành vi người dùng trên trang Thực đơn. Ví dụ: người dùng thường xuyên loại trừ nguyên liệu cá, chọn món low carb hoặc lọc khoảng giá 200.000đ - 300.000đ. Hệ thống dùng các tín hiệu này để gợi ý món phù hợp hơn, nhưng không tự động xem đó là dữ liệu sức khỏe chính thức cho đến khi người dùng xác nhận.

**Đối tượng**

- Người dùng đã đăng nhập.
- Tài khoản tạm có thể được ghi nhận hành vi theo số điện thoại/session sau khi checkout.

**Mục đích**

Tăng khả năng cá nhân hóa mà không ép người dùng phải hoàn thành khảo sát ngay từ đầu.

---

# B. Luồng nghiệp vụ

## Popup liên quan

- Popup gợi ý món ăn tại Menu theo hành vi: `popup/menu_behavior_recommendation.md`

## Luồng ghi nhận hành vi lọc món

```text
Người dùng vào /menu
    ↓
Chọn bộ lọc: dị ứng, chế độ ăn, khoảng giá, khoảng calo
    ↓
Nhấn áp dụng lọc hoặc kết quả tự cập nhật
    ↓
Frontend gửi event hành vi về backend
    ↓
Backend lưu hoặc tổng hợp tín hiệu
    ↓
Nếu một tín hiệu xuất hiện nhiều lần:
  ↳ Tạo preference candidate
```

## Luồng xác nhận sở thích

```text
Người dùng vào /profile hoặc /onboarding-survey
    ↓
Hệ thống hiển thị gợi ý:
  "Bạn thường loại trừ cá. Bạn có muốn lưu cá vào danh sách dị ứng/cần tránh không?"
    ↓
Người dùng xác nhận hoặc bỏ qua
    ↓
Nếu xác nhận:
  ↳ Lưu vào customer_allergies hoặc cập nhật customer_profiles/preferences
Nếu bỏ qua:
  ↳ Không ghi vào hồ sơ chính thức
```

---

# C. Quy tắc nghiệp vụ

- Không tự động kết luận người dùng bị dị ứng chỉ vì họ lọc nguyên liệu một lần.
- Chỉ tạo candidate khi hành vi lặp lại đủ nhiều lần.
- Dị ứng là dữ liệu nhạy cảm, nên cần người dùng xác nhận trước khi lưu vào `customer_allergies`.
- Khoảng giá/calo/chế độ ăn có thể dùng làm tín hiệu gợi ý món, nhưng nên cho phép người dùng chỉnh lại trong Hồ sơ.

Ví dụ ngưỡng gợi ý:

| Hành vi | Điều kiện gợi ý |
|---|---|
| Loại trừ cùng nguyên liệu | Từ 3 lần trở lên trong 14 ngày |
| Chọn cùng khoảng giá | Từ 3 lần trở lên trong 14 ngày |
| Chọn cùng diet tag | Từ 3 lần trở lên trong 14 ngày |
| Chọn cùng khoảng calo | Từ 3 lần trở lên trong 14 ngày |

---

# D. Kỹ thuật & Tích hợp

## Database Relationships

ERD hiện tại chưa có bảng riêng cho hành vi lọc món. Có thể triển khai tối giản bằng log tạm ở backend/session, hoặc bổ sung bảng mới.

## Đề xuất bổ sung ERD

```txt
Table user_preference_events {
  event_id int [pk, increment]
  user_id int
  event_type varchar [note: 'filter_menu, search_menu']
  payload text
  created_at datetime
}

Table user_preference_candidates {
  candidate_id int [pk, increment]
  user_id int
  candidate_type varchar [note: 'allergy, price_range, calorie_range, diet_tag']
  candidate_value varchar
  confidence decimal
  status varchar [note: 'Pending, Confirmed, Dismissed']
  created_at datetime
  updated_at datetime
}
```

Quan hệ:

| Quan hệ | Kiểu | Mô tả |
|---|---|---|
| `users` ↔ `user_preference_events` | One-to-Many | Một user có nhiều event hành vi |
| `users` ↔ `user_preference_candidates` | One-to-Many | Một user có nhiều gợi ý sở thích cần xác nhận |
| `customer_profiles` ↔ `customer_allergies` | One-to-Many | Khi xác nhận dị ứng, lưu vào hồ sơ chính thức |

---

# Types & Services

```ts
export type MenuBehaviorEventInput = {
  search?: string;
  selected_category_ids?: number[];
  selected_diet_tag_ids?: number[];
  excluded_ingredient_ids?: number[];
  min_price?: number;
  max_price?: number;
  min_calories?: number;
  max_calories?: number;
};

export type PreferenceCandidate = {
  candidate_id: number;
  candidate_type: 'allergy' | 'price_range' | 'calorie_range' | 'diet_tag';
  candidate_value: string;
  confidence: number;
  status: 'Pending' | 'Confirmed' | 'Dismissed';
};

export type ConfirmPreferenceInput = {
  candidate_id: number;
  action: 'confirm' | 'dismiss';
};
```

---

# API Services

## API 1 - Ghi nhận hành vi lọc món

| Thuộc tính | Giá trị |
|---|---|
| API | REST / POST `/api/user-preferences/menu-behavior` |
| Service | `trackMenuBehavior(payload)` |
| Input | `MenuBehaviorEventInput` |
| Output | `{ success: boolean }` |

## API 2 - Lấy các gợi ý sở thích cần xác nhận

| Thuộc tính | Giá trị |
|---|---|
| API | REST / GET `/api/user-preferences/candidates` |
| Service | `fetchPreferenceCandidates()` |
| Input | token/session |
| Output | `PreferenceCandidate[]` |

## API 3 - Xác nhận hoặc bỏ qua gợi ý

| Thuộc tính | Giá trị |
|---|---|
| API | REST / POST `/api/user-preferences/candidates/confirm` |
| Service | `confirmPreferenceCandidate(payload)` |
| Input | `ConfirmPreferenceInput` |
| Output | `{ success: boolean }` |

---

# E. Tóm tắt

Thu thập sở thích ngầm giúp FitFud cá nhân hóa mà không ép khảo sát. Tuy nhiên, dữ liệu suy luận chỉ nên là candidate; dị ứng và hồ sơ sức khỏe chính thức phải được người dùng xác nhận trước khi lưu.
