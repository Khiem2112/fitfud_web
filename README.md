# FitFud

Ứng dụng web về sức khoẻ & dinh dưỡng, xây dựng bằng **React** (frontend) và **Strapi** (backend).

---

## Mục lục

- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt dự án](#cài-đặt-dự-án)
- [Chạy Frontend (React)](#chạy-frontend-react)
- [Chạy Backend](#chạy-backend) -- Khoi cần chay
- [Biến môi trường](#biến-môi-trường)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)

---

## Yêu cầu hệ thống

Hãy đảm bảo máy bạn đã cài sẵn các công cụ sau:

| Công cụ | Phiên bản khuyến nghị | Kiểm tra |
|---------|----------------------|----------|
| [Node.js](https://nodejs.org/) | v18 trở lên | `node -v` |
| [npm](https://www.npmjs.com/) | v9 trở lên | `npm -v` |
| [Git](https://git-scm.com/) | Bất kỳ | `git --version` |

---

## Cài đặt dự án

### Bước 1 — Clone repository về máy

```bash
git clone https://github.com/Khiem2112/FitFud.git
cd FitFud
```

---

## Chạy Frontend (React)

### Bước 2 — Vào thư mục frontend và cài thư viện

```bash
cd fe
npm install
```

> Lần đầu chạy sẽ tải khá nhiều package, hãy đợi đến khi thấy dòng `added X packages`.

### Bước 3 — Thiết lập biến môi trường (nếu có)

```bash
# Kiểm tra xem có file mẫu không
ls .env.example

# Nếu có, sao chép và chỉnh sửa
cp .env.example .env
```

Mở file `.env` và điền các giá trị cần thiết (URL API backend, ...).

### Bước 4 — Khởi động ứng dụng React

```bash
npm run dev
```
hoac
```bash
yarn dev
```

Trình duyệt sẽ tự mở tại **[http://localhost:3000](http://localhost:3000)**

> Nếu trình duyệt không tự mở, hãy truy cập thủ công vào địa chỉ trên.

---
Dunư ở nay nha, khoi cần chay BE

## Chạy Backend

### Bước 5 — Mở terminal mới, vào thư mục backend

```bash
# Quay về thư mục gốc nếu đang ở trong /fe
cd ..

# Vào thư mục backend
cd be
npm install
```

### Bước 6 — Thiết lập biến môi trường backend

```bash
cp .env.example .env
```

Mở file `.env` và điền các thông tin như chuỗi kết nối database, secret key, ...

### Bước 7 — Khởi động server backend

```bash
npm start

# Hoặc nếu dự án dùng nodemon (tự restart khi sửa code):
npm run dev
```

Server backend mặc định chạy tại **[http://localhost:5000](http://localhost:5000)** (hoặc port khác tuỳ cấu hình).

---

## Biến môi trường

### Frontend (`fe/.env`)

```env
# URL của backend API
REACT_APP_API_URL=http://localhost:5000

# Tên ứng dụng (tuỳ chọn)
REACT_APP_NAME=FitFud
```

### Backend (`be/.env`)

```env
# Cổng server
PORT=5000

# Chuỗi kết nối database (MongoDB, MySQL, ...)
DATABASE_URL=mongodb://localhost:27017/fitfud

# Khoá bí mật JWT
JWT_SECRET=your_secret_key_here
```

> **Quan trọng:** Không bao giờ commit file `.env` lên GitHub vì chứa thông tin nhạy cảm!

---

## Cấu trúc thư mục

```
FitFud/
├── fe/                  # 🖥️  Frontend — React (Create React App)
│   ├── public/
│   ├── src/
│   │   ├── components/  # Các component dùng chung
│   │   ├── pages/       # Các trang
│   │   ├── App.js
│   │   └── index.js
│   ├── .env             # Biến môi trường frontend (tự tạo)
│   └── package.json
│
├── be/                  # ⚙️  Backend — Node.js / Express
│   ├── src/
│   ├── .env             # Biến môi trường backend (tự tạo)
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## Các lỗi thường gặp

**`npm install` báo lỗi permission:**
```bash
# Thử chạy với quyền admin (Windows)
# Hoặc dùng sudo (Linux/macOS)
sudo npm install
```

**Port 3000 đã bị chiếm:**
```bash
# React sẽ tự hỏi bạn có muốn dùng port khác không, nhấn Y để đồng ý
```

**Không kết nối được backend:**
- Kiểm tra backend đang chạy chưa (bước 7)
- Kiểm tra `REACT_APP_API_URL` trong file `fe/.env` có đúng port không

---

## 🔗 Liên kết hữu ích

- Repository: [https://github.com/Khiem2112/FitFud](https://github.com/Khiem2112/FitFud)
- Tài liệu React: [https://react.dev](https://react.dev)
