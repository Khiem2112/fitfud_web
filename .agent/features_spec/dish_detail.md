# Mô tả chức năng: Chi tiết món ăn (Dish Detail)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang hiển thị thông tin chi tiết của một món ăn cụ thể. Cung cấp chỉ số dinh dưỡng macro, danh sách nguyên liệu, các đánh giá thực tế của khách hàng và đặc biệt là hệ thống tự động đưa ra cảnh báo dị ứng dựa trên hồ sơ y tế của người dùng đang đăng nhập.

**Đối tượng**

- Người dùng khách và người dùng đã đăng nhập.

**Mục đích**

Giúp người dùng nắm rõ giá trị dinh dưỡng của món ăn, kiểm tra độ an toàn (tránh chất gây dị ứng) và đưa ra quyết định mua hàng chính xác.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=142-759` (Chi tiết món ăn)

---

## Luồng tiếp cận

- Click vào thẻ món ăn trên trang Thực đơn hoặc trang chủ.
- Click từ liên kết gợi ý trong Trang gợi ý AI hoặc Nhật ký sức khỏe.

---

## Luồng giao diện

```text
Tải trang chi tiết món ăn (id)
    ↓
Đọc thông tin mô tả, nguyên liệu & bảng Macro dinh dưỡng
    ↓
Hệ thống đối chiếu nguyên liệu món ăn với danh sách dị ứng trong Customer Profile
    ↓
Có trùng khớp dị ứng?
    ↳ Có: Hiển thị Banner cảnh báo màu đỏ ("Món ăn này có chứa... Sử dụng có thể gây kích ứng")
    ↳ Không: Không hiển thị banner cảnh báo
    ↓
Chọn Size (S, M, L) -> Cập nhật bảng Macro và giá tiền tương ứng
    ↓
Bấm chọn số lượng và nhấn "Tôi hiểu cảnh báo - Tiếp tục" hoặc "Thêm vào giỏ hàng"
    ↓
Thêm món vào giỏ hàng với size và số lượng đã chọn
```

---

## Tính năng tương tác

### Bảng chỉ số dinh dưỡng (Macros Chart)
- Hiển thị 4 chỉ số lớn: Calories (kcal), Protein (g), Carbs (g), Chất béo/Fat (g).
- Các chỉ số tự động cập nhật khi người dùng thay đổi kích cỡ phần ăn (Size S, M, L).

### Cảnh báo dị ứng cá nhân hóa (Allergen Smart Warning)
- **Tính năng độc quyền**: So khớp nguyên liệu của món ăn (`ingredients`) với danh mục dị ứng (`allergies`) trong hồ sơ người dùng đăng nhập.
- Nếu phát hiện trùng khớp, hiển thị khung cảnh báo màu đỏ nổi bật phía trên nút Mua hàng:
  > **CẢNH BÁO DỊ ỨNG:** Món ăn này có chứa [TÊN NGUYÊN LIỆU]. Hồ sơ sức khỏe của bạn ghi nhận dị ứng với [TÊN NGUYÊN LIỆU]. Sử dụng món ăn này có thể gây kích ứng.
- Khi có cảnh báo, nút "Thêm vào giỏ hàng" đổi text thành "Tôi hiểu cảnh báo – tiếp tục". Chức năng vẫn là thêm món vào giỏ; text này chỉ nhấn mạnh rằng người dùng đã nhìn thấy cảnh báo dị ứng.

### Nguyên liệu & Kích cỡ
- Hiển thị danh sách nguyên liệu trực quan (Cá hồi, Gạo lứt, Bông cải xanh...).
- Chọn kích cỡ (S, M, L) dạng radio button nút bấm hộp tròn.

### Khách hàng đánh giá (Reviews List)
- Hiển thị điểm số trung bình (ví dụ: `4.8 / 5` từ `126 đánh giá`).
- Danh sách bình luận gồm: Tên khách, số sao đánh giá, nội dung bình luận, ngày đánh giá.
- Nút "Xem tất cả đánh giá" mở modal bình luận đầy đủ.

---

## Phân rã theo Atomic Design

### Atoms
- Size Button Selector (S, M, L)
- Quantity Input Counter
- Rating Stars indicator
- Allergen Warning Icon

### Molecules
- Macro Nutrient Badge (Số calo + Đơn vị)
- Ingredient Chip item
- User Review Comment item

### Organisms
- Product Gallery (Hình ảnh món ăn)
- Product Info Section (Tên, Giá, Mô tả, Chọn size, Cảnh báo dị ứng)
- Ingredients Grid Layout
- User Reviews Container

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Dishes ↔ DishSize | One-to-Many |
| Dishes ↔ Review | One-to-Many |
| CustomerProfile ↔ CustomerAllergy | One-to-Many |

---

# Types & Services

> File: `type/dish.types.ts`

```ts
export type ReviewItem = {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  date: string;
};

export type DishDetailRes = {
  id: string;
  dish_name: string;
  description: string;
  image_url: string;
  status: string;
  ingredients: string[]; // Danh sách tên nguyên liệu
  sizes: {
    id: string;
    size_name: string;
    price: number;
    calories: number;
    protein: number;
    fat: number;
    carb: number;
  }[];
  reviews: ReviewItem[];
  rating_avg: number;
  reviews_count: number;
};

export type UserAllergyInfo = {
  allergyNames: string[];
};
```

---

# API Services

## API 1 - Lấy chi tiết món ăn và các đánh giá liên quan

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/dishes/{id}` (kèm query populate sizes & reviews) |
| Service | `getDishDetails(id)` |
| Input | `id: string` |
| Output | `DishDetailRes` |

## API 2 - Lấy danh sách dị ứng của người dùng

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/customer-profiles/allergies` |
| Service | `getUserAllergies()` |
| Input | `void` |
| Output | `UserAllergyInfo` |

**Mô tả**

Dùng để đối chiếu với nguyên liệu của món ăn và hiển thị cảnh báo dị ứng cá nhân hóa nếu có trùng khớp.
