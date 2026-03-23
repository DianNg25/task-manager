# 📝 Quản Lý Công Việc Cá Nhân (Task Manager)

Một ứng dụng Single Page Application (SPA) giúp người dùng quản lý công việc cá nhân hiệu quả, được xây dựng với ReactJS, TypeScript và Tailwind CSS.

## 🚀 Hướng dẫn cài đặt và chạy local

**Yêu cầu môi trường:** Đảm bảo máy tính của bạn đã cài đặt Node.js (khuyên dùng bản LTS).

**Bước 1:** Clone repository này về máy local:
```bash
git clone https://github.com/DianNg25/task-manager
cd task-manager
```

**Bước 2:** Cài đặt các thư viện (dependencies):
```bash
npm install
```

**Bước 3:** Khởi động server ở chế độ development:
```bash
npm run dev
```

**Bước 4:** Mở trình duyệt và truy cập vào địa chỉ mặc định: `http://localhost:5173`

---

## 🧠 Giải thích các quyết định kỹ thuật

Để ứng dụng dễ bảo trì, tối ưu hiệu suất và mở rộng trong tương lai, tôi đã áp dụng các phương pháp sau:

1. **Sử dụng Vite thay vì Create React App:** Vite cung cấp tốc độ khởi tạo và Hot Module Replacement (HMR) cực nhanh, mang lại trải nghiệm phát triển mượt mà hơn rất nhiều.

2. **Áp dụng TypeScript:** Việc định nghĩa rõ ràng cấu trúc dữ liệu (`Task`, `TaskStatus`) giúp bắt lỗi ngay trong quá trình viết code (compile-time) thay vì lúc chạy (runtime), đồng thời giúp code dễ đọc và tự động nhắc lệnh (intellisense) tốt hơn.

3. **Styling với Tailwind CSS v4:** Sử dụng kiến trúc Utility-first của Tailwind CSS (phiên bản 4 tích hợp trực tiếp qua Vite plugin) giúp tạo ra giao diện responsive (hiển thị tốt trên cả mobile và desktop) cực kỳ nhanh chóng mà không cần viết các file CSS rời rạc, tránh xung đột class.

4. **Tách logic lưu trữ thành Custom Hook (`useLocalStorage`):**
   Thay vì gọi `localStorage.getItem` và `setItem` trực tiếp trong Component làm code bị rối, tôi đóng gói logic này vào một Custom Hook riêng. Điều này tuân thủ nguyên tắc Single Responsibility Principle (SRP), giúp hook này có thể tái sử dụng dễ dàng.

5. **Tối ưu hiệu suất với `useMemo`:**
   Các chức năng như **Thống kê** (đếm task, kiểm tra hạn chót) và **Lọc/Tìm kiếm** yêu cầu tính toán lại dữ liệu. Để tránh việc React tính toán lại những con số này ở mỗi lần re-render không cần thiết, tôi bọc chúng trong hook `useMemo`. Hàm chỉ chạy lại khi mảng `tasks` gốc hoặc các điều kiện lọc thực sự thay đổi.

6. **Kiến trúc Component (Lifting State Up):**
   Do ứng dụng có quy mô SPA nhỏ, việc sử dụng các thư viện quản lý State toàn cục (như Redux) là Over-engineering. Tôi quản lý State ở component cha (`App.tsx`) và truyền dữ liệu/hàm xử lý xuống các component con (`TaskForm`, `TaskList`) thông qua Props.

---

## 🎯 Những điểm sẽ cải thiện nếu có thêm thời gian

Nếu có thêm thời gian phát triển, tôi sẽ bổ sung các tính năng sau để ứng dụng hoàn thiện hơn giống một sản phẩm thực tế:

1. **Giao diện kéo thả (Drag & Drop):** Cải tiến danh sách thành dạng bảng Kanban, cho phép người dùng kéo thả thẻ công việc giữa các cột trạng thái (Sử dụng thư viện `dnd-kit`).
2. **Quản lý State mở rộng:** Nếu ứng dụng thêm tính năng phức tạp (như phân quyền, quản lý theo dự án), tôi sẽ chuyển sang sử dụng Context API hoặc thư viện `Zustand` để quản lý state thay vì truyền Props.
3. **Đồng bộ Đám mây (Cloud Sync) & Authentication:** Tích hợp Firebase để cho phép người dùng đăng nhập, lưu trữ dữ liệu trên database thay vì chỉ lưu ở LocalStorage, giúp đồng bộ công việc trên nhiều thiết bị.
4. **Phân trang (Pagination) hoặc Tải thêm (Load More):** Khi số lượng công việc quá lớn, việc render tất cả cùng lúc sẽ làm giảm hiệu suất.
5. **Viết Unit Test:** Bổ sung Jest và React Testing Library để viết kịch bản kiểm thử tự động cho các hàm logic cốt lõi.