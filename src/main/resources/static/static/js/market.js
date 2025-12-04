// src/main/resources/static/static/js/market.js

// 全局变量
let products = [];
let currentPage = 1;
const productsPerPage = 8;
let currentCategory = 'all';

// 数据库 category_id 到前端 code 的映射
// 对应 food_db_ingredient_categories.sql 的数据
const categoryMap = {
    1: 'vegetables',
    2: 'meat',
    3: 'seafood',
    4: 'dairy',
    5: 'seasoning',
    6: 'fruits',
    7: 'staple'
};

// 前端显示的分类标签配置
const categories = [
    { id: "all", name: "全部食材" },
    { id: "vegetables", name: "新鲜蔬菜" },
    { id: "meat", name: "肉类禽蛋" },
    { id: "seafood", name: "海鲜水产" },
    { id: "dairy", name: "奶制品" },
    { id: "seasoning", name: "调味品" },
    { id: "fruits", name: "水果" },
    { id: "staple", name: "主食粮油" }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', async function() {
    console.log("Market page loaded");

    // 1. 显示分类标签
    displayCategories();

    // 2. 从数据库加载商品数据
    await loadProductsFromDB();

    // 3. 检查登录状态
    checkLoginStatus();
});

// 从后端获取所有食材数据
async function loadProductsFromDB() {
    const grid = document.getElementById('productsGrid');

    try {
        // 调用 CommonController 中的接口
        const res = await fetch('/api/common/ingredients');

        if (res.ok) {
            const data = await res.json();

            // 映射后端数据到前端格式
            products = data.map(item => ({
                id: item.id,
                name: item.name,
                // 将数据库的 categoryId 转换为前端的 category code
                category: categoryMap[item.categoryId] || 'other',
                price: item.price,
                image: item.image || 'static/image/default_food.jpg',
                unit: item.unit,
                stock: item.stock
            }));

            // 数据加载完成后显示第一页
            displayProducts('all');
        } else {
            console.error("获取食材失败:", res.status);
            grid.innerHTML = '<p style="text-align:center; padding:20px; color:red;">数据加载失败，请刷新重试</p>';
        }
    } catch (e) {
        console.error("网络错误:", e);
        grid.innerHTML = '<p style="text-align:center; padding:20px; color:red;">网络连接异常</p>';
    }
}

// 显示分类及功能按钮
function displayCategories() {
    const container = document.getElementById('categories');
    if (!container) return;
    container.innerHTML = '';

    // 1. 【购物清单】按钮
    const listBtn = document.createElement('button');
    listBtn.className = 'cart-btn';
    listBtn.style.backgroundColor = '#f7941e';
    listBtn.style.borderColor = '#dc831b';
    listBtn.style.marginRight = '10px';
    listBtn.innerHTML = '<i class="fas fa-clipboard-list"></i> 待买清单';
    listBtn.onclick = showShoppingList;
    container.appendChild(listBtn);

    // 2. 【购物车】按钮
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn';
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> 购物车';
    cartBtn.onclick = showCart;
    container.appendChild(cartBtn);

    // 3. 分类标签
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = `category ${category.id === 'all' ? 'active' : ''}`;
        categoryElement.textContent = category.name;
        categoryElement.dataset.category = category.id;
        categoryElement.onclick = function() {
            document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            displayProducts(this.dataset.category);
        };
        container.appendChild(categoryElement);
    });
}

// 显示商品列表
function displayProducts(category) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    // 筛选
    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);

    // 分页计算
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (currentPage > totalPages && totalPages > 0) {
        currentPage = 1;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

    grid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-shopping-basket" style="font-size: 60px; margin-bottom: 20px; color: #ddd;"></i>
                <p style="font-size: 18px;">暂无相关商品</p>
            </div>
        `;
        createProductPagination(0);
    } else {
        productsToDisplay.forEach(product => {
            let stockClass = 'in-stock';
            if (product.stock === 0) stockClass = 'out-of-stock';
            else if (product.stock < 10) stockClass = 'low-stock';

            const productElement = document.createElement('div');
            productElement.className = 'product-card common-card-style';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='static/image/default_food.jpg'">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">¥${product.price.toFixed(2)}/${product.unit}</div>
                    <div class="stock-info ${stockClass}">
                        ${product.stock === 0 ? '缺货' : product.stock < 10 ? `库存紧张 (${product.stock}件)` : `库存充足 (${product.stock}件)`}
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <input type="number" id="quantity-${product.id}" class="quantity-input" aria-label="购买数量" value="1" min="1" max="${product.stock}" ${product.stock === 0 ? 'disabled' : ''}>
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? '已售罄' : '加入购物车'}
                    </button>
                </div>
            `;
            grid.appendChild(productElement);
        });
        createProductPagination(totalPages);
    }
}

