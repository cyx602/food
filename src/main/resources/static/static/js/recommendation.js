// src/main/resources/static/static/js/recommendation.js

let myFavoriteIds = []; // 存储收藏ID

document.addEventListener('DOMContentLoaded', async function() {
    await fetchFavoriteIds(); // 先获取收藏列表
    loadFeaturedRecipes();
    checkLoginStatus();
});

// 获取收藏ID列表
async function fetchFavoriteIds() {
    const user = sessionStorage.getItem('currentUser');
    if(!user) return;
    try {
        const res = await fetch('/api/recipe/favorites/ids');
        if(res.ok) {
            myFavoriteIds = await res.json();
        }
    } catch(e) { console.error("获取收藏列表失败", e); }
}

// 从后端加载推荐菜品
async function loadFeaturedRecipes() {
    const container = document.getElementById('featuredRecipes');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center; padding: 40px;">正在加载推荐美食...</p>';

    try {
        const res = await fetch('/api/common/featured-recipes');
        if (!res.ok) throw new Error('Failed to fetch data');

        const recipes = await res.json();

        if (recipes.length === 0) {
            container.innerHTML = '<p style="text-align:center; padding: 40px; color: #999;">暂无特别推荐，去<a href="cuisine.html" style="color:#f7941e;">分类页面</a>看看吧</p>';
            return;
        }

        displayFeaturedRecipes(recipes);
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p style="text-align:center; padding: 40px; color: red;">加载失败，请刷新重试</p>';
    }
}

