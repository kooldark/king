// ============================================
// ELEGANT RESTAURANT MENU - JavaScript
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

// Menu Data
let menuData = {};
let cart = [];

// ============ FETCH & PROCESS MENU DATA ============
async function fetchMenuData() {
    try {
        const response = await fetch('menu.json');
        const rawData = await response.json();
        const processedMenu = {};
        let currentCategory = null;

        rawData.forEach(item => {
            if (item['Nhóm'] && item['Nhóm'].trim() !== '') {
                currentCategory = item['Nhóm'].trim();
                processedMenu[currentCategory] = {
                    name: currentCategory,
                    items: []
                };
            }

            if (currentCategory && (item['Tên món / Dịch vụ'] || item['Quy cách / Phân loại'] || item['Giá tiền'])) {
                processedMenu[currentCategory].items.push({
                    name: item['Tên món / Dịch vụ'] ? item['Tên món / Dịch vụ'].trim() : '',
                    spec: item['Quy cách / Phân loại'] ? item['Quy cách / Phân loại'].trim() : '',
                    price: item['Giá tiền'] ? item['Giá tiền'].trim() : ''
                });
            }
        });

        return processedMenu;
    } catch (error) {
        console.error('Lỗi tải menu:', error);
        return {};
    }
}

// ============ FORMAT ITEM DETAILS ============
function displayItemDetails(item) {
    let details = item.name;
    if (item.spec) {
        details += ` <span class="spec">(${item.spec})</span>`;
    }
    if (item.price) {
        details += ` <span class="price">- ${item.price}</span>`;
    }
    return details;
}

// ============ RENDER MENU ============
async function renderMenu() {
    menuSection.innerHTML = '<div class="menu-loading"><i class="fas fa-utensils"></i><p>Đang tải menu...</p></div>';
    
    menuData = await fetchMenuData();
    menuSection.innerHTML = '';

    const ul = document.createElement('ul');
    const categories = Object.keys(menuData);

    if (categories.length === 0) {
        menuSection.innerHTML = '<p style="text-align: center; padding: 40px;">Không có menu</p>';
        return;
    }

    categories.forEach(categoryName => {
        const category = menuData[categoryName];
        if (category.items.length > 0) {
            const categoryLi = document.createElement('li');
            categoryLi.classList.add('category');
            
            const categorySpan = document.createElement('span');
            categorySpan.textContent = category.name;
            categoryLi.appendChild(categorySpan);

            const itemUl = document.createElement('ul');
            
            category.items.forEach(item => {
                if (item.name || item.spec || item.price) {
                    const itemLi = document.createElement('li');
                    itemLi.classList.add('item');
                    
                    const itemDiv = document.createElement('div');
                    itemDiv.innerHTML = displayItemDetails(item);
                    
                    const addBtn = document.createElement('button');
                    addBtn.innerHTML = '<i class="fas fa-plus"></i> Thêm';
                    addBtn.addEventListener('click', () => addToCart(item.name, item.price, item.spec));
                    
                    itemLi.appendChild(itemDiv);
                    itemLi.appendChild(addBtn);
                    itemUl.appendChild(itemLi);
                }
            });

            categoryLi.appendChild(itemUl);
            
            // Toggle category open/close
            categorySpan.addEventListener('click', () => {
                categoryLi.classList.toggle('open');
            });

            ul.appendChild(categoryLi);
        }
    });

    menuSection.appendChild(ul);
}