// 更改数量
function changeQuantity(productId, delta) {
    const input = document.getElementById(`quantity-${productId}`);
    const product = products.find(p => p.id === productId);
    if (!input || !product) return;
    let newQuantity = parseInt(input.value) + delta;
    newQuantity = Math.max(1, Math.min(product.stock, newQuantity));
    input.value = newQuantity;
}

// 分页逻辑
function createProductPagination(totalPages) {
    const container = document.getElementById('productPagination');
    if (!container) return;
    container.innerHTML = '';

    if (totalPages <= 1) return;

    // 首页
    const firstPageBtn = document.createElement('button');
    firstPageBtn.className = 'pagination-btn';
    firstPageBtn.textContent = '首页';
    firstPageBtn.disabled = currentPage === 1;
    firstPageBtn.onclick = () => {
        currentPage = 1;
        displayProducts(currentCategory);
    };
    container.appendChild(firstPageBtn);

    // 上一页
    const prevPageBtn = document.createElement('button');
    prevPageBtn.className = 'pagination-btn';
    prevPageBtn.textContent = '上一页';
    prevPageBtn.disabled = currentPage === 1;
    prevPageBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(currentCategory);
        }
    };
    container.appendChild(prevPageBtn);

    // 页码
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            displayProducts(currentCategory);
        };
        container.appendChild(btn);
    }

    // 下一页
    const nextPageBtn = document.createElement('button');
    nextPageBtn.className = 'pagination-btn';
    nextPageBtn.textContent = '下一页';
    nextPageBtn.disabled = currentPage === totalPages;
    nextPageBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(currentCategory);
        }
    };
    container.appendChild(nextPageBtn);

    // 末页
    const lastPageBtn = document.createElement('button');
    lastPageBtn.className = 'pagination-btn';
    lastPageBtn.textContent = '末页';
    lastPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.onclick = () => {
        currentPage = totalPages;
        displayProducts(currentCategory);
    };
    container.appendChild(lastPageBtn);
}

