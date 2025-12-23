# 🎓 Hướng Dẫn Sử Dụng Các Tính Năng Mới

## 🌟 Tính Năng Nổi Bật

### 1️⃣ Form Xác Nhận Thông Tin Giao Hàng

**Vấn đề cũ:** Đơn hàng không có thông tin khách hàng, khó quản lý

**Giải pháp mới:**
- Khi click "Hoàn Tất Đơn Hàng", bạn sẽ được yêu cầu nhập thông tin
- **Các trường bắt buộc:**
  - 👤 **Tên khách hàng**: ít nhất 2 ký tự
  - 📱 **Số điện thoại**: định dạng Việt (0901234567, 0811111111, v.v.)
  - 📍 **Địa chỉ giao**: ít nhất 5 ký tự
  
- **Lợi ích:**
  - ✅ Validation tự động, ngăn lỗi
  - ✅ Lưu thông tin để lần sau không cần nhập lại
  - ✅ Tất cả thông tin được ghi vào đơn hàng

**Ví dụ thông tin hợp lệ:**
```
Tên: Nguyễn Văn A
SĐT: 0912345678
Địa chỉ: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM
```

---

### 2️⃣ Yêu Thích Món Ăn (❤️ Favorite)

**Tính năng:** Đánh dấu những món yêu thích để dễ tìm lại

**Cách dùng:**
1. Di chuột (hover) vào một món ăn
2. Click vào nút **❤️** ở góc trên cùng bên trái
3. Nút sẽ chuyển sang màu đỏ để xác nhận
4. Lần sau món sẽ hiển thị ❤️ ngay

**Lợi ích:**
- 🏃 **Nhanh hơn**: không cần tìm kiếm các món thường gọi
- 💾 **Tự động lưu**: dữ liệu được lưu vào browser

---

### 3️⃣ Lịch Sử Đơn Hàng 📋

**Tính năng:** Xem lại các đơn hàng đã gửi

**Cách dùng:**
1. Mở giỏ hàng (click 🛒)
2. Click nút **"Lịch Sử"** (📋 icon)
3. Xem danh sách các đơn đã hoàn tất
4. Click **"Chi tiết"** để xem chi tiết từng đơn
5. Click **"Copy"** để copy thông tin đơn

