# Mô tả popup: Chi tiết món ăn nhanh

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup hiển thị thông tin nhanh của món ăn để người dùng chọn size, số lượng, tùy chỉnh ghi chú và thêm vào giỏ mà không rời khỏi trang hiện tại.

**Đối tượng**

- Khách vãng lai.
- Người dùng đã đăng nhập.

**Mục đích**

Rút ngắn thao tác mua hàng từ Trang chủ, Menu hoặc Gợi ý AI, đồng thời đảm bảo người dùng xác nhận đúng size, số lượng và tùy chỉnh trước khi thêm vào giỏ.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=232-2` (Popup chi tiết món ăn)

---

## Luồng tiếp cận

- Nhấn "Thêm vào giỏ" từ thẻ món ở Trang chủ, Menu hoặc Gợi ý AI.
- Nhấn xem nhanh từ thẻ món ăn.

---

## Luồng giao diện

```text
Mở popup với dishId
    ↓
Load thông tin món, size, macro dinh dưỡng và nguyên liệu
    ↓
Người dùng chọn size, số lượng, ghi chú hoặc loại bỏ nguyên liệu nếu hỗ trợ
    ↓
Nhấn "Thêm vào giỏ hàng"
    ↓
Validate món còn hàng và lựa chọn hợp lệ
    ↓
Thêm item vào Cart State và đóng popup hoặc mở Popup giỏ hàng
```

---

## Tính năng tương tác

- Cập nhật giá và macro dinh dưỡng theo size đã chọn.
- Cho phép tăng/giảm số lượng, số lượng tối thiểu là 1.
- Cho phép nhập ghi chú cho đầu bếp.
- Nếu món hết hàng, disable nút thêm vào giỏ và hiển thị trạng thái hết hàng.
- Nếu thao tác không hợp lệ, hiển thị Popup lỗi dùng chung với nội dung cụ thể.

---

## Phân rã theo Atomic Design

### Atoms
- Close Button
- Size Button
- Quantity Stepper
- Nutrition Badge
- Textarea

### Molecules
- Dish Media Preview
- Size Selector
- Macro Summary
- Add To Cart Action Row

### Organisms
- Dish Quick View Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| Dishes ↔ DishSize | One-to-Many |
| Dishes ↔ DishIngredient ↔ Ingredient | Many-to-Many |

---

# Types & Services

> File: `type/popup.types.ts`

```ts
export type DishQuickViewInput = {
  dishId: string;
};

export type AddCartItemInput = {
  dish_size_id: string;
  quantity: number;
  chef_notes?: string;
};
```

---

# API Services

## API 1 - Lấy chi tiết món cho popup

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/dishes/{id}` |
| Service | `fetchDishDetail(id)` |
| Input | `id: string` |
| Output | `DishDetailRes` |
