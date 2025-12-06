// src/main/resources/static/static/js/cuisine.js

// 全局变量
let recipes = [];
let currentPage = 1;
const recipesPerPage = 6;
let currentCuisine = 'all';

const cuisineMap = {
    1: 'chinese', 2: 'western', 3: 'japanese', 4: 'korean', 5: 'thai', 6: 'dessert'
};

document.addEventListener('DOMContentLoaded', async function() {
    checkLoginStatus();

    if (document.querySelector('.cuisine-tabs')) {
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
                    <button class="favorite-btn" onclick="event.stopPropagation(); addToFavorites(${r.id})">
                        <i class="fas fa-heart"></i> 收藏
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

// 2. 分页逻辑优化 (匹配 market.js 风格)
function generatePagination() {
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

    // 首页
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '首页';
    firstBtn.disabled = currentPage === 1;
    firstBtn.onclick = () => { currentPage = 1; updateView(); };
    container.appendChild(firstBtn);

    // 上一页
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { if(currentPage > 1) { currentPage--; updateView(); } };
    container.appendChild(prevBtn);

    // 页码
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = i === currentPage ? 'active' : '';
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; updateView(); };
        container.appendChild(btn);
    }

    // 下一页
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { if(currentPage < totalPages) { currentPage++; updateView(); } };
    container.appendChild(nextBtn);

    // 末页
    const lastBtn = document.createElement('button');
    lastBtn.textContent = '末页';
    lastBtn.disabled = currentPage === totalPages;
    lastBtn.onclick = () => { currentPage = totalPages; updateView(); };
    container.appendChild(lastBtn);
}

function updateView() {
    displayRecipes(currentPage);
    generatePagination();
}

function showRecipeDetails(recipeId) {
    window.location.href = `recipe_detail.html?id=${recipeId}`;
}

// 辅助函数
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
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    fetch('/api/recipe/favorite/toggle', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({recipeId: id})
    }).then(r=>r.json()).then(d => alert(d.message));
}

async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        alert('请先登录后使用清单功能');
        window.location.href = 'login.html';
        return;
    }

    if (!ingredientsStr || ingredientsStr.trim() === '') {
        alert("该食谱暂无详细食材信息，无法自动添加");
        return;
    }

    if(!confirm(`确定将《${title}》的食材加入待买清单吗？`)) return;

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

    if (items.length === 0) return alert('未解析到有效食材');

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
            if(confirm('添加成功！是否前往商城查看清单？')) window.location.href = 'market.html';
        } else {
            alert(data.message || '添加失败');
        }
    } catch(e) {
        console.error(e);
        alert('请求失败: ' + e.message);
    }
}