**Thông tin hiển thị:**
- 🆔 Mã đơn (#123456)
- 📅 Ngày/giờ đặt
- 👤 Tên khách hàng
- 📱 SĐT
- 💰 Tổng tiền

---

### 4️⃣ Lưu & Tải Nháp Đơn Hàng

**Tính năng:** Lưu đơn chưa gửi để tiếp tục sau

**Cách lưu:**
1. Chọn các món ăn
2. Mở giỏ hàng
3. Click **"Lưu Nháp"** (💾 icon)
4. Thông báo sẽ xác nhận

**Cách tải:**
1. Mở giỏ hàng
2. Click **"Tải"** (⏮️ icon)
3. Chọn nháp cần khôi phục
4. Nháp sẽ được tải vào giỏ

**Ví dụ sử dụng:**
- Bạn chọn 5 món lúc trưa
- Click "Lưu Nháp"
- Chiều tối, bạn tải lại nháp đó
- Thêm/bớt 1-2 món và gửi

---

### 5️⃣ Xóa Giỏ Hàng 🗑️

**Tính năng:** Làm trống toàn bộ giỏ hàng

**Cách dùng:**
1. Mở giỏ hàng
2. Click **"Xóa"** (🗑️ icon)
3. Xác nhận khi được hỏi
4. Giỏ hàng sẽ trống

---

### 6️⃣ Tìm Kiếm & Lọc Nhanh 🔍

**Cải thiện:**
- Tìm kiếm **nhanh hơn** (debounced)
- **Giảm lag** khi typing
- Kết quả **chính xác hơn**

**Cách dùng:**
```
Tìm "dê nấu" -> sẽ hiển thị tất cả món dê nấu
Tìm "nước" -> sẽ hiển thị tất cả món nước
```

---

### 7️⃣ Caching & Tải Nhanh ⚡

**Cải thiện kỹ thuật:**
- Menu được **cache 24 giờ** → không cần tải lại
- Hình ảnh được **lazy load** → tải khi cần xem
- **Tiết kiệm data** trên mobile

**Bạn không cần làm gì**, nó **tự động hoạt động**!

---

### 8️⃣ Validation Thông Minh ✅

**Tính năng:** Tự động kiểm tra và sửa lỗi

**Ví dụ:**
- Nhập số điện thoại: `12345` → ❌ Lỗi
- Nhập số điện thoại: `0912345678` → ✅ Đúng
- Nhập tên: `A` → ❌ Quá ngắn
- Nhập tên: `Nguyễn Văn A` → ✅ Đúng

---

## 🔄 Quy Trình Gọi Hàng Từ A Đến Z

### Scenario 1: Gọi Hàng Lần Đầu

```
1. Xem Menu → Tìm/Lọc các món thích
2. Chọn kích thước → Tăng/giảm số lượng
3. Click "Gọi Món Này" → Thêm vào giỏ
4. Lặp lại với các món khác
5. Kiểm tra giỏ → Sửa số lượng nếu cần
6. Thêm ghi chú (nếu có)
7. Click "Hoàn Tất Đơn Hàng"
   → Nhập: Tên + SĐT + Địa chỉ
   → Bấm "Tiếp Tục"
   → Được copy & mở Zalo tự động
8. Gửi đơn qua Zalo (copy sẽ có sẵn)
```

### Scenario 2: Gọi Hàng Lần Thứ 2

```
1. Mở giỏ → Click "Tải"
   → Chọn đơn trước đó
   → Nó sẽ được restore
2. Sửa lại số lượng nếu cần
3. Hoàn tất (không cần nhập info lại - đã lưu)
```

### Scenario 3: Gọi Những Món Yêu Thích

```
1. Scroll qua menu
2. Click ❤️ trên những món thích
3. Sau này, những món có ❤️ sẽ dễ nhận diện
4. Tìm kiếm từ khóa → sẽ nhanh hơn
```

---

## 💾 Dữ Liệu Được Lưu Ở Đâu?

Tất cả dữ liệu được lưu **vào trình duyệt** của bạn:

| Dữ Liệu | Nơi Lưu | Thời Hạn |
|---------|---------|----------|
| Thông tin khách | localStorage | Vĩnh viễn (đến khi xóa) |
| Danh sách yêu thích | localStorage | Vĩnh viễn |
| Menu (cache) | localStorage | 24 giờ |
| Nháp đơn | localStorage | 10 nháp gần nhất |
| Lịch sử đơn | localStorage | 50 đơn gần nhất |

**Lưu ý:** Nếu bạn xóa browser cache/cookies → tất cả sẽ mất

---

## 🛡️ Bảo Mật & Riêng Tư

- ✅ Tất cả dữ liệu được lưu **cục bộ** trên thiết bị của bạn
- ✅ **Không gửi** lên server bất kỳ dữ liệu gì (trừ khi bạn gửi Zalo)
- ✅ Chỉ khi gửi đơn qua Zalo → thông tin mới được gửi

---

## 🐛 Xử Lý Lỗi

Nếu gặp lỗi:

1. **Tải menu thất bại?**
   - F5 làm mới trang
   - Kiểm tra kết nối internet
   - Thử trên trình duyệt khác

2. **Copy đơn không hoạt động?**
   - Cho phép quyền clipboard trong trình duyệt
   - Hoặc copy thủ công từ modal

3. **Dữ liệu mất?**
   - Kiểm tra xem đã xóa browser cache chưa
   - Thử trên trình duyệt/thiết bị khác

---

## 📞 Liên Hệ Hỗ Trợ

- 📱 **SĐT:** 0327933609
- 💬 **Zalo:** zalo.me/0327933609
- 🏠 **Địa chỉ:** Ngã 3 Trà Bồng, Xã Bình Sơn, Quảng Ngãi

---

**Cập nhật:** December 2025 | **Version:** 2.0.0
