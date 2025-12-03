// 推荐菜品数据
const featuredRecipes = [
    {
        id: 101,
        title: "新手零失败 - 网友推荐番茄炒蛋",
        cuisine: "chinese",
        difficulty: "简单",
        time: "15分钟",
        image: "static/image/番茄炒蛋.png",
        description: "国民家常菜，酸甜可口，营养丰富，最适合厨房新手入门",
        ingredients: [
            "鸡蛋 3个",
            "番茄 2个",
            "小葱 2根",
            "糖 1茶匙",
            "盐 适量",
            "食用油 2汤匙",
            "番茄酱 1汤匙（可选）"
        ],
        steps: [
            "番茄洗净，顶部划十字，用开水烫一下去皮，切块备用",
            "鸡蛋打入碗中，加少许盐打散",
            "小葱切葱花，葱白和葱绿分开",
            "热锅凉油，倒入蛋液，用筷子快速划散，炒至八成熟盛出",
            "锅中再加少许油，爆香葱白",
            "加入番茄块，中火翻炒至出汁",
            "加入糖和盐调味，可加一勺番茄酱增加风味",
            "倒入炒好的鸡蛋，快速翻炒均匀",
            "撒上葱绿，出锅装盘"
        ]
    },
    {
        id: 102,
        title: "健康低脂 - 香煎鸡胸肉",
        cuisine: "western",
        difficulty: "简单",
        time: "20分钟",
        image: "static/image/香煎鸡胸肉.png",
        description: "健身人士最爱，肉质鲜嫩多汁，告别干柴鸡胸肉",
        ingredients: [
            "鸡胸肉 1块（约200g）",
            "橄榄油 1汤匙",
            "黑胡椒 适量",
            "盐 适量",
            "蒜粉 1茶匙",
            "迷迭香 少许",
            "柠檬 半个"
        ],
        steps: [
            "鸡胸肉横切成两片薄片，用刀背轻轻拍松",
            "两面均匀撒上盐、黑胡椒、蒜粉，按摩入味",
            "腌制15分钟（时间充裕可冷藏腌制更久）",
            "平底锅预热，刷一层橄榄油",
            "放入鸡胸肉，中火煎2-3分钟",
            "翻面，撒上迷迭香，再煎2-3分钟",
            "用筷子戳最厚处，能轻松穿透且流出清澈汁水即可",
            "挤上柠檬汁，静置2分钟再切块"
        ]
    },
    {
        id: 103,
        title: "快手早餐 - 香蕉松饼",
        cuisine: "dessert",
        difficulty: "简单",
        time: "25分钟",
        image: "static/image/香蕉松饼.png",
        description: "无需打发，零技巧松饼，香甜松软，孩子超爱吃",
        ingredients: [
            "香蕉 2根（熟透的）",
            "鸡蛋 2个",
            "牛奶 120ml",
            "面粉 150g",
            "泡打粉 1茶匙",
            "糖 2汤匙",
            "盐 一小撮",
            "黄油 适量",
            "蜂蜜 适量",
            "水果 适量（装饰用）"
        ],
        steps: [
            "香蕉用叉子压成泥状",
            "加入鸡蛋、牛奶，搅拌均匀",
            "筛入面粉、泡打粉，加入糖和盐",
            "轻轻搅拌至无干粉即可（不要过度搅拌）",
            "平底锅小火预热，刷薄薄一层黄油",
            "舀一勺面糊倒入锅中，自然形成圆形",
            "表面出现小气泡时翻面",
            "另一面煎至金黄即可出锅",
            "搭配蜂蜜和喜欢的水果享用"
        ]
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedRecipes();
    checkLoginStatus();
});

