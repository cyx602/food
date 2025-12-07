

let currentRecipeId = null;
let myFavoriteIds = [];
document.addEventListener('DOMContentLoaded', async function () {
    checkLoginStatus();
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (recipeId) {
        currentRecipeId = parseInt(recipeId);
        // 并行加载：先获取收藏列表，再渲染详情
        await fetchFavoriteIds();
        loadRecipeDetail(recipeId);
    } else {
        document.getElementById('recipeContainer').innerHTML = '<p style="text-align:center; color:red;">参数错误：未找到食谱ID</p>';
    }
});
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

    const safeTitle = (recipe.title || '').replace(/'/g, "\\'");
    const safeIngredients = (recipe.ingredients || '').replace(/`/g, "\\`").replace(/\$/g, "\\$");

    // 判断收藏状态
    const isFav = myFavoriteIds.includes(recipe.id);
    const favText = isFav ? '取消收藏' : '收藏食谱';
    const favStyle = isFav ? 'background-color:#999;' : 'background-color:#f7941e;'; // 已收藏变灰

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
            <button id="btnFavorite" class="view-comment-btn" style="margin: 0; flex: 1; display: flex; justify-content: center; align-items: center; gap: 8px; ${favStyle}" onclick="addToFavorites(${recipe.id})">
                <i class="fas fa-heart"></i> <span>${favText}</span>
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

async function submitComment() {
    const user = sessionStorage.getItem('currentUser');
    if (!user) {
        showToast('请先登录', 'error');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }

    const content = document.getElementById('commentContent').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const fileInput = document.getElementById('commentFile');

    if (!content.trim()) return showToast('请输入评论内容', 'error');

    let imagePath = null;
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);
        try {
            const upRes = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
            const upData = await upRes.json();
            if (upData.success) imagePath = upData.fileName;
        } catch (e) { console.error('图片上传失败', e); }
    }

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
            showToast('评论成功！');
            document.getElementById('commentContent').value = '';
            document.getElementById('commentFile').value = '';
            document.getElementById('imgPreview').style.display = 'none';
            document.getElementById('fileName').innerText = '';
            loadComments(currentRecipeId);
        } else {
            showToast(data.message, 'error');
        }
    } catch (e) { showToast('网络错误', 'error'); }
}

async function loadComments(recipeId) {
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
            showToast(data.message || '操作成功', data.success ? 'success' : 'error');

            if (data.success) {
                const btn = document.getElementById('btnFavorite');
                const span = btn.querySelector('span');

                if (data.status === 'added') {
                    span.innerText = '取消收藏';
                    btn.style.backgroundColor = '#999';
                    myFavoriteIds.push(recipeId); // 更新本地缓存
                } else {
                    span.innerText = '收藏食谱';
                    btn.style.backgroundColor = '#f7941e';
                    myFavoriteIds = myFavoriteIds.filter(id => id !== recipeId);
                }
            }
        })
        .catch(() => showToast('网络错误', 'error'));
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
