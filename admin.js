// ============================================
// ADMIN DASHBOARD - Menu Management
// ============================================

let allItems = [];
let editingId = null;

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    setupEventListeners();
});

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    document.getElementById('add-item-btn').addEventListener('click', openModal);
    document.getElementById('item-form').addEventListener('submit', saveItem);
    document.getElementById('export-btn').addEventListener('click', exportMenu);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importMenu);
    document.getElementById('backup-btn').addEventListener('click', autoBackup);
    document.getElementById('item-image').addEventListener('input', updateImagePreview);
    document.getElementById('image-upload-input').addEventListener('change', handleImageUpload);
}

// ============ LOAD MENU ============
async function loadMenu() {
    try {
        const response = await fetch('menu.json');
        allItems = await response.json();
        renderTable();
        updateStats();
    } catch (error) {
        console.error('Lỗi load menu:', error);
        showMessage('❌ Lỗi tải menu', 'error');
    }
}

// ============ RENDER TABLE ============
function renderTable() {
    const tbody = document.getElementById('menu-tbody');
    tbody.innerHTML = allItems.map((item, idx) => `
        <tr>
            <td>${item.id}</td>
            <td>
                <img src="${item.image}" alt="${item.name}" 
                     style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;"
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2260%22%3E%3Crect fill=%22%238B2E26%22 width=%2280%22 height=%2260%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2214%22 fill=%22%23D4AF37%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E🍽️%3C/text%3E%3C/svg%3E'">
            </td>
            <td>
                <strong>${item.name}</strong>
                ${item.bestseller ? ' <span style="color: #E74C3C;">⭐</span>' : ''}
            </td>
            <td>${item.category}</td>
            <td><strong>${item.basePrice}k</strong></td>
            <td class="item-actions">
                <button class="btn btn-small btn-edit" onclick="openQuickEdit(${item.id})">
                    <i class="fas fa-pencil-alt"></i> Sửa Nhanh
                </button>
                <button class="btn btn-small btn-edit" onclick="editItem(${item.id})">
                    <i class="fas fa-edit"></i> Chi Tiết
                </button>
                <button class="btn btn-small btn-delete" onclick="deleteItem(${item.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </td>
        </tr>
    `).join('');
}

// ============ OPEN MODAL ============
function openModal() {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Thêm Món Mới';
    document.getElementById('item-form').reset();
    document.getElementById('item-id').value = getNextId();
    document.getElementById('image-preview').innerHTML = '<span style="color: #999;">Không có ảnh</span>';
    document.getElementById('item-modal').classList.add('active');
}

// ============ EDIT ITEM ============
function editItem(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    editingId = id;
    document.getElementById('modal-title').textContent = 'Sửa Món Ăn';
    document.getElementById('item-id').value = item.id;
    document.getElementById('item-name').value = item.name;
    document.getElementById('item-category').value = item.category;
    document.getElementById('item-price').value = item.basePrice;
    document.getElementById('item-description').value = item.description || '';
    document.getElementById('item-image').value = item.image;
    document.getElementById('item-bestseller').checked = item.bestseller || false;
    document.getElementById('item-options').value = JSON.stringify(item.options || [], null, 2);

    updateImagePreview();
    document.getElementById('item-modal').classList.add('active');
}

// ============ SAVE ITEM ============
function saveItem(e) {
    e.preventDefault();

    const itemData = {
        id: parseInt(document.getElementById('item-id').value),
        name: document.getElementById('item-name').value.trim(),
        category: document.getElementById('item-category').value.trim(),
        basePrice: parseInt(document.getElementById('item-price').value),
        description: document.getElementById('item-description').value.trim(),
        image: document.getElementById('item-image').value.trim(),
        bestseller: document.getElementById('item-bestseller').checked,
        options: tryParseJSON(document.getElementById('item-options').value)
    };

    // Validate
    if (!itemData.name || !itemData.category || !itemData.basePrice) {
        showMessage('❌ Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
    }

    if (editingId) {
        const idx = allItems.findIndex(i => i.id === editingId);
        if (idx > -1) allItems[idx] = itemData;
    } else {
        allItems.push(itemData);
    }

    saveMenuToFile();
    renderTable();
    updateStats();
    closeModal();
    showMessage('✓ Lưu thành công!', 'success');
}

// ============ DELETE ITEM ============
function deleteItem(id) {
    if (!confirm(`Bạn chắc chắn muốn xóa món này?`)) return;

    allItems = allItems.filter(i => i.id !== id);
    saveMenuToFile();
    renderTable();
    updateStats();
    showMessage('✓ Đã xóa!', 'success');
}

// ============ QUICK EDIT ============
let quickEditId = null;

function openQuickEdit(id) {
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    quickEditId = id;
    document.getElementById('quick-edit-name').value = item.name;
    document.getElementById('quick-edit-price').value = item.basePrice;
    document.getElementById('quick-edit-category').value = item.category;
    document.getElementById('quick-edit-modal').classList.add('active');
}

function closeQuickEdit() {
    quickEditId = null;
    document.getElementById('quick-edit-modal').classList.remove('active');
}

function saveQuickEdit(e) {
    e.preventDefault();
    
    if (!quickEditId) return;

    const idx = allItems.findIndex(i => i.id === quickEditId);
    if (idx > -1) {
        allItems[idx].name = document.getElementById('quick-edit-name').value.trim();
        allItems[idx].basePrice = parseInt(document.getElementById('quick-edit-price').value);
        allItems[idx].category = document.getElementById('quick-edit-category').value.trim();
        
        saveMenuToFile();
        renderTable();
        updateStats();
        closeQuickEdit();
        showMessage('✓ Cập nhật nhanh thành công!', 'success');
    }
}

// ============ CLOSE MODAL ============
function closeModal() {
    document.getElementById('item-modal').classList.remove('active');
}

// ============ UPDATE IMAGE PREVIEW ============
function updateImagePreview() {
    const imageUrl = document.getElementById('item-image').value.trim();
    const preview = document.getElementById('image-preview');

    if (imageUrl) {
        preview.innerHTML = `<img src="${imageUrl}" alt="preview" onerror="this.src='https://via.placeholder.com/300x250?text=Lỗi%20ảnh'">`;
    } else {
        preview.innerHTML = '<span style="color: #999;">Không có ảnh</span>';
    }
}

// ============ HANDLE IMAGE UPLOAD ============
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
        showMessage('❌ Vui lòng chọn file ảnh', 'error');
        return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showMessage('❌ Ảnh quá lớn (tối đa 5MB)', 'error');
        return;
    }

    // Create FormData to send file to server
    const formData = new FormData();
    formData.append('file', file);

    // Upload to server
    fetch('upload_image.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Cập nhật input với đường dẫn asset (relative path)
            document.getElementById('item-image').value = data.path;
            
            // Hiển thị preview
            const preview = document.getElementById('image-preview');
            preview.innerHTML = `<img src="${data.path}" alt="preview" style="max-width: 100%; height: auto; border-radius: 8px;">`;
            
            showMessage(`✓ Tải lên thành công! ${data.message}`, 'success');
            console.log(`Asset path: ${data.path}`);
        } else {
            throw new Error(data.error || 'Unknown error occurred');
        }
    })
    .catch(error => {
        showMessage('❌ Lỗi tải ảnh: ' + error.message, 'error');
        console.error('Upload error:', error);
    })
    .finally(() => {
        // Reset file input
        e.target.value = '';
    });
}

