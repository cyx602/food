// 食材数据 - 添加更多常见食材
const products = [
    // 蔬菜类
    { id: 1, name: "新鲜番茄", category: "vegetables", price: 8.5, image: "static/image/新鲜番茄.png", unit: "500g", stock: 50 },
    { id: 2, name: "有机黄瓜", category: "vegetables", price: 6.8, image: "static/image/有机黄瓜.png", unit: "500g", stock: 45 },
    { id: 3, name: "胡萝卜", category: "vegetables", price: 4.5, image: "static/image/胡萝卜.png", unit: "500g", stock: 60 },
    { id: 4, name: "土豆", category: "vegetables", price: 3.8, image: "static/image/土豆.png", unit: "500g", stock: 80 },
    { id: 5, name: "洋葱", category: "vegetables", price: 5.2, image: "static/image/洋葱.png", unit: "500g", stock: 55 },
    { id: 22, name: "青椒", category: "vegetables", price: 7.5, image: "static/image/青椒.png", unit: "500g", stock: 40 },
    { id: 23, name: "菠菜", category: "vegetables", price: 6.2, image: "static/image/菠菜.png", unit: "500g", stock: 35 },
    { id: 24, name: "西兰花", category: "vegetables", price: 9.8, image: "static/image/西兰花.png", unit: "500g", stock: 30 },
    { id: 25, name: "大白菜", category: "vegetables", price: 3.5, image: "static/image/大白菜.png", unit: "500g", stock: 65 },
    { id: 26, name: "芹菜", category: "vegetables", price: 5.8, image: "static/image/芹菜.png", unit: "500g", stock: 25 },

    // 肉类
    { id: 6, name: "鸡胸肉", category: "meat", price: 25.8, image: "static/image/鸡胸肉.png", unit: "500g", stock: 30 },
    { id: 7, name: "猪里脊", category: "meat", price: 32.5, image: "static/image/猪里脊.png", unit: "500g", stock: 25 },
    { id: 8, name: "牛肉片", category: "meat", price: 48.9, image: "static/image/牛肉片.png", unit: "500g", stock: 20 },
    { id: 9, name: "三文鱼", category: "meat", price: 68.0, image: "static/image/三文鱼.png", unit: "300g", stock: 15 },
    { id: 27, name: "鸡翅", category: "meat", price: 28.5, image: "static/image/鸡翅.png", unit: "500g", stock: 35 },
    { id: 28, name: "猪五花肉", category: "meat", price: 35.8, image: "static/image/猪五花肉.png", unit: "500g", stock: 28 },
    { id: 29, name: "牛排", category: "meat", price: 59.9, image: "static/image/牛排.png", unit: "300g", stock: 18 },
    { id: 30, name: "羊肉片", category: "meat", price: 52.5, image: "static/image/羊肉片.png", unit: "500g", stock: 22 },

    // 蛋奶类
    { id: 10, name: "新鲜鸡蛋", category: "dairy", price: 12.8, image: "static/image/新鲜鸡蛋.png", unit: "30个", stock: 100 },
    { id: 11, name: "纯牛奶", category: "dairy", price: 8.5, image: "static/image/纯牛奶.png", unit: "1L", stock: 60 },
    { id: 12, name: "黄油", category: "dairy", price: 15.9, image: "static/image/黄油.png", unit: "200g", stock: 40 },
    { id: 31, name: "酸奶", category: "dairy", price: 6.8, image: "static/image/酸奶.png", unit: "200g", stock: 55 },
    { id: 32, name: "奶酪", category: "dairy", price: 22.5, image: "static/image/奶酪.png", unit: "200g", stock: 30 },
    { id: 33, name: "淡奶油", category: "dairy", price: 18.9, image: "static/image/淡奶油.png", unit: "250ml", stock: 25 },

    // 调味品
    { id: 13, name: "生抽", category: "seasoning", price: 12.8, image: "static/image/生抽.png", unit: "500ml", stock: 80 },
    { id: 14, name: "老抽", category: "seasoning", price: 10.5, image: "static/image/老抽.png", unit: "500ml", stock: 70 },
    { id: 15, name: "香醋", category: "seasoning", price: 8.9, image: "static/image/香醋.png", unit: "500ml", stock: 65 },
    { id: 16, name: "料酒", category: "seasoning", price: 9.8, image: "static/image/料酒.png", unit: "500ml", stock: 75 },
    { id: 17, name: "白糖", category: "seasoning", price: 6.5, image: "static/image/白糖.png", unit: "500g", stock: 90 },
    { id: 18, name: "食盐", category: "seasoning", price: 3.5, image: "static/image/食盐.png", unit: "500g", stock: 95 },
    { id: 34, name: "蚝油", category: "seasoning", price: 11.5, image: "static/image/蚝油.png", unit: "500g", stock: 60 },
    { id: 35, name: "芝麻油", category: "seasoning", price: 15.8, image: "static/image/芝麻油.png", unit: "200ml", stock: 45 },
    { id: 36, name: "辣椒酱", category: "seasoning", price: 8.9, image: "static/image/辣椒酱.png", unit: "300g", stock: 50 },

    // 水果类
    { id: 19, name: "香蕉", category: "fruits", price: 6.8, image: "static/image/香蕉.png", unit: "500g", stock: 40 },
    { id: 20, name: "苹果", category: "fruits", price: 9.9, image: "static/image/苹果.png", unit: "500g", stock: 55 },
    { id: 21, name: "柠檬", category: "fruits", price: 12.5, image: "static/image/柠檬.png", unit: "500g", stock: 30 },
    { id: 37, name: "橙子", category: "fruits", price: 11.8, image: "static/image/橙子.png", unit: "500g", stock: 48 },
    { id: 38, name: "葡萄", category: "fruits", price: 15.9, image: "static/image/葡萄.png", unit: "500g", stock: 35 },
    { id: 39, name: "草莓", category: "fruits", price: 22.5, image: "static/image/草莓.png", unit: "500g", stock: 20 },
    { id: 40, name: "西瓜", category: "fruits", price: 8.9, image: "static/image/西瓜.png", unit: "个", stock: 25 },

    // 新增分类：主食类
    { id: 41, name: "大米", category: "staple", price: 6.5, image: "static/image/大米.png", unit: "1kg", stock: 120 },
    { id: 42, name: "面粉", category: "staple", price: 5.8, image: "static/image/面粉.png", unit: "1kg", stock: 110 },
    { id: 43, name: "面条", category: "staple", price: 8.2, image: "static/image/面条.png", unit: "500g", stock: 85 },
    { id: 44, name: "意大利面", category: "staple", price: 12.5, image: "static/image/意大利面.png", unit: "500g", stock: 60 },

    // 新增分类：海鲜类
    { id: 45, name: "虾仁", category: "seafood", price: 45.8, image: "static/image/虾仁.png", unit: "500g", stock: 25 },
    { id: 46, name: "鱿鱼", category: "seafood", price: 38.9, image: "static/image/鱿鱼.png", unit: "500g", stock: 20 },
    { id: 47, name: "带鱼", category: "seafood", price: 32.5, image: "static/image/带鱼.png", unit: "500g", stock: 18 },
    { id: 48, name: "蛤蜊", category: "seafood", price: 18.9, image: "static/image/蛤蜊.png", unit: "500g", stock: 15 }
];


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

