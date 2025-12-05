// src/main/resources/static/static/js/recommendation.js

document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedRecipes();
    checkLoginStatus();
});

// 从后端加载推荐菜品
async function loadFeaturedRecipes() {
    const container = document.getElementById('featuredRecipes');
    if (!container) return;

    container.innerHTML = '<p style="text-align:center; padding: 40px;">正在加载推荐美食...</p>';

    try {
        // 调用新添加的接口
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

        // 解析食材和步骤 (数据库中通常存储为换行分隔的字符串)
        const ingredientsList = recipe.ingredients
            ? recipe.ingredients.split('\n').map(i => `<li>${i}</li>`).join('')
            : '<li>暂无详细食材</li>';

        const stepsList = recipe.steps
            ? recipe.steps.split('\n').map(s => {
                // 去除开头的数字序号
                const cleanStep = s.replace(/^\d+[.、\s]\s*/, '');
                return `<li>${cleanStep}</li>`;
            }).join('')
            : '<li>暂无详细步骤</li>';

        // 构建操作按钮
        let actionButtonsHtml = `
            <button class="favorite-btn" onclick="addToFavorites(${recipe.id})" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #f7941e; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-heart"></i> 收藏食谱
            </button>
            <button class="add-list-btn" onclick="addRecipeToShoppingList('${recipe.title.replace(/'/g, "\\'")}', \`${recipe.ingredients || ''}\`)" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #f7941e; display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-clipboard-list"></i> 加入清单
            </button>`;

        if (isAdmin) {
            actionButtonsHtml += `
                <button class="delete-btn" onclick="deleteRecipe(${recipe.id})" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; color: white; background-color: #dc3545; display: flex; align-items: center; gap: 8px;">
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

function addToFavorites(recipeId) {
    const isLoggedIn = sessionStorage.getItem('currentUser');
    if (!isLoggedIn) {
        alert('请先登录后再收藏食谱！');
        window.location.href = 'login.html';
        return;
    }
    fetch('/api/recipe/favorite/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipeId: recipeId})
    }).then(res => res.json())
        .then(data => alert(data.message || '操作成功'));
}

function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    if (!ingredientsStr) {
        alert("该食谱暂无详细食材信息");
        return;
    }

    // 解析食材字符串 (简单按换行或逗号分割)
    const items = ingredientsStr.split(/[\n,，]/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => {
            // 尝试分离名称和数量 (简单逻辑：假设空格分隔)
            const parts = s.split(' ');
            return { name: parts[0], quantity: parts.slice(1).join(' ') || '适量' };
        });

    if (items.length === 0) return;

    if(!confirm(`确定将《${title}》的食材加入购物清单吗？`)) return;

    fetch('/api/shopping-list/batch-add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(items)
    }).then(res => res.json())
        .then(data => {
            if (data.success && confirm('添加成功！是否前往查看清单？')) {
                window.location.href = 'market.html';
            }
        });
}

function checkLoginStatus() {
    const userJson = sessionStorage.getItem('currentUser');
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
    }
}

// 仅限管理员在前端移除 (实际后端需校验)
function deleteRecipe(recipeId) {
    if (confirm('确定要删除这个推荐吗？(此操作会调用管理员删除接口)')) {
        fetch('/api/admin/recipe/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: recipeId})
        }).then(res => res.json())
            .then(data => {
                if(data.success) {
                    loadFeaturedRecipes();
                    alert('删除成功');
                } else {
                    alert(data.message || '删除失败');
                }
            });
    }
}

function handleImageError(img) {
    img.onerror = null;
    img.src = 'static/image/default_food.jpg';
}