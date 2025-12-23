# ✅ Testing Checklist - v2.0.0

## 🧪 Manual Testing Checklist

### 1️⃣ Form Xác Thực Thông Tin Giao Hàng

- [ ] **Hiển thị form khi click "Hoàn Tất Đơn Hàng"**
  - [ ] Form có tiêu đề "📋 Thông Tin Giao Hàng"
  - [ ] Có nút X để đóng
  - [ ] Có 3 trường nhập: Tên, SĐT, Địa chỉ
  - [ ] Có checkbox \"Lưu thông tin cho lần sau\"

- [ ] **Validation tên khách hàng**
  - [ ] Nhập 1 ký tự → ❌ Lỗi "Tên phải từ 2 ký tự trở lên"
  - [ ] Nhập "Nguyễn Văn A" → ✅ Được chấp nhận
  - [ ] Để trống → ❌ Lỗi

- [ ] **Validation số điện thoại**
  - [ ] Nhập "12345" → ❌ Lỗi
  - [ ] Nhập "0912345678" → ✅ Được chấp nhận
  - [ ] Nhập "0911111111" → ✅ Được chấp nhận
  - [ ] Nhập "0123456789" → ❌ Lỗi (định dạng sai)
  - [ ] Để trống → ❌ Lỗi

- [ ] **Validation địa chỉ**
  - [ ] Nhập 4 ký tự → ❌ Lỗi
  - [ ] Nhập "123 Đường ABC" → ✅ Được chấp nhận
  - [ ] Để trống → ❌ Lỗi

- [ ] **Lưu thông tin**
  - [ ] Checkbox checked → Lưu vào localStorage
  - [ ] Lần sau mở form → Hiển thị giá trị cũ
  - [ ] Checkbox unchecked → Không lưu

- [ ] **Hoàn tất đơn hàng**
  - [ ] Sau khi bấm "Tiếp Tục" → Form đóng
  - [ ] Đơn được copy → Notification ✅
  - [ ] Zalo mở tự động
  - [ ] Giỏ hàng được làm trống

### 2️⃣ Yêu Thích Món Ăn (❤️)

- [ ] **Hiển thị nút yêu thích**
  - [ ] Hover vào card → Nút ❤️ hiện lên
  - [ ] Nút ở góc trên trái
  - [ ] Nút có background trắng mờ

- [ ] **Toggle yêu thích**
  - [ ] Click ❤️ → Nút chuyển màu đỏ
  - [ ] Nút hiển thị sẵn (không cần hover nữa)
  - [ ] Click lại → Nút trở về trắng
  - [ ] Lưu vào localStorage

- [ ] **Persistence**
  - [ ] Refresh trang → ❤️ vẫn còn
  - [ ] Clear browser cache → ❤️ mất (dự kiến)

### 3️⃣ Xem Lịch Sử Đơn Hàng 📋

- [ ] **Mở lịch sử**
  - [ ] Click "Lịch Sử" trong giỏ hàng
  - [ ] Modal hiện lên với danh sách đơn
  - [ ] Nếu chưa có đơn → \"Chưa có đơn hàng nào hoàn tất\"

- [ ] **Hiển thị danh sách**
  - [ ] Mỗi item hiển thị:
    - [ ] Mã đơn #123456
    - [ ] ✓ Đã gửi (status)
    - [ ] 📅 Timestamp
    - [ ] 👤 Tên khách hàng
    - [ ] 📱 Số điện thoại
    - [ ] 💰 Tổng tiền

- [ ] **Chi tiết đơn hàng**
  - [ ] Click "Chi tiết" → Mở modal chi tiết
  - [ ] Hiển thị:
    - [ ] Thông tin khách (tên, SĐT, địa chỉ)
    - [ ] Danh sách các món
    - [ ] Tóm tắt (tiền hàng, phí giao, tổng)
    - [ ] Ghi chú (nếu có)

- [ ] **Copy thông tin**
  - [ ] Click "Copy" → Notification ✓ Đã copy
  - [ ] Paste vào text editor → Đơn hàng được paste

### 4️⃣ Lưu & Tải Nháp Đơn

- [ ] **Lưu nháp**
  - [ ] Chọn 3-4 món → Click "Lưu Nháp"
  - [ ] Notification: \"✓ Lưu nháp đơn hàng thành công\"
  - [ ] Đơn được lưu vào localStorage

- [ ] **Tải nháp**
  - [ ] Xóa giỏ hàng → Click "Tải"
  - [ ] Modal hiện danh sách nháp
  - [ ] Click nháp cần tải → Được restore vào giỏ
  - [ ] Giỏ hiển thị lại các món cũ

- [ ] **Quản lý nháp**
  - [ ] Mỗi nháp hiển thị:
    - [ ] 📅 Timestamp
    - [ ] 💰 Tổng tiền
    - [ ] 📦 Số lượng món
    - [ ] Nút \"Tải\" & \"Xóa\"
  - [ ] Giữ tối đa 10 nháp
  - [ ] Nháp cũ nhất bị xóa khi vượt 10

- [ ] **Xóa nháp**
  - [ ] Click \"Xóa\" → Hỏi xác nhận
  - [ ] Click OK → Nháp bị xóa
  - [ ] Notification: \"✓ Nháp đã xóa\"

### 5️⃣ Quản Lý Giỏ Hàng

- [ ] **Nút Xóa Giỏ**
  - [ ] Giỏ có ít nhất 1 món
  - [ ] Click \"Xóa\" → Hỏi xác nhận
  - [ ] Click OK → Giỏ trống
  - [ ] Notification: \"✓ Giỏ hàng đã được làm trống\"

