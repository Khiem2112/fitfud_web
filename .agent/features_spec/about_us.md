# Mô tả chức năng: Về FitFud (About Us)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Trang giới thiệu FitFud theo mẫu thiết kế: hero thương hiệu, quy trình hoạt động 3 bước, cam kết nguyên liệu bản địa/tiêu chuẩn quốc tế, chứng nhận chuyên gia dinh dưỡng và CTA bắt đầu hành trình sống khỏe.

**Đối tượng**

- Khách vãng lai muốn tìm hiểu về dịch vụ.
- Khách hàng quan tâm đến chất lượng nguyên liệu và quy chuẩn dinh dưỡng.

**Mục đích**

Xây dựng niềm tin với khách hàng thông qua thông điệp sống khỏe, quy trình đặt món rõ ràng, nguồn nguyên liệu minh bạch và các chứng nhận chất lượng.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2383` (Về FitFud)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-2577` (Chân trang Footer)
- Spec layout liên quan: `header_footer.md`

---

## Luồng tiếp cận

- Click link "Về chúng tôi" hoặc "Về FitFud" trên Sidebar/Header Navigation.
- Click link liên quan đến FitFud tại trang chủ hoặc footer.
- Truy cập trực tiếp qua URL `/about`.

---

## Luồng giao diện

```text
Tải trang Về FitFud
    ↓
Xem Hero với thông điệp "Hành trình mang lại sức khỏe cho người Việt"
    ↓
Cuộn đến "Cách thức hoạt động" gồm 3 bước: Phân tích thể trạng -> Thiết kế thực đơn -> Giao tận tay
    ↓
Đọc khối "Nguyên liệu bản địa, Tiêu chuẩn quốc tế"
    ↓
Xem khối "Được chứng nhận bởi chuyên gia dinh dưỡng" và các badge chứng nhận
    ↓
Click CTA cuối trang: "Xem thực đơn" hoặc "Tư vấn dinh dưỡng"
```

---

## Tính năng tương tác

### Hero thương hiệu
- Hiển thị ảnh món ăn lớn làm nền.
- Có badge nhỏ "Câu chuyện của chúng tôi".
- Heading chính: "Hành trình mang lại sức khỏe cho người Việt".
- Mô tả ngắn về FitFud và hành trình xây dựng bữa ăn lành mạnh.
- CTA "Khám phá ngay" điều hướng xuống nội dung chính hoặc sang trang thực đơn tùy thiết kế.

### Cách thức hoạt động
- Hiển thị 3 thẻ bước theo hàng ngang:
  - "1. Phân tích thể trạng": dựa trên chỉ số cá nhân để hiểu nhu cầu sức khỏe.
  - "2. Thiết kế thực đơn": chuyên gia dinh dưỡng xây dựng thực đơn cân bằng.
  - "3. Giao tận tay": món ăn giao đúng giờ, đảm bảo vệ sinh và chất lượng.
- Mỗi thẻ có icon tròn màu xanh, tiêu đề và mô tả ngắn.

### Nguyên liệu bản địa, tiêu chuẩn quốc tế
- Bố cục gồm hình ảnh nguyên liệu/món ăn bên trái và nội dung cam kết bên phải.
- Nội dung nhấn mạnh nguyên liệu chọn lọc, quy trình kiểm soát chất lượng và tiêu chuẩn chế biến.
- Danh sách cam kết hiển thị bằng icon check:
  - 100% nguyên liệu sạch đạt chuẩn.
  - Không sử dụng chất bảo quản/chất tạo màu.
  - Chế biến nhiệt độ thấp, giữ trọn vitamin.

### Chứng nhận chuyên gia dinh dưỡng
- Khối trắng nằm giữa trang, có icon chứng nhận.
- Heading: "Được chứng nhận bởi chuyên gia dinh dưỡng".
- Mô tả ngắn về việc mỗi thực đơn được thẩm định bởi đội ngũ bác sĩ/chuyên gia dinh dưỡng.
- Hiển thị badge chứng nhận: Health Cert, ISO 22000, VietGAP.

### CTA cuối trang
- Khối nền xanh đậm với heading: "Bắt đầu hành trình sống khỏe cùng FitFud".
- Mô tả ngắn khuyến khích chọn gói thực đơn phù hợp.
- CTA chính "Xem thực đơn" điều hướng `/menu`.
- CTA phụ "Tư vấn dinh dưỡng" nếu có luồng tư vấn.

---

## Phân rã theo Atomic Design

### Atoms
- Heading, Paragraph, Sub-text
- Primary Button ("Xem thực đơn")
- Secondary Button ("Tư vấn dinh dưỡng")
- Badge chứng nhận VietGAP, ISO
- Check Icon

### Molecules
- Process Card (Icon + Title + Description)
- Certification Logo Item
- Ingredient Image Tile
- CTA Button Group

### Organisms
- About Hero Section
- How It Works Section
- Ingredient Standard Section
- Nutrition Certification Section
- Final CTA Section

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

*Tính năng giới thiệu chủ yếu là nội dung tĩnh (static content) ở Frontend, không có quan hệ trực tiếp trong DB.*

---

# Types & Services

Không yêu cầu type/service riêng nếu toàn bộ nội dung About Us được hardcode hoặc quản lý như static content ở Frontend.

---

# API Services

Không yêu cầu API cho phạm vi giao diện About Us theo mẫu hiện tại.
