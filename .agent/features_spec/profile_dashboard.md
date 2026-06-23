# Mô tả chức năng: Hồ sơ Cá nhân & Nhật ký Dinh dưỡng (Profile Dashboard)

---

# A. Tổng quan nghiệp vụ

**Mô tả**

Giao diện trang tổng quan của người dùng đã đăng nhập. Hiển thị thông số sức khỏe hiện tại, mục tiêu sức khỏe, tiến độ calo, protein trong ngày, lịch sử dinh dưỡng, địa chỉ giao hàng mặc định, gợi ý món từ AI, bữa ăn gần đây và nhật ký bữa ăn. Đổi mật khẩu.

**Đối tượng**

- Người dùng đã đăng nhập tài khoản FitFud.

**Mục đích**

Giúp người dùng theo dõi trực quan mục tiêu cân nặng/dinh dưỡng hàng ngày và ghi chép bữa ăn thuận tiện để cải thiện sức khỏe. Giúp người dùng quản lí các thông tin cá nhân như Địa chỉ, mật khẩu.

---

# B. Thiết kế & Giao diện

## Tài liệu thiết kế

- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=258-960` (Hồ sơ cá nhân)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=352-1536` (Popup đổi mật khẩu)
- Figma: `https://www.figma.com/design/nVRsMRDuQtkttZsSeqCyqY/FitFud?node-id=351-1364&t=xqLgjthLOLzmr4ok-0` (popup thêm địa chỉ)
- Spec popup liên quan: `popup/change_password.md`, `popup/error.md`, `add_address.md`

---

## Luồng tiếp cận

- Click icon tài khoản trên Header Navigation (đối với người dùng đã đăng nhập).
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
- Hiển thị Cân nặng (kg), Chiều cao (cm), Chỉ số BMI (kèm tag đánh giá: Bình thường, Thừa cân...), TDEE (Kcal duy trì) và mục tiêu sức khỏe hiện tại. Các chỉ số như cân nặng và chiều cao có thể được thay đổi.
- Nút "Cập nhật mục tiêu" ghi nhận lại các thông tin đã được thay đổi, hệ thống tự tính lại TDEE, BMI nếu người dùng có thay đổi về cân nặng hay mục tiêu sức khỏe.

### Tiến độ calo và protein hằng ngày
- Hiển thị tiến độ calo và protein theo thiết kế dashboard.
- Khi ấn vào bảng này sẽ chuyển hướng qua kết quả gợi í AI 'ai_recommendation.md'

### Biểu đồ xu hướng 7 ngày (Nutrition Charts)
- Hiển thị lịch sử dinh dưỡng dạng line chart mẫu theo thiết kế.
- Khung nhận xét động từ AI: *"Bạn đang duy trì thói quen ăn uống rất tốt! Chỉ số protein cao hơn 15% so với tuần trước."*

### Địa chỉ, gợi ý AI và bữa ăn gần đây
- Hiển thị địa chỉ giao hàng mặc định nếu người dùng đã lưu.
-> khi người dùng ấn vào đổi địa chỉ sẽ hiện popup 'add_address.md'
- Hiển thị khu vực gợi ý món từ AI theo hồ sơ và hành vi người dùng.
-> Nếu người dùng chọn đặt ngay từ gợi í bữa ăn thì sẽ hiện theo quy trình mua hàng, hiện popup chi tiết món ăn sau đó người dùng ấn thêm vào giỏ hàng và thanh toán.
- Hiển thị danh sách bữa ăn gần đây để người dùng dễ theo dõi nhật ký.

### Nhật ký bữa ăn (Meal Log)
- **Tải ảnh nhận diện bằng AI**: Người dùng click "Chụp/Tải ảnh" -> Mô phỏng AI quét ảnh -> Tự động nhận diện tên món ăn và lượng calories/protein -> Lưu nhật ký.
- **Log nhanh từ thực đơn FitFud**: Nhập tên món để tìm nhanh trong danh sách thực đơn FitFud, click để ghi log trực tiếp.
- **Nhập thủ công**: Form nhập text đơn giản dành cho các món tự chuẩn bị ngoài FitFud.
- Khi AI đang phân tích ảnh, hiển thị loading/spinner ngay trong khu vực nhập nhật ký bữa ăn, không mở popup toàn màn hình.

