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
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// ============ FETCH MENU DATA ============
async function fetchMenuData() {
    try {
        const response = await fetch('menu.json');
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate data
        if (!Array.isArray(data)) {
            throw new Error('Menu data must be an array');
        }
        
        if (data.length === 0) {
            console.warn('Menu is empty');
            return [];
        }
        
        // Validate each dish
        return data.filter(dish => {
            return dish.id && dish.name && dish.basePrice && dish.category;
        });
        
    } catch (error) {
        console.error('Lỗi tải menu:', error.message);
        showNotification('❌ Lỗi tải menu: ' + error.message);
        return [];
    }
}

// ============ RENDER MENU DISHES ============
async function renderMenu() {
    menuSection.innerHTML = '<div class="menu-loading"><i class="fas fa-utensils"></i><p>Đang tải menu...</p></div>';
    
    // Check cache first
    const cachedMenu = localStorage.getItem('menuCache');
    const cacheTime = localStorage.getItem('menuCacheTime');
    const now = Date.now();
    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    
    if (cachedMenu && cacheTime && (now - parseInt(cacheTime)) < CACHE_DURATION) {
        allDishes = JSON.parse(cachedMenu);
    } else {
        allDishes = await fetchMenuData();
        if (allDishes.length > 0) {
            localStorage.setItem('menuCache', JSON.stringify(allDishes));
            localStorage.setItem('menuCacheTime', now.toString());
        }
    }
    
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
    
    const isFavorite = favorites.includes(dish.id);

    let optionsHTML = '';
    if (dish.options && dish.options.length > 0) {
        optionsHTML = `<div class="dish-options">`;
        dish.options.forEach((option, idx) => {
            optionsHTML += `
                <div class="option-group">
                    <label class="option-label">${option.type}</label>
                    <div class="option-buttons">
                        ${option.choices.map((choice, choiceIdx) => `
                            <button class="option-btn ${choiceIdx === 0 ? 'active' : ''}" 
                                    data-option="${idx}" 
                                    data-choice="${choiceIdx}" 
                                    data-price="${choice.price}"
                                    onclick="selectOption(event, ${idx}, ${choiceIdx})">
                                ${choice.name} ${choice.price > 0 ? `+${choice.price}k` : ''}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        optionsHTML += `</div>`;
    }

    card.innerHTML = `
        <div class="dish-image">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='250'%3E%3Crect fill='%23f0f0f0' width='300' height='250'/%3E%3C/svg%3E" 
                 data-src="${dish.image}" 
                 alt="${dish.name}" 
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x250/8B2E26/D4AF37?text=${encodeURIComponent(dish.name)}'"
                 class="lazy-image">
            <span class="dish-badge ${dish.bestseller ? 'bestseller' : ''}">${dish.bestseller ? '⭐ BEST' : dish.category}</span>
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${dish.id})" title="Yêu thích">
                <i class="fas fa-heart"></i>
            </button>
        </div>
        <div class="dish-content">
            <h3 class="dish-name">${dish.name}</h3>
            <p class="dish-description">${dish.description}</p>
            
            ${optionsHTML}
            
            <div class="dish-footer">
                <div class="dish-quantity">
                    <span class="quantity-label">Số lượng</span>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="decreaseQty('dish-${dish.id}')">−</button>
                        <input type="number" class="qty-input" value="1" min="1" max="99" onchange="updateQty('dish-${dish.id}')">
                        <button class="qty-btn" onclick="increaseQty('dish-${dish.id}')">+</button>
                    </div>
                </div>
                
                <button class="add-to-cart-btn" onclick="addToCart(${dish.id})">
                    <i class="fas fa-shopping-cart"></i> Gọi món
                </button>
            </div>
        </div>
    `;

    return card;
}

// ============ FAVORITE ITEMS ============
function toggleFavorite(dishId) {
    event.stopPropagation();
    
    const index = favorites.indexOf(dishId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(dishId);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Update UI
    const btn = document.querySelector(`#dish-${dishId} .favorite-btn`);
    if (btn) {
        btn.classList.toggle('active');
    }
}

// ============ OPTION SELECTION ============
function selectOption(event, optionIdx, choiceIdx) {
    event.preventDefault();
    event.stopPropagation();
    
    const clickedBtn = event.target.closest('.option-btn');
    if (!clickedBtn) return;
    
    // Get the option group
    const optionGroup = clickedBtn.closest('.option-group');
    if (!optionGroup) return;
    
    // Remove active class from all buttons in this group
    optionGroup.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to clicked button
    clickedBtn.classList.add('active');
}

// ============ QUANTITY CONTROLS ============
function updateQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    if (!input) return;
    
    let val = parseInt(input.value) || 1;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    input.value = val;
}

function increaseQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    if (!input) return;
    
    let val = parseInt(input.value) || 1;
    input.value = Math.min(99, val + 1);
}

function decreaseQty(cardId) {
    const input = document.querySelector(`#${cardId} .qty-input`);
    if (!input) return;
    
    let val = parseInt(input.value) || 1;
    input.value = Math.max(1, val - 1);
}

// ============ ADD TO CART ============
function addToCart(dishId) {
    try {
        const dish = allDishes.find(d => d.id === dishId);
        if (!dish) {
            showNotification('❌ Lỗi: Không tìm thấy món ăn');
            return;
        }

        const card = document.getElementById(`dish-${dishId}`);
        if (!card) {
            showNotification('❌ Lỗi: Không tìm thấy card món ăn');
            return;
        }

        const quantity = Math.max(1, parseInt(card.querySelector('.qty-input').value) || 1);
        const selectedOptions = {};
        let totalPrice = 0;

        // Get selected options - price in options is the final price, not additional
        if (dish.options && dish.options.length > 0) {
            dish.options.forEach((option, idx) => {
                const activeBtn = card.querySelector(`[data-option="${idx}"].active`);
                if (activeBtn) {
                    const choiceIdx = parseInt(activeBtn.getAttribute('data-choice'));
                    const selectedChoice = option.choices[choiceIdx];
                    if (selectedChoice) {
                        selectedOptions[option.type] = selectedChoice.name;
                        totalPrice = selectedChoice.price;  // Use the choice price as final price
                    }
                } else if (option.choices && option.choices.length > 0) {
                    // Default to first choice if no selection
                    const selectedChoice = option.choices[0];
                    selectedOptions[option.type] = selectedChoice.name;
                    totalPrice = selectedChoice.price;  // Use the choice price as final price
                }
            });
        } else {
            // No options, use base price
            totalPrice = dish.basePrice;
        }

        // Add to cart - merge if same item with same options
        const optionsKey = JSON.stringify(selectedOptions);
        const existingItem = cart.find(item => 
            item.id === dishId && JSON.stringify(item.options) === optionsKey
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: dishId,
                name: dish.name,
                price: totalPrice,
                options: selectedOptions,
                basePrice: dish.basePrice,
                quantity: quantity
            });
        }

        updateCartUI();
        showNotification(`✓ ${dish.name} x${quantity} đã gọi`);
    } catch (error) {
        console.error('Lỗi thêm vào giỏ:', error);
        showNotification('❌ Lỗi khi thêm vào giỏ hàng');
    }
}

