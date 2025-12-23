// ============================================
// ELEGANT RESTAURANT MENU - JavaScript
// Individual Dish Card System
// ============================================

// DOM Elements
const cartSection = document.getElementById('cart-section');
const viewCartBtn = document.getElementById('view-cart');
const closeCartBtn = document.getElementById('close-cart');
const menuSection = document.getElementById('menu-section');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const completeOrderBtn = document.getElementById('complete-order');
const notesInput = document.getElementById('notes');

// State
let allDishes = [];
let filteredDishes = [];
let cart = [];
let selectedCategory = 'all';

// ============ FETCH MENU DATA ============
async function fetchMenuData() {
    try {
        const response = await fetch('menu.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Lỗi tải menu:', error);
        return [];
    }
}

// ============ RENDER MENU DISHES ============
async function renderMenu() {
    menuSection.innerHTML = '<div class="menu-loading"><i class="fas fa-utensils"></i><p>Đang tải menu...</p></div>';
    
    allDishes = await fetchMenuData();
    
    if (allDishes.length === 0) {
        menuSection.innerHTML = '<p style="text-align: center; padding: 40px;">Không có menu</p>';
        return;
    }

    // Populate category filters
    initCategoryFilters();
    
    // Initial render
    filteredDishes = allDishes;
    renderDishes();
}

// ============ INIT CATEGORY FILTERS ============
function initCategoryFilters() {
    const categorySet = new Set(allDishes.map(dish => dish.category));
    const filterContainer = document.querySelector('.category-filter');
    
    // Keep the "Tất cả" button
    const allBtn = filterContainer.querySelector('.filter-btn');
    if (allBtn) {
        allBtn.addEventListener('click', () => {
            selectedCategory = 'all';
            filteredDishes = allDishes;
            updateFilters();
            renderDishes();
        });
    }

    // Add other categories
    categorySet.forEach(category => {
        if (!filterContainer.querySelector(`[data-category="${category}"]`)) {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-category', category);
            btn.textContent = category;
            btn.addEventListener('click', () => {
                selectedCategory = category;
                filteredDishes = allDishes.filter(dish => dish.category === category);
                updateFilters();
                renderDishes();
            });
            filterContainer.appendChild(btn);
        }
    });
}

function updateFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', 
            (btn.getAttribute('data-category') === 'all' && selectedCategory === 'all') ||
            (btn.getAttribute('data-category') === selectedCategory)
        );
    });
}

// ============ RENDER DISHES AS CARDS ============
function renderDishes() {
    const searchTerm = searchInput.value.toLowerCase();
    const visibleDishes = filteredDishes.filter(dish =>
        dish.name.toLowerCase().includes(searchTerm) ||
        dish.description.toLowerCase().includes(searchTerm)
    );

    if (visibleDishes.length === 0) {
        menuSection.innerHTML = '<div style="text-align: center; padding: 40px; grid-column: 1/-1;"><p>Không tìm thấy món ăn</p></div>';
        return;
    }

    menuSection.innerHTML = '';

    visibleDishes.forEach(dish => {
        const card = createDishCard(dish);
        menuSection.appendChild(card);
    });
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.id = `dish-${dish.id}`;

    let optionsHTML = '';
    if (dish.options && dish.options.length > 0) {
        optionsHTML = `<div class="dish-options">`;
        dish.options.forEach((option, idx) => {
            optionsHTML += `
                <div class="option-group">
                    <label class="option-label">${option.type}</label>
                    <select class="option-select" data-option="${idx}">
                        ${option.choices.map((choice, choiceIdx) => `
                            <option value="${choiceIdx}" data-price="${choice.price}">
                                ${choice.name} ${choice.price > 0 ? `(+${choice.price}k)` : ''}
                            </option>
                        `).join('')}
                    </select>
                </div>
            `;
        });
        optionsHTML += `</div>`;
    }

    card.innerHTML = `
        <div class="dish-image">
            <img src="${dish.image}" alt="${dish.name}" onerror="this.src='https://via.placeholder.com/300x250/8B2E26/D4AF37?text=${encodeURIComponent(dish.name)}'">
            <span class="dish-badge">${dish.category}</span>
        </div>
        <div class="dish-content">
            <div class="dish-category">${dish.category}</div>
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-description">${dish.description}</p>
            <div class="dish-price">${dish.basePrice}k</div>
            
            ${optionsHTML}
            
            <div class="dish-quantity">
                <span class="quantity-label">Số lượng</span>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="decreaseQty('dish-${dish.id}')">−</button>
                    <input type="number" class="qty-input" value="1" min="1" max="99" onchange="updateQty('dish-${dish.id}')">
                    <button class="qty-btn" onclick="increaseQty('dish-${dish.id}')">+</button>
                </div>
            </div>
            
            <button class="add-to-cart-btn" onclick="addToCart(${dish.id})">
                <i class="fas fa-shopping-cart"></i> Thêm vào giỏ
            </button>
        </div>
    `;

    return card;
}

