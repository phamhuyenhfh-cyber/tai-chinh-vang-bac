# Hướng Dẫn Kết Nối Ứng Dụng Web Với Google Sheets (1-Click)

Dành riêng cho **Chị Phạm Huyền** để tự động đồng bộ 2 chiều dữ liệu danh mục Vàng & Bạc giữa Web Dashboard và bảng tính Google Sheets.

---

## 🌟 Lợi ích khi kết nối Google Sheets
1. **Nhập liệu mọi lúc mọi nơi**: Chị có thể mở Google Sheets trên điện thoại khi đang ở tiệm vàng để ghi nhanh số lượng, hoặc nhập trên giao diện Web Dashboard sang trọng.
2. **Không lo mất dữ liệu**: Dữ liệu vừa được lưu an toàn trên trình duyệt máy tính của chị, vừa được sao lưu tự động trên Google Drive cá nhân.
3. **Đồng bộ 2 chiều**: Cập nhật từ Web đẩy lên Google Sheets, và sửa trên Google Sheets có thể kéo về Web Dashboard chỉ bằng 1 nút bấm.

---

## 🛠️ Các Bước Thiết Lập Trong 2 Phút

### Bước 1: Tạo Google Sheets mới
1. Mở trình duyệt và truy cập [sheets.new](https://sheets.new) để tạo 1 file Google Sheets mới.
2. Đặt tên file là: **Sổ Quản Lý Danh Mục Vàng Bạc - Phạm Huyền**.

### Bước 2: Dán mã Apps Script
1. Trên thanh menu của Google Sheets, chọn **Tiện ích mở rộng (Extensions)** &rarr; **Apps Script**.
2. Xóa hết các dòng mã mặc định trong khung soạn thảo.
3. Mở file [Google_Sheets_Sync_Script.js](file:///d:/Huyen/tai-chinh/Google_Sheets_Sync_Script.js), copy toàn bộ nội dung và dán vào Apps Script.
4. Nhấn biểu tượng **Lưu (Save / Ctrl + S)**.

### Bước 3: Triển khai thành Web App
1. Nhấn nút **Triển khai (Deploy)** ở góc trên bên phải &rarr; chọn **Tùy chọn triển khai mới (New deployment)**.
2. Nhấn biểu tượng bánh răng ⚙️ cạnh chữ *Chọn loại (Select type)* &rarr; chọn **Ứng dụng web (Web app)**.
3. Điền cấu hình như sau:
   - **Mô tả**: *Quản lý Vàng Bạc Phạm Huyền*
   - **Thực thi dưới dạng (Execute as)**: *Tôi (Địa chỉ email của chị)*
   - **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)** *(Lưu ý: Bắt buộc chọn "Anyone" để Web Dashboard có thể gửi dữ liệu vào Sheets)*.
4. Nhấn nút **Triển khai (Deploy)** &rarr; Nếu Google hiện bảng cấp quyền, chị bấm *Ủy quyền truy cập (Authorize access)* &rarr; Chọn tài khoản Google của chị &rarr; Nhấn *Nâng cao (Advanced)* &rarr; Bấm *Đi tới [Tên script] (Go to unsafe)* &rarr; Nhấn *Cho phép (Allow)*.
5. Sao chép đường dẫn **URL ứng dụng web** (có đuôi `/exec`).

### Bước 4: Dán URL vào Web Dashboard
1. Mở file [index.html](file:///d:/Huyen/tai-chinh/index.html) trên trình duyệt.
2. Nhấn nút **Cấu hình Google Sheets** (hoặc nút **Sync Google Sheets**).
3. Dán đường dẫn URL vừa copy vào ô &rarr; Bấm **Lưu cấu hình**.
4. Xong! Nhấn **Sync Google Sheets** để đẩy toàn bộ danh mục lên Google Sheets.

---

## 📱 Cách Mở Web Nhanh Mỗi Ngày
- Chị chỉ cần mở file [index.html](file:///d:/Huyen/tai-chinh/index.html) bằng Chrome, Cốc Cốc, Edge hoặc Safari.
- Khi mua thêm vàng DOJI, BTMC, BTMH hoặc Bạc Phú Quý, Ancarat: Bấm nút **"Thêm Giao Dịch"** &rarr; Chọn thương hiệu & đơn vị &rarr; Bấm **Lưu Giao Dịch**.
- Bấm nút **"Xuất Excel"** bất kỳ khi nào chị muốn xuất file báo cáo lưu trữ về máy tính.
