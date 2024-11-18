
# Hotel Booking Management System

This is a **Hotel Booking Management System** built with **Node.js**, **React**, and **MongoDB**. The system supports functionalities for customers, hotel managers, and administrators. This README provides a comprehensive guide to set up and run the project.

---

## Features

- User authentication and role-based access (Customer, Hotel Manager, Admin).
- Hotel and room management for managers.
- Room booking and payment processing for customers.
- Responsive UI built with React and Ant Design.
- Image uploading via Cloudinary API.

---

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas for cloud setup)

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Waito3007/WEB-DAT-PHONG.git
cd WEB-DAT-PHONG
```

### 2. Backend Setup
Navigate to the project root directory and install backend dependencies:
```bash
npm install
```

### 3. Frontend Setup
Navigate to the `client` folder and install frontend dependencies:
```bash
cd client
npm install react
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
JWT_SECRET=<your_jwt_secret_key>
CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
MONGO_URI=<your_mongodb_connection_string>
```

---

## Running the Application

### Start the Backend Server
From the project root directory, run:
```bash
node server.js
```
The backend server will run on `http://localhost:3001` by default.

### Start the Frontend Server
From the `client` directory, run:
```bash
npm start
```
The frontend server will run on `http://localhost:3000` by default.

---

## Usage

### For Administrators:
- Manage all users, hotels, and rooms.
- Monitor platform activities.

### For Hotel Managers:
- Add, edit, and manage hotels and rooms.
- Upload hotel and room images via Cloudinary.

### For Customers:
- Search for hotels and rooms.
- Book rooms and make payments.

---


## Hướng dẫn sử dụng (Tiếng Việt)

### Yêu cầu hệ thống
Đảm bảo bạn đã cài đặt:
- **Node.js** (phiên bản 14 trở lên)
- **npm** hoặc **yarn**
- **MongoDB** (cục bộ hoặc MongoDB Atlas)

### Cài đặt

#### 1. Tải về Repository
```bash
git clone https://github.com/Waito3007/WEB-DAT-PHONG.git
cd WEB-DAT-PHONG
```

#### 2. Cài đặt Backend
Trong thư mục gốc của dự án, chạy lệnh:
```bash
npm install
```

#### 3. Cài đặt Frontend
Vào thư mục `client` và chạy lệnh:
```bash
cd client
npm install react
```

#### 4. Cấu hình Biến Môi Trường
Tạo file `.env` trong thư mục gốc và cấu hình:
```env
JWT_SECRET=<mã_bí_mật_jwt>
CLOUDINARY_CLOUD_NAME=<tên_cloudinary>
CLOUDINARY_API_KEY=<api_key_cloudinary>
CLOUDINARY_API_SECRET=<api_secret_cloudinary>
MONGO_URI=<chuỗi_kết_nối_mongodb>
```

### Chạy ứng dụng

#### Khởi động Backend
Từ thư mục gốc, chạy lệnh:
```bash
node server.js
```
Server backend sẽ chạy tại `http://localhost:5000`.

#### Khởi động Frontend
Từ thư mục `client`, chạy lệnh:
```bash
npm start
```
Server frontend sẽ chạy tại `http://localhost:3000`.

---

## Tính năng chính

- **Admin**: Quản lý toàn bộ hệ thống.
- **Quản lý khách sạn**: Thêm, sửa, xóa khách sạn và phòng.
- **Khách hàng**: Đặt phòng, thanh toán.

---

## Lưu ý

- Liên hệ qua email nếu bạn gặp vấn đề: **vuphanhoaisang@gmail.com**.

---

## Contributors

- **Sang Vu** - Student of HUFLIT UNIVERSITY
- **Nghia Le** - Student of HUFLIT UNIVERSITY

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
