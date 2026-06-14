# Mô tả chức năng: Hồ sơ Cá nhân & Nhật ký Dinh dưỡng (Profile Dashboard)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện trang tổng quan của người dùng đã đăng nhập. Hiển thị thông số sức khỏe hiện tại, tiến độ tiêu thụ calo/protein trong ngày, biểu đồ xu hướng dinh dưỡng 7 ngày qua, quản lý địa chỉ nhận hàng và nhật ký bữa ăn (Meal Log) hỗ trợ ghi chép tự động hoặc thủ công.

**Đối tượng**

- Người dùng đã đăng nhập tài khoản FitFud.

**Mục đích**

Giúp người dùng theo dõi trực quan mục tiêu cân nặng/dinh dưỡng hàng ngày và ghi chép bữa ăn thuận tiện để cải thiện sức khỏe.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=258-960` (Hồ sơ cá nhân)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=51-1806` (Hồ sơ sức khỏe - Mobile)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=51-3450` (Quản lý tài khoản tổng hợp - Mobile)

---

## Luồng tiếp cận

- Click vào tên người dùng hoặc Avatar trên Header Navigation.
- Chuyển hướng tự động sau khi hoàn thành "Form khảo sát thể trạng".
- Truy cập qua URL `/profile`.

---

## Luồng giao diện

```text
Tải trang cá nhân
    ↓
Đọc thông số cơ bản (BMI, TDEE, Calo/Protein hôm nay)
    ↓
Xem Biểu đồ dinh dưỡng 7 ngày (Calo/Protein)
    ↓
Thao tác Ghi chép bữa ăn (Meal Log):
  ↳ Cách 1: Bấm "Chụp ảnh AI" -> Tải ảnh lên -> AI tự phân tích -> Log món
  ↳ Cách 2: Tìm món trong menu FitFud -> Bấm chọn món -> Tự động ghi log
  ↳ Cách 3: Nhập thủ công (Tên món, Calo, Protein, Carb, Fat)
    ↓
Vòng tiến trình (Circular Progress) cập nhật phần trăm hoàn thành chỉ số trong ngày
```

---

## Tính năng tương tác

### Bảng chỉ số thể trạng
- Hiển thị Cân nặng (kg), Chiều cao (cm), Chỉ số BMI (kèm tag đánh giá: Bình thường, Thừa cân...), TDEE (Kcal duy trì).
- Nút "Cập nhật mục tiêu" mở lại Khảo sát thể trạng nhanh.

### Tiến độ hằng ngày (Circular Target Tracker)
- Hiển thị vòng tròn tiến trình (ví dụ: `70% Hoàn thành` - `1,250 / 1,850 kcal`).
- Thanh tiến trình ngang phụ cho Protein (ví dụ: `62%` - `90g / 145g`).

### Biểu đồ xu hướng 7 ngày (Nutrition Charts)
- Biểu đồ hình cột (Bar Chart) biểu diễn lượng Calorie nạp vào trong tuần (Thứ 2 -> Chủ Nhật).
- Biểu đồ đường (Line Chart) biểu diễn lượng Protein nạp vào tương ứng.
- Khung nhận xét động từ AI: *"Bạn đang duy trì thói quen ăn uống rất tốt! Chỉ số protein cao hơn 15% so với tuần trước."*

### Nhật ký bữa ăn (Meal Log)
- **Tải ảnh nhận diện bằng AI**: Người dùng click "Chụp/Tải ảnh" -> Mô phỏng AI quét ảnh -> Tự động nhận diện tên món ăn và lượng calories/protein -> Lưu nhật ký.
- **Log nhanh từ thực đơn FitFud**: Nhập tên món để tìm nhanh trong danh sách thực đơn FitFud, click để ghi log trực tiếp.
- **Nhập thủ công**: Form nhập text đơn giản dành cho các món tự chuẩn bị ngoài FitFud.

---

## Phân rã theo Atomic Design

### Atoms
- Metric Text (BMI, Weight, Height)
- File Input (Tải ảnh bữa ăn)
- Search Input Box
- ProgressBar (Thanh tiến trình phẳng)

### Molecules
- Progress Ring (Vòng tròn tiến độ)
- Chart Bar Item (Cột đơn trong biểu đồ)
- Address Box Item (Mặc định)

### Organisms
- Health Info Summary Section
- Daily Target Progress Panel
- Nutrition Chart Grid
- Meal Logger Panel (AI Upload, FitFud Select, Manual Form)

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| CustomerProfile ↔ UserExtended | One-to-One |
| MealLog ↔ UserExtended | Many-to-One |

---

# Types & Services

> File: `type/profile.types.ts`

```ts
export type ProfileDashboardOutput = {
  fullName: string;
  weight: number;
  height: number;
  bmi: number;
  tdee: number;
  target_calories: number;
  target_protein: number;
  today_calories_logged: number;
  today_protein_logged: number;
  weekly_trend: {
    day: string; // T2, T3...
    calories: number;
    protein: number;
  }[];
};

export type MealLogInput = {
  dish_name: string;
  calories: number;
  protein: number;
  fat?: number;
  carb?: number;
  image_url?: string;
};

export type MealLogOutput = {
  id: string;
  logged_at: string;
} & MealLogInput;
```

---

# API Services

## API 1 - Lấy thông tin Dashboard tổng quan

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/customer-profiles/dashboard` hoặc custom endpoint |
| Service | `getProfileDashboard()` |
| Input | `void` |
| Output | `ProfileDashboardOutput` |

## API 2 - Ghi nhận nhật ký bữa ăn (Meal Log)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/meal-logs` |
| Service | `logMeal(params)` |
| Input | `MealLogInput` |
| Output | `MealLogOutput` |

## API 3 - Phân tích ảnh bữa ăn bằng AI (Mock)

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/meal-logs/analyze-image` |
| Service | `analyzeMealImage(imageFile)` |
| Input | `File` |
| Output | `{ dish_name: string, calories: number, protein: number }` |
