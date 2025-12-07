let currentTab = 'favorites';
let currentPage = 1;
const pageSize = 8;

document.addEventListener('DOMContentLoaded', function() {
    const user = sessionStorage.getItem('currentUser');

    if (!user) {
        // 1. 隐藏 Tab 栏和分页
        document.querySelector('.recipes-tabs').style.display = 'none';

        // 2. 渲染锁屏卡片 (使用统一的样式)
        document.getElementById('recipesGrid').style.display = 'block'; // 设为 block 以便居中
        document.getElementById('recipesGrid').innerHTML = `
                <div class="lock-container">
                    <i class="fas fa-lock lock-icon"></i>
                    <div class="lock-text">请先登录以查看您的食谱</div>
                    <a href="login.html" class="lock-btn">立即登录</a>
                </div>
            `;
        return;
    }

    loadData();
});

function switchTab(tab, element) {
    if(!sessionStorage.getItem('currentUser')) return;
    currentTab = tab;
    currentPage = 1;
    document.querySelectorAll('.recipes-tab').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    loadData();
}

async function loadData() {
    const grid = document.getElementById('recipesGrid');
    const emptyState = document.getElementById('emptyState');
    const pagination = document.getElementById('pagination');

    grid.innerHTML = '';
    pagination.innerHTML = '';

    const endpoint = currentTab === 'favorites' ? '/api/recipe/favorites' : '/api/recipe/my-list';

    try {
        const res = await fetch(`${endpoint}?page=${currentPage}&size=${pageSize}`);
        if(res.status === 401) { window.location.href = 'login.html'; return; }

        const data = await res.json();
        const list = data.rows || [];
        const total = data.total || 0;

        if(currentTab === 'created') {
            // 1. 我的创作模式：显示网格，隐藏空状态框
            grid.style.display = 'grid';
            emptyState.style.display = 'none';

            // 2. 无论是否有数据，第一张卡片永远是“去发布新菜”
            const addCard = document.createElement('div');
            addCard.className = 'recipe-card common-card-style add-card';
            addCard.innerHTML = `
                    <i class="fas fa-plus-circle" style="font-size:40px;margin-bottom:15px;"></i>
                    <div style="font-size:18px; font-weight:bold;">去发布新菜</div>
                `;
            addCard.onclick = openCreateModal;
            grid.appendChild(addCard);

            // 3. 渲染数据卡片
            list.forEach(r => {
                const card = createRecipeCard(r, 'delete');
                grid.appendChild(card);
            });

        } else {
            // 收藏模式
            if(list.length === 0) {
                // 1. 列表为空：隐藏网格（消除空白占位），显示空状态
                grid.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                // 2. 列表不为空：显示网格，隐藏空状态
                grid.style.display = 'grid';
                emptyState.style.display = 'none';
                list.forEach(r => {
                    const card = createRecipeCard(r, 'favorite');
                    grid.appendChild(card);
                });
            }
        }

        renderPagination(total);

    } catch(e) {
        console.error(e);
        grid.style.display = 'block'; // 恢复显示以便展示错误信息
        grid.innerHTML = '<p style="text-align:center; color:red; grid-column:1/-1;">加载失败，请稍后重试</p>';
    }
}

