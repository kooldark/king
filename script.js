// Dữ liệu menu từ hình ảnh, tổ chức thành JSON
const menuData = {
    "GiaiKhat": {
        "name": "Giải Khát",
        "subcategories": {
            "MonAnKem": {
                "name": "Món Ăn Kèm",
                "items": [
                    { "name": "Khăn lanh", "price": "2k / 1 cái", "unit": "cái" },
                    { "name": "Bánh tráng", "price": "4k / 1 cái", "unit": "cái" },
                    { "name": "Bánh mì", "price": "4k / 1 cái", "unit": "cái" },
                    { "name": "Bun", "price": "10k / 1 tô", "unit": "tô" },
                    { "name": "Trái cây", "price": "50k - 100k / 1 loại", "unit": "loại" },
                    { "name": "Phồng tôm", "price": "50k / 1 lon", "unit": "lon" },
                    { "name": "Phụ thu phí v.v nếu không mang", "price": "Bò gà v.v không mang", "unit": "" }
                ]
            },
            "Bia": {
                "name": "Bia",
                "items": [
                    { "name": "Heniken", "price": "22k", "unit": "lon" },
                    { "name": "Tiger", "price": "25k", "unit": "lon" }
                ]
            },
            "NuocNgot": {
                "name": "Nước Ngọt",
                "items": [
                    { "name": "Coca", "price": "10k", "unit": "lon" },
                    { "name": "Redbull Bò Húc", "price": "15k", "unit": "lon" },
                    { "name": "Nước suối", "price": "6k", "unit": "chai" }
                ]
            },
            "Ruou": {
                "name": "Rượu",
                "items": [
                    { "name": "Cao Dê", "price": "80k / 330ml", "unit": "chai" },
                    { "name": "Rượu Chuối", "price": "30k / 330ml", "unit": "chai" },
                    { "name": "Rượu Cốc", "price": "50k / 330ml", "unit": "chai" }
                ]
            }
        }
    },
    "ThitNauKho": {
        "name": "Thịt Nấu Khô",
        "items": [
            { "name": "Thịt lụi ckh", "price": "50k / 1 lạng (kem chén binh)", "unit": "lạng" },
            { "name": "Hủ Sa", "price": "50k / 1 lạng", "unit": "lạng" },
            { "name": "Xào Sa", "price": "50k / 1 lạng (kem chén binh)", "unit": "lạng" },
            { "name": "Xào Lăn", "price": "50k / 1 lạng", "unit": "lạng" },
            { "name": "Xào Hồi", "price": "50k / 1 lạng", "unit": "lạng" },
            { "name": "Thịt Nướng", "price": "50k / 1 lạng", "unit": "lạng" },
            { "name": "Sườn Nướng", "price": "250k / dĩa", "unit": "dĩa" },
            { "name": "Dê 250k", "price": "250k / dĩa", "unit": "dĩa" },
            { "name": "Dĩa 200k", "price": "200k / dĩa", "unit": "dĩa" },
            { "name": "~ no an 100k", "price": "100k / dĩa", "unit": "dĩa" }
        ]
    },
    "TietCanhLongDeNgocDuong": {
        "name": "Tiết Canh, Lòng Dê, Ngọc Dương",
        "items": [
            { "name": "Tiết Canh", "price": "40k / 1 dĩa", "unit": "dĩa" },
            { "name": "Lòng Dê", "price": "250k", "unit": "phần" },
            { "name": "Lòng Lức", "price": "250k", "unit": "phần" },
            { "name": "Lòng Dìa", "price": "250k", "unit": "phần" },
            { "name": "Ngọc Dương", "price": "350k - 450k / thiếu khâu", "unit": "phần" }
        ]
    },
    "ThitDeMonNuoc": {
        "name": "Thịt Dê Món Nước",
        "items": [
            { "name": "Dê Nấu Cừu", "price": "120k / 150k (nhỏ/vừa)", "unit": "nồi", "sizes": ["nhỏ", "vừa", "lớn"] },
            { "name": "Lẩu Dê", "price": "200k (nhỏ), 250k (vừa), 300k (lớn)", "unit": "nồi", "sizes": ["nhỏ", "vừa", "lớn"] },
            { "name": "Dê Nấu Nấm", "price": "120k / 150k (nhỏ/vừa)", "unit": "nồi", "sizes": ["nhỏ", "vừa", "lớn"] },
            { "name": "Dê Nấu Đỗ", "price": "120k / 150k (nhỏ/vừa)", "unit": "nồi", "sizes": ["nhỏ", "vừa", "lớn"] },
            { "name": "Tu Tục", "price": "300k / món", "unit": "món" },
            { "name": "Nia Cừu", "price": "200k / 2 ng binh", "unit": "phần" },
            { "name": "Nia Dê", "price": "200k", "unit": "phần" },
            { "name": "Nia Đậu", "price": "200k", "unit": "phần" },
            { "name": "Nia Hấp", "price": "200k", "unit": "phần" }
        ]
    }
};