// 分页相关变量
let currentPage = 1;
const productsPerPage = 8;
let currentCategory = 'all';

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    console.log("Market page loaded"); // 调试日志
    displayCategories();
    displayProducts('all');
    checkLoginStatus();
});

// 显示分类及功能按钮（修复按钮显示问题）
function displayCategories() {
    const container = document.getElementById('categories');
    if (!container) {
        console.error("找不到分类容器 #categories");
        return;
    }
    container.innerHTML = '';

    // 1. 【购物清单】按钮
    const listBtn = document.createElement('button');
    listBtn.className = 'cart-btn';
    listBtn.style.backgroundColor = '#3498db'; // 蓝色
    listBtn.style.borderColor = '#2980b9';
    listBtn.style.marginRight = '10px';
    listBtn.innerHTML = '<i class="fas fa-clipboard-list"></i> 待买清单';
    listBtn.onclick = function() {
        window.location.href = 'shopping_list.html';
    };
    container.appendChild(listBtn);

    // 2. 【购物车】按钮
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn';
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> 购物车';
    cartBtn.onclick = showCart; // 绑定事件
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

// 显示商品列表 (保持逻辑不变)
function displayProducts(category) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filteredProducts = category === 'all'
        ? products
        : products.filter(product => product.category === category);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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
    } else {
        productsToDisplay.forEach(product => {
            let stockClass = 'in-stock';
            if (product.stock === 0) stockClass = 'out-of-stock';
            else if (product.stock < 10) stockClass = 'low-stock';

            const productElement = document.createElement('div');
            productElement.className = 'product-card';
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
    }
    createProductPagination(totalPages);
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

    // 简单分页实现
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            currentPage = i;
            displayProducts(currentCategory);
        };
        container.appendChild(btn);
    }
}

// 添加到购物车
async function addToCart(productId) {
    // 获取当前数量
    const qtyInput = document.getElementById(`quantity-${productId}`);
    const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

    try {
        const res = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredientId: productId, quantity: quantity })
        });

        // 先检查状态码
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

// 显示购物车（修复加载失败问题）
async function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsDiv = document.getElementById('cartItems');

    if(!modal) {
        console.error("Cart modal not found");
        return;
    }

    modal.style.display = 'flex';
    cartItemsDiv.innerHTML = '<p style="text-align:center; padding:20px;">正在加载购物车...</p>';

    try {
        const res = await fetch('/api/cart/list');

        // 1. 优先处理未登录
        if (res.status === 401) {
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }

        // 2. 检查响应是否正常
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        // 3. 尝试解析 JSON
        const cartItems = await res.json();
        renderCart(cartItems);

    } catch (e) {
        console.error("加载购物车出错:", e);
        cartItemsDiv.innerHTML = `
            <div style="text-align:center; color:red; padding:20px;">
                <p>加载失败</p>
                <button class="btn btn-sm" onclick="showCart()">重试</button>
            </div>`;
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
        // 容错处理：防止数据缺失导致计算错误
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

// 其他辅助函数
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
        showCart(); // 刷新
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
    const authSection = document.getElementById('authSection');
    // 简单通过 sessionStorage 判断 UI 显示，实际权限由后端控制
    if (sessionStorage.getItem('currentUser') && authSection) {
        authSection.style.display = 'none';
    }
}