// ============ CART FUNCTIONS ============
function addToCart(name, price, spec) {
    cart.push({ name, price, spec });
    updateCartUI();
    
    // Show brief notification
    showNotification(`${name} đã thêm vào giỏ hàng`);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
    updateCartUI();
}

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
        cartEmpty.style.flexDirection = 'column';
        cartEmpty.style.alignItems = 'center';
    } else {
        cartEmpty.style.display = 'none';
        cartList.innerHTML = '';
        
        let total = 0;
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            const itemSpec = item.spec ? ` <span style="opacity: 0.7;">(${item.spec})</span>` : '';
            
            const priceSpan = document.createElement('span');
            priceSpan.className = 'price';
            priceSpan.style.fontWeight = '600';
            priceSpan.textContent = item.price;
            
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
            removeBtn.style.background = '#E74C3C';
            removeBtn.style.color = 'white';
            removeBtn.style.border = 'none';
            removeBtn.style.padding = '6px 12px';
            removeBtn.style.borderRadius = '4px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.fontSize = '0.8em';
            removeBtn.addEventListener('click', () => removeFromCart(index));
            
            li.innerHTML = `<span>${item.name}${itemSpec}</span>`;
            li.appendChild(removeBtn);
            cartList.appendChild(li);
            
            // Calculate total
            const priceMatch = item.price.match(/(\d+)k/);
            if (priceMatch) {
                total += parseInt(priceMatch[1]) * 1000;
            } else {
                const simplePriceMatch = item.price.match(/(\d+)/);
                if (simplePriceMatch) {
                    total += parseInt(simplePriceMatch[1]);
                }
            }
        });
        
        document.getElementById('total-price').textContent = total.toLocaleString('vi-VN');
    }
}

// ============ SEARCH FUNCTIONALITY ============
function filterMenu() {
    const searchTerm = searchInput.value.toLowerCase();
    const categories = document.querySelectorAll('.category');
    
    categories.forEach(category => {
        const categoryName = category.querySelector('span').textContent.toLowerCase();
        const items = category.querySelectorAll('.item');
        let hasVisibleItems = false;
        
        if (categoryName.includes(searchTerm)) {
            category.style.display = 'block';
            hasVisibleItems = true;
        } else {
            let foundInItems = false;
            items.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                if (itemText.includes(searchTerm)) {
                    item.style.display = 'flex';
                    foundInItems = true;
                    hasVisibleItems = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            if (foundInItems) {
                category.style.display = 'block';
                category.classList.add('open');
            } else {
                category.style.display = 'none';
            }
        }
    });
}

// ============ NOTIFICATION ============
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

// ============ CART MODAL CONTROL ============
viewCartBtn.addEventListener('click', () => {
    cartSection.classList.toggle('hidden');
});

closeCartBtn.addEventListener('click', () => {
    cartSection.classList.add('hidden');
});

// Close cart when clicking outside
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

    let orderText = '========== ĐƠN HÀNG KING ==========\n\n';
    let total = 0;

    cart.forEach(item => {
        const itemSpec = item.spec ? ` (${item.spec})` : '';
        orderText += `🍖 ${item.name}${itemSpec}\n   Giá: ${item.price}\n\n`;
        
        const priceMatch = item.price.match(/(\d+)k/);
        if (priceMatch) {
            total += parseInt(priceMatch[1]) * 1000;
        }
    });

    orderText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    orderText += `💰 TỔNG TIỀN: ${total.toLocaleString('vi-VN')} VND\n`;
    orderText += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (notesInput.value.trim()) {
        orderText += `📝 Ghi chú: ${notesInput.value}\n\n`;
    }

    orderText += `Nhà hàng KING - Tinh hoa ẩm thực Đông Bắc\n`;
    orderText += `☎️ Gọi: 0123456789`;

    navigator.clipboard.writeText(orderText).then(() => {
        showNotification('✓ Đơn hàng đã copy! Dán vào Zalo để gửi');
        setTimeout(() => {
            cart = [];
            notesInput.value = '';
            updateCartUI();
            cartSection.classList.add('hidden');
        }, 1500);
    }).catch(err => {
        console.error('Lỗi copy:', err);
        alert('Không thể copy đơn hàng. Vui lòng thử lại!');
    });
});

// ============ SEARCH EVENT ============
searchInput.addEventListener('input', filterMenu);

// ============ KEYBOARD SHORTCUTS ============
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        cartSection.classList.add('hidden');
    }
});

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', () => {
    renderMenu();
});

// Add animation styles
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
    
    .spec {
        font-size: 0.9em;
        color: #888;
        font-weight: 400;
    }
    
    .price {
        color: var(--primary, #8B3A3A);
        font-weight: 600;
    }
`;
document.head.appendChild(style);
