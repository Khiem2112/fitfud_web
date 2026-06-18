# Mô tả popup: Gợi ý món ăn tại Menu theo hành vi

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup gợi ý món ăn tại giao diện Menu dựa trên hành vi người dùng như tìm kiếm, lọc món, loại trừ nguyên liệu, chọn khoảng calo, khoảng giá hoặc diet tag lặp lại. Popup này dùng dữ liệu candidate từ luồng thu thập sở thích ngầm, không tự động xem các tín hiệu đó là dữ liệu sức khỏe chính thức.

**Đối tượng**

- Người dùng đã đăng nhập.
- Người dùng guest hoặc tài khoản tạm có dữ liệu hành vi theo session/số điện thoại.

**Mục đích**

Đưa ra gợi ý món phù hợp ngay trong lúc người dùng đang xem thực đơn, giúp rút ngắn thời gian chọn món nhưng vẫn tôn trọng nguyên tắc người dùng phải xác nhận trước khi lưu dữ liệu nhạy cảm như dị ứng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=461-15` (Popup recommend món ăn tại Menu)
- Spec nghiệp vụ liên quan: `implicit_preference_tracking.md`

---

## Luồng tiếp cận

- Người dùng đang ở trang Menu.
- Người dùng có hành vi lọc/tìm kiếm đủ điều kiện tạo gợi ý.
- Hệ thống có danh sách món phù hợp với candidate hiện tại.

---

## Luồng giao diện

```text
Người dùng thao tác trên /menu
    ↓
Frontend gửi event lọc/tìm kiếm về backend
    ↓
Backend trả về preference candidates hoặc recommendation candidates
    ↓
Nếu có gợi ý phù hợp -> Hiển thị popup recommend món ăn
    ↓
Người dùng chọn:
  ↳ Xem món được gợi ý -> Mở Popup chi tiết món ăn
  ↳ Thêm vào giỏ -> Mở Popup chi tiết món ăn để chọn size/số lượng
  ↳ Bỏ qua -> Đóng popup, không lưu candidate vào hồ sơ chính thức
  ↳ Lưu sở thích nếu được hỏi -> Xác nhận candidate vào hồ sơ
```

---

## Tính năng tương tác

- Hiển thị món được gợi ý kèm lý do ngắn gọn, ví dụ: "Dựa trên các lần bạn chọn Low Carb gần đây".
- Nếu gợi ý liên quan đến dị ứng hoặc loại trừ nguyên liệu, chỉ được hiển thị như candidate cần xác nhận, không tự lưu vào hồ sơ dị ứng.
- Cho phép người dùng bỏ qua gợi ý mà không ảnh hưởng đến bộ lọc hiện tại.
- Khi người dùng chọn món, mở Popup chi tiết món ăn để xác nhận size, số lượng và ghi chú.
- Nếu không có đủ tín hiệu hành vi, không hiển thị popup.
- Nếu API gợi ý lỗi, không chặn luồng xem Menu; chỉ hiển thị Popup lỗi khi người dùng đang chủ động thao tác.

---

## Phân rã theo Atomic Design

### Atoms
- Recommendation Badge
- Close Button
- Dish Image
- Action Button

### Molecules
- Recommendation Reason
- Recommended Dish Item
- Preference Confirm Action

### Organisms
- Menu Behavior Recommendation Popup
- Dish Quick View Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| User ↔ UserPreferenceEvent | One-to-Many |
| User ↔ UserPreferenceCandidate | One-to-Many |
| Dishes ↔ DishDietTag ↔ DietTag | Many-to-Many |
| Dishes ↔ DishIngredient ↔ Ingredient | Many-to-Many |

---

# Types & Services

> File: `type/recommendation-popup.types.ts`

```ts
export type MenuRecommendationReasonType =
  | 'allergy_candidate'
  | 'price_range'
  | 'calorie_range'
  | 'diet_tag'
  | 'search_behavior';

export type MenuRecommendedDish = {
  id: string;
  dish_name: string;
  image_url?: string;
  price_from: number;
  calories?: number;
  protein?: number;
  diet_tags: string[];
  reason: string;
  reason_type: MenuRecommendationReasonType;
  candidate_id?: number;
};

export type MenuRecommendationPopupOutput = {
  recommendations: MenuRecommendedDish[];
  hasPreferenceCandidate: boolean;
};
```

---

# API Services

## API 1 - Lấy gợi ý món theo hành vi Menu

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/user-preferences/menu-recommendations` |
| Service | `fetchMenuBehaviorRecommendations()` |
| Input | token/session |
| Output | `MenuRecommendationPopupOutput` |

## API 2 - Xác nhận hoặc bỏ qua candidate

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/user-preferences/candidates/confirm` |
| Service | `confirmPreferenceCandidate(payload)` |
| Input | `ConfirmPreferenceInput` |
| Output | `{ success: boolean }` |