// 创建通用卡片 HTML
function createRecipeCard(r, type) {
    const card = document.createElement('div');
    card.className = 'recipe-card common-card-style';

    let actionBtnHtml = '';
    if (type === 'delete') {
        actionBtnHtml = `
                <button class="action-btn btn-view" onclick="event.stopPropagation(); window.location.href='recipe_detail.html?id=${r.id}'">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="action-btn btn-delete" onclick="event.stopPropagation(); deleteRecipe(${r.id})">
                    <i class="fas fa-trash"></i> 删除
                </button>
            `;
    } else {
        actionBtnHtml = `
                <button class="action-btn btn-view" onclick="event.stopPropagation(); window.location.href='recipe_detail.html?id=${r.id}'">
                    <i class="fas fa-eye"></i> 查看
                </button>
                <button class="action-btn btn-delete" style="background-color:#ccc;" onclick="event.stopPropagation(); removeFavorite(${r.id})">
                    <i class="fas fa-times"></i> 取消收藏
                </button>
            `;
    }

    card.innerHTML = `
            <img src="${r.image || 'static/image/default_food.jpg'}" class="recipe-image" onerror="this.src='static/image/default_food.jpg'">
            <div class="recipe-info">
                <div class="recipe-content">
                    <div class="recipe-title">${r.title}</div>
                    <div class="recipe-desc">${r.description || '暂无简介'}</div>
                </div>
                <div class="recipe-actions">
                    ${actionBtnHtml}
                </div>
            </div>
        `;

    card.onclick = (e) => {
        if (!e.target.closest('button')) {
            window.location.href = `recipe_detail.html?id=${r.id}`;
        }
    };

    return card;
}

function renderPagination(total) {
    const container = document.getElementById('pagination');
    const totalPages = Math.ceil(total / pageSize);
    container.innerHTML = '';

    // 如果只有1页，不显示分页
    if (totalPages <= 1) return;

    // 创建按钮的辅助函数
    const createBtn = (text, page, disabled, active) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        if(disabled) btn.disabled = true;
        if(active) btn.className = 'active';
        btn.onclick = () => {
            if(!disabled && !active) {
                currentPage = page;
                loadData();
            }
        };
        return btn;
    };

    // 1. 首页 & 上一页
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

    // 3. 渲染页码和省略号
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

    // 4. 下一页 & 末页
    container.appendChild(createBtn('下一页', currentPage + 1, currentPage === totalPages, false));
    container.appendChild(createBtn('末页', totalPages, currentPage === totalPages, false));
}

// --- 模态框逻辑 ---
function openCreateModal() {
    document.getElementById('createRecipeForm').reset();
    document.getElementById('createRecipeModal').style.display = 'flex';
}

function closeCreateModal() {
    document.getElementById('createRecipeModal').style.display = 'none';
}

// --- 业务逻辑 ---
async function submitCreateRecipe() {
    const title = document.getElementById('newTitle').value.trim();
    const cuisineId = document.getElementById('newCuisine').value;
    const desc = document.getElementById('newDesc').value;
    const ingredients = document.getElementById('newIngredients').value;
    const steps = document.getElementById('newSteps').value;
    const fileInput = document.getElementById('newImageFile');

    if(!title) return showToast('请填写食谱标题', 'error');

    let imagePath = 'static/image/default_food.jpg';

    if(fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);
        try {
            const uploadRes = await fetch('/api/upload-avatar', {method:'POST', body:formData});
            const upData = await uploadRes.json();
            if(data.success) {
                showToast('发布成功！');
                closeCreateModal();
                loadData();
            } else {
                showToast('发布失败: ' + data.message, 'error');
            }
        } catch(e) {
            showToast('网络错误', 'error');
        }
    }

    const recipeData = {
        title, cuisineId: parseInt(cuisineId), description: desc,
        ingredients, steps, image: imagePath
    };

    try {
        const res = await fetch('/api/recipe/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(recipeData)
        });
        const data = await res.json();
        if(data.success) {
            alert('发布成功！');
            closeCreateModal();
            loadData();
        } else {
            alert('发布失败: ' + data.message);
        }
    } catch(e) {
        console.error(e);
        alert('网络错误');
    }
}

function removeFavorite(id) {
    showConfirm('确定取消收藏吗？', function() {
        fetch('/api/recipe/favorite/toggle', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({recipeId: id})
        }).then(() => {
            showToast('已取消收藏');
            loadData();
        });
    });
}

function deleteRecipe(id) {
    showConfirm('确定删除这个食谱吗？', function() {
        fetch('/api/recipe/delete', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: id})
        }).then(res => res.json()).then(data => {
            if(data.success) {
                showToast('删除成功');
                loadData();
            } else {
                showToast(data.message, 'error');
            }
        });
    });
}