// 显示推荐菜品
function displayFeaturedRecipes(recipes) {
    const container = document.getElementById('featuredRecipes');
    container.innerHTML = '';

    const isAdmin = sessionStorage.getItem('adminLoggedIn') === 'true';

    recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.className = 'featured-recipe common-card-style';

        // 整个卡片点击跳转到详情页
        recipeElement.style.cursor = 'pointer';
        recipeElement.onclick = function(e) {
            // 防止点击按钮时触发卡片跳转
            if(e.target.closest('button')) return;
            window.location.href = `recipe_detail.html?id=${recipe.id}`;
        };

        const ingredientsList = recipe.ingredients
            ? recipe.ingredients.split('\n').map(i => `<li>${i}</li>`).join('')
            : '<li>暂无详细食材</li>';

        const stepsList = recipe.steps
            ? recipe.steps.split('\n').map(s => `<li>${s.replace(/^\d+[.、\s]\s*/, '')}</li>`).join('')
            : '<li>暂无详细步骤</li>';

        // 判断是否已收藏
        const isFav = myFavoriteIds.includes(recipe.id);
        const favText = isFav ? '取消收藏' : '收藏食谱';
        // 已收藏显示灰色，未收藏显示橙色
        const favStyle = isFav ? 'background-color:#999;' : 'background-color:#f7941e;';

        // 【关键修改】：给收藏按钮添加唯一 ID (id="fav-btn-${recipe.id}")，方便后续局部更新
        let actionButtonsHtml = `
            <button id="fav-btn-${recipe.id}" class="favorite-btn" onclick="event.stopPropagation(); addToFavorites(${recipe.id})" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; ${favStyle} display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-heart"></i> <span>${favText}</span>
            </button>
            <button class="add-list-btn" onclick="event.stopPropagation(); addRecipeToShoppingList('${recipe.title.replace(/'/g, "\\'")}', \`${recipe.ingredients || ''}\`)" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #f7941e; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-clipboard-list"></i> 加入清单
            </button>`;

        if (isAdmin) {
            actionButtonsHtml += `
                <button class="delete-btn" onclick="event.stopPropagation(); deleteRecipe(${recipe.id})" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #dc3545; display: flex; align-items: center; gap: 8px;">
                    <i class="fas fa-trash"></i> 删除 (管理员)
                </button>`;
        }

        recipeElement.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='static/image/default_food.jpg'">
            <div class="recipe-content">
                <h2 class="recipe-title">${recipe.title}</h2>
                <div class="recipe-meta">
                    <span><i class="fas fa-user"></i> ${recipe.authorName || '官方推荐'}</span> |
                    <span><i class="fas fa-utensils"></i> ${getCuisineName(recipe.cuisineId)}</span>
                </div>
                <p class="recipe-desc">${recipe.description || '这道菜看起来很美味！'}</p>

                <div class="ingredients-section">
                    <h3 class="section-title">所需食材</h3>
                    <ul class="ingredients-list">
                        ${ingredientsList}
                    </ul>
                </div>

                <div class="steps-section">
                    <h3 class="section-title">详细步骤</h3>
                    <ol class="steps-list">
                        ${stepsList}
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

function getCuisineName(idOrCode) {
    const names = {
        1: '中餐', 'chinese': '中餐',
        2: '西餐', 'western': '西餐',
        3: '日料', 'japanese': '日料',
        4: '韩式', 'korean': '韩式',
        5: '泰式', 'thai': '泰式',
        6: '甜点', 'dessert': '甜点'
    };
    return names[idOrCode] || '特色美食';
}

// 【核心修改】：局部更新 DOM，绝不调用 loadFeaturedRecipes()
function addToFavorites(recipeId) {
    const isLoggedIn = sessionStorage.getItem('currentUser');
    if (!isLoggedIn) {
        showToast('请先登录后再收藏食谱！', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    fetch('/api/recipe/favorite/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipeId: recipeId})
    }).then(res => res.json())
        .then(data => {
            showToast(data.message || '操作成功');
            if (data.success) {
                // 1. 更新本地收藏ID列表缓存
                if (data.status === 'added') {
                    myFavoriteIds.push(recipeId);
                } else {
                    myFavoriteIds = myFavoriteIds.filter(fid => fid !== recipeId);
                }

                // 2. 直接找到该按钮元素并修改样式和文字，避免页面刷新跳动
                const btn = document.getElementById(`fav-btn-${recipeId}`);
                if (btn) {
                    const span = btn.querySelector('span'); // 获取按钮内的 span 文字标签

                    if (data.status === 'added') {
                        // 收藏成功 -> 变为“取消收藏”
                        if(span) span.innerText = '取消收藏';
                        btn.style.backgroundColor = '#999'; // 变灰
                    } else {
                        // 取消成功 -> 变为“收藏食谱”
                        if(span) span.innerText = '收藏食谱';
                        btn.style.backgroundColor = '#f7941e'; // 变回橙色
                    }
                }
            }
        })
        .catch(err => {
            console.error(err);
            showToast('网络错误', 'error');
        });
}

async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        showToast('请先登录', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }
    if (!ingredientsStr || ingredientsStr.trim() === '') {
        showToast("该食谱暂无详细食材信息，无法自动添加", 'error');
        return;
    }

    showConfirm(`确定将《${title}》的食材加入购物清单吗？`, async function() {
        const items = ingredientsStr.split(/[\n,，]/)
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .map(s => {
                const firstSpace = s.indexOf(' ');
                if (firstSpace > 0) {
                    return { name: s.substring(0, firstSpace), quantity: s.substring(firstSpace + 1).trim() };
                } else {
                    return { name: s, quantity: '适量' };
                }
            });

        if (items.length === 0) return showToast('未解析到有效食材', 'error');

        try {
            const res = await fetch('/api/shopping-list/batch-add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(items)
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const json = JSON.parse(text);
                    throw new Error(json.message || "服务器错误");
                } catch(e) { throw new Error("服务器响应异常 (" + res.status + ")"); }
            }

            const data = await res.json();
            if (data.success) {
                showConfirm('添加成功！是否前往查看清单？', function() {
                    window.location.href = 'market.html';
                });
            } else {
                showToast(data.message || '添加失败', 'error');
            }
        } catch(e) {
            console.error(e);
            showToast('请求失败: ' + e.message, 'error');
        }
    });
}

function checkLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const authSection = document.getElementById('authSection');

    if (user && authSection) {
        const avatarPath = user.avatarFileName ?
            'static/upload/' + user.avatarFileName :
            'static/image/default_avatar.jpg';

        authSection.innerHTML = `
            <a href="profile.html" style="display: flex; align-items: center; height: 100%; padding: 0 15px;">
                <img src="${avatarPath}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.8);">
            </a>
        `;
        authSection.style.background = 'transparent';
    }
}

function deleteRecipe(recipeId) {
    showConfirm('确定要删除这个推荐吗？', function() {
        fetch('/api/admin/recipe/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: recipeId})
        }).then(res => res.json())
            .then(data => {
                if(data.success) {
                    loadFeaturedRecipes();
                    showToast('删除成功');
                } else {
                    showToast(data.message || '删除失败', 'error');
                }
            });
    });
}