function updateCartUI() {
    // Count total items (sum of all quantities)
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems;
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
        
        let total = 0;
        // Store existing items for comparison
        const existingItems = Array.from(cartList.querySelectorAll('.cart-item'));
        
        cart.forEach((item, index) => {
            const existingItem = existingItems[index];
            const quantity = item.quantity || 1;
            const subtotal = item.price * quantity;
            
            let optionsText = '';
            if (Object.keys(item.options).length > 0) {
                optionsText = '<div class="cart-item-options">' + 
                    Object.entries(item.options)
                        .map(([type, choice]) => `<span class="option-tag">${choice}</span>`)
                        .join('') + 
                    '</div>';
            }
            
            const itemHTML = `
                <div class="cart-item-content">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        ${optionsText}
                        <div class="cart-item-price">${item.price}k × ${quantity} = ${subtotal}k</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="cart-quantity-control">
                            <button class="cart-qty-btn" data-action="decrease" data-index="${index}">−</button>
                            <span class="cart-qty-display">${quantity}</span>
                            <button class="cart-qty-btn" data-action="increase" data-index="${index}">+</button>
                        </div>
                        <button class="cart-edit-btn" title="Sửa" data-action="edit" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="cart-delete-btn" title="Xóa" data-action="delete" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            
            if (existingItem) {
                // Update existing item instead of replacing
                existingItem.innerHTML = itemHTML;
            } else {
                // Create new item
                const li = document.createElement('li');
                li.className = 'cart-item';
                li.innerHTML = itemHTML;
                cartList.appendChild(li);
            }
            
            total += subtotal * 1000;
        });
        
        // Remove items that no longer exist (if cart was reduced)
        if (existingItems.length > cart.length) {
            for (let i = cart.length; i < existingItems.length; i++) {
                existingItems[i].remove();
            }
        }
        
        document.getElementById('total-price').textContent = total.toLocaleString('vi-VN');
    }
}

function increaseItemQty(index) {
    if (index < cart.length) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        updateCartUI();
    }
}

function decreaseItemQty(index) {
    if (index < cart.length) {
        const qty = (cart[index].quantity || 1) - 1;
        if (qty > 0) {
            cart[index].quantity = qty;
        } else {
            cart.splice(index, 1);
        }
        updateCartUI();
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

// ============ DEBOUNCE HELPER ============
function debounce(func, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============ SEARCH ============
const debouncedFilterMenu = debounce(filterMenu, 300);

function filterMenu() {
    if (selectedCategory === 'all') {
        filteredDishes = allDishes;
    }
    renderDishes();
}

// ============ NOTIFICATIONS ============
function showNotification(message) {
    try {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = 'notification';
        
        // Determine notification type
        if (message.includes('❌')) {
            notification.classList.add('error');
        } else if (message.includes('✓')) {
            notification.classList.add('success');
        } else {
            notification.classList.add('info');
        }
        
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            z-index: 999;
            animation: slideUp 0.3s ease;
            font-weight: 500;
            max-width: 90%;
            word-wrap: break-word;
        `;
        
        // Set background color based on type
        if (notification.classList.contains('success')) {
            notification.style.background = 'linear-gradient(135deg, #27AE60 0%, #229954 100%)';
        } else if (notification.classList.contains('error')) {
            notification.style.background = 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)';
        } else {
            notification.style.background = 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideDown 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    } catch (error) {
        console.error('Notification error:', error);
    }
}

// ============ CART MODAL ============
function toggleCart(state) {
    if (state === true) {
        cartSection.classList.remove('hidden');
        if (isSmallMobile) document.body.style.overflow = 'hidden';
    } else if (state === false) {
        cartSection.classList.add('hidden');
        if (isSmallMobile) document.body.style.overflow = 'auto';
    } else {
        cartSection.classList.toggle('hidden');
        if (!cartSection.classList.contains('hidden') && isSmallMobile) {
            document.body.style.overflow = 'hidden';
        } else if (isSmallMobile) {
            document.body.style.overflow = 'auto';
        }
    }
}

viewCartBtn.addEventListener('click', () => {
    toggleCart();
});

closeCartBtn.addEventListener('click', () => {
    toggleCart(false);
});

document.addEventListener('click', (e) => {
    // Only close cart if clicking outside of it (not on buttons within cart)
    if (!cartSection.contains(e.target) && e.target !== viewCartBtn && !viewCartBtn.contains(e.target)) {
        toggleCart(false);
    }
    
    // Handle cart item button clicks with event delegation
    if (cartSection.contains(e.target)) {
        const btn = e.target.closest('[data-action]');
        if (btn) {
            e.stopPropagation(); // Prevent bubbling to document listener
            const action = btn.dataset.action;
            const index = parseInt(btn.dataset.index);
            
            if (action === 'increase') {
                increaseItemQty(index);
            } else if (action === 'decrease') {
                decreaseItemQty(index);
            } else if (action === 'edit') {
                editCartItem(index);
            } else if (action === 'delete') {
                removeFromCart(index);
            }
        }
    }
});

// ============ VALIDATE PHONE ============
function isValidPhone(phone) {
    // Vietnamese phone format: 08/09/07/06/05/03 + 8 digits or 010/011 + 9 digits
    const phoneRegex = /^(0[3-9]|010|011)\d{8,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// ============ VALIDATE EMAIL (optional) ============
function isValidEmail(email) {
    if (!email) return true; // optional
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============ VALIDATE ADDRESS ============
function isValidAddress(address) {
    return address.trim().length >= 5;
}

// ============ COMPLETE ORDER PROCESS ============
function completeOrderProcess() {
    if (cart.length === 0) {
        alert('Vui lòng chọn ít nhất 1 món ăn');
        return;
    }

    let orderText = '═════════════════════════════════════\n';
    orderText += '      ĐƠN HÀNG NHÀ HÀNG KING\n';
    orderText += '═════════════════════════════════════\n\n';
    orderText += '🍖 ĐƠN ĂN TẠI NHÀ HÀNG\n\n';
    
    // Order items
    orderText += '📦 ĐƠN HÀNG:\n';
    orderText += '─────────────────────────────────────\n';
    
    let subtotal = 0;
    let itemCount = 0;

    cart.forEach(item => {
        const quantity = item.quantity || 1;
        const itemSubtotal = item.price * quantity;
        
        let optionsText = '';
        if (Object.keys(item.options).length > 0) {
            optionsText = '\n  ' + Object.entries(item.options)
                .map(([type, choice]) => `   • ${type}: ${choice}`)
                .join('\n');
        }
        orderText += `${quantity}x ${item.name}${optionsText}\n`;
        orderText += `   💰 ${item.price}k × ${quantity} = ${itemSubtotal}k\n\n`;
        
        subtotal += itemSubtotal;
        itemCount += quantity;
    });

    const total = subtotal * 1000;

    orderText += '─────────────────────────────────────\n';
    orderText += `Tổng số món: ${itemCount}\n`;
    orderText += '─────────────────────────────────────\n';
    orderText += `💵 TỔNG TIỀN: ${subtotal.toLocaleString('vi-VN')}k (${total.toLocaleString('vi-VN')} VND)\n`;
    orderText += '═════════════════════════════════════\n\n';

    if (notesInput.value.trim()) {
        orderText += `📝 GHI CHÚ:\n${notesInput.value}\n\n`;
    }

    const timestamp = new Date().toLocaleString('vi-VN');
    orderText += `🕐 Thời gian: ${timestamp}\n\n`;
    orderText += '─────────────────────────────────────\n';
    orderText += 'Nhà hàng KING - Dê Sạch Truyền Thống\n';
    orderText += '☎️ Gọi: 0327933609\n';
    orderText += 'Cảm ơn bạn đã đặt hàng!\n';
    orderText += '═════════════════════════════════════\n';

    // Auto save to history
    saveOrderToHistory(subtotal, total, timestamp);

    navigator.clipboard.writeText(orderText).then(() => {
        showNotification('✓ Đơn hàng đã copy! Đang mở Zalo...');
        
        setTimeout(() => {
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
        showNotification('❌ Không thể copy, nhưng sẽ mở Zalo...');
        window.open('https://zalo.me/0327933609', '_blank');
    });
}

// ============ SAVE ORDER TO HISTORY ============
function saveOrderToHistory(subtotal, total, timestamp) {
    try {
        const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        const newOrder = {
            id: Date.now(),
            timestamp: timestamp,
            items: JSON.parse(JSON.stringify(cart)),
            subtotal,
            total,
            notes: notesInput.value,
            status: 'completed'
        };
        
        orders.unshift(newOrder);
        // Keep only last 100 orders
        if (orders.length > 100) orders.splice(100);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
    } catch (err) {
        console.error('Lỗi lưu lịch sử đơn hàng:', err);
    }
}

// ============ COMPLETE ORDER ============
completeOrderBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showNotification('❌ Vui lòng chọn ít nhất 1 món ăn');
        return;
    }
    completeOrderProcess();
});

// ============ EVENT LISTENERS ============
searchInput.addEventListener('input', debouncedFilterMenu);

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

    const savedDrafts = JSON.parse(localStorage.getItem('draftOrders') || '[]');
    const draftData = {
        id: Date.now(),
        timestamp: new Date().toLocaleString('vi-VN'),
        cart: JSON.parse(JSON.stringify(cart)),
        notes: notesInput.value,
        total: document.getElementById('total-price').textContent
    };
    
    savedDrafts.unshift(draftData);
    // Keep only last 10 drafts
    if (savedDrafts.length > 10) savedDrafts.splice(10);
    localStorage.setItem('draftOrders', JSON.stringify(savedDrafts));
    showNotification('✓ Lưu nháp đơn hàng thành công!');
}

function loadOrders() {
    const drafts = JSON.parse(localStorage.getItem('draftOrders') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'saved-orders-modal';
    
    let ordersHTML = '';
    if (drafts.length === 0) {
        ordersHTML = '<div class="saved-orders-empty"><p>Chưa có nháp nào được lưu</p></div>';
    } else {
        ordersHTML = '<div class="saved-orders-list">' + drafts.map((draft, idx) => {
            const totalItems = draft.cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            return `
            <div class="saved-order-item">
                <div class="saved-order-info">
                    <div class="saved-order-date">📅 ${draft.timestamp}</div>
                    <div class="saved-order-total">💰 ${draft.total}</div>
                    <div class="saved-order-items">📦 ${totalItems} món</div>
                    ${draft.notes ? `<div class="saved-order-note">"${draft.notes}"</div>` : ''}
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
        `}).join('') + '</div>';
    }
    
    modal.innerHTML = `
        <div class="saved-orders-content">
            <div class="saved-orders-header">
                <h3>📋 Nháp Đơn Hàng Đã Lưu</h3>
                <button class="saved-orders-close" onclick="this.closest('.saved-orders-modal').remove()">&times;</button>
            </div>
            ${ordersHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function loadOrderData(index) {
    const drafts = JSON.parse(localStorage.getItem('draftOrders') || '[]');
    if (index < 0 || index >= drafts.length) return;
    
    const draft = drafts[index];
    cart = JSON.parse(JSON.stringify(draft.cart));
    notesInput.value = draft.notes || '';
    
    const modal = document.querySelector('.saved-orders-modal');
    if (modal) modal.remove();
    
    updateCartUI();
    showNotification('✓ Nháp đơn hàng đã được tải!');
    cartSection.classList.remove('hidden');
}

function deleteSavedOrder(index) {
    if (!confirm('Bạn chắc chắn muốn xóa nháp này?')) return;
    
    const drafts = JSON.parse(localStorage.getItem('draftOrders') || '[]');
    drafts.splice(index, 1);
    localStorage.setItem('draftOrders', JSON.stringify(drafts));
    loadOrders(); // Reload modal
    showNotification('✓ Nháp đã xóa');
}

const saveOrderBtn = document.getElementById('save-order-btn');
const loadOrderBtn = document.getElementById('load-order-btn');
const viewHistoryBtn = document.getElementById('view-history-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

if (saveOrderBtn) saveOrderBtn.addEventListener('click', saveOrder);
if (loadOrderBtn) loadOrderBtn.addEventListener('click', loadOrders);
if (viewHistoryBtn) viewHistoryBtn.addEventListener('click', viewOrderHistory);
if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

// ============ VIEW ORDER HISTORY ============
function clearCart() {
    if (cart.length === 0) {
        showNotification('❌ Giỏ hàng đã trống');
        return;
    }
    
    if (!confirm('Bạn chắc chắn muốn xóa toàn bộ giỏ hàng?')) return;
    
    cart = [];
    notesInput.value = '';
    updateCartUI();
    showNotification('✓ Giỏ hàng đã được làm trống');
}

function viewOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'order-history-modal';
    
    let historyHTML = '';
    if (orders.length === 0) {
        historyHTML = '<div class="history-empty"><p>Chưa có đơn hàng nào hoàn tất</p></div>';
    } else {
        historyHTML = '<div class="history-list">' + orders.map((order, idx) => `
            <div class="history-item">
                <div class="history-header">
                    <span class="history-id">#${String(order.id).slice(-6)}</span>
                    <span class="history-status">✓ Đã gửi</span>
                </div>
                <div class="history-info">
                    <div class="history-detail">📅 ${order.timestamp}</div>
                    <div class="history-detail">👤 ${order.customerName}</div>
                    <div class="history-detail">📱 ${order.customerPhone}</div>
                    <div class="history-detail">💰 ${(order.total / 1000).toLocaleString('vi-VN')}k</div>
                </div>
                <div class="history-actions">
                    <button class="history-view-btn" onclick="viewOrderDetails(${idx})">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                    <button class="history-copy-btn" onclick="copyOrderInfo(${idx})">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
            </div>
        `).join('') + '</div>';
    }
    
    modal.innerHTML = `
        <div class="history-content">
            <div class="history-header-bar">
                <h3>📋 Lịch Sử Đơn Hàng</h3>
                <button class="history-close" onclick="this.closest('.order-history-modal').remove()">&times;</button>
            </div>
            ${historyHTML}
        </div>
    `;
    
    document.body.appendChild(modal);
}

function viewOrderDetails(index) {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (index < 0 || index >= orders.length) return;
    
    const order = orders[index];
    
    let itemsHTML = order.items.map(item => {
        const qty = item.quantity || 1;
        return `
        <div class="detail-item">
            <span class="detail-item-name">${qty}x ${item.name}</span>
            <span class="detail-item-price">${item.price * qty}k</span>
        </div>
        `;
    }).join('');
    
    const modal = document.createElement('div');
    modal.className = 'order-detail-modal';
    
    modal.innerHTML = `
        <div class="detail-content">
            <div class="detail-header">
                <h3>Chi Tiết Đơn Hàng #${String(order.id).slice(-6)}</h3>
                <button class="detail-close" onclick="this.closest('.order-detail-modal').remove()">&times;</button>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <h4>Thông Tin Khách Hàng</h4>
                    <p><strong>Tên:</strong> ${order.customerName}</p>
                    <p><strong>SĐT:</strong> ${order.customerPhone}</p>
                    <p><strong>Địa chỉ:</strong> ${order.customerAddress}</p>
                </div>
                
                <div class="detail-section">
                    <h4>Các Món Ăn</h4>
                    ${itemsHTML}
                </div>
                
                <div class="detail-section">
                    <h4>Tóm Tắt</h4>
                    <p>Tiền hàng: <strong>${order.subtotal}k</strong></p>
                    ${order.deliveryFee > 0 ? `<p>Phí giao: <strong>${order.deliveryFee}k</strong></p>` : ''}
                    <p>Tổng: <strong>${(order.total / 1000).toLocaleString('vi-VN')}k</strong></p>
                </div>
                
                ${order.notes ? `<div class="detail-section"><h4>Ghi Chú</h4><p>"${order.notes}"</p></div>` : ''}
                
                <div class="detail-section">
                    <p><small>Thời gian: ${order.timestamp}</small></p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyOrderInfo(index) {
    const orders = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    if (index < 0 || index >= orders.length) return;
    
    const order = orders[index];
    let text = `ĐƠN HÀNG #${String(order.id).slice(-6)}\n`;
    text += `${order.timestamp}\n\n`;
    text += `${order.customerName} | ${order.customerPhone}\n`;
    text += `${order.customerAddress}\n\n`;
    text += order.items.map(item => `${item.quantity || 1}x ${item.name}`).join('\n');
    text += `\n\nTổng: ${(order.total / 1000).toLocaleString('vi-VN')}k`;
    
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✓ Đã copy thông tin đơn hàng');
    });
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
    initLazyLoading();
});

// ============ LAZY LOADING IMAGES ============
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        img.classList.remove('lazy-image');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observer all lazy images on page
        document.querySelectorAll('img.lazy-image').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img.lazy-image').forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    }
}