// ============ IMAGE HANDLING ============
// Images are now stored directly in the assets folder with relative paths
// No need to restore from localStorage anymore

// ============ TOGGLE IMAGE INPUT MODE ============
function toggleImageInput() {
    const textInput = document.getElementById('item-image');
    textInput.style.display = textInput.style.display === 'none' ? 'block' : 'none';
}

// ============ EXPORT MENU ============
function exportMenu() {
    const dataStr = JSON.stringify(allItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menu-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showMessage('✓ Đã tải menu!', 'success');
}

// ============ IMPORT MENU ============
function importMenu(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            if (!Array.isArray(data)) throw new Error('File phải là mảng JSON');

            if (confirm('Bạn chắc chắn muốn thay thế toàn bộ menu? Không thể hoàn tác!')) {
                allItems = data;
                saveMenuToFile();
                renderTable();
                updateStats();
                showMessage('✓ Nhập menu thành công!', 'success');
            }
        } catch (error) {
            showMessage('❌ File không hợp lệ: ' + error.message, 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
}

// ============ AUTO BACKUP ============
function autoBackup() {
    const backup = {
        timestamp: new Date().toISOString(),
        data: allItems
    };
    localStorage.setItem('menuBackup_' + Date.now(), JSON.stringify(backup));
    showMessage('✓ Backup tự động thành công!', 'success');
    updateStats();
}

// ============ UPDATE STATS ============
function updateStats() {
    document.getElementById('total-items').textContent = allItems.length;
    const categories = new Set(allItems.map(i => i.category));
    document.getElementById('total-categories').textContent = categories.size;
    
    const backups = JSON.parse(localStorage.getItem('menuBackups') || '[]').length;
    document.getElementById('backup-count').textContent = backups;
}

// ============ SAVE MENU TO FILE ============
function saveMenuToFile() {
    // Lưu vào localStorage trước
    localStorage.setItem('menuCache', JSON.stringify(allItems));
    localStorage.setItem('menuCacheTime', Date.now().toString());

    // Tự động backup vào localStorage
    autoBackupMenu();

    // Tạo blob và download tự động để cập nhật menu.json
    const dataStr = JSON.stringify(allItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Lưu vào localStorage với key special để JavaScript chính có thể đọc
    localStorage.setItem('menuData', dataStr);

    // Nếu có backend, gọi API đến đây
    // await fetch('/api/menu', { method: 'POST', body: JSON.stringify(allItems) })
}

// ============ AUTO BACKUP ============
function autoBackupMenu() {
    const backups = JSON.parse(localStorage.getItem('menuBackups') || '[]');
    
    // Backup tối đa 10 versions
    if (backups.length >= 10) {
        backups.shift();
    }
    
    const backup = {
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('vi-VN'),
        data: JSON.stringify(allItems),
        size: (new Blob([JSON.stringify(allItems)]).size / 1024).toFixed(2) + ' KB'
    };
    
    backups.push(backup);
    localStorage.setItem('menuBackups', JSON.stringify(backups));
    updateStats();
}

// ============ HELPER FUNCTIONS ============
function getNextId() {
    return Math.max(0, ...allItems.map(i => i.id)) + 1;
}

function tryParseJSON(str) {
    try {
        return str.trim() ? JSON.parse(str) : [];
    } catch {
        return [];
    }
}

function showMessage(message, type = 'info') {
    const msgEl = document.getElementById('success-msg');
    msgEl.textContent = message;
    msgEl.className = 'success-message show';
    setTimeout(() => msgEl.classList.remove('show'), 3000);
}

// Close modal khi click outside
document.getElementById('item-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'item-modal') closeModal();
});
