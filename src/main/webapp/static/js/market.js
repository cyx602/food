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
    displayCategories();
    displayProducts('all');
    checkLoginStatus();
});

// 显示分类
function displayCategories() {
    const container = document.getElementById('categories');

    // 首先添加购物车按钮
    const cartBtn = document.createElement('button');
    cartBtn.className = 'cart-btn';
    cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> 购物车';
    cartBtn.addEventListener('click', showCart);
    container.appendChild(cartBtn);

    // 然后添加其他分类
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = `category ${category.id === 'all' ? 'active' : ''}`;
        categoryElement.textContent = category.name;
        categoryElement.dataset.category = category.id;
        categoryElement.addEventListener('click', function() {
            document.querySelectorAll('.category').forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            displayProducts(this.dataset.category);
        });
        container.appendChild(categoryElement);
    });
}

// 图片加载错误处理
function handleImageError(img) {
    img.onerror = null;
    img.src = 'static/image/default_food.jpg';
}

// 显示商品列表
function displayProducts(category) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    // 根据分类筛选商品
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    // 计算分页信息
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToDisplay = filteredProducts.slice(startIndex, endIndex);
    
    // 清空商品网格
    grid.innerHTML = '';
    
    // 渲染商品
    if (productsToDisplay.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #999;">
                <i class="fas fa-shopping-basket" style="font-size: 60px; margin-bottom: 20px; color: #ddd;"></i>
                <p style="font-size: 18px;">暂无相关商品</p>
            </div>
        `;
    } else {
        productsToDisplay.forEach(product => {
            // 确定库存状态样式
            let stockClass = 'in-stock';
            if (product.stock === 0) {
                stockClass = 'out-of-stock';
            } else if (product.stock < 10) {
                stockClass = 'low-stock';
            }
            
            const productElement = document.createElement('div');
            productElement.className = 'product-card';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image" onerror="handleImageError(this)">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-price">¥${product.price.toFixed(2)}/${product.unit}</div>
                    <div class="stock-info ${stockClass}">
                        ${product.stock === 0 ? '缺货' : product.stock < 10 ? `库存紧张 (${product.stock}件)` : `库存充足 (${product.stock}件)`}
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                        <input type="number" id="quantity-${product.id}" class="quantity-input" value="1" min="1" max="${product.stock}" ${product.stock === 0 ? 'disabled' : ''}>
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
    
    // 生成分页控件
    createProductPagination(totalPages);
}

// 更改商品数量
function changeQuantity(productId, delta) {
    const input = document.getElementById(`quantity-${productId}`);
    const product = products.find(p => p.id === productId);
    if (!input || !product) return;
    
    let newQuantity = parseInt(input.value) + delta;
    newQuantity = Math.max(1, Math.min(product.stock, newQuantity));
    input.value = newQuantity;
}

// 生成分页控件
function createProductPagination(totalPages) {
    const paginationContainer = document.getElementById('productPagination');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // 上一页按钮
    const prevButton = createProductPageButton('上一页', currentPage > 1);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(currentCategory);
        }
    });
    paginationContainer.appendChild(prevButton);
    
    // 页码按钮
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // 第一页按钮
    if (startPage > 1) {
        const firstPageButton = createProductPageButton('1', true);
        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            displayProducts(currentCategory);
        });
        paginationContainer.appendChild(firstPageButton);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }
    
    // 中间页码按钮
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = createProductPageButton(i.toString(), true);
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayProducts(currentCategory);
        });
        paginationContainer.appendChild(pageButton);
    }
    
    // 最后一页按钮
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'pagination-ellipsis';
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
        
        const lastPageButton = createProductPageButton(totalPages.toString(), true);
        lastPageButton.addEventListener('click', () => {
            currentPage = totalPages;
            displayProducts(currentCategory);
        });
        paginationContainer.appendChild(lastPageButton);
    }
    
    // 下一页按钮
    const nextButton = createProductPageButton('下一页', currentPage < totalPages);
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts(currentCategory);
        }
    });
    paginationContainer.appendChild(nextButton);
}

// 创建分页按钮
function createProductPageButton(text, enabled) {
    const button = document.createElement('button');
    button.className = `pagination-btn ${enabled ? '' : 'disabled'}`;
    button.textContent = text;
    if (!enabled) {
        button.disabled = true;
    }
    return button;
}

// 添加到购物车
function addToCart(productId) {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后再添加商品到购物车！');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        alert('商品信息有误，请刷新页面重试');
        return;
    }
    
    if (product.stock === 0) {
        alert('该商品已售罄');
        return;
    }
    
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (quantity > product.stock) {
        alert(`库存不足，最多只能购买${product.stock}件`);
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    // 检查商品是否已在购物车中
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex > -1) {
        // 已存在，更新数量（注意不能超过库存）
        const newQuantity = cart[existingItemIndex].quantity + quantity;
        if (newQuantity <= product.stock) {
            cart[existingItemIndex].quantity = newQuantity;
        } else {
            alert(`库存不足，该商品最多还能购买${product.stock - cart[existingItemIndex].quantity}件`);
            return;
        }
    } else {
        // 不存在，添加新商品
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            unit: product.unit
        });
    }
    
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    alert(`${product.name}已成功添加到购物车！`);
}

// 显示购物车
function showCart() {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后查看购物车！');
        return;
    }
    
    const modal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon"><i class="fas fa-shopping-cart"></i></div>
                <p>购物车空空如也</p>
                <p>快去挑选心仪的食材吧！</p>
            </div>
        `;
        cartTotal.querySelector('span:last-child').textContent = '¥0.00';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-quantity">x${item.quantity}</div>
                <div class="cart-item-price">¥${itemTotal.toFixed(2)}</div>
                <button class="remove-item" onclick="removeFromCart(${index})"><i class="fas fa-trash-alt"></i></button>
            `;
            cartItems.appendChild(itemElement);
        });
        
        cartTotal.querySelector('span:last-child').textContent = `¥${total.toFixed(2)}`;
        checkoutBtn.disabled = false;
    }
    
    modal.style.display = 'flex';
}

// 关闭购物车
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// 从购物车移除商品
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    showCart(); // 重新显示购物车
}

// 结算
function checkout() {
    alert('结算功能即将上线，敬请期待！');
    closeCart();
}

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');

    if (isLoggedIn && authSection) {
        authSection.style.display = 'none';
    }
}
