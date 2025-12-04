// src/main/resources/static/static/js/recommendation.js

// 推荐菜品数据 (已补全)
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
    // 如果找不到容器，直接返回
    if (!container) return;

    // 清空容器，防止重复添加
    container.innerHTML = '';

    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';

    featuredRecipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'featured-recipe common-card-style';

        // 构建操作按钮HTML (统一使用 favorite-btn 和 add-list-btn 类名)
        let actionButtonsHtml = `
            <button class="favorite-btn" onclick="addToFavorites(${recipe.id})" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #f7941e; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-heart"></i> 收藏食谱
            </button>
            <button class="add-list-btn" onclick="addRecipeToShoppingList('${recipe.title}', '${recipe.ingredients.join('\\n')}')" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #f7941e; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-clipboard-list"></i> 加入清单
            </button>`;

        if (isAdmin) {
            actionButtonsHtml += `
                <button class="delete-btn" onclick="deleteRecipe(${recipe.id}); event.stopPropagation();" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #dc3545; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-trash"></i> 删除
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

                <div class="action-buttons" style="display: flex; gap: 15px; margin-top: 20px;">
                    ${actionButtonsHtml}
                </div>
            </div>
        `;
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
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后再收藏食谱！');
        window.location.href = 'login.html';
        return;
    }
    // 这里仅做前端演示，实际应调用后端接口
    // fetch('/api/recipe/favorite/toggle', ...);
    alert('收藏成功 (如需持久化请连接后端接口)');
}

// 一键添加食谱食材到购物清单
async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    if (!ingredientsStr) {
        alert("该食谱暂无详细食材信息");
        return;
    }

    let items = [];
    const rawItems = ingredientsStr.split(/[,，\n]/);

    items = rawItems.map(item => {
        item = item.trim();
        if(!item) return null;
        const parts = item.split(' ');
        let name = item;
        let qty = '';
        if(parts.length > 1) {
            qty = parts[parts.length-1];
            name = item.replace(qty, '').trim();
        }
        return { name: name, quantity: qty };
    }).filter(i => i !== null);

    if (items.length === 0) return;

    if(!confirm(`确定将《${title}》的 ${items.length} 种食材加入购物清单吗？`)) return;

    try {
        const res = await fetch('/api/shopping-list/batch-add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(items)
        });
        const data = await res.json();

        if (data.success) {
            if(confirm('添加成功！是否前往查看清单？')) {
                window.location.href = 'market.html'; // 跳转到商城查看清单弹窗
            }
        } else {
            alert('添加失败');
        }
    } catch (e) {
        console.error(e);
        alert('网络错误');
    }
}

// 检查登录状态并显示头像
function checkLoginStatus() {
    const userJson = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');

    if (userJson && authSection) {
        const user = JSON.parse(userJson);
        const avatarPath = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';

        // 替换为头像
        authSection.innerHTML = `
            <a href="profile.html" style="display:flex; align-items:center; padding: 5px;">
                <img src="${avatarPath}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                     onerror="this.src='static/image/default_avatar.jpg'">
            </a>
        `;
        authSection.style.backgroundColor = 'transparent';
    }
}

function deleteRecipe(recipeId) {
    if (confirm('确定要删除这个食谱吗？(仅演示前端效果)')) {
        // 前端模拟删除
        const index = featuredRecipes.findIndex(r => r.id === recipeId);
        if (index > -1) {
            featuredRecipes.splice(index, 1);
            displayFeaturedRecipes();
            alert('删除成功');
        }
    }
}

function handleImageError(img) {
    img.onerror = null;
    img.src = 'static/image/default_food.jpg';
}