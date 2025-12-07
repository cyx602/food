// src/main/resources/static/static/js/cuisine.js

// 全局变量
let recipes = [];
let currentPage = 1;
const recipesPerPage = 6;
let currentCuisine = 'all';
let myFavoriteIds = []; // 新增：存储已收藏的ID

const cuisineMap = {
    1: 'chinese', 2: 'western', 3: 'japanese', 4: 'korean', 5: 'thai', 6: 'dessert'
};

document.addEventListener('DOMContentLoaded', async function() {
    checkLoginStatus();

    if (document.querySelector('.cuisine-tabs')) {
        await fetchFavoriteIds(); // 新增：先获取收藏列表
        await loadRecipesFromDB();
        displayRecipes(currentPage);
        generatePagination();
        setupCuisineTabs();

        // 绑定搜索回车
        const searchInput = document.getElementById('recipeSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') searchRecipes();
            });
        }
    }

    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
        window.onclick = function(event) {
            if (event.target == recipeModal) recipeModal.style.display = "none";
        }
    }
});

// 新增：获取收藏ID列表
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

function setupCuisineTabs() {
    document.querySelectorAll('.cuisine-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.cuisine-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCuisine = this.getAttribute('data-cuisine');
            currentPage = 1;
            updateView();
        });
    });
}

// 加载数据
async function loadRecipesFromDB() {
    try {
        const res = await fetch('/api/common/recipes');
        if (res.ok) {
            const data = await res.json();
            recipes = data.map(r => ({
                ...r,
                cuisine: cuisineMap[r.cuisineId] || 'other',
                image: r.image || 'static/image/default_food.jpg'
            }));
        }
    } catch(e) { console.error("加载失败", e); }
}

function searchRecipes() {
    currentPage = 1;
    updateView();
}

// 显示列表
function displayRecipes(page) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const searchTerm = document.getElementById('recipeSearchInput') ? document.getElementById('recipeSearchInput').value.toLowerCase().trim() : '';

    let filtered = recipes.filter(r => {
        const matchCuisine = currentCuisine === 'all' || r.cuisine === currentCuisine;
        const matchSearch = r.title.toLowerCase().includes(searchTerm);
        return matchCuisine && matchSearch;
    });

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">暂无匹配食谱</div>';
        return;
    }

    const start = (page - 1) * recipesPerPage;
    const current = filtered.slice(start, start + recipesPerPage);

    current.forEach(r => {
        // 判断是否已收藏
        const isFav = myFavoriteIds.includes(r.id);
        const btnText = isFav ? '取消收藏' : '收藏';
        const btnStyle = isFav ? 'background-color:#999;' : ''; // 可选：已收藏变灰，或保持原样

        const div = document.createElement('div');
        div.className = 'recipe-card common-card-style';
        div.innerHTML = `
            <img src="${r.image}" class="recipe-image" onerror="this.src='static/image/default_food.jpg'">
            <div class="recipe-info">
                <div class="recipe-content">
                    <h3 class="recipe-title">${r.title}</h3>
                    <p class="recipe-desc">${r.description || '暂无描述'}</p>
                </div>
                <div class="recipe-actions">
                    <button class="favorite-btn" style="${btnStyle}" onclick="event.stopPropagation(); addToFavorites(${r.id})">
                        <i class="fas fa-heart"></i> ${btnText}
                    </button>
                    <button class="add-list-btn" onclick="event.stopPropagation(); addRecipeToShoppingList('${r.title}', \`${r.ingredients || ''}\`)">
                        <i class="fas fa-clipboard-list"></i> 加入清单
                    </button>
                </div>
            </div>
        `;
        div.onclick = (e) => { if(e.target.tagName !== 'BUTTON') showRecipeDetails(r.id); };
        grid.appendChild(div);
    });
}

function generatePagination() {
    // ... (分页代码与之前保持一致，为节省篇幅略去，直接保留原文件逻辑即可) ...
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    container.innerHTML = '';

    const searchTerm = document.getElementById('recipeSearchInput') ? document.getElementById('recipeSearchInput').value.toLowerCase().trim() : '';
    let filtered = recipes.filter(r => {
        const matchCuisine = currentCuisine === 'all' || r.cuisine === currentCuisine;
        const matchSearch = r.title.toLowerCase().includes(searchTerm);
        return matchCuisine && matchSearch;
    });
    const totalPages = Math.ceil(filtered.length / recipesPerPage);

    if (totalPages <= 1) return;

    const createBtn = (text, page, disabled, active) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        if (disabled) btn.disabled = true;
        if (active) btn.className = 'active';
        btn.onclick = () => {
            if (!disabled && !active) {
                currentPage = page;
                updateView();
            }
        };
        return btn;
    };

    container.appendChild(createBtn('首页', 1, currentPage === 1, false));
    container.appendChild(createBtn('上一页', currentPage - 1, currentPage === 1, false));

    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    rangeWithDots.forEach(item => {
        if (item === '...') {
            const span = document.createElement('span');
            span.className = 'page-ellipsis';
            span.innerText = '...';
            container.appendChild(span);
        } else {
            container.appendChild(createBtn(item, item, false, item === currentPage));
        }
    });

    container.appendChild(createBtn('下一页', currentPage + 1, currentPage === totalPages, false));
    container.appendChild(createBtn('末页', totalPages, currentPage === totalPages, false));
}

function updateView() {
    displayRecipes(currentPage);
    generatePagination();
}

function showRecipeDetails(recipeId) {
    window.location.href = `recipe_detail.html?id=${recipeId}`;
}

function checkLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const authSection = document.getElementById('authSection');

    if (user && authSection) {
        const avatarPath = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';
        authSection.innerHTML = `
            <a href="profile.html" style="display: flex; align-items: center; height: 100%; padding: 0 15px;">
                <img src="${avatarPath}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.8);"
                     onerror="this.src='static/image/default_avatar.jpg'">
            </a>
        `;
        authSection.style.background = 'transparent';
    }
}

function addToFavorites(id) {
    if(!sessionStorage.getItem('currentUser')) {
        showToast('请先登录', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }
    fetch('/api/recipe/favorite/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipeId: id})
    }).then(r=>r.json()).then(d => {
        showToast(d.message, d.success ? 'success' : 'error');
        if (d.success) {
            // 更新本地收藏状态
            if (d.status === 'added') {
                myFavoriteIds.push(id);
            } else {
                myFavoriteIds = myFavoriteIds.filter(fid => fid !== id);
            }
            // 重新渲染当前视图以更新按钮状态
            updateView();
        }
    });
}

async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        showToast('请先登录后使用清单功能', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    if (!ingredientsStr || ingredientsStr.trim() === '') {
        showToast("该食谱暂无详细食材信息，无法自动添加", 'error');
        return;
    }

    showConfirm(`确定将《${title}》的食材加入待买清单吗？`, async function() {
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
                showConfirm('添加成功！是否前往商城查看清单？', function() {
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