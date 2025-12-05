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
    await loadRecipesFromDB();
    displayRecipes(currentPage);
    generatePagination();

    if (document.querySelector('.cuisine-tabs')) {
        await loadRecipesFromDB();
        displayRecipes(currentPage);
        generatePagination();
        setupCuisineTabs();
    }


    // 绑定标签切换
    document.querySelectorAll('.cuisine-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.cuisine-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCuisine = this.getAttribute('data-cuisine');
            currentPage = 1;
            updateView();
        });
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

    // 模态框关闭
    const recipeModal = document.getElementById('recipeModal');
    if (recipeModal) {
        window.onclick = function(event) {
            if (event.target == recipeModal) recipeModal.style.display = "none";
        }
    }
});

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

// 显示列表
function displayRecipes(page) {
    const grid = document.getElementById('recipesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    let filtered = currentCuisine === 'all' ? recipes : recipes.filter(r => r.cuisine === currentCuisine);

    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">暂无数据</div>';
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
                <div class="recipe-actions" style="display:flex; gap:10px;">
                    <button class="favorite-btn" onclick="event.stopPropagation(); addToFavorites(${r.id})">
                        <i class="fas fa-heart"></i> 收藏
                    </button>
                    <button class="favorite-btn add-list-btn" style="background-color:#f7941e;" 
                            onclick="event.stopPropagation(); addRecipeToShoppingList('${r.title}', \`${r.ingredients || ''}\`)">
                        <i class="fas fa-clipboard-list"></i> 加入清单
                    </button>
                </div>
            </div>
        `;
        div.onclick = (e) => { if(e.target.tagName !== 'BUTTON') showRecipeDetails(r.id); };
        grid.appendChild(div);
    });
}

// 分页逻辑
function generatePagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;
    container.innerHTML = '';

    let filtered = currentCuisine === 'all' ? recipes : recipes.filter(r => r.cuisine === currentCuisine);
    const totalPages = Math.ceil(filtered.length / recipesPerPage);
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; updateView(); };
        container.appendChild(btn);
    }
}

function updateView() {
    displayRecipes(currentPage);
    generatePagination();
}

// 替换原有的 showRecipeDetails 函数
function showRecipeDetails(recipeId) {
    // 直接跳转到独立的详情页面
    window.location.href = `recipe_detail.html?id=${recipeId}`;
}
// 预览评论图片
function previewCommentImage(input) {
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.getElementById('commentImgPreview');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('fileNameDisplay').innerText = input.files[0].name;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 加载评论列表
async function loadComments(recipeId) {
    const container = document.getElementById('commentListContainer');
    try {
        const res = await fetch(`/api/comment/list?recipeId=${recipeId}`);
        const comments = await res.json();

        if(comments.length === 0) {
            container.innerHTML = '<p style="color:#999; text-align:center;">暂无评论，快来抢沙发！</p>';
            return;
        }

        container.innerHTML = comments.map(c => `
            <div class="comment-item">
                <img src="${c.avatar ? 'static/upload/'+c.avatar : 'static/image/default_avatar.jpg'}" class="comment-avatar">
                <div class="comment-body">
                    <div class="comment-header">
                        <span class="comment-user">${c.username}</span>
                        <span class="comment-rating">${'★'.repeat(c.rating)}</span>
                    </div>
                    <div class="comment-content">${c.content}</div>
                    ${c.image ? `<img src="static/upload/${c.image}" style="max-width:100px; margin-top:5px; border-radius:4px;">` : ''}
                    <div style="font-size:12px; color:#ccc; margin-top:5px;">${new Date(c.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    } catch(e) { console.error(e); }
}

// 提交评论
async function submitComment(recipeId) {
    if(!sessionStorage.getItem('currentUser')) return alert('请先登录');

    const content = document.getElementById('commentContent').value;
    const rating = document.querySelector('input[name="rating"]:checked')?.value || 5;
    const fileInput = document.getElementById('commentImage');

    if(!content.trim()) return alert('请输入评论内容');

    let imagePath = null;

    // 1. 先上传图片（如果有）
    if(fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]); // 复用头像上传接口
        try {
            const upRes = await fetch('/api/upload-avatar', { method:'POST', body:formData });
            const upData = await upRes.json();
            if(upData.success) imagePath = upData.fileName;
        } catch(e) { console.error("图片上传失败"); }
    }

    // 2. 提交评论
    try {
        const res = await fetch('/api/comment/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                recipeId, content, rating, image: imagePath
            })
        });
        if((await res.json()).success) {
            alert('评价成功！');
            loadComments(recipeId); // 刷新评论
            document.getElementById('commentContent').value = '';
            document.getElementById('commentImgPreview').style.display = 'none';
            document.getElementById('fileNameDisplay').innerText = '';
            fileInput.value = '';
        } else {
            alert('评价失败');
        }
    } catch(e) { alert('网络错误'); }
}

