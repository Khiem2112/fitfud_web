# Mô tả popup: Gợi ý món ăn tại Menu theo hành vi

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup gợi ý món ăn tại giao diện Menu, hiển thị một nhóm món phù hợp với hành vi lọc/tìm kiếm gần đây của người dùng. File này chỉ mô tả popup hiển thị gì và FE dùng dữ liệu nào để hiển thị; rule BE chi tiết nằm ở `implicit_preference_tracking.md`.

**Đối tượng**

- Người dùng đã đăng nhập.
- Người dùng guest hoặc tài khoản tạm có dữ liệu hành vi theo session/số điện thoại.

**Mục đích**

Đưa ra gợi ý món phù hợp ngay trong lúc người dùng đang xem thực đơn, giúp rút ngắn thời gian chọn món mà không tự ý ghi dữ liệu suy luận vào hồ sơ chính thức.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=461-15` (Popup recommend món ăn tại Menu)
- Spec nghiệp vụ liên quan: `implicit_preference_tracking.md`

---

## Luồng tiếp cận

- Người dùng đang ở trang Menu.
- FE nhận được dữ liệu gợi ý món từ service recommendation.
- Có ít nhất một món phù hợp để hiển thị.

---

## Luồng giao diện

```text
Người dùng thao tác trên /menu
    ↓
FE cập nhật dữ liệu filter/search hiện tại
    ↓
FE gọi/lấy danh sách món được gợi ý theo hành vi đã có
    ↓
Nếu có gợi ý phù hợp -> Hiển thị popup
    ↓
Người dùng chọn:
  ↳ Xem món được gợi ý -> Điều hướng sang Trang chi tiết món ăn
  ↳ Thêm vào giỏ -> Mở Popup chọn món nhanh để chọn size/số lượng
  ↳ Bỏ qua -> Đóng popup
```

---

## Tính năng tương tác

- Popup hiển thị danh sách món gợi ý, gồm ảnh món, tên món, giá, tag dinh dưỡng/chế độ ăn nếu có và lý do ngắn gọn.
- Ví dụ lý do hiển thị: "Phù hợp với bộ lọc Low Carb bạn hay chọn" hoặc "Gần với khoảng calo bạn đang tìm".
- Nếu lý do liên quan đến dị ứng hoặc loại trừ nguyên liệu, chỉ hiển thị như gợi ý tham khảo; không tự lưu vào hồ sơ dị ứng.
- Cho phép người dùng bỏ qua gợi ý mà không ảnh hưởng đến bộ lọc hiện tại.
- Click vào món gợi ý điều hướng sang Trang chi tiết món ăn.
- Click "Thêm vào giỏ" mở Popup chọn món nhanh để xác nhận size, số lượng và ghi chú.
- Nếu không có đủ tín hiệu hành vi, không hiển thị popup.

### Dữ liệu FE cần để hiển thị
- Danh sách món gợi ý.
- Lý do gợi ý dạng text ngắn.
- Trạng thái món còn bán/hết hàng.
- Thông tin giá/ảnh/tag đủ để render card trong popup.

### FE logic hiển thị popup
- Theo dõi thay đổi filter/search trên trang Menu.
- Khi FE có dữ liệu gợi ý món hợp lệ và popup chưa bị người dùng bỏ qua trong phiên hiện tại, hiển thị popup.
- Nếu người dùng bấm "Bỏ qua", ẩn popup trong phiên hiện tại để tránh gây phiền.
- Nếu danh sách gợi ý rỗng, không hiển thị popup.
- Nếu món gợi ý đã hết hàng, vẫn có thể hiển thị nhưng disable nút "Thêm vào giỏ".

### Phần không mô tả trong popup này
- Không mô tả ngưỡng tạo candidate chi tiết.
- Không mô tả ERD/rule BE chi tiết.
- Không quyết định tự động lưu dị ứng hoặc sở thích chính thức.

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

*Không mô tả trong file popup này. Rule BE và quan hệ dữ liệu nằm ở `implicit_preference_tracking.md`.*

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

**Ghi chú**

File popup này chỉ cần API lấy dữ liệu hiển thị popup. API/rule xác nhận candidate thuộc phạm vi `implicit_preference_tracking.md`.
