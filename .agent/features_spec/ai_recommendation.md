# Mô tả chức năng: Gợi ý AI (AI Recommendation)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang Gợi ý AI đưa ra danh sách món ăn phù hợp dựa trên hồ sơ sức khỏe, mục tiêu dinh dưỡng, dị ứng và dữ liệu nhật ký bữa ăn của người dùng.

**Đối tượng**

- Người dùng đã đăng nhập và đã hoàn thành khảo sát thể trạng.
- Người dùng chưa hoàn thành khảo sát sẽ được điều hướng tới form khảo sát trước khi nhận gợi ý.

**Mục đích**

Cá nhân hóa trải nghiệm chọn món, giúp người dùng ra quyết định nhanh hơn và hạn chế chọn nhầm món không phù hợp với mục tiêu hoặc dị ứng cá nhân.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2977` (Gợi ý AI)
(Popup lỗi dùng chung)

---

## Luồng tiếp cận

- Click CTA "Nhận gợi ý AI" tại Trang chủ.
- Click từ Hồ sơ cá nhân chỗ 'tiến độ dinh dưỡng trong ngày.'

---

## Luồng giao diện

```text
Truy cập trang Gợi ý AI
    ↓
Kiểm tra trạng thái đăng nhập và hồ sơ dinh dưỡng
    ↓
Nếu chưa đăng nhập -> Điều hướng sang Đăng nhập
Nếu chưa có hồ sơ -> Điều hướng sang Khảo sát thể trạng
    ↓
Hiển thị danh sách món được gợi ý kèm lý do phù hợp
    ↓
Người dùng chọn món:
  ↳ Xem chi tiết -> Mở Popup chi tiết món ăn hoặc trang chi tiết món
  ↳ Thêm vào giỏ -> Mở Popup chi tiết món ăn để xác nhận size/số lượng
```

---

## Tính năng tương tác

### Phân tích hồ sơ cá nhân
- Sử dụng dữ liệu mục tiêu sức khỏe, chỉ số calo/protein mục tiêu, danh sách dị ứng và sở thích ẩm thực đã lưu.
- Không gợi ý món có nguyên liệu trùng với dị ứng đã khai báo.
- Nếu không đủ dữ liệu hồ sơ, hệ thống yêu cầu người dùng hoàn thành khảo sát thay vì tự suy đoán.

### Danh sách món gợi ý
- Mỗi món hiển thị ảnh, tên, giá, calo, protein, tag chế độ ăn và lý do AI đề xuất.
- Hỗ trợ xem nhanh chi tiết món và thêm vào giỏ.
- Nếu món tạm hết hàng không hiển thị món đó.


---

## Phân rã theo Atomic Design

### Atoms
- AI Badge
- Nutrition Badge
- Loading Indicator
- Button
- Error Message

### Molecules
- Recommendation Reason Block
- Suggested Dish Card
- Profile Summary Chip Group

### Organisms
- AI Recommendation Result List
- AI Analysis Loading Popup
- Dish Quick View Popup

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| CustomerProfile ↔ UserExtended | One-to-One |
| CustomerProfile ↔ CustomerAllergy | One-to-Many |
| Dishes ↔ DishIngredient ↔ Ingredient | Many-to-Many |
| Dishes ↔ DishDietTag ↔ DietTag | Many-to-Many |

---

# Types & Services

> File: `type/ai-recommendation.types.ts`


```ts
export type AiRecommendationSource = 'PROFILE_PAGE' | 'HOME_CTA' | 'DIRECT_ACCESS';

export type AiRecommendationInput = {
  profileId: string;
  limit?: number;
};

export type AiRecommendedDish = {
  id: string;
  dish_name: string;
  description?: string;
  image_url?: string;
  price_from: number;
  calories: number;
  protein: number;
  carb?: number;
  fat?: number;
  diet_tags: string[];
  reason: string;
  status: 'Active' | 'Inactive' | 'Out of Stock';
};

export type AiRecommendationOutput = {
  recommendedDishes: AiRecommendedDish[];
  generated_at: string;
};
```

---
# API Services

## API 1 - Lấy gợi ý món ăn bằng AI

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/recommendations/ai` |
| Service | `fetchAiRecommendations(params)` |
| Input | `AiRecommendationInput` |
| Output | `AiRecommendationOutput` |

**Mô tả**

Trả về danh sách món được cá nhân hóa theo hồ sơ người dùng. Nếu backend chưa có AI thật, service có thể dùng rule-based recommendation nhưng vẫn giữ nguyên contract.

**Chú thích cho FE/AI code**

- Chỉ gọi API này sau khi người dùng đã đăng nhập và đã có hồ sơ dinh dưỡng.
- Nếu chưa đăng nhập, điều hướng sang `/login`.
- Nếu chưa có hồ sơ dinh dưỡng, điều hướng sang trang Khảo sát thể trạng.
- Nếu người dùng vào từ Hồ sơ cá nhân qua bảng tiến độ dinh dưỡng, truyền `source = 'PROFILE_PAGE'`.
- Nếu người dùng vào từ CTA Trang chủ, truyền `source = 'HOME_CTA'`.
- Nếu người dùng vào trực tiếp URL `/ai-recommendation`, truyền `source = 'DIRECT_ACCESS'` hoặc bỏ trống.
- API không nên trả món hết hàng. Nếu backend vẫn trả món hết hàng, FE phải lọc bỏ món có `status !== 'Active'` trước khi render.
- Khi người dùng bấm "Xem chi tiết", điều hướng sang Trang chi tiết món ăn.
- Khi người dùng bấm "Thêm vào giỏ", không thêm thẳng vào giỏ; phải mở Popup chọn món nhanh để chọn size/số lượng.

**Dữ liệu dùng để gợi ý**

- Mục tiêu sức khỏe hiện tại.
- Target calories/protein.
- Dị ứng cần tránh.
- Nhật ký bữa ăn gần đây.
- Hành vi người dùng nếu backend đã có dữ liệu tracking.

**Chú thích nghiệp vụ**

- Không gợi ý món có nguyên liệu trùng dị ứng đã khai báo.
- Không gợi ý món `Out of Stock`.
- Nếu `recommendedDishes` rỗng, hiển thị trạng thái rỗng và CTA quay lại Menu hoặc cập nhật hồ sơ.
- Lý do gợi ý (`reason`) cần ngắn gọn, dễ hiểu, ví dụ:
  - "Phù hợp với mục tiêu tăng cơ của bạn"
  - "Giàu protein và nằm trong mức calo mục tiêu"
  - "Không chứa các nguyên liệu bạn cần tránh"