### Quản lý tài khoản
- Người dùng có thể mở Popup đổi mật khẩu từ khu vực tài khoản chỗ nhấn 'đổi mật khẩu'.
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

| Quan hệ | Kiểu | Mô tả |
|---------|------|-------|
| CustomerProfile ↔ UserExtended | One-to-One | Một người dùng có một hồ sơ sức khỏe/dinh dưỡng chính |
| CustomerProfile ↔ HealthGoal | Many-to-One hoặc Enum | Hồ sơ lưu mục tiêu sức khỏe hiện tại như giảm cân, tăng cơ, ăn sạch |
| CustomerProfile ↔ AddressProfile | One-to-Many | Một người dùng có thể lưu nhiều địa chỉ giao hàng |
| AddressProfile ↔ Ward/District/City | Many-to-One / Chain | Địa chỉ giao hàng liên kết với dữ liệu địa giới |
| MealLog ↔ UserExtended | Many-to-One | Một người dùng có nhiều bản ghi nhật ký bữa ăn |
| MealLog ↔ Dish | Many-to-One nullable | Meal log có thể liên kết với món FitFud, hoặc để trống nếu người dùng nhập thủ công |
| Dish ↔ DishSize | One-to-Many | Dùng khi người dùng bấm đặt ngay từ gợi ý AI hoặc log món từ thực đơn |
| CustomerProfile ↔ CustomerAllergy | One-to-Many | Dùng làm dữ liệu nền cho gợi ý món và cảnh báo món không phù hợp |

**Ghi chú**

- Gợi ý món từ AI có thể là dữ liệu tính toán từ service, không bắt buộc phải lưu thành bảng riêng.
- Nếu backend muốn lưu lịch sử gợi ý, có thể bổ sung bảng recommendation logs sau; không bắt buộc cho giao diện dashboard hiện tại.

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
  today_calories_logged: number;
  today_protein_logged: number;

  weekly_trend: {
    day: string; // T2, T3...
    calories: number;
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
    price_from: number;
    calories?: number;
    protein?: number;
    status: 'Active' | 'Inactive' | 'Out of Stock';
  }[];

  recentMeals: {
    id: string;
    dish_name: string;
    calories?: number;
    protein?: number;
    carb?: number;
    fat?: number;
    logged_at: string;
    source: 'FitFudDish' | 'Manual' | 'AIImage';
    dish_id?: string;
  }[];
};

export type UpdateProfileHealthInput = {
  weight?: number;
  height?: number;
  health_goal?: string;
};

export type UpdateProfileHealthOutput = {
  success: boolean;
  bmi: number;
  tdee: number;
  target_calories: number;
  target_protein: number;
};

export type MealLogInput = {
  dish_name: string;
  calories: number;
  protein: number;
  fat?: number;
  carb?: number;
  image_url?: string;
  dish_id?: string;
  source: 'FitFudDish' | 'Manual' | 'AIImage';
};

export type MealLogOutput = {
  id: string;
  logged_at: string;
} & MealLogInput;

export type SearchFitFudDishForLogOutput = {
  dishes: {
    id: string;
    dish_name: string;
    image_url?: string;
    calories?: number;
    protein?: number;
    carb?: number;
    fat?: number;
  }[];
};

export type ChangePasswordInput = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};
---

# API Services

> Ghi chú triển khai:
>
> - Tên API là contract đề xuất để FE/AI code bám theo.
> - Nếu backend dùng endpoint khác, chỉ map lại trong service layer, không đổi logic UI.
> - Các API `GET` dùng để render dashboard nên được gọi khi vào `/profile`.
> - Các API ghi dữ liệu (`POST`, `PATCH`) sau khi thành công cần refresh dashboard hoặc cập nhật state tương ứng.
> - Nếu API lỗi, hiển thị lỗi tại khu vực thao tác hoặc popup lỗi chung, không reload toàn trang.

