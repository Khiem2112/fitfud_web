# Mô tả popup: Đánh giá món ăn

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup cho phép người dùng đánh giá món ăn sau khi đã mua hoặc xem/nhập nội dung đánh giá trong ngữ cảnh đơn hàng.

**Đối tượng**

- Người dùng đã đăng nhập và có đơn hàng đã hoàn thành.

**Mục đích**

Thu thập phản hồi thực tế để cải thiện chất lượng món ăn và hỗ trợ người dùng khác ra quyết định.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=141-2` (Popup đánh giá món ăn)

---

## Luồng tiếp cận

- Click "Đánh giá" trong lịch sử đơn hàng đã hoàn thành.
- Click từ Popup chi tiết lịch sử đơn nếu món đủ điều kiện đánh giá.

---

## Luồng giao diện

```text
Người dùng click "Đánh giá"
    ↓
Mở Popup đánh giá món ăn
    ↓
Chọn số sao và nhập nhận xét
    ↓
Submit đánh giá
    ↓
Thành công -> Đóng popup và cập nhật trạng thái đã đánh giá
Thất bại -> Hiển thị lỗi
```

---

## Tính năng tương tác

- Chọn rating từ 1 đến 5 sao.
- Nội dung nhận xét là tùy chọn hoặc bắt buộc tùy rule backend; nếu chưa thống nhất, frontend cần theo response validation từ API.
- Chỉ cho phép đánh giá món thuộc đơn hàng đã hoàn thành.
- Không cho gửi nhiều đánh giá trùng cho cùng một món trong cùng một đơn nếu backend đã ghi nhận.

---

## Phân rã theo Atomic Design

### Atoms
- Star Rating Button
- Textarea
- Submit Button
- Error Text

### Molecules
- Rating Selector
- Review Form Group

### Organisms
- Dish Review Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Review ↔ Dishes | Many-to-One |
| Review ↔ UserExtended | Many-to-One |
| Review ↔ OrderItem | One-to-One hoặc Many-to-One |

---

# Types & Services

> File: `type/review.types.ts`

```ts
export type CreateDishReviewInput = {
  dish_id: string;
  order_item_id: string;
  rating: number;
  comment?: string;
};

export type CreateDishReviewOutput = {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
};
```

---

# API Services

## API 1 - Tạo đánh giá món ăn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/reviews` |
| Service | `createDishReview(params)` |
| Input | `CreateDishReviewInput` |
| Output | `CreateDishReviewOutput` |