// ============ QUANTITY CONTROLS ============
function increaseQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    input.value = Math.min(99, parseInt(input.value) + 1);
}

function decreaseQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    input.value = Math.max(1, parseInt(input.value) - 1);
}

function updateQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    const val = parseInt(input.value);
    if (isNaN(val) || val < 1) input.value = 1;
    if (val > 99) input.value = 99;
}

// ============ ADD TO CART ============
function addToCart(dishId) {
    const dish = allDishes.find(d => d.id === dishId);
    if (!dish) return;

    const card = document.getElementById(`dish-${dishId}`);
    const quantity = parseInt(card.querySelector('.qty-input').value);
    const selectedOptions = {};
    let totalPrice = dish.basePrice;

    // Get selected options
    if (dish.options && dish.options.length > 0) {
        dish.options.forEach((option, idx) => {
            const select = card.querySelector(`[data-option="${idx}"]`);
            if (select) {
                const choiceIdx = parseInt(select.value);
                const selectedChoice = option.choices[choiceIdx];
                selectedOptions[option.type] = selectedChoice.name;
                totalPrice += selectedChoice.price;
            }
        });
    }

    // Add to cart
    for (let i = 0; i < quantity; i++) {
        cart.push({
            id: dishId,
            name: dish.name,
            price: totalPrice,
            options: selectedOptions,
            basePrice: dish.basePrice
        });
    }

    updateCartUI();
    showNotification(`✓ ${dish.name} x${quantity} đã thêm vào giỏ`);
}

// ============ CART MANAGEMENT ============
function updateCartUI() {
    cartCount.textContent = cart.length;
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    const cartEmpty = document.getElementById('cart-empty');
    
    if (cart.length === 0) {
        cartList.innerHTML = '';
        cartEmpty.style.display = 'flex';
    } else {
        cartEmpty.style.display = 'none';
        cartList.innerHTML = '';
        
        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'cart-item';
            
            let optionsText = '';
            if (Object.keys(item.options).length > 0) {
                optionsText = '<div class="cart-item-options">' + 
                    Object.entries(item.options)
                        .map(([type, choice]) => `<span class="option-tag">${choice}</span>`)
                        .join('') + 
                    '</div>';
            }
            
            const itemContent = document.createElement('div');
            itemContent.className = 'cart-item-content';
            itemContent.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    ${optionsText}
                    <div class="cart-item-price">${item.price}k</div>
                </div>
                <div class="cart-item-controls">
                    <div class="cart-quantity-control">
                        <button class="cart-qty-btn" onclick="decreaseItemQty(${index})">−</button>
                        <span class="cart-qty-display">1</span>
                        <button class="cart-qty-btn" onclick="increaseItemQty(${index})">+</button>
                    </div>
                    <button class="cart-edit-btn" title="Sửa" onclick="editCartItem(${index})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="cart-delete-btn" title="Xóa" onclick="removeFromCart(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            li.appendChild(itemContent);
            cartList.appendChild(li);
            
            total += item.price * 1000;
        });
        
        document.getElementById('total-price').textContent = total.toLocaleString('vi-VN');
    }
}

function increaseItemQty(index) {
    if (index < cart.length) {
        cart.splice(index, 0, { ...cart[index] });
        updateCartUI();
    }
}

function decreaseItemQty(index) {
    if (index < cart.length) {
        cart.splice(index, 1);
        if (cart.length === 0) {
            renderCart();
        } else {
            updateCartUI();
        }
    }
}

