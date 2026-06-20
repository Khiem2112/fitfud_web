# Mô tả chức năng: Khảo sát Thể trạng (Onboarding Survey)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Màn hình khảo sát thu thập các chỉ số cơ thể, mục tiêu sức khỏe và dị ứng thực phẩm của người dùng mới đăng ký để thiết lập hồ sơ dinh dưỡng ban đầu. Hiển thị màn hình chờ khi AI phân tích dữ liệu.

**Đối tượng**

- Người dùng mới đăng ký thành công tài khoản.
- Người dùng chưa hoàn thành khảo sát trước đó.

**Mục đích**

Tính toán chỉ số TDEE/BMI cá nhân, xác định các chất gây dị ứng cần loại bỏ, và lập kế hoạch calo/protein hàng ngày.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=261-1290` (Khảo sát)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=1-3317` (Đang phân tích AI)
- Spec popup liên quan: `popup/ai_loading.md`, `popup/error.md`

---

## Luồng tiếp cận

- Tự động hiển thị ngay sau khi người dùng đăng ký tài khoản thành công.
- Truy cập từ nút "Cập nhật mục tiêu" trong trang Hồ sơ cá nhân.

---

## Luồng giao diện

```text
Truy cập Form khảo sát (3 bước)
    ↓
Bước 1: Chọn mục tiêu sức khỏe (Giảm cân, Tăng cơ, Ăn sạch...)
    ↓
Bước 2: Nhập chỉ số cơ thể (Giới tính, Tuổi, Chiều cao, Cân nặng, Cường độ vận động)
    ↓
Bước 3: Chọn dị ứng cần tránh (Cá, Trứng, Sữa, Hải sản, Đậu nành, Gluten, Hạt, Đồ cay...)
    ↓
Bấm "Hoàn tất" -> Hiển thị màn hình "Đang phân tích AI..."
    ↓
Chuyển hướng về Dashboard Hồ sơ cá nhân với kết quả đề xuất.
```

---

## Tính năng tương tác

### Khảo sát nhiều bước (Multi-step Form)
- Cho phép bấm "Bỏ qua" để vào thẳng trang thực đơn (với chỉ số mặc định).
- Nút "Quay lại" và "Tiếp theo" mượt mà, lưu tạm dữ liệu từng bước.
- Bộ chọn mục tiêu đơn giản bằng các card lớn có hình vẽ hoặc icon.
- Form gồm 3 bước chính: mục tiêu sức khỏe, chỉ số cơ thể/cường độ vận động, dị ứng cần tránh.

### Chọn dị ứng & Loại trừ
- Các chip chọn dị ứng, hỗ trợ chọn nhiều (Multi-select).
- Ô nhập văn bản bổ sung: "Ghi chú dị ứng khác (ví dụ: Không ăn được mắm tôm...)".

### Màn hình chờ AI (Nutrition Engine Loading)
- Các dòng chữ thông báo tiến trình chạy động (Phân tích hồ sơ -> Tính toán Calo -> Lọc thực đơn...).
- Hiệu ứng loading quay tròn hoặc sóng não AI hiện đại, tạo cảm giác chuyên nghiệp.
- Nếu trạng thái chờ được hiển thị dạng popup overlay, dùng spec `popup/ai_loading.md`.

---

## Phân rã theo Atomic Design

### Atoms
- Radio Group (Giới tính, Hoạt động)
- Number input (Tuổi, Chiều cao, Cân nặng)
- Multi-select Chip (Allergies)
- Step Indicator
- Circular / Line Loader

### Molecules
- Goal Card Selector
- Activity Level Item (Kèm mô tả chi tiết cho từng cường độ)
- Chef Note Input

### Organisms
- Step 1: Health Goal Form
- Step 2: Body Metrics Form
- Step 3: Allergens & Preferences Form
- AI Analyzer Loader Screen

---

# C. Kỹ thuật & Tích hợp

## Database Relationships

| Quan hệ | Kiểu |
|---------|------|
| CustomerProfile ↔ UserExtended | One-to-One |
| CustomerProfile ↔ CustomerAllergy | One-to-Many |

---

# Types & Services

> File: `type/survey.types.ts`

```ts
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extra Active';
export type HealthGoal = 'Weight Loss' | 'Muscle Gain' | 'Eat Clean' | 'Calorie Control' | 'Convenience';
export type Gender = 'Male' | 'Female' | 'Other';

export type SurveyMasterDataOutput = {
  healthGoals: {
    id: string;
    name: string;
    description?: string;
  }[];
  activityLevels: {
    id: string;
    name: string;
    description?: string;
  }[];
  allergies: {
    id: string;
    name: string;
  }[];
};

export type SurveyInput = {
  health_goal: HealthGoal;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activity_level: ActivityLevel;
  allergyIds: string[]; // Danh sách ID các nguyên liệu gây dị ứng
};

export type SurveyOutput = {
  profileId: string;
  target_calories: number; // Tự động tính toán từ cân nặng, chiều cao, tuổi, hoạt động
  target_protein: number;
  bmi: number;
};
```

---

# API Services

## API 1 - Lấy dữ liệu lựa chọn cho khảo sát

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/survey/master-data` |
| Service | `fetchSurveyMasterData()` |
| Input | `void` |
| Output | `SurveyMasterDataOutput` |

**Mô tả**

Lấy danh sách mục tiêu sức khỏe, cường độ vận động và dị ứng cần tránh để render 3 bước khảo sát.

## API 2 - Gửi thông tin khảo sát

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/customer-profiles` |
| Service | `submitSurvey(params)` |
| Input | `SurveyInput` |
| Output | `SurveyOutput` |

**Mô tả**

Tính toán chỉ số TDEE/Macro tại client hoặc server rồi lưu vào database. Tạo quan hệ `CustomerAllergy` cho các dị ứng đã chọn.