// 显示推荐菜品
function displayFeaturedRecipes() {
    const container = document.getElementById('featuredRecipes');
    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';

    featuredRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'featured-recipe common-card-style';
        
        // 构建操作按钮HTML
        let actionButtonsHtml = `
                            <button class="favorite-btn" onclick="addToFavorites(${recipe.id})"><i class="fas fa-heart"></i> 收藏食谱
                            </button>
                            <button class="buy-ingredients-btn" onclick="buyIngredients(${recipe.id})"><i class="fas fa-shopping-cart"></i> 购买食材
                            </button>`;
        
        // 如果是管理员，添加删除按钮
        if (isAdmin) {
            actionButtonsHtml += `
                            <button class="delete-btn" onclick="deleteRecipe(${recipe.id}); event.stopPropagation();"><i class="fas fa-trash"></i> 删除
                            </button>`;
        }
        
        recipeElement.innerHTML = `
                   <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="handleImageError(this)">
                    <div class="recipe-content">
                        <h2 class="recipe-title">${recipe.title}</h2>
                        <div class="recipe-meta">
                            <span><i class="fas fa-clock"></i> ${recipe.time}</span> |
                            <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span> |
                            <span><i class="fas fa-utensils"></i> ${getCuisineName(recipe.cuisine)}</span>
                        </div>
                        <p class="recipe-desc">${recipe.description}</p>

                        <div class="ingredients-section">
                            <h3 class="section-title">所需食材</h3>
                            <ul class="ingredients-list">
                                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                            </ul>
                        </div>

                        <div class="steps-section">
                            <h3 class="section-title">详细步骤</h3>
                            <ol class="steps-list">
                                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>

                        <div class="action-buttons">
                            ${actionButtonsHtml}
                        </div>
                    </div>
                `;
        // 点击整个食谱卡片的处理
        recipeElement.addEventListener('click', function(e) {
             // 避免点击按钮时重复添加
         });
        container.appendChild(recipeElement);
    });
}

// 获取菜系名称
function getCuisineName(cuisine) {
    const names = {
        'chinese': '中餐',
        'western': '西餐',
        'japanese': '日料',
        'korean': '韩式',
        'thai': '泰式',
        'dessert': '甜点'
    };
    return names[cuisine] || cuisine;
}

// 添加到收藏
function addToFavorites(recipeId) {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后再收藏食谱！');
        return;
    }
    
    const recipe = featuredRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    let favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
    if (!favorites.find(fav => fav.id === recipeId)) {
        favorites.push(recipe);
        localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
        alert('食谱已添加到收藏！');
    } else {
        alert('该食谱已经在您的收藏中了！');
    }
}

// 功能已移除

// 购买食材
function buyIngredients(recipeId) {
    // 检查登录状态
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后再购买食材！');
        return;
    }
    
    const recipe = featuredRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    // 功能已移除

    // 将食材添加到购物车
    let cart = JSON.parse(localStorage.getItem('shoppingCart') || '[]');
    recipe.ingredients.forEach(ingredient => {
        const item = {
            name: ingredient.split(' ')[1] || ingredient,
            quantity: ingredient.split(' ')[0],
            price: Math.random() * 10 + 5, // 模拟价格
            recipe: recipe.title
        };
        cart.push(item);
    });

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    alert('食材已添加到购物车！');

    // 跳转到食材商城
    window.location.href = 'market.html';
}

// 检查登录状态
function checkLoginStatus() {
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');

    if (isLoggedIn && authSection) {
        authSection.style.display = 'none';
    }
    
    // 管理员状态检查
    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';
    console.log('管理员状态:', isAdmin);
}

// 删除食谱函数
function deleteRecipe(recipeId) {
    // 确认是否是管理员
    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isAdmin) {
        alert('只有管理员才能删除食谱！');
        return;
    }
    
    // 确认删除
    if (confirm('确定要删除这个食谱吗？此操作不可撤销。')) {
        // 从推荐菜品数组中移除
        const recipeIndex = featuredRecipes.findIndex(recipe => recipe.id === recipeId);
        
        if (recipeIndex !== -1) {
            featuredRecipes.splice(recipeIndex, 1);
            // 刷新显示
            displayFeaturedRecipes();
            alert('食谱已成功删除！');
        } else {
            alert('未找到该食谱！');
        }
    }
}

// 图片错误处理函数
function handleImageError(img) {
    img.onerror = null;
    img.src = 'static/image/default_food.jpg';
}