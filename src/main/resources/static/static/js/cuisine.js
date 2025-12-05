// src/main/resources/static/static/js/cuisine.js

// 全局变量
let recipes = [];
let currentPage = 1;
const recipesPerPage = 6;
let currentCuisine = 'all';

// 数据库 cuisine_id 到前端 code 的映射
// 对应 food_db_cuisines.sql 的数据
const cuisineMap = {
    1: 'chinese',
    2: 'western',
    3: 'japanese',
    4: 'korean',
    5: 'thai',
    6: 'dessert'
};

// 初始化页面
document.addEventListener('DOMContentLoaded', async function() {
    // 1. 检查登录状态
    checkLoginStatus();

    // 2. 从数据库加载食谱数据
    await loadRecipesFromDB();

    // 3. 显示食谱
    displayRecipes(currentPage);

    // 4. 生成分页按钮
    generatePagination();

    // 5. 绑定菜系切换事件
    const cuisineTabs = document.querySelectorAll('.cuisine-tab');
    cuisineTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            cuisineTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCuisine = this.getAttribute('data-cuisine');
            currentPage = 1;
            displayRecipes(currentPage);
            generatePagination();
        });
    });

    // 模态框点击背景关闭
    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
        window.addEventListener('click', function(event) {
            if (event.target === recipeModal) {
                recipeModal.style.display = 'none';
            }
        });
    }
});

// 从后端获取所有食谱数据
async function loadRecipesFromDB() {
    const grid = document.getElementById('recipesGrid');
    try {
        const res = await fetch('/api/common/recipes');
        if (res.ok) {
            const data = await res.json();

            // 映射数据
            recipes = data.map(r => ({
                id: r.id,
                title: r.title,
                // 将数据库的 cuisineId 转换为前端的 code
                cuisine: cuisineMap[r.cuisineId] || 'other',
                cuisineId: r.cuisineId,
                difficulty: "简单", // 数据库如有此字段可替换，否则使用默认值
                time: "30分钟",    // 默认值
                image: r.image || 'static/image/default_food.jpg',
                description: r.description,
                ingredients: r.ingredients,
                steps: r.steps,
                userId: r.userId,
                authorName: r.authorName,
                authorAvatar: r.authorAvatar,
                createdAt: r.createdAt
            }));
        } else {
            console.error("获取食谱失败");
            grid.innerHTML = '<p style="text-align:center;">暂无食谱数据</p>';
        }
    } catch(e) {
        console.error("网络错误", e);
        grid.innerHTML = '<p style="text-align:center;">加载失败</p>';
    }
}