function editCartItem(index) {
    if (index >= cart.length) return;
    
    const item = cart[index];
    const dish = allDishes.find(d => d.id === item.id);
    
    if (!dish || !dish.options || dish.options.length === 0) {
        alert('Món này không có tùy chọn để chỉnh sửa');
        return;
    }
    
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h3>Sửa: ${item.name}</h3>
                <button class="edit-modal-close" onclick="this.closest('.edit-modal').remove()">&times;</button>
            </div>
            <div class="edit-modal-body" id="edit-options-container">
                ${dish.options.map((option, optIdx) => {
                    const currentChoice = item.options[option.type];
                    return `
                        <div class="edit-option-group">
                            <label>${option.type}</label>
                            <select class="edit-option-select" data-option="${optIdx}">
                                ${option.choices.map((choice, choiceIdx) => `
                                    <option value="${choiceIdx}" 
                                            data-price="${choice.price}"
                                            ${choice.name === currentChoice ? 'selected' : ''}>
                                        ${choice.name} ${choice.price > 0 ? `(+${choice.price}k)` : ''}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="edit-modal-footer">
                <button class="edit-cancel-btn" onclick="this.closest('.edit-modal').remove()">Hủy</button>
                <button class="edit-save-btn" onclick="saveEditedItem(${index})">Lưu Thay Đổi</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Store reference for saving
    window.editingItemIndex = index;
    window.editingDish = dish;
}

function saveEditedItem(index) {
    const dish = window.editingDish;
    const oldPrice = cart[index].basePrice;
    let newPrice = oldPrice;
    const newOptions = {};
    
    dish.options.forEach((option, idx) => {
        const select = document.querySelector(`.edit-option-select[data-option="${idx}"]`);
        if (select) {
            const choiceIdx = parseInt(select.value);
            const selectedChoice = option.choices[choiceIdx];
            newOptions[option.type] = selectedChoice.name;
            newPrice += selectedChoice.price;
        }
    });
    
    cart[index].price = newPrice;
    cart[index].options = newOptions;
    
    document.querySelector('.edit-modal').remove();
    updateCartUI();
    showNotification('✓ Cập nhật thành công');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// ============ SEARCH ============
function filterMenu() {
    if (selectedCategory === 'all') {
        filteredDishes = allDishes;
    }
    renderDishes();
}

// ============ NOTIFICATIONS ============
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 999;
        animation: slideUp 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// ============ CART MODAL ============
viewCartBtn.addEventListener('click', () => {
    cartSection.classList.toggle('hidden');
});

closeCartBtn.addEventListener('click', () => {
    cartSection.classList.add('hidden');
});

document.addEventListener('click', (e) => {
    if (!cartSection.contains(e.target) && e.target !== viewCartBtn && !viewCartBtn.contains(e.target)) {
        cartSection.classList.add('hidden');
    }
});

// ============ COMPLETE ORDER ============
completeOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Vui lòng chọn ít nhất 1 món ăn');
        return;
    }

    let orderText = '═══════════════════════════════\n';
    orderText += '        ĐƠN HÀNG NHÀ HÀNG KING\n';
    orderText += '═══════════════════════════════\n\n';
    
    let total = 0;
    const itemsMap = {};

    cart.forEach(item => {
        const key = item.name + JSON.stringify(item.options);
        if (!itemsMap[key]) {
            itemsMap[key] = { count: 0, price: item.price, name: item.name, options: item.options };
        }
        itemsMap[key].count++;
        total += item.price * 1000;
    });

    Object.values(itemsMap).forEach(item => {
        let optionsText = '';
        if (Object.keys(item.options).length > 0) {
            optionsText = '\n  ' + Object.entries(item.options)
                .map(([type, choice]) => `• ${type}: ${choice}`)
                .join('\n  ');
        }
        orderText += `${item.count}x ${item.name}${optionsText}\n`;
        orderText += `   Giá: ${item.price}k × ${item.count} = ${item.price * item.count}k\n\n`;
    });

    orderText += '───────────────────────────────\n';
    orderText += `TỔNG TIỀN: ${total.toLocaleString('vi-VN')} VND\n`;
    orderText += '───────────────────────────────\n\n';

    if (notesInput.value.trim()) {
        orderText += `📝 GHI CHÚ:\n${notesInput.value}\n\n`;
    }

    orderText += 'Nhà hàng KING\n';
    orderText += '☎️ Gọi: 0327933609\n';
    orderText += 'Cảm ơn bạn đã đặt hàng!\n';

    navigator.clipboard.writeText(orderText).then(() => {
        showNotification('✓ Đơn hàng đã copy! Đang mở Zalo...');
        
        setTimeout(() => {
            // Open Zalo with the number
            window.open('https://zalo.me/0327933609', '_blank');
            
            setTimeout(() => {
                cart = [];
                notesInput.value = '';
                updateCartUI();
                cartSection.classList.add('hidden');
            }, 500);
        }, 800);
    }).catch(err => {
        console.error('Lỗi copy:', err);
        alert('Không thể copy đơn hàng. Nhưng sẽ mở Zalo cho bạn!');
        window.open('https://zalo.me/0327933609', '_blank');
    });
});

// ============ EVENT LISTENERS ============
searchInput.addEventListener('input', filterMenu);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cartSection.classList.add('hidden');
    }
});

