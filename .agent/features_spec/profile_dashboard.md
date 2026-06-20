# Mô tả chức năng: Hồ sơ Cá nhân & Nhật ký Dinh dưỡng (Profile Dashboard)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện trang tổng quan của người dùng đã đăng nhập. Hiển thị thông số sức khỏe hiện tại, TDEE, mục tiêu sức khỏe, tiến độ protein trong ngày, lịch sử dinh dưỡng, địa chỉ giao hàng mặc định, gợi ý món từ AI, bữa ăn gần đây và nhật ký bữa ăn.

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
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=352-1536` (Popup đổi mật khẩu)
- Spec popup liên quan: `popup/change_password.md`, `popup/error.md`

---

## Luồng tiếp cận

- Click icon tài khoản trên Header Navigation.
- Chuyển hướng tự động sau khi hoàn thành "Form khảo sát thể trạng".
- Truy cập qua URL `/profile`.

---

## Luồng giao diện

```text
Tải trang cá nhân
    ↓
Đọc thông số cơ bản (BMI, TDEE, mục tiêu sức khỏe, protein hôm nay)
    ↓
Xem lịch sử dinh dưỡng dạng line chart mẫu
    ↓
Xem địa chỉ giao hàng mặc định, gợi ý món từ AI và bữa ăn gần đây
    ↓
Thao tác Ghi chép bữa ăn (Meal Log):
  ↳ Cách 1: Bấm "Chụp ảnh AI" -> Tải ảnh lên -> AI tự phân tích -> Log món
  ↳ Cách 2: Tìm món trong menu FitFud -> Bấm chọn món -> Tự động ghi log
  ↳ Cách 3: Nhập thủ công (Tên món, Calo, Protein, Carb, Fat)
    ↓
Khu vực nhật ký cập nhật lại dữ liệu hiển thị sau khi ghi nhận bữa ăn
```

---

## Tính năng tương tác

### Bảng chỉ số thể trạng
- Hiển thị Cân nặng (kg), Chiều cao (cm), Chỉ số BMI (kèm tag đánh giá: Bình thường, Thừa cân...), TDEE (Kcal duy trì) và mục tiêu sức khỏe hiện tại.
- Nút "Cập nhật mục tiêu" mở lại Khảo sát thể trạng nhanh.

### Tiến độ protein hằng ngày
- Hiển thị tiến độ protein theo thiết kế dashboard.
- Không mô tả thêm tiến độ calo nếu Figma không thể hiện khu vực đó.

### Biểu đồ xu hướng 7 ngày (Nutrition Charts)
- Hiển thị lịch sử dinh dưỡng dạng line chart mẫu theo thiết kế.
- Khung nhận xét động từ AI: *"Bạn đang duy trì thói quen ăn uống rất tốt! Chỉ số protein cao hơn 15% so với tuần trước."*

### Địa chỉ, gợi ý AI và bữa ăn gần đây
- Hiển thị địa chỉ giao hàng mặc định nếu người dùng đã lưu.
- Hiển thị khu vực gợi ý món từ AI theo hồ sơ và hành vi người dùng.
- Hiển thị danh sách bữa ăn gần đây để người dùng dễ theo dõi nhật ký.

### Nhật ký bữa ăn (Meal Log)
- **Tải ảnh nhận diện bằng AI**: Người dùng click "Chụp/Tải ảnh" -> Mô phỏng AI quét ảnh -> Tự động nhận diện tên món ăn và lượng calories/protein -> Lưu nhật ký.
- **Log nhanh từ thực đơn FitFud**: Nhập tên món để tìm nhanh trong danh sách thực đơn FitFud, click để ghi log trực tiếp.
- **Nhập thủ công**: Form nhập text đơn giản dành cho các món tự chuẩn bị ngoài FitFud.
- Khi AI đang phân tích ảnh, hiển thị loading/spinner ngay trong khu vực nhập nhật ký bữa ăn, không mở popup toàn màn hình.

### Quản lý tài khoản
- Người dùng có thể mở Popup đổi mật khẩu từ khu vực tài khoản.
- Chi tiết hành vi đổi mật khẩu tại `popup/change_password.md`.

---

## Phân rã theo Atomic Design

### Atoms
- Metric Text (BMI, Weight, Height)
- File Input (Tải ảnh bữa ăn)
- Search Input Box
- ProgressBar (Thanh tiến trình protein)

### Molecules
- Protein Progress Block
- Line Chart Item
- Address Box Item (Mặc định)

### Organisms
- Health Info Summary Section
- Protein Progress Panel
- Nutrition Chart Grid
- Default Address Panel
- AI Recommended Meals Panel
- Recent Meals Panel
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
  health_goal: string;
  target_calories: number;
  target_protein: number;
  today_protein_logged: number;
  weekly_trend: {
    day: string; // T2, T3...
    protein: number;
  }[];
  defaultAddress?: {
    id: string;
    receiver_name: string;
    receiver_phone: string;
    full_address: string;
  };
  aiRecommendedDishes: {
    id: string;
    dish_name: string;
    image_url?: string;
    reason: string;
  }[];
  recentMeals: {
    id: string;
    dish_name: string;
    calories?: number;
    protein?: number;
    logged_at: string;
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

**Mô tả**

Trả về thông tin chính để render dashboard: BMI, TDEE, mục tiêu sức khỏe, tiến độ protein, line chart lịch sử dinh dưỡng, địa chỉ giao hàng mặc định, gợi ý món từ AI và bữa ăn gần đây.

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

## API 4 - Lấy địa chỉ giao hàng mặc định

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/address-profiles/default` |
| Service | `getDefaultAddress()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['defaultAddress']` |

## API 5 - Lấy gợi ý món từ AI cho dashboard

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/recommendations/profile` |
| Service | `getProfileAiRecommendations()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['aiRecommendedDishes']` |

## API 6 - Lấy bữa ăn gần đây

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/meal-logs/recent` |
| Service | `getRecentMeals()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['recentMeals']` |
