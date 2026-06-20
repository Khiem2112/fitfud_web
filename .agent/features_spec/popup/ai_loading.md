# Mô tả popup: Chờ phân tích AI

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup chờ phân tích AI hiển thị trong lúc hệ thống xử lý dữ liệu dinh dưỡng, ảnh bữa ăn hoặc gợi ý món ăn cá nhân hóa.

**Đối tượng**

- Người dùng đang chờ kết quả AI.

**Mục đích**

Cho người dùng biết hệ thống đang xử lý, hạn chế thao tác submit lặp và giữ trải nghiệm liền mạch.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=353-1684` (Popup chờ phân tích AI)

---

## Luồng tiếp cận

- Sau khi hoàn tất Khảo sát thể trạng.
- Khi mở Trang Gợi ý AI và hệ thống đang tạo danh sách gợi ý.
- Khi tải ảnh bữa ăn trong Hồ sơ cá nhân để AI phân tích.

---

## Luồng giao diện

```text
Người dùng gửi dữ liệu cần AI xử lý
    ↓
Hiển thị Popup chờ phân tích AI
    ↓
Khóa thao tác submit chính trong lúc xử lý
    ↓
AI trả kết quả thành công -> Đóng popup và hiển thị kết quả
AI thất bại -> Đóng popup và mở Popup lỗi với thông báo cụ thể
```

---

## Tính năng tương tác

- Hiển thị trạng thái xử lý bằng loading indicator và nội dung tiến trình ngắn.
- Không cho người dùng bấm submit nhiều lần.
- Không tự tạo kết quả giả nếu API trả lỗi.
- Có thể cho phép hủy thao tác nếu luồng sản phẩm yêu cầu, nhưng mặc định chờ đến khi API trả kết quả.

---

## Phân rã theo Atomic Design

### Atoms
- Loading Spinner
- Progress Text

### Molecules
- AI Processing Message

### Organisms
- AI Loading Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| CustomerProfile ↔ UserExtended | One-to-One |
| MealLog ↔ UserExtended | Many-to-One |

---

# Types & Services

> File: `type/ai-loading.types.ts`

```ts
export type AiLoadingContext = 'SURVEY_ANALYSIS' | 'AI_RECOMMENDATION' | 'MEAL_IMAGE_ANALYSIS';

export type AiLoadingState = {
  isOpen: boolean;
  context: AiLoadingContext;
  message?: string;
};
```

---

# API Services

## API 1 - Không áp dụng

| Thuộc tính | Giá trị |
|------------|----------|
| API | Client UI State |
| Service | `showAiLoading(context)` |
| Input | `AiLoadingContext` |
| Output | `void` |
