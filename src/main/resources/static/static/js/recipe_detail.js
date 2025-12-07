// src/main/resources/static/static/js/recipe_detail.js

let currentRecipeId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        currentRecipeId = recipeId;
        loadRecipeDetail(recipeId);
    } else {
        document.getElementById('recipeContainer').innerHTML = '<p style="text-align:center; color:red;">参数错误：未找到食谱ID</p>';
    }
});

const cuisineMap = {
    1: '中餐', 2: '西餐', 3: '日料', 4: '韩式', 5: '泰式', 6: '甜点'
};

async function loadRecipeDetail(id) {
    try {
        const res = await fetch(`/api/recipe/${id}`);
        if (!res.ok) throw new Error('食谱不存在');
        const recipe = await res.json();
        renderDetail(recipe);
    } catch (e) {
        document.getElementById('recipeContainer').innerHTML = `<p style="text-align:center; color:red;">${e.message}</p>`;
    }
}

function renderDetail(recipe) {
    const container = document.getElementById('recipeContainer');
    const authorAvatar = recipe.authorAvatar ? `static/upload/${recipe.authorAvatar}` : 'static/image/default_avatar.jpg';
    const mainImg = recipe.image || 'static/image/default_food.jpg';

    // 处理食材字符串，防止引号破坏 onclick 属性
    const safeTitle = (recipe.title || '').replace(/'/g, "\\'");
    const safeIngredients = (recipe.ingredients || '').replace(/`/g, "\\`").replace(/\$/g, "\\$");

    container.innerHTML = `
        <div class="recipe-header">
            <img src="${authorAvatar}" class="author-avatar">
            <div>
                <div style="font-size: 18px; font-weight: bold; color: #664b2e; display: flex; align-items: center; gap: 10px;">
                    ${recipe.authorName || '美食达人'}
                </div>
                <div style="font-size: 14px; color: #888;">发布于 ${new Date(recipe.createdAt).toLocaleDateString()}</div>
            </div>
        </div>

        <h1 class="recipe-title">${recipe.title}</h1>
        <div class="recipe-meta">
            <span><i class="fas fa-eye"></i> 浏览</span>
            <span class="cuisine-tag">${cuisineMap[recipe.cuisineId] || '特色菜'}</span>
        </div>

        <img src="${mainImg}" class="recipe-main-img" onerror="this.src='static/image/default_food.jpg'">

        <div style="background: rgba(255,255,255,0.6); padding: 20px; border-radius: 8px; border-left: 4px solid #f7941e; margin-bottom: 40px;">
            <p style="margin:0; color:#555; font-size:16px;">“ ${recipe.description || '暂无简介'} ”</p>
        </div>

        <h3 class="section-title"><i class="fas fa-shopping-basket"></i> 所需食材</h3>
        <div class="text-content">${recipe.ingredients || '暂无详细食材'}</div>

        <h3 class="section-title"><i class="fas fa-list-ol"></i> 烹饪步骤</h3>
        <div class="text-content">${recipe.steps || '暂无详细步骤'}</div>

        <div style="display: flex; gap: 15px; margin: 40px auto 20px; max-width: 500px;">
            <button class="view-comment-btn" style="margin: 0; flex: 1; display: flex; justify-content: center; align-items: center; gap: 8px;" onclick="addToFavorites(${recipe.id})">
                <i class="fas fa-heart"></i> 收藏食谱
            </button>
            <button class="view-comment-btn" style="margin: 0; flex: 1; display: flex; justify-content: center; align-items: center; gap: 8px;" onclick="addRecipeToShoppingList('${safeTitle}', \`${safeIngredients}\`)">
                <i class="fas fa-clipboard-list"></i> 加入清单
            </button>
        </div>

        <button class="view-comment-btn" onclick="openCommentModal()" style="background-color: #8cc63f; max-width: 500px;">
            <i class="fas fa-comments"></i> 查看 / 发表评论
        </button>
    `;
}

// ... (模态框控制代码保持不变，省略) ...
function openCommentModal() {
    const modal = document.getElementById('commentModal');
    modal.style.display = 'flex';
    loadComments(currentRecipeId);
}

function closeCommentModal() {
    document.getElementById('commentModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('commentModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('imgPreview');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('fileName').innerText = input.files[0].name;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// ... (submitComment 和 loadComments 代码保持不变，省略) ...
async function submitComment() {
    // ... 原有逻辑 ...
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    const content = document.getElementById('commentContent').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const fileInput = document.getElementById('commentFile');

    if (!content.trim()) return alert('请输入评论内容');

    let imagePath = null;
    // 上传图片逻辑
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);
        try {
            const upRes = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
            const upData = await upRes.json();
            if (upData.success) imagePath = upData.fileName;
        } catch (e) { console.error('图片上传失败', e); }
    }

    // 提交评论
    try {
        const res = await fetch('/api/comment/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipeId: currentRecipeId,
                content: content,
                rating: parseInt(rating),
                image: imagePath
            })
        });
        const data = await res.json();
        if (data.success) {
            alert('评论成功！');
            document.getElementById('commentContent').value = '';
            document.getElementById('commentFile').value = '';
            document.getElementById('imgPreview').style.display = 'none';
            document.getElementById('fileName').innerText = '';
            loadComments(currentRecipeId); // 刷新列表
        } else {
            alert(data.message);
        }
    } catch (e) { alert('网络错误'); }
}

async function loadComments(recipeId) {
    // ... 原有逻辑 ...
    const container = document.getElementById('commentList');
    container.innerHTML = '<p style="text-align:center;color:#999;">加载中...</p>';

    try {
        const res = await fetch(`/api/comment/list?recipeId=${recipeId}`);
        if (!res.ok) throw new Error("加载失败");

        const comments = await res.json();

        if (comments.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:#999; padding: 20px;">暂无评论，快来抢沙发！</p>';
            return;
        }

        container.innerHTML = comments.map(c => `
            <div class="comment-item">
                <img src="${c.avatar ? 'static/upload/'+c.avatar : 'static/image/default_avatar.jpg'}" class="comment-avatar-small">
                <div style="flex:1;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <span style="font-weight:bold; color:#664b2e;">${c.username || '匿名用户'}</span>
                        <span style="color:#f7941e;">${'★'.repeat(c.rating || 5)}</span>
                    </div>
                    <p style="margin:0; color:#555; line-height:1.5;">${c.content}</p>
                    ${c.image ? `<img src="static/upload/${c.image}" style="max-height:120px; border-radius:4px; margin-top:10px; cursor:pointer;" onclick="window.open(this.src)">` : ''}
                    <div style="color:#ccc; font-size:12px; margin-top:5px;">${new Date(c.createdAt).toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error(e);
        container.innerHTML = '<p style="text-align:center; color:red;">评论加载失败</p>';
    }
}

function checkLoginStatus() {
    // ... 原有逻辑 ...
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

// --- 新增：业务功能函数 ---

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

async function addRecipeToShoppingList(title, ingredientsStr) {
    if(!sessionStorage.getItem('currentUser')) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    if (!ingredientsStr || ingredientsStr.trim() === '') {
        alert("该食谱暂无详细食材信息，无法自动添加");
        return;
    }

    if(!confirm(`确定将《${title}》的食材加入购物清单吗？`)) return;

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
            if (confirm('添加成功！是否前往查看清单？')) {
                window.location.href = 'market.html';
            }
        } else {
            alert(data.message || '添加失败');
        }
    } catch(e) {
        console.error(e);
        alert('请求失败: ' + e.message);
    }
}