// 显示食谱
function displayRecipes(page) {
    const recipesGrid = document.getElementById('recipesGrid');
    if (!recipesGrid) return;

    recipesGrid.innerHTML = '';

    // 筛选
    let filteredRecipes = recipes;
    if (currentCuisine !== 'all') {
        filteredRecipes = recipes.filter(recipe => recipe.cuisine === currentCuisine);
    }

    if (filteredRecipes.length === 0) {
        recipesGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:#999;">该分类下暂无食谱</div>';
        return;
    }

    // 分页
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    if (currentPage > totalPages && totalPages > 0) currentPage = 1;

    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

    // 渲染卡片
    currentRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.className = 'recipe-card common-card-style';

        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='static/image/default_food.jpg'">
            <div class="recipe-info">
                <div class="recipe-content">
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-desc">${recipe.description || '暂无描述'}</p>
                </div>
                <div class="recipe-actions" style="display: flex; gap: 10px;">
                    <button class="favorite-btn" data-id="${recipe.id}" style="flex: 1;">
                        <i class="fas fa-heart"></i> 收藏
                    </button>
                    
                    <button class="favorite-btn add-list-btn" data-id="${recipe.id}" style="flex: 1; background-color: #f7941e;">
                        <i class="fas fa-clipboard-list"></i> 加入清单
                    </button>
                </div>
            </div>
        `;

        recipesGrid.appendChild(recipeCard);
    });

    // 绑定卡片点击事件（详情）
    document.querySelectorAll('.recipe-card').forEach(card => {
        card.addEventListener('click', function(event) {
            if (event.target.closest('button')) return;
            const recipeId = parseInt(this.querySelector('button').getAttribute('data-id'));
            showRecipeDetails(recipeId);
        });
    });

    // 绑定收藏按钮
    document.querySelectorAll('.favorite-btn:not(.add-list-btn)').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const recipeId = parseInt(this.getAttribute('data-id'));
            addToFavorites(recipeId);
        });
    });

    // 绑定加入清单按钮
    document.querySelectorAll('.add-list-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            const recipeId = parseInt(this.getAttribute('data-id'));
            const recipe = recipes.find(r => r.id === recipeId);
            if(recipe) {
                let ingredientsStr = recipe.ingredients;
                addRecipeToShoppingList(recipe.title, ingredientsStr);
            }
        });
    });
}

// 生成分页按钮
function generatePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    let filteredRecipes = recipes;
    if (currentCuisine !== 'all') {
        filteredRecipes = recipes.filter(recipe => recipe.cuisine === currentCuisine);
    }

    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    if (totalPages <= 1) return;

    // 首页
    const firstPageBtn = document.createElement('button');
    firstPageBtn.className = 'pagination-btn';
    firstPageBtn.textContent = '首页';
    firstPageBtn.disabled = currentPage === 1;
    firstPageBtn.onclick = () => { currentPage = 1; updateView(); };
    paginationContainer.appendChild(firstPageBtn);

    // 上一页
    const prevPageBtn = document.createElement('button');
    prevPageBtn.className = 'pagination-btn';
    prevPageBtn.textContent = '上一页';
    prevPageBtn.disabled = currentPage === 1;
    prevPageBtn.onclick = () => { if (currentPage > 1) { currentPage--; updateView(); } };
    paginationContainer.appendChild(prevPageBtn);

    // 页码
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => { currentPage = i; updateView(); };
        paginationContainer.appendChild(pageBtn);
    }

    // 下一页
    const nextPageBtn = document.createElement('button');
    nextPageBtn.className = 'pagination-btn';
    nextPageBtn.textContent = '下一页';
    nextPageBtn.disabled = currentPage === totalPages;
    nextPageBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; updateView(); } };
    paginationContainer.appendChild(nextPageBtn);

    // 末页
    const lastPageBtn = document.createElement('button');
    lastPageBtn.className = 'pagination-btn';
    lastPageBtn.textContent = '末页';
    lastPageBtn.disabled = currentPage === totalPages;
    lastPageBtn.onclick = () => { currentPage = totalPages; updateView(); };
    paginationContainer.appendChild(lastPageBtn);
}

function updateView() {
    displayRecipes(currentPage);
    generatePagination();
}

// 显示详情
// 显示详情
async function showRecipeDetails(recipeId) {
    let recipe;
    try {
        const res = await fetch(`/api/recipe/${recipeId}`);
        if (!res.ok) throw new Error('食谱不存在');
        recipe = await res.json();
    } catch (e) {
        // 如果 API 失败，尝试从本地列表找（兜底）
        recipe = recipes.find(r => r.id === recipeId);
    }

    if (!recipe) return;

    const modalContent = document.getElementById('modalContent');
    const recipeModal = document.getElementById('recipeModal');
    // 获取中文菜系名
    const cuisineName = getCuisineName(recipe.cuisineId ? String(recipe.cuisineId) : recipe.cuisine);

    modalContent.innerHTML = `
        <div class="close-modal" onclick="document.getElementById('recipeModal').style.display='none'">&times;</div>
        
        <div class="recipe-header" style="display:flex; align-items:center; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <img src="${recipe.authorAvatar ? 'static/upload/'+recipe.authorAvatar : 'static/image/default_avatar.jpg'}" 
                 style="width:50px; height:50px; border-radius:50%; margin-right:10px; object-fit:cover;">
            <div style="flex:1;">
                <div style="font-weight:bold; color:#664b2e; font-size:16px;">${recipe.authorName || '美食达人'}</div>
                <div style="font-size:12px; color:#999;">发布于 ${new Date(recipe.createdAt || Date.now()).toLocaleDateString()}</div>
            </div>
            </div>

        <img src="${recipe.image || 'static/image/default_food.jpg'}" class="recipe-detail-image" onerror="this.src='static/image/default_food.jpg'">
        <h2 class="detail-title">${recipe.title}</h2>
        
        <div class="cuisine-info"><span class="cuisine-tag">${cuisineName}</span></div>
        <p class="recipe-desc">${recipe.description || '暂无简介'}</p>
        
        <div class="ingredients-section">
            <h3 class="section-title">所需食材</h3>
            <p style="white-space: pre-wrap; color:#666;">${recipe.ingredients || '暂无'}</p>
        </div>
        
        <div class="steps-section">
            <h3 class="section-title">制作步骤</h3>
            <p style="white-space: pre-wrap; color:#666;">${recipe.steps || '暂无'}</p>
        </div>

        <div class="comments-section" id="commentsSection"></div>
    `;

    // 初始化评论区逻辑 (复用之前写好的逻辑)
    if(typeof loadComments === 'function') {
        const commentsHtml = `
            <h3 class="section-title">食客评价</h3>
            <div id="commentListContainer"></div>
            <div class="comment-form-container clearfix">
                <div class="comment-form-title"><i class="fas fa-pen"></i> 写下你的评价</div>
                <textarea id="newCommentContent" class="comment-textarea" placeholder="分享你的心得..."></textarea>
                <button class="comment-submit-btn" onclick="submitComment(${recipe.id})">发送评价</button>
            </div>
        `;
        document.getElementById('commentsSection').innerHTML = commentsHtml;
        loadComments(recipe.id);
    }

    // 删除原本这里的关注状态检查调用
    // if (recipe.userId && typeof checkFollowStatus === 'function') checkFollowStatus(recipe.userId);

    recipeModal.style.display = 'flex';
}

function getCuisineName(keyOrId) {
    // 兼容 ID 和 Code
    if(cuisineMap[keyOrId]) return getCuisineDisplayName(cuisineMap[keyOrId]);
    return getCuisineDisplayName(keyOrId);
}

function getCuisineDisplayName(code) {
    const names = {
        'chinese': '中餐',
        'western': '西餐',
        'japanese': '日料',
        'korean': '韩式',
        'thai': '泰式',
        'dessert': '甜点'
    };
    return names[code] || '其他';
}

// 检查登录状态
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

// 关注、评论等辅助函数需保持与 feed.html 或 my_recipes.html 中一致的实现，或提取到公共 JS 文件。
// 这里简单提供占位，防止报错
function toggleFollow(id) { alert('功能需结合后端接口'); }
function submitComment(id) { alert('评论功能需结合后端接口'); }
function addToFavorites(id) {
    fetch('/api/recipe/favorite/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipeId: id})
    }).then(res => res.json()).then(data => alert(data.message || '操作完成'));
}
function addRecipeToShoppingList(title, ingredients) {
    if(!sessionStorage.getItem('currentUser')) return alert('请先登录');
    // ... 保持原有解析逻辑 ...
    alert('请求已发送 (需配合后端)');
}