// 添加到购物车
async function addToCart(productId) {
    const qtyInput = document.getElementById(`quantity-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientId: productId, quantity: quantity })
        });

        if (res.status === 401) {
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }

        const data = await res.json();
        if (data.success) {
            alert('✅ 已添加到购物车！');
        } else {
            alert('添加失败: ' + data.message);
        }
    } catch (e) {
        console.error(e);
        alert('网络错误或未登录');
    }
}

// 显示购物车
async function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');

    if(!modal) return;

    modal.style.display = 'flex';
    cartItemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">正在加载购物车...</p>';

    try {
        const res = await fetch('/api/cart/list');
        if (res.status === 401) {
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const cartItems = await res.json();
        renderCart(cartItems);
    } catch (e) {
        console.error("加载购物车出错:", e);
        cartItemsDiv.innerHTML = `<div style="text-align:center; color:red;">加载失败</div>`;
    }
}

function renderCart(cartItems) {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (!cartItems || cartItems.length === 0) {
        cartItemsDiv.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon"><i class="fas fa-shopping-cart"></i></div>
                <p>购物车空空如也</p>
            </div>`;
        if(cartTotal) cartTotal.querySelector('span:last-child').textContent = '¥0.00';
        if(checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = '';

    cartItems.forEach(item => {
        const price = item.price || 0;
        const qty = item.quantity || 0;
        const itemTotal = price * qty;
        total += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-name">${item.ingredientName || '未知商品'}</div>
            <div class="cart-item-quantity">x${qty}</div>
            <div class="cart-item-price">¥${itemTotal.toFixed(2)}</div>
            <button class="remove-item" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
        `;
        cartItemsDiv.appendChild(div);
    });

    if(cartTotal) cartTotal.querySelector('span:last-child').textContent = `¥${total.toFixed(2)}`;
    if(checkoutBtn) checkoutBtn.disabled = false;
}

// 购物清单相关逻辑
function showShoppingList() {
    const modal = document.getElementById('listModal');
    if (modal) {
        modal.style.display = 'flex';
        loadShoppingList();
    }
}

function closeShoppingList() {
    const modal = document.getElementById('listModal');
    if (modal) modal.style.display = 'none';
}

async function loadShoppingList() {
    try {
        const res = await fetch('/api/shopping-list/list');
        if(res.status === 401) {
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }
        const list = await res.json();
        renderShoppingList(list);
    } catch(e) { console.error(e); }
}

function renderShoppingList(list) {
    const todoContainer = document.getElementById('todoListItems');
    const boughtContainer = document.getElementById('boughtListItems');
    if(!todoContainer || !boughtContainer) return;

    todoContainer.innerHTML = '';
    boughtContainer.innerHTML = '';

    if(list.length === 0) {
        todoContainer.innerHTML = '<div style="text-align:center; color:#999; padding:20px;">清单空空如也</div>';
        return;
    }

    list.forEach(item => {
        const checkColor = item.isBought ? '#8cc63f' : 'transparent';
        const borderColor = item.isBought ? '#8cc63f' : '#ddd';
        const textColor = item.isBought ? '#999' : '#333';
        const textDecor = item.isBought ? 'line-through' : 'none';
        const displayCheck = item.isBought ? 'block' : 'none';

        const html = `
            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed #eee;">
                <div onclick="toggleListStatus(${item.id}, ${!item.isBought})" 
                     style="width: 22px; height: 22px; border: 2px solid ${borderColor}; border-radius: 50%; margin-right: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; background-color: ${checkColor}; transition: 0.2s;">
                    <i class="fas fa-check" style="font-size: 12px; color: white; display: ${displayCheck}"></i>
                </div>
                <span style="flex: 1; font-size: 16px; color: ${textColor}; text-decoration: ${textDecor};">${item.name}</span>
                ${item.quantity ? `<span style="background: #f0f0f0; padding: 2px 8px; border-radius: 10px; font-size: 12px; color: #666; margin-right: 10px;">${item.quantity}</span>` : ''}
                <button onclick="deleteListItem(${item.id})" style="color: #ff6b6b; border: none; background: none; cursor: pointer; font-size: 16px;"><i class="fas fa-times"></i></button>
            </div>
        `;
        if(item.isBought) boughtContainer.insertAdjacentHTML('beforeend', html);
        else todoContainer.insertAdjacentHTML('beforeend', html);
    });
}

async function addListItem() {
    const nameInput = document.getElementById('listNewItem');
    const qtyInput = document.getElementById('listNewQty');
    const name = nameInput.value.trim();
    const quantity = qtyInput.value.trim();

    if(!name) return;

    await fetch('/api/shopping-list/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name, quantity })
    });

    nameInput.value = '';
    qtyInput.value = '';
    loadShoppingList();
}

async function toggleListStatus(id, isBought) {
    await fetch('/api/shopping-list/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, isBought })
    });
    loadShoppingList();
}

async function deleteListItem(id) {
    await fetch('/api/shopping-list/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id })
    });
    loadShoppingList();
}

async function clearBoughtList() {
    if(!confirm('确定清空所有已买物品吗？')) return;
    await fetch('/api/shopping-list/clear-bought', { method: 'POST' });
    loadShoppingList();
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

async function removeFromCart(cartId) {
    if(!confirm('确定移除该商品吗？')) return;
    try {
        await fetch('/api/cart/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cartId })
        });
        showCart();
    } catch(e) { alert('删除失败'); }
}

async function checkout() {
    if (!confirm('确认下单结算吗？')) return;
    try {
        const res = await fetch('/api/order/checkout', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
            alert('下单成功！');
            closeCart();
            window.location.href = 'profile.html';
        } else {
            alert(data.message || '结算失败');
        }
    } catch (e) { alert('网络错误'); }
}

function checkLoginStatus() {
    const userJson = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');

    if (userJson && authSection) {
        const user = JSON.parse(userJson);
        const avatarPath = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';
        authSection.innerHTML = `
            <a href="profile.html" style="display:flex; align-items:center; padding: 5px;">
                <img src="${avatarPath}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                     onerror="this.src='static/image/default_avatar.jpg'">
            </a>
        `;
        authSection.style.backgroundColor = 'transparent';
        const registerButton = document.getElementById('registerButton');
        if (registerButton) registerButton.style.display = 'none';
    }
}