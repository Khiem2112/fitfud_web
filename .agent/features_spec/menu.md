# Mô tả chức năng: Menu món ăn (Healthy Menu)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang hiển thị toàn bộ danh sách món ăn sức khỏe của FitFud. Hỗ trợ tìm kiếm thông minh, lọc nâng cao theo nhu cầu (loại món, calo, dị ứng, chế độ ăn, khoảng giá) và sắp xếp món ăn. Tích hợp Popup chi tiết món ăn (Quick View).

**Đối tượng**

- Khách vãng lai và người dùng đã đăng nhập.

**Mục đích**

Giúp người dùng dễ dàng tìm kiếm và lựa chọn món ăn phù hợp với chế độ ăn uống lành mạnh của cá nhân.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=137-485` (Trang chủ / Menu chính)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=232-2` (Popup chi tiết món ăn)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=461-15` (Popup recommend món ăn tại Menu)
- Spec popup liên quan: `popup/dish_quick_view.md`, `popup/menu_behavior_recommendation.md`
- Spec nghiệp vụ liên quan: `implicit_preference_tracking.md`

---

## Luồng tiếp cận

- Click link "Thực đơn" hoặc "Trang chủ" trên Header Navigation.
- Click các link gói ăn từ trang giới thiệu.
- Click từ các gợi ý trong nhật ký sức khỏe.

---

## Luồng giao diện

```text
Tải trang thực đơn (mặc định hiển thị tất cả món ăn đang bán)
    ↓
Nhập thanh tìm kiếm hoặc Tích chọn các bộ lọc ở sidebar bên trái
    ↓
Nhấn "Áp dụng" bộ lọc -> Cập nhật danh sách món (Grid)
    ↓
Di chuột vào món ăn -> Bấm "Thêm vào giỏ" -> Mở Popup chi tiết món ăn (Quick View)
    ↓
Bấm chọn size & tùy chỉnh thành phần -> Xác nhận "Thêm vào giỏ hàng"
```

---

## Tính năng tương tác

### Tìm kiếm
- Ô tìm kiếm nhập text: Tìm theo tên món ăn hoặc các thành phần nguyên liệu chính.
- Gợi ý từ khóa tìm kiếm phổ biến.

### Bộ lọc nâng cao (Sidebar Filter)
- **Chọn nhiều (Multi-select)**:
  - Loại món (Món chính, Salad, Ăn sáng, Ăn nhẹ...)
  - Chế độ ăn (Giàu Protein, Thuần chay, Low Carb...)
  - Loại trừ dị ứng (Cá, Trứng, Đậu nành, Gluten, Hạt, Sữa...)
- **Khoảng calo**: Slider hoặc input nhập khoảng Calo "Từ ... kcal" - "Đến ... kcal".
- **Khoảng giá**: Lọc món theo mức ngân sách.
- **Trạng thái**: Toggle "Chỉ hiển thị món đang bán" (lọc bỏ món hết hàng).

### Lưới món ăn & Badge
- Thẻ món ăn (Product Card) hiển thị: Ảnh món, tag giảm giá, tên món, calo, đánh giá sao, mô tả ngắn, giá tiền, badge ăn kiêng (KETO, PRO).
- Badge cảnh báo "TẠM HẾT HÀNG" đè lên ảnh sản phẩm nếu món đó có status `Out of Stock`. Nút "Thêm vào giỏ" đổi thành "Hết hàng" và bị disable.

### Popup chi tiết món ăn (Quick View Modal)
- Khi bấm "Thêm vào giỏ" hoặc click thẻ món, mở Popup nhanh.
- Hiển thị lượng Calo, Carb, Protein, Fat lớn.
- Cho phép chọn Size (S, M, L) và tính toán cộng thêm tiền phụ trội (`+0đ`, `+15.000đ`, `+30.000đ`).
- Tích hợp checkbox loại bỏ nguyên liệu (ví dụ: Không lấy hành tây, không lấy rong biển...).
- Ô nhập "Ghi chú cho đầu bếp".
- Nút "Thêm vào giỏ hàng" và bộ tăng giảm số lượng.
- Chi tiết hành vi popup được quản lý tại `popup/dish_quick_view.md`.

### Popup gợi ý món theo hành vi
- Khi người dùng lọc/tìm kiếm món nhiều lần và hệ thống có preference candidate phù hợp, có thể hiển thị Popup recommend món ăn tại Menu.
- Popup chỉ đưa ra gợi ý và lý do, không tự lưu dị ứng hoặc dữ liệu sức khỏe chính thức nếu người dùng chưa xác nhận.
- Chi tiết hành vi tại `popup/menu_behavior_recommendation.md` và nghiệp vụ thu thập tín hiệu tại `implicit_preference_tracking.md`.

---

## Phân rã theo Atomic Design

### Atoms
- Checkbox / Toggle Switch
- Input số lượng (Qty Selector)
- Product Badge (Best Seller, Keto, Out of stock)
- Rating Star Icon

### Molecules
- Search Box Input
- Filter Category Section
- Dish Card (Ảnh, Tên, Calo, Giá, Rating)

### Organisms
- Sidebar Filter Form
- Dish Grid list
- Quick View Modal Popup (Có chọn size, ghi chú)

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Dishes ↔ DishSize | One-to-Many |
| Dishes ↔ Category | Many-to-One |
| Dishes ↔ DishDietTag ↔ DietTag | Many-to-Many |
| Dishes ↔ DishIngredient ↔ Ingredient | Many-to-Many |

---

# Types & Services

> File: `type/menu.types.ts`

```ts
export type DishSizeInfo = {
  id: string;
  size_name: string;
  price: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
};

export type DishItem = {
  id: string;
  dish_name: string;
  description?: string;
  image_url?: string;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  category_name: string;
  diet_tags: string[];
  ingredients: string[];
  sizes: DishSizeInfo[]; // Chứa các kích cỡ phần ăn và giá/dinh dưỡng tương ứng
  rating_avg: number;
};

export type FilterMenuInput = {
  search?: string;
  categories?: string[];
  diets?: string[];
  allergiesExclude?: string[];
  minCal?: number;
  maxCal?: number;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  page: number;
  limit: number;
};

export type FilterMenuOutput = {
  dishes: DishItem[];
  totalItems: number;
  totalPages: number;
};
```

---

# API Services

## API 1 - Lấy danh sách món ăn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/dishes` với query params |
| Service | `fetchHealthyMenu(params)` |
| Input | `FilterMenuInput` |
| Output | `FilterMenuOutput` |

## API 2 - Lấy chi tiết món ăn (Quick View)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/dishes/{id}` |
| Service | `fetchDishDetail(id)` |
| Input | `id: string` |
| Output | `DishItem` |
