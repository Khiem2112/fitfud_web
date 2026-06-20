# Mô tả chức năng: Trang chủ (Home)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang chủ là điểm chạm đầu tiên của FitFud, giới thiệu giá trị cốt lõi về thực phẩm lành mạnh, điều hướng người dùng đến thực đơn, khảo sát cá nhân hóa và các khu vực nội dung chính của website.

**Đối tượng**

- Khách vãng lai.
- Người dùng đã đăng nhập.

**Mục đích**

Giúp người dùng nhanh chóng hiểu FitFud bán gì, lợi ích chính là gì và có thể bắt đầu hành trình mua món ăn hoặc nhận gợi ý dinh dưỡng bằng AI.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=137-485` (Trang chủ)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=141-132` (Header)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2577` (Footer)

---

## Luồng tiếp cận

- Truy cập trực tiếp domain chính hoặc URL `/`.
- Click logo FitFud trên Header Navigation.
- Chuyển hướng về trang chủ sau khi đăng nhập thành công nếu người dùng không có redirect đích.

---

## Luồng giao diện

```text
Tải trang chủ
    ↓
Hiển thị Header + Hero section
    ↓
Người dùng chọn CTA chính:
  ↳ "Xem thực đơn" -> Điều hướng sang Menu
  ↳ "Nhận gợi ý AI" -> Điều hướng sang Trang gợi ý AI hoặc Khảo sát nếu chưa có hồ sơ
    ↓
Cuộn xem các khu vực nội dung: món nổi bật, lợi ích, quy trình, đánh giá
    ↓
Footer cung cấp liên kết hỗ trợ và điều hướng phụ
```

---

## Tính năng tương tác

### Hero & CTA chính
- Hero cần thể hiện rõ thương hiệu FitFud, giá trị về bữa ăn lành mạnh và hành động chính.
- CTA "Xem thực đơn" điều hướng tới trang Menu.
- CTA "Nhận gợi ý AI" điều hướng tới trang Gợi ý AI nếu người dùng đã có hồ sơ; nếu chưa có hồ sơ dinh dưỡng thì điều hướng tới Khảo sát thể trạng.

### Khu vực món ăn nổi bật
- Hiển thị danh sách món phổ biến hoặc được đề xuất.
- Mỗi thẻ món hỗ trợ hành động xem chi tiết và thêm vào giỏ.
- Khi người dùng nhấn thêm món, mở Popup chi tiết món ăn để chọn size, số lượng và ghi chú.

### Khu vực quy trình sử dụng
- Trình bày luồng sử dụng FitFud ở mức tổng quan: khảo sát nhu cầu, chọn món phù hợp, đặt hàng và nhận món.
- Các nút hoặc liên kết trong khu vực này điều hướng tới Khảo sát, Menu hoặc About Us tùy ngữ cảnh.

### Header & Footer dùng chung
- Trang chủ sử dụng Header và Footer theo spec `header_footer.md`.
- Trạng thái giỏ hàng trên Header cần đồng bộ với Popup giỏ hàng.

---

## Phân rã theo Atomic Design

### Atoms
- Logo
- Navigation link
- Button CTA
- Badge dinh dưỡng
- Rating star

### Molecules
- Hero CTA group
- Featured Dish Card
- Benefit Item
- Process Step Item

### Organisms
- Header Navigation
- Hero Section
- Featured Dishes Section
- How It Works Section
- Footer Section

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Dishes ↔ DishSize | One-to-Many |
| Dishes ↔ Review | One-to-Many |
| CustomerProfile ↔ UserExtended | One-to-One |

---

# Types & Services

> File: `type/home.types.ts`

```ts
export type HomeDishItem = {
  id: string;
  dish_name: string;
  description?: string;
  image_url?: string;
  price_from: number;
  calories_from?: number;
  diet_tags: string[];
  rating_avg?: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
};

export type HomePageOutput = {
  featuredDishes: HomeDishItem[];
};
```

---

# API Services

## API 1 - Lấy dữ liệu trang chủ

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/home` hoặc REST / GET `/api/dishes?featured=true` |
| Service | `fetchHomePage()` |
| Input | `void` |
| Output | `HomePageOutput` |

**Mô tả**

Lấy danh sách món nổi bật cho trang chủ. Nếu backend chưa có endpoint riêng, frontend có thể dùng endpoint danh sách món với query phù hợp.
