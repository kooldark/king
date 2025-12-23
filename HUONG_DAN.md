# 📸 Hướng Dẫn Thay Thế Ảnh - Nhà Hàng KING

## ✅ Tính Năng Save/Load Đơn Hàng

### Lưu Đơn Hàng (Save Order)
- Click nút **"💾 Lưu Đơn"** trong giỏ hàng
- Đơn hàng được lưu vào **localStorage** (trình duyệt nhớ)
- Lưu cả: Items, tùy chọn, ghi chú, thời gian, tổng tiền
- Có thể lưu nhiều đơn khác nhau

### Tải Lại Đơn (Load Order)
- Click nút **"🕐 Tải Lại"** trong giỏ hàng
- Hiện danh sách tất cả đơn hàng đã lưu (ngày giờ + tổng tiền)
- Click **"Tải"** để load đơn hàng vào giỏ
- Click **"Xóa"** để xóa đơn khỏi lịch sử

### Lợi Ích
✓ Khách không cần chụp ảnh hoặc ghi giấy  
✓ Lưu trữ lâu dài trong trình duyệt  
✓ Load lại nhanh chóng  
✓ Tiện khi gọi thêm đồ  

---

## 🖼️ Hướng Dẫn Thay Thế Ảnh

### Danh Sách File Ảnh Cần Tạo

Tất cả ảnh phải upload vào folder: `assets/`

#### **Lẩu Dê** (2 ảnh)
```
assets/1-lau-de-nuong.jpg
assets/2-lau-de-tu-tuc.jpg
```

#### **Thịt Dê Nấu Khô** (2 ảnh)
```
assets/3-luoc-de-cat-kho.jpg
assets/4-suon-de-nuong.jpg
```

#### **Lòng & Tiết** (3 ảnh)
```
assets/5-tiet-canh-de.jpg
assets/6-long-de-xao-nge.jpg
assets/7-ngoc-duong.jpg
```

#### **Đồ Uống** (6 ảnh)
```
assets/8-bia-heineken.jpg
assets/9-bia-tiger.jpg
assets/10-ruou-ngoc-duong.jpg
assets/11-ruou-cao-de.jpg
assets/12-nuoc-ngot.jpg
assets/13-nuoc-suoi.jpg
```

#### **Món Kèm** (4 ảnh)
```
assets/14-khan-lanh.jpg
assets/15-banh-trang.jpg
assets/16-bun.jpg
assets/17-trai-cay-tuoi.jpg
```

#### **Dịch Vụ** (2 ảnh)
```
assets/18-phong-lanh.jpg
assets/19-phi-phuc-vu.jpg
```

### Yêu Cầu Ảnh
- **Format**: JPG hoặc PNG
- **Kích thước**: 300x250px (hoặc tỷ lệ 6:5)
- **Dung lượng**: < 200KB mỗi file (để load nhanh)
- **Chất lượng**: >= 72 DPI

### Cách Upload Ảnh
1. Chụp/tải ảnh món ăn
2. Resize về 300x250px (dùng Photoshop, GIMP, hoặc online)
3. Nén ảnh nếu file > 200KB (ImageOptimizer, TinyPNG...)
4. Đặt tên file đúng theo danh sách trên
5. Upload vào folder `assets/` trong dự án
6. Tải lại trang web (Ctrl+F5 để xóa cache)

### Ví Dụ Upload
```
Trước: assets/1-lau-de-nuong.jpg (placeholder)
Sau:  assets/1-lau-de-nuong.jpg (ảnh thực)
```

Website sẽ **tự động load ảnh mới** mà không cần sửa code!

---

## 💡 Tips Chụp Ảnh Đẹp

1. **Đèn sáng**: Chụp vào lúc ban ngày hoặc dùng đèn flash
2. **Góc chụp**: Chụp từ trên xuống (45°) để thấy toàn bộ mon
3. **Nền**: Dùng nền sáng, đơn giản (trắng hoặc ghi)
4. **Trang trí**: Thêm lá, hoa để ăn ngon hơn
5. **Chất lượng**: Dùng điện thoại camera tốt, chụp chế độ HD

---

## 🔧 Thay Đổi Số Điện Thoại Zalo

Nếu cần thay đổi số điện thoại Zalo:

**File**: `script.js`  
**Tìm**: `https://zalo.me/0327933609`  
**Thay thế**: Thay `0327933609` bằng số điện thoại của bạn

Ví dụ:
```javascript
// Trước
window.open('https://zalo.me/0327933609', '_blank');

// Sau
window.open('https://zalo.me/0123456789', '_blank');
```

---

## 📊 Thống Kê & Quản Lý

### Kiểm Tra Lịch Sử Đơn Hàng
- Mở DevTools (F12) → Console
- Chạy lệnh: `localStorage.getItem('savedOrders')`
- Sẽ hiển thị tất cả đơn hàng đã lưu

### Xóa Tất Cả Lịch Sử
- Mở DevTools (F12) → Console
- Chạy lệnh: `localStorage.removeItem('savedOrders')`

---

## 🚀 Phát Triển Thêm (Tương Lai)

Các tính năng có thể thêm:
- [ ] Export đơn hàng thành PDF
- [ ] Gửi email đơn hàng
- [ ] Hình ảnh toàn cảnh nhà hàng
- [ ] Rating từ khách
- [ ] Đặt bàn online
- [ ] Tích hợp thanh toán online

---

**Cần hỗ trợ?** Liên hệ: 0327933609 (Zalo)
