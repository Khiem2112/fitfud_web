# Mô tả chức năng: Về FitFud & Quy trình (About Us & Process)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang giới thiệu câu chuyện thương hiệu FitFud, sứ mệnh bảo vệ sức khỏe và quy trình vận hành khép kín (Khảo sát -> Thực đơn -> Giao hàng). Cung cấp đầy đủ thông tin hỗ trợ và cam kết dịch vụ cho khách hàng.

**Đối tượng**

- Khách vãng lai muốn tìm hiểu về dịch vụ.
- Khách hàng quan tâm đến chất lượng nguyên liệu và quy chuẩn dinh dưỡng.

**Mục đích**

Xây dựng niềm tin với khách hàng thông qua sự minh bạch về nguyên liệu đạt chuẩn VietGAP, đội ngũ chuyên gia dinh dưỡng và quy trình chuẩn bị chu đáo.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2383` (Giới thiệu & Quy trình)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2577` (Chân trang Footer)

---

## Luồng tiếp cận

- Click link "Về chúng tôi" trên Header Navigation.
- Click link "Cách thức hoạt động" tại trang chủ hoặc chân trang.
- Truy cập trực tiếp qua URL `/about`.

---

## Luồng giao diện

```text
Cuộn xem Câu chuyện FitFud
    ↓
Xem 3 bước vận hành hoạt động (Khảo sát -> Thực đơn -> Giao nóng)
    ↓
Đọc thông tin chứng nhận nguyên liệu (VietGAP, ISO 22000, Health Cert)
    ↓
Xem đội ngũ chuyên gia dinh dưỡng khuyên dùng
    ↓
Click các nút hành động ("Xem các gói ăn", "Tư vấn miễn phí")
```

---

## Tính năng tương tác

### Quy trình 3 bước (Interactive Operation Steps)
- Hiển thị 3 thẻ bước hoạt động rõ ràng, có hiệu ứng zoom nhẹ hoặc đổi màu khi di chuột qua (Hover effect).
- Nút Action "Xem các gói ăn" chuyển hướng nhanh sang thực đơn.

### Chứng nhận & Đối tác
- Hiển thị các logo chứng nhận chất lượng (Health Cert, ISO 22000, VietGAP) dạng carousel hoặc lưới ngang tinh tế.

### Form Yêu cầu Tư vấn miễn phí (Optional Callback Popup)
- Người dùng có thể click "Tư vấn miễn phí" để mở form nhanh gửi tên & SĐT để đội ngũ dinh dưỡng liên hệ hỗ trợ.

---

## Phân rã theo Atomic Design

### Atoms
- Heading, Paragraph, Sub-text
- Primary Button ("Xem các gói ăn")
- Secondary Button ("Tư vấn miễn phí")
- Badge chứng nhận VietGAP, ISO

### Molecules
- Process Card (Icon + Title + Description)
- Certification Logo Item

### Organisms
- Story Section (Hình ảnh nông trại + Sứ mệnh)
- Process Flow Section (3 cột quy trình)
- Quality Commitment Block
- Footer Section (Địa chỉ, SDT, Email chính sách hỗ trợ)

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

*Tính năng giới thiệu chủ yếu là nội dung tĩnh (static content) ở Frontend, không có quan hệ trực tiếp trong DB. Riêng form "Tư vấn miễn phí" nếu có sẽ gửi thông tin về backend hoặc lưu vào logs.*

---

# Types & Services

> File: `type/about.types.ts`

```ts
export type ConsultationRequestInput = {
  fullName: string;
  phone: string;
  note?: string;
};

export type ConsultationRequestOutput = {
  success: boolean;
  message: string;
};
```

---

# API Services

## API 1 - Gửi yêu cầu tư vấn (Tùy chọn)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/consultation-requests` (nếu backend hỗ trợ) hoặc mock |
| Service | `requestConsultation(params)` |
| Input | `ConsultationRequestInput` |
| Output | `ConsultationRequestOutput` |