// ============ SAVE/LOAD ORDERS ============
function saveOrder() {
    if (cart.length === 0) {
        showNotification('❌ Giỏ hàng trống, không thể lưu!');
        return;
    }

    const orders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    const orderData = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        cart: JSON.parse(JSON.stringify(cart)),
        notes: notesInput.value,
        total: document.getElementById('total-price').textContent
    };
    
    orders.unshift(orderData);
    localStorage.setItem('savedOrders', JSON.stringify(orders));
    showNotification('✓ Đơn hàng đã lưu!');
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'saved-orders-modal';
    
    let ordersHTML = '';
    if (orders.length === 0) {
        ordersHTML = '<div class="saved-orders-empty"><p>Chưa có đơn hàng nào được lưu</p></div>';
    } else {
        ordersHTML = '<div class="saved-orders-list">' + orders.map((order, idx) => `
            <div class="saved-order-item">
                <div class="saved-order-info">
                    <div class="saved-order-date">📅 ${order.timestamp}</div>
                    <div class="saved-order-total">💰 ${order.total} VND</div>
                    ${order.notes ? `<div class="saved-order-note">"${order.notes}"</div>` : ''}
                </div>
                <div class="saved-order-controls">
                    <button class="saved-order-load-btn" onclick="loadOrderData(${idx})">
                        <i class="fas fa-redo"></i> Tải
                    </button>
                    <button class="saved-order-delete-btn" onclick="deleteSavedOrder(${idx})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('') + '</div>';
    }
    
    modal.innerHTML = `
        <div class="saved-orders-content">
            <div class="saved-orders-header">
                <h3>📋 Các Đơn Hàng Đã Lưu</h3>
                <button class="saved-orders-close" onclick="this.closest('.saved-orders-modal').remove()">&times;</button>
            </div>
            ${ordersHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function loadOrderData(index) {
    const orders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    if (index < 0 || index >= orders.length) return;
    
    const order = orders[index];
    cart = JSON.parse(JSON.stringify(order.cart));
    notesInput.value = order.notes || '';
    
    document.querySelector('.saved-orders-modal').remove();
    updateCartUI();
    showNotification('✓ Đơn hàng đã được tải lại!');
    cartSection.classList.remove('hidden');
}

function deleteSavedOrder(index) {
    if (!confirm('Bạn chắc chắn muốn xóa đơn hàng này?')) return;
    
    const orders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
    orders.splice(index, 1);
    localStorage.setItem('savedOrders', JSON.stringify(orders));
    loadOrders(); // Reload modal
    showNotification('✓ Đơn hàng đã xóa');
}

const saveOrderBtn = document.getElementById('save-order-btn');
const loadOrderBtn = document.getElementById('load-order-btn');

if (saveOrderBtn) saveOrderBtn.addEventListener('click', saveOrder);
if (loadOrderBtn) loadOrderBtn.addEventListener('click', loadOrders);

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
`;
document.head.appendChild(style);