---

## API 1 - Lấy thông tin Dashboard tổng quan

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/customer-profiles/dashboard` hoặc custom endpoint |
| Service | `getProfileDashboard()` |
| Input | `void` |
| Output | `ProfileDashboardOutput` |

**Mục đích**

Render dữ liệu chính của trang Profile Dashboard.

**Ghi chú FE**

- Gọi khi vào `/profile`.
- Nếu API này đã trả đủ địa chỉ mặc định, gợi ý AI, bữa ăn gần đây và thống kê dinh dưỡng thì không cần gọi API 6, 8, 9, 10 riêng.
- Sau khi cập nhật chỉ số, thêm địa chỉ hoặc log bữa ăn thành công, cần refresh dashboard hoặc cập nhật state tương ứng.

**Ghi chú nghiệp vụ**

- API này nên trả dữ liệu tổng hợp đủ để render lần đầu.
- Nếu backend tách dữ liệu thành nhiều endpoint, FE được phép gọi các API nhỏ hơn và merge vào UI state.

---

## API 2 - Cập nhật chỉ số cá nhân / mục tiêu sức khỏe

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / PATCH `/api/customer-profiles/health-metrics` |
| Service | `updateProfileHealth(params)` |
| Input | `UpdateProfileHealthInput` |
| Output | `UpdateProfileHealthOutput` |

**Mục đích**

Cập nhật cân nặng, chiều cao hoặc mục tiêu sức khỏe khi người dùng bấm "Cập nhật mục tiêu".

**Ghi chú FE**

- Chỉ gọi khi người dùng bấm submit.
- Không gọi API khi người dùng chỉ đang nhập dở trong input.
- Sau khi thành công, cập nhật BMI, TDEE, target calories và target protein.
- Nếu backend chỉ trả success, gọi lại `getProfileDashboard()`.

**Ghi chú nghiệp vụ**

- BMI/TDEE/target calories/target protein phải được tính lại sau khi cân nặng, chiều cao hoặc mục tiêu sức khỏe thay đổi.
- Không thay đổi dữ liệu meal log cũ.

---

## API 3 - Ghi nhận nhật ký bữa ăn

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/meal-logs` |
| Service | `logMeal(params)` |
| Input | `MealLogInput` |
| Output | `MealLogOutput` |

**Mục đích**

Lưu một bữa ăn vào nhật ký dinh dưỡng của người dùng.

**Ghi chú FE**

- Dùng cho 3 nguồn log:
  - `FitFudDish`: chọn món từ menu FitFud.
  - `Manual`: nhập thủ công.
  - `AIImage`: kết quả từ phân tích ảnh.
- Sau khi log thành công, cập nhật:
  - Bữa ăn gần đây.
  - Tiến độ calo/protein hôm nay.
  - Line chart 7 ngày nếu cần.
- Nếu thiếu calories/protein, không submit.

**Ghi chú nghiệp vụ**

- `dish_id` chỉ bắt buộc khi `source = 'FitFudDish'`.
- Với món nhập thủ công hoặc AI image, `dish_id` có thể trống.
- Calories và protein là dữ liệu tối thiểu để tính tiến độ dashboard.

---

## API 4 - Phân tích ảnh bữa ăn bằng AI

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/meal-logs/analyze-image` |
| Service | `analyzeMealImage(imageFile)` |
| Input | `File` |
| Output | `{ dish_name: string, calories: number, protein: number, carb?: number, fat?: number }` |

**Mục đích**

Phân tích ảnh bữa ăn và trả về dữ liệu dinh dưỡng gợi ý.

**Ghi chú FE**

- Khi đang chờ API, chỉ hiển thị loading/spinner trong khu vực nhật ký bữa ăn.
- Không mở popup AI loading toàn màn hình.
- Không tự lưu meal log ngay sau khi phân tích ảnh nếu UI cần người dùng xác nhận.
- Sau khi có kết quả, điền dữ liệu vào form log để người dùng kiểm tra rồi bấm lưu.

**Ghi chú nghiệp vụ**

- Kết quả AI chỉ là gợi ý, người dùng có thể chỉnh trước khi lưu.
- Nếu AI không nhận diện được món, hiển thị lỗi và cho nhập thủ công.

---

## API 5 - Tìm món FitFud để ghi log nhanh

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/dishes/search?keyword={keyword}` hoặc dùng lại API Menu |
| Service | `searchFitFudDishForLog(keyword)` |
| Input | `keyword: string` |
| Output | `SearchFitFudDishForLogOutput` |

