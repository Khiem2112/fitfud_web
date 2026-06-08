# 1. Tổng quan Kiến trúc & Tech Stack

FitFud là một ứng dụng được xây dựng với kiến trúc tách biệt hoàn toàn giữa Frontend và Backend. Các AI Agent cần lưu ý ranh giới nghiêm ngặt này trong quá trình thao tác:

- **Frontend Framework**: React khởi tạo bằng Vite. Đây là KHÔNG GIAN LÀM VIỆC CHÍNH (Active Workspace) cho mọi yêu cầu về UI/UX, logic, và kết nối dữ liệu.
- **Backend Framework**: Strapi Headless CMS.
- **Quy tắc Cốt lõi (Core Guardrail)**: Thư mục Backend (`be/`) được đặt ở trạng thái CHỈ ĐỌC (READ-ONLY) đối với AI, do thành viên khác quản lý. AI tuyệt đối không tự ý chỉnh sửa, thêm, hoặc xóa file tại đây.
- **Tích hợp Dữ liệu**: Việc gọi API tới Strapi phải được cô lập hoàn toàn trong các module Service của Frontend, không gọi trực tiếp từ các UI Component.

## 1.1 Frontend (Active Workspace)
Lớp giao diện người dùng được xây dựng tập trung vào hiệu suất, khả năng tái sử dụng UI và quản lý trạng thái dữ liệu (server-state) hiệu quả.

- **Core Framework:** React 19.2.6. 
  - *Quy tắc:* Xây dựng các UI Component chủ yếu bằng Javascript, HTML, và CSS.
- **Styling:** TailwindCSS.
  - *Quy tắc:* Sử dụng utility-first classes để thiết kế giao diện. Hạn chế tối đa việc tạo các file CSS tùy chỉnh lẻ tẻ.
- **Data Fetching & Caching:** Tanstack Query.
  - *Quy tắc:* Sử dụng để quản lý toàn bộ server state, caching, và đồng bộ dữ liệu với Backend. Không sử dụng useEffect kết hợp useState để gọi API trực tiếp.
- **Type-Safety (Lớp Giao tiếp API):** TypeScript.
  - *Quy tắc:* TypeScript được khoanh vùng và tập trung nghiêm ngặt ở lớp gọi API. AI cần tạo các Interfaces/Types/DTOs chuẩn xác cho dữ liệu trả về từ Strapi để đảm bảo tính toàn vẹn của dữ liệu chảy vào hệ thống.
- **Design Pattern:** Atomic Design.
  - *Quy tắc:* Tuân thủ việc tổ chức component theo triết lý chia nhỏ: Atoms (nút bấm, input) -> Molecules (form group) -> Organisms (header, form phức tạp) -> Pages.

## 1.2 Backend (Read-Only Workspace)
Lớp dữ liệu và quản trị nội dung do thành viên khác chịu trách nhiệm. Frontend chỉ đóng vai trò là Client tiêu thụ dữ liệu.

- **Core Framework:** Strapi v5 (Headless CMS).
- **Giao thức Giao tiếp API:**
  - **RESTful API:** Sử dụng cho các thao tác CRUD cơ bản và các endpoint mặc định của hệ thống.
  - **GraphQL (Apollo Server):** Sử dụng cho các truy vấn dữ liệu có cấu trúc phức tạp, cần query sâu (nested relations) để tối ưu hóa payload mạng.

---

# 2. Cấu trúc Thư mục & File

Dự án tuân thủ việc phân tách trách nhiệm (Separation of Concerns) một cách nghiêm ngặt, sử dụng mô hình module hóa tại Frontend để tối ưu hóa khả năng bảo trì.

```text
FitFud/
├── .agent/                   # Cấu hình hành vi cho AI Agent
│   └── skills/react/         # Tài liệu hướng dẫn AI (agents.md, structure.md, v.v.)
├── be/                       # [CHỈ ĐỌC] Backend Strapi (RESTRICTED: Không được phép chỉnh sửa)
├── fe/                       # [LÀM VIỆC] Frontend React (Vite)
│   ├── public/               # Tài nguyên công khai (Favicon, v.v.)
│   └── src/                  # Mã nguồn chính của ứng dụng
│       ├── assets/           # Tài nguyên tĩnh (Hình ảnh, SVG, Fonts)
│       ├── component/        # Các UI component dùng chung (Dumb components / Reusable blocks)
│       ├── config/           # Cấu hình môi trường, định tuyến và hằng số toàn cục
│       ├── hook/             # Custom React hooks (Quản lý state và side-effects)
│       ├── page/             # Các trang giao diện cấp cao nhất (Smart components)
│       ├── service/          # Logic giao tiếp API với Backend (Axios/Fetch)
│       ├── type/             # Định nghĩa kiểu dữ liệu (Interfaces/Types/DTOs)
│       └── util/             # Các hàm hỗ trợ độc lập (Helpers/Formatters)
├── README.md                 # Tài liệu khởi tạo dự án chung