// 替换原有的 addRecipeToShoppingList 函数
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

    // 解析逻辑：按换行或逗号分割
    const rawItems = ingredientsStr.split(/[\n,，]/);
    const items = [];

    rawItems.forEach(line => {
        line = line.trim();
        if(line) {
            // 简单取第一个空格前为名，后为量
            const firstSpace = line.indexOf(' ');
            if (firstSpace > 0) {
                items.push({
                    name: line.substring(0, firstSpace),
                    quantity: line.substring(firstSpace + 1).trim()
                });
            } else {
                items.push({ name: line, quantity: '适量' });
            }
        }
    });

    if (items.length === 0) return alert('未解析到有效食材');

    try {
        const res = await fetch('/api/shopping-list/batch-add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(items)
        });

        // 修复：处理可能返回的非JSON错误页
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

// --- 修复功能：加入清单 ---
async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        alert('请先登录后使用清单功能');
        window.location.href = 'login.html';
        return;
    }

    if (!ingredientsStr || ingredientsStr.trim() === '') {
        alert("该食谱暂无食材信息");
        return;
    }

    if(!confirm(`确定将《${title}》的食材加入待买清单吗？`)) return;

    // 解析食材字符串 (例如: "土豆 2个\n牛肉 500g")
    // 按换行或逗号分割
    const rawItems = ingredientsStr.split(/[\n,，]/);
    const items = [];

    rawItems.forEach(line => {
        line = line.trim();
        if(line) {
            // 简单尝试分离名称和数量 (取第一个空格前为名，后为量)
            const firstSpace = line.indexOf(' ');
            if (firstSpace > 0) {
                items.push({
                    name: line.substring(0, firstSpace),
                    quantity: line.substring(firstSpace + 1).trim()
                });
            } else {
                items.push({ name: line, quantity: '适量' });
            }
        }
    });

    if (items.length === 0) return alert('未解析到有效食材');

    try {
        const res = await fetch('/api/shopping-list/batch-add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(items)
        });
        const data = await res.json();

        if (data.success) {
            if(confirm('添加成功！是否前往商城查看清单？')) {
                window.location.href = 'market.html';
            }
        } else {
            alert(data.message);
        }
    } catch(e) {
        console.error(e);
        alert('网络请求失败');
    }
}

// 辅助函数
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

function getChName(code) {
    const map = {'chinese':'中餐','western':'西餐','japanese':'日料','korean':'韩式','thai':'泰式','dessert':'甜点'};
    return map[code] || '特色美食';
}

function checkLoginStatus() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    const authSection = document.getElementById('authSection');

    if (user && authSection) {
        // 尝试构建路径，如果 avatarFileName 为空则用默认
        const avatarUrl = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';

        authSection.innerHTML = `
            <a href="profile.html" style="display: flex; align-items: center; height: 100%; padding: 0 15px;">
                <img src="${avatarUrl}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.8);"
                     onerror="this.src='static/image/default_avatar.jpg'">
            </a>
        `;
        authSection.style.background = 'transparent';
    }
}