**Mục đích**

Tìm món FitFud trong khu vực nhật ký bữa ăn để log nhanh.

**Ghi chú FE**

- Chỉ gọi khi keyword có độ dài tối thiểu, ví dụ từ 2 ký tự.
- Nên debounce input.
- Khi người dùng chọn món:
  - Điền tên món, calories, protein, carb, fat vào form log.
  - Gán `source = 'FitFudDish'`.
  - Gán `dish_id` theo món đã chọn.
- API này chỉ phục vụ log bữa ăn, không thay thế trang Menu.

**Ghi chú nghiệp vụ**

- Nếu món không còn bán, vẫn có thể cho log nếu dữ liệu dinh dưỡng còn hợp lệ.
- Nếu backend muốn giới hạn chỉ log món đang bán, cần trả trạng thái để FE disable lựa chọn.

---

## API 6 - Lấy địa chỉ giao hàng mặc định

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/address-profiles/default` |
| Service | `getDefaultAddress()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['defaultAddress']` |

**Mục đích**

Hiển thị địa chỉ giao hàng mặc định trên Dashboard.

**Ghi chú FE**

- Nếu `getProfileDashboard()` đã trả `defaultAddress`, không cần gọi API này riêng.
- Nếu chưa có địa chỉ mặc định, hiển thị trạng thái rỗng và CTA thêm địa chỉ.
- Sau khi thêm/cập nhật địa chỉ thành công, refresh địa chỉ mặc định.

**Ghi chú nghiệp vụ**

- Chỉ có một địa chỉ mặc định tại một thời điểm.
- Nếu người dùng thêm địa chỉ đầu tiên, có thể tự đặt làm mặc định.

---

## API 7 - Thêm hoặc cập nhật địa chỉ giao hàng

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/address-profiles` hoặc REST / PATCH `/api/address-profiles/{id}` |
| Service | `createAddress(params)`, `updateAddress(id, params)` |
| Input | Theo spec `popup/add_address.md` |
| Output | Địa chỉ đã tạo/cập nhật |

**Mục đích**

Cho phép người dùng thêm hoặc chỉnh sửa địa chỉ giao hàng từ Dashboard.

**Ghi chú FE**

- Mở popup thêm/sửa địa chỉ khi người dùng bấm đổi địa chỉ.
- Sau khi lưu thành công:
  - Đóng popup.
  - Refresh địa chỉ mặc định hoặc cập nhật state.
- Validation địa chỉ hiển thị trong popup, không reload trang.

**Ghi chú nghiệp vụ**

- Địa chỉ cần có người nhận, SĐT, địa chỉ chi tiết và ward/district/city.
- Nếu có checkbox “Đặt làm mặc định”, backend cần đảm bảo các địa chỉ khác không còn là mặc định.

---

## API 8 - Lấy gợi ý món từ AI cho Dashboard

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/recommendations/profile` |
| Service | `getProfileAiRecommendations()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['aiRecommendedDishes']` |

**Mục đích**

Hiển thị danh sách món gợi ý từ AI trên Dashboard.

**Ghi chú FE**

- Nếu `getProfileDashboard()` đã trả `aiRecommendedDishes`, không cần gọi API này riêng.
- Card món gợi ý cần đủ dữ liệu: tên, ảnh, lý do, giá, calories/protein nếu có.
- Khi bấm “Đặt ngay”:
  - Mở popup chi tiết/chọn món nhanh.
  - Không thêm thẳng vào giỏ nếu chưa chọn size/số lượng.
- Nếu món hết hàng, disable nút đặt ngay hoặc hiển thị trạng thái hết hàng.

**Ghi chú nghiệp vụ**

- Gợi ý AI phải tôn trọng dị ứng và mục tiêu sức khỏe của người dùng.
- Nếu thiếu hồ sơ sức khỏe, hiển thị CTA cập nhật mục tiêu thay vì gợi ý món.

---

## API 9 - Lấy bữa ăn gần đây

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/meal-logs/recent` |
| Service | `getRecentMeals()` |
| Input | `void` |
| Output | `ProfileDashboardOutput['recentMeals']` |

**Mục đích**

Hiển thị danh sách bữa ăn gần đây trên Dashboard.

**Ghi chú FE**

- Nếu `getProfileDashboard()` đã trả `recentMeals`, không cần gọi API này riêng.
- Sau khi log bữa ăn thành công, cập nhật lại danh sách này.
- Danh sách nên sắp xếp mới nhất trước.

**Ghi chú nghiệp vụ**

- Recent meals có thể bao gồm món FitFud, món nhập tay và món từ AI image.
- Cần hiển thị rõ tên món, thời gian log, calories/protein nếu có.

---

## API 10 - Lấy thống kê dinh dưỡng hôm nay và 7 ngày

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / GET `/api/meal-logs/nutrition-summary` |
| Service | `getNutritionSummary()` |
| Input | `void` |
| Output | `NutritionSummaryOutput` |

**Mục đích**

Tính tổng calo/protein đã nạp trong ngày hiện tại và dữ liệu lịch sử dinh dưỡng 7 ngày để hiển thị bảng tiến độ và line chart.

**Ghi chú FE**

- Gọi API này nếu `getProfileDashboard()` chưa trả đủ dữ liệu tiến độ hôm nay và line chart.
- Nếu dashboard đã trả `today_calories_logged`, `today_protein_logged`, `target_calories`, `target_protein`, `weekly_trend` thì không cần gọi riêng.
- Sau khi log bữa ăn thành công, gọi lại API này hoặc cập nhật state.
- `calories_percent` và `protein_percent` dùng để render thanh/vòng tiến độ.
- Nếu backend không trả phần trăm thì FE tự tính:
  - `calories_logged / target_calories * 100`
  - `protein_logged / target_protein * 100`

**Ghi chú nghiệp vụ**

- Dữ liệu hôm nay tính theo timezone đã thống nhất.
- Weekly trend lấy 7 ngày gần nhất, bao gồm ngày hiện tại.
- Meal log nhập thủ công, món FitFud và món từ AI image đều phải được tính vào tổng.
- Nếu ngày nào không có meal log, trả calories/protein bằng `0` để line chart không bị đứt đoạn.

---

## API 11 - Đổi mật khẩu

| Thuộc tính | Giá trị |
|------------|----------|
| API | REST / POST `/api/auth/change-password` |
| Service | `changePassword(params)` |
| Input | `ChangePasswordInput` |
| Output | `{ success: boolean, message: string }` |

**Mục đích**

Đổi mật khẩu cho người dùng đã đăng nhập từ khu vực quản lý tài khoản của Dashboard.

**Ghi chú FE**

- Chỉ gọi API khi người dùng submit popup đổi mật khẩu.
- Validate trước khi gọi API:
  - Mật khẩu hiện tại không rỗng.
  - Mật khẩu mới đạt yêu cầu tối thiểu.
  - Mật khẩu mới và xác nhận mật khẩu mới trùng nhau.
- Sau khi đổi thành công:
  - Đóng popup.
  - Hiển thị thông báo thành công.
- Nếu lỗi mật khẩu hiện tại sai, hiển thị lỗi trong popup đổi mật khẩu.

**Ghi chú nghiệp vụ**

- Không tự logout người dùng sau khi đổi mật khẩu trừ khi backend yêu cầu.
- Không lưu mật khẩu trong localStorage/sessionStorage.