// Render menu tree
function renderMenu() {
    const menuSection = document.getElementById('menu-section');
    const ul = document.createElement('ul');
    Object.keys(menuData).forEach(key => {
        const category = menuData[key];
        const li = document.createElement('li');
        li.classList.add('category');
        li.innerHTML = `<span>${category.name}</span>`;
        li.addEventListener('click', () => li.classList.toggle('open'));
        const subUl = document.createElement('ul');
        if (category.subcategories) {
            Object.keys(category.subcategories).forEach(subKey => {
                const subCat = category.subcategories[subKey];
                const subLi = document.createElement('li');
                subLi.innerHTML = `<span>${subCat.name}</span>`;
                const itemUl = document.createElement('ul');
                subCat.items.forEach(item => {
                    const itemLi = document.createElement('li');
                    itemLi.classList.add('item');
                    itemLi.innerHTML = `${item.name} - ${item.price} <button onclick="addToCart('${item.name}', '${item.price}', '${item.unit}')">Thêm</button>`;
                    if (item.sizes) {
                        const select = document.createElement('select');
                        item.sizes.forEach(size => {
                            const option = document.createElement('option');
                            option.value = size;
                            option.text = size;
                            select.add(option);
                        });
                        itemLi.insertBefore(select, itemLi.lastChild);
                    }
                    itemUl.appendChild(itemLi);
                });
                subLi.appendChild(itemUl);
                subUl.appendChild(subLi);
            });
        } else if (category.items) {
            category.items.forEach(item => {
                const itemLi = document.createElement('li');
                itemLi.classList.add('item');
                itemLi.innerHTML = `${item.name} - ${item.price} <button onclick="addToCart('${item.name}', '${item.price}', '${item.unit}')">Thêm</button>`;
                if (item.sizes) {
                    const select = document.createElement('select');
                    item.sizes.forEach(size => {
                        const option = document.createElement('option');
                        option.value = size;
                        option.text = size;
                        select.add(option);
                    });
                    itemLi.insertBefore(select, itemLi.lastChild);
                }
                subUl.appendChild(itemLi);
            });
        }
        li.appendChild(subUl);
        ul.appendChild(li);
    });
    menuSection.appendChild(ul);
}

// Giỏ hàng
let cart = [];
function addToCart(name, price, unit) {
    cart.push({ name, price, unit });
    alert(`${name} đã được thêm vào giỏ hàng.`);
}

function renderCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ${item.price} <button onclick="removeFromCart(${index})">Xóa</button> <button onclick="editCartItem(${index})">Sửa</button>`;
        cartList.appendChild(li);
        // Tính tổng (giả định price là số, loại bỏ 'k' và chuyển sang số)
        const numPrice = parseInt(item.price.replace(/[^0-9]/g, '')) * 1000 || 0;
        total += numPrice;
    });
    document.getElementById('total-price').textContent = total.toLocaleString();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function editCartItem(index) {
    const newName = prompt('Sửa tên món:', cart[index].name);
    const newPrice = prompt('Sửa giá:', cart[index].price);
    if (newName && newPrice) {
        cart[index].name = newName;
        cart[index].price = newPrice;
        renderCart();
    }
}

document.getElementById('view-cart').addEventListener('click', () => {
    document.getElementById('cart-section').classList.toggle('hidden');
    renderCart();
});

document.getElementById('complete-order').addEventListener('click', () => {
    const notes = document.getElementById('notes').value;
    let orderText = 'Đơn hàng:\n';
    cart.forEach(item => {
        orderText += `${item.name} - ${item.price}\n`;
    });
    orderText += `Tổng: ${document.getElementById('total-price').textContent} VND\nGhi chú: ${notes}`;
    navigator.clipboard.writeText(orderText).then(() => {
        alert('Đơn hàng đã được copy vào bộ nhớ đệm. Vui lòng dán vào Zalo để gửi.');
    });
});

// Khởi tạo
renderMenu();