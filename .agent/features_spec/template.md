# Mô tả chức năng: Menu món ăn

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện hiển thị danh sách món ăn, hỗ trợ tìm kiếm, lọc đa điều kiện (dinh dưỡng, dị ứng, giá) và phân trang.

**Đối tượng**

- Người dùng khách
- Người dùng đã đăng nhập

**Mục đích**

Hỗ trợ cá nhân hóa việc khám phá món ăn, tối ưu hóa trải nghiệm tìm kiếm của người dùng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `[Link_Figma]`

---

## Luồng tiếp cận

- Header Navigation tại Trang chủ
- Nút **"Xem thực đơn lẻ"** tại Trang Gói ăn tuần
- Link gợi ý từ Trang Nhật ký sức khỏe
- Truy cập trực tiếp qua URL

---

## Luồng giao diện

```text
Tải trang
    ↓
Tìm kiếm / Chọn bộ lọc
    ↓
Nhấn "Áp dụng lọc"
    ↓
Hiển thị danh sách món ăn
    ↓
Chuyển trang (Pagination)
```

---

## Tính năng tương tác

### Tìm kiếm

- Query theo:
  - Tên món
  - Thành phần
- Có gợi ý (Suggestion)

### Bộ lọc

#### Chọn nhiều

- Loại món
- Chế độ ăn
- Loại trừ dị ứng

#### Chọn một

- Khoảng giá
- Lượng calo

#### Toggle Switch

- Chỉ hiển thị món đang bán

### Sắp xếp

- Phổ biến
- Giá tăng dần
- Giá giảm dần

### Thẻ món ăn

Bao gồm:

- Yêu thích
- Xem nhanh
- Hiển thị Tag
- Cảnh báo **"Tạm hết hàng"**

> Lưu ý:
> Khi người dùng nhấn **"Thêm vào giỏ"**, Menu chỉ phát trigger event để mở Pop-up chi tiết món ăn. Pop-up này nằm ngoài phạm vi (scope) của chức năng Menu.

---

## Phân rã theo Atomic Design

### Atoms

- Checkbox
- Radio Button
- Toggle Switch
- Badge
- Button
- Icons

### Molecules

- Search Input Block
- Filter Group
- Menu Card
- Pagination Block

### Organisms

- Product Card
- Product Menu
- Sidebar Filter

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Dishes ↔ DietCategories | Many-to-Many |
| Dishes ↔ DishCategories | Many-to-Many |
| Dishes ↔ Allergies | Many-to-Many |

---

# Types & Services

> File: `types.ts`

## 1. Master Data (GraphQL)

```ts
export type FilterMasterDataOutput = {
  categories: {
    id: string;
    name: string;
  }[];

  diets: {
    id: string;
    name: string;
  }[];

  allergies: {
    id: string;
    name: string;
  }[];
};
```

---

## 2. Danh sách món ăn (REST)

### Input

```ts
export type FilterMenuInput = {
  search?: string;
  categories?: string[];
  diets?: string[];
  priceRange?: string;
  calories?: string;
  excludedAllergies?: string[];
  inStockOnly: boolean;
  page: number;
  limit: number;
};
```

---

### ProductNutrients

```ts
export type ProductNutrients = {
  protein: number;
  calories: number;
  carb: number;
};
```

---

### ProductGeneralInfo

```ts
export type ProductGeneralInfo = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  displayTags: string[];
  prepTime: number;
  rating: number;
  isFavorite: boolean;
  inStock: boolean;
};
```

---

### ProductItem

```ts
export type ProductItem =
  ProductNutrients &
  ProductGeneralInfo;
```

---

### Output

```ts
export type FilterMenuOutput = {
  products: ProductItem[];
  totalItems: number;
  totalPages: number;
};
```

---

# API Services

## API 1 - Lấy Master Data

| Thuộc tính | Giá trị |
|------------|----------|
| API | GraphQL |
| Service | `fetchFilterOptions()` |
| Input | `void` |
| Output | `FilterMasterDataOutput` |

**Mô tả**

Được gọi khi khởi tạo trang để lấy toàn bộ danh mục tĩnh.

---

## API 2 - Lấy danh sách món ăn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST |
| Service | `fetchHealthyMenu(params)` |
| Input | `FilterMenuInput` |
| Output | `FilterMenuOutput` |

**Mô tả**

Lấy danh sách món ăn theo bộ lọc và hỗ trợ phân trang.