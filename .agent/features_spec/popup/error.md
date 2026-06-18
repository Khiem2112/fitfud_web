# Mô tả popup: Lỗi dùng chung

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Popup lỗi dùng chung hiển thị khi người dùng thực hiện thao tác không hợp lệ hoặc hệ thống không thể xử lý yêu cầu.

**Đối tượng**

- Tất cả người dùng.

**Mục đích**

Thông báo rõ ràng lỗi xảy ra, nội dung lỗi theo đúng thao tác không hợp lệ, và hướng người dùng quay lại trạng thái có thể xử lý tiếp.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=353-1684` (Popup lỗi)

---

## Luồng tiếp cận

- Hiển thị tại mọi thao tác không hợp lệ.
- Hiển thị khi API trả lỗi cần thông báo cho người dùng.

---

## Luồng giao diện

```text
Người dùng thực hiện thao tác
    ↓
Validation hoặc API trả lỗi
    ↓
Mở Popup lỗi với nội dung cụ thể của thao tác
    ↓
Người dùng bấm "Đã hiểu" hoặc đóng popup
    ↓
Quay lại màn hình trước đó, không mất dữ liệu form nếu có thể
```

---

## Tính năng tương tác

- Nội dung lỗi phải truyền từ context thao tác, không dùng một thông báo chung mơ hồ.
- Có một hành động chính để đóng popup.
- Không tự động reload trang.
- Với lỗi validation form, ưu tiên hiển thị lỗi tại field; popup chỉ dùng cho lỗi tổng quát hoặc thao tác không thể tiếp tục.

---

## Phân rã theo Atomic Design

### Atoms
- Error Icon
- Error Title
- Error Message
- Close Button

### Molecules
- Error Content Block
- Error Action Row

### Organisms
- Global Error Modal

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

*Không có quan hệ DB trực tiếp. Popup nhận dữ liệu lỗi từ client validation hoặc API response.*

---

# Types & Services

> File: `type/error.types.ts`

```ts
export type AppErrorPopupData = {
  title: string;
  message: string;
  actionLabel?: string;
};
```

---

# API Services

## API 1 - Không áp dụng

| Thuộc tính | Giá trị |
|------------|----------|
| API | Client UI State |
| Service | `showErrorPopup(error)` |
| Input | `AppErrorPopupData` |
| Output | `void` |