- [ ] **Nút Clear hoạt động đúng**
  - [ ] Giỏ trống → Click \"Xóa\" → \"❌ Giỏ hàng đã trống\"
  - [ ] Không xác nhận → Giỏ vẫn có dữ liệu

### 6️⃣ Tối Ưu Hiệu Suất

- [ ] **Menu Caching**
  - [ ] Lần đầu → Tải menu từ menu.json
  - [ ] Lần 2 → Tải từ cache (nhanh hơn)
  - [ ] Kiểm tra DevTools → localStorage có menuCache
  - [ ] Sau 24h → Cache mất, tải lại

- [ ] **Lazy Loading Hình**
  - [ ] Mở trang → Hình placeholder SVG hiển thị
  - [ ] Scroll đến hình → Hình thực tế tải
  - [ ] Network tab → Hình chỉ tải khi cần
  - [ ] Kiểm tra class lazy-image trong source

- [ ] **Debounced Search**
  - [ ] Typing nhanh \"dê nấu\" → Không bị lag
  - [ ] Kết quả đúng
  - [ ] Ít render lại so với trước

### 7️⃣ Error Handling

- [ ] **Menu tải lỗi**
  - [ ] Tắt internet → Tải trang → \"❌ Lỗi tải menu\"
  - [ ] Bật internet lại → F5 → Menu tải lại bình thường

- [ ] **Quantity Input**
  - [ ] Nhập -1 → Tự sửa thành 1
  - [ ] Nhập 100 → Tự sửa thành 99
  - [ ] Nhập \"abc\" → Tự sửa thành 1

- [ ] **Copy Clipboard**
  - [ ] Copy đơn hàng → Notification ✓
  - [ ] Paste → Được đơn hàng đúng format
  - [ ] Nếu lỗi → Notification ❌ & vẫn mở Zalo

### 8️⃣ Mobile Responsive

- [ ] **Form modal**
  - [ ] Mở trên mobile → Form phù hợp màn hình
  - [ ] Không bị tràn
  - [ ] Các input dễ nhập

- [ ] **Lịch sử modal**
  - [ ] Mở trên mobile → Danh sách cuộn được
  - [ ] Buttons responsive

- [ ] **Giỏ hàng**
  - [ ] Buttons nằm vừa vặn
  - [ ] Text không bị cắt

### 9️⃣ Data Persistence

- [ ] **Refresh trang**
  - [ ] Có dữ liệu trong giỏ → Sau refresh vẫn có
  - [ ] Thông tin khách lưu → Sau refresh vẫn có
  - [ ] Favorites lưu → Sau refresh vẫn có

- [ ] **Giới hạn localStorage**
  - [ ] Giữ 10 nháp gần nhất (nháp cũ bị xóa)
  - [ ] Giữ 50 đơn gần nhất (đơn cũ bị xóa)
  - [ ] Không crash khi vượt limit

### 🔟 UI/UX Improvements

- [ ] **Notifications**
  - [ ] Success (✓) → Màu xanh
  - [ ] Error (❌) → Màu đỏ
  - [ ] Info (ℹ️) → Màu xanh dương
  - [ ] Tự động đóng sau 2s

- [ ] **Animations**
  - [ ] Modal slideUp & fadeIn mượt
  - [ ] Notification slideUp & slideDown
  - [ ] Không có lag/flashing

- [ ] **Button States**
  - [ ] Hover → Transform & shadow
  - [ ] Active → Scale down
  - [ ] Color changes rõ ràng

---

## 🔍 Browser Testing

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Android Firefox

### Tablet
- [ ] iPad
- [ ] Android Tablet

---

## 📊 Performance Testing

### Metrics
- [ ] Giỏ hàng add → < 1s
- [ ] Search result → < 300ms
- [ ] Form validation → instant
- [ ] Image lazy load → < 2s
- [ ] localStorage write → instant

### DevTools Checks
- [ ] Console: 0 errors, 0 warnings
- [ ] Network: Menu cache hit on reload
- [ ] Storage: localStorage entries valid
- [ ] Performance: No janky animations

---

## 🐛 Edge Cases

- [ ] **Empty state**: Giỏ trống → \"Đơn hàng trống\"
- [ ] **No history**: Lưu lần đầu → Hiển thị \"Chưa có\"
- [ ] **Form back/cancel**: Không mất dữ liệu giỏ
- [ ] **Multiple forms**: Chỉ có 1 form open
- [ ] **Network offline**: Error handling graceful
- [ ] **Storage full**: Graceful degradation
- [ ] **Very long text**: Wrapping & truncation

---

## 📋 Sign-Off

### QA Checklist
- [ ] Tất cả test case pass
- [ ] Không có regression
- [ ] Performance acceptable
- [ ] Mobile friendly
- [ ] Cross-browser compatible

### Dev Checklist
- [ ] Code reviewed
- [ ] No console errors
- [ ] No memory leaks
- [ ] Comments added
- [ ] Cleanup complete

### Production Checklist
- [ ] Tested on staging
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Monitoring enabled
- [ ] Team notified

---

**Test Date:** _____________  
**Tester:** _____________  
**Status:** ⬜ Not Started | 🟡 In Progress | 🟢 Complete | 🔴 Failed

**Notes:**
```
_____________________________________________________________
_____________________________________________________________
_____________________________________________________________
```

---

**Version:** 2.0.0  
**Last Updated:** Dec 23, 2025
