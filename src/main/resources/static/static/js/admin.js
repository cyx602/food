document.addEventListener('DOMContentLoaded', function() {
    // 1. 严格权限检查
    checkAdminAuth();
    // 2. 初始化菜单
    setupMenuTabs();
    // 3. 默认加载仪表盘
    loadDashboardStats();
});

// 权限检查
function checkAdminAuth() {
    const userJson = sessionStorage.getItem('currentUser');
    if (!userJson) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(userJson);
    // 检查用户名是否为 admin 或者角色是否为 admin
    if (user.username !== 'admin' && user.role !== 'admin') {
        alert('权限不足：您不是管理员');
        window.location.href = 'index.html';
    }
}

function setupMenuTabs() {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            // 样式切换
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // 内容切换
            const targetId = item.getAttribute('data-target');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // 标题更新
            document.getElementById('pageTitle').innerText = item.innerText.trim();

            // 数据加载分发
            if (targetId === 'users') loadUserList();
            if (targetId === 'recipes') loadRecipeList();
            if (targetId === 'ingredients') loadIngredientList();
            if (targetId === 'cuisines') loadCuisineList();
            if (targetId === 'orders') { loadOrderList(); loadOrderStats(); }
            if (targetId === 'settings') { loadAnnouncements(); }
            if (targetId === 'dashboard') loadDashboardStats();
        });
    });

    // 模态框背景关闭
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = "none";
        }
    }
}

// 退出登录
function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

function animateNumber(id, target) {
    const el = document.getElementById(id);
    if(!el) return;
    el.innerText = target; // 简化版，直接显示
}

// ==================== 1. 仪表盘 ====================
async function loadDashboardStats() {
    try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();

        animateNumber('statUserCount', data.userCount);
        animateNumber('statRecipeCount', data.recipeCount);
        animateNumber('statOrderCount', data.orderCount);
        document.getElementById('statSystem').innerText = data.systemStatus || '正常';

        // 热门食谱
        const hotList = document.getElementById('hotRecipesList');
        if (data.hotRecipes && data.hotRecipes.length > 0) {
            hotList.innerHTML = data.hotRecipes.map((r, i) =>
                `<li><span style="font-weight:bold;margin-right:10px;">${i+1}.</span> ${r.title} <span style="float:right;color:#f7941e">${r.favorite_count} 收藏</span></li>`
            ).join('');
        } else {
            hotList.innerHTML = '<li>暂无数据</li>';
        }

        // 最新公告 (复用公告列表接口获取)
        const annRes = await fetch('/api/admin/announcements');
        const anns = await annRes.json();
        const dashboardAnns = document.getElementById('dashboardAnnouncements');
        if (anns.length > 0) {
            dashboardAnns.innerHTML = anns.slice(0, 5).map(a => `<li>【公告】${a.title} <span style="float:right;color:#999;font-size:12px;">${new Date(a.createdAt).toLocaleDateString()}</span></li>`).join('');
        } else {
            dashboardAnns.innerHTML = '<li>暂无公告</li>';
        }
    } catch(e) { console.error(e); }
}

// ==================== 2. 用户管理 ====================
async function loadUserList() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">加载中...</td></tr>';
    try {
        const res = await fetch('/api/admin/users');
        const users = await res.json();
        tbody.innerHTML = users.map(u => `
            <tr>
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email || '-'}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                <td><span class="status-badge ${u.status === 1 ? 'status-normal' : 'status-banned'}">${u.status === 1 ? '正常' : '禁用'}</span></td>
                <td>
                    ${u.username !== 'admin' ?
            `<button class="btn btn-sm ${u.status===1?'btn-danger':'btn-primary'}" onclick="toggleUserStatus(${u.id}, ${u.status})">${u.status===1?'禁用':'解封'}</button>` :
            '<span style="color:#ccc">不可操作</span>'}
                </td>
            </tr>
        `).join('');
    } catch(e) { tbody.innerHTML = '<tr><td colspan="6">加载失败</td></tr>'; }
}

async function toggleUserStatus(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    if(!confirm(`确定${newStatus===1?'解封':'禁用'}该用户？`)) return;
    await fetch('/api/admin/user/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, status: newStatus})
    });
    loadUserList();
}

// ==================== 3. 食材管理 ====================
async function loadIngredientList() {
    const tbody = document.getElementById('ingredientTableBody');
    const res = await fetch('/api/admin/ingredients');
    const list = await res.json();
    tbody.innerHTML = list.map(i => `
        <tr>
            <td><img src="${i.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;"></td>
            <td>${i.name}</td>
            <td>${i.categoryId}</td>
            <td>¥${i.price} / ${i.unit}</td>
            <td>${i.stock}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick='editIngredient(${JSON.stringify(i).replace(/'/g, "&#39;")})'>编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteIngredient(${i.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function openIngredientModal() {
    document.getElementById('ingredientForm').reset();
    document.getElementById('ingId').value = '';
    document.getElementById('ingredientModal').style.display = 'block';
}

function editIngredient(i) {
    document.getElementById('ingId').value = i.id;
    document.getElementById('ingName').value = i.name;
    document.getElementById('ingCategory').value = i.categoryId;
    document.getElementById('ingPrice').value = i.price;
    document.getElementById('ingUnit').value = i.unit;
    document.getElementById('ingStock').value = i.stock;
    document.getElementById('ingImage').value = i.image;
    document.getElementById('ingredientModal').style.display = 'block';
}

async function saveIngredient() {
    const data = {
        id: document.getElementById('ingId').value || null,
        name: document.getElementById('ingName').value,
        categoryId: document.getElementById('ingCategory').value,
        price: document.getElementById('ingPrice').value,
        unit: document.getElementById('ingUnit').value,
        stock: document.getElementById('ingStock').value,
        image: document.getElementById('ingImage').value
    };
    await fetch('/api/admin/ingredient/save', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    document.getElementById('ingredientModal').style.display = 'none';
    loadIngredientList();
}

async function deleteIngredient(id) {
    if(!confirm('确定删除该食材？')) return;
    await fetch('/api/admin/ingredient/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    loadIngredientList();
}

// ==================== 4. 菜系管理 ====================
async function loadCuisineList() {
    const tbody = document.getElementById('cuisineTableBody');
    const res = await fetch('/api/admin/cuisines');
    const list = await res.json();
    tbody.innerHTML = list.map(c => `
        <tr>
            <td>${c.name}</td>
            <td>${c.code}</td>
            <td>${c.description || '-'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick='editCuisine(${JSON.stringify(c).replace(/'/g, "&#39;")})'>编辑</button>
                <button class="btn btn-sm btn-danger" onclick="deleteCuisine(${c.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

function openCuisineModal() {
    document.getElementById('cuisineForm').reset();
    document.getElementById('cuiId').value='';
    document.getElementById('cuisineModal').style.display='block';
}

function editCuisine(c) {
    document.getElementById('cuiId').value = c.id;
    document.getElementById('cuiName').value = c.name;
    document.getElementById('cuiCode').value = c.code;
    document.getElementById('cuiDesc').value = c.description;
    document.getElementById('cuisineModal').style.display='block';
}

async function saveCuisine() {
    const data = {
        id: document.getElementById('cuiId').value || null,
        name: document.getElementById('cuiName').value,
        code: document.getElementById('cuiCode').value,
        description: document.getElementById('cuiDesc').value
    };
    await fetch('/api/admin/cuisine/save', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    document.getElementById('cuisineModal').style.display = 'none';
    loadCuisineList();
}

async function deleteCuisine(id) {
    if(!confirm('确定删除该菜系？')) return;
    await fetch('/api/admin/cuisine/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
    loadCuisineList();
}

// ==================== 5. 食谱管理 ====================
async function loadRecipeList() {
    const tbody = document.getElementById('recipeTableBody');
    const res = await fetch('/api/admin/recipes');
    const list = await res.json();
    tbody.innerHTML = list.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.title}</td>
            <td>${r.authorName || '未知'}</td>
            <td>
                <label style="cursor:pointer">
                    <input type="checkbox" ${r.isRecommended ? 'checked' : ''} onchange="toggleRecommend(${r.id}, this.checked)"> 推荐
                </label>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="window.open('my_recipes.html?id=${r.id}', '_blank')">查看</button>
                <button class="btn btn-sm btn-danger" onclick="adminDeleteRecipe(${r.id})">删除</button>
            </td>
        </tr>
    `).join('');
}

async function toggleRecommend(id, isRecommended) {
    await fetch('/api/admin/recipe/recommend', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, isRecommended})
    });
}

async function adminDeleteRecipe(id) {
    if(!confirm('确定强制删除此食谱？')) return;
    const res = await fetch('/api/admin/recipe/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    const data = await res.json();
    if(data.success) {
        alert('删除成功');
        loadRecipeList();
    } else {
        alert(data.message);
    }
}

// ==================== 6. 订单管理 ====================
async function loadOrderList() {
    const tbody = document.getElementById('orderTableBody');
    const res = await fetch('/api/admin/orders');
    const list = await res.json();
    tbody.innerHTML = list.map(o => `
        <tr>
            <td>${o.orderNo}</td>
            <td>${o.userName}</td>
            <td style="color:#f7941e; font-weight:bold;">¥${o.totalAmount}</td>
            <td>
                <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding:4px; border-radius:4px; border:1px solid #ddd;">
                    <option value="PENDING" ${o.status==='PENDING'?'selected':''}>待发货</option>
                    <option value="SHIPPED" ${o.status==='SHIPPED'?'selected':''}>已发货</option>
                    <option value="COMPLETED" ${o.status==='COMPLETED'?'selected':''}>已完成</option>
                </select>
            </td>
            <td>${new Date(o.createdAt).toLocaleString()}</td>
        </tr>
    `).join('');
}

async function updateOrderStatus(id, status) {
    await fetch('/api/admin/order/status', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id, status})
    });
    loadOrderStats();
}

async function loadOrderStats() {
    const res = await fetch('/api/admin/order/stats');
    const list = await res.json();
    const map = {'PENDING':'待发货', 'SHIPPED':'已发货', 'COMPLETED':'已完成'};
    document.getElementById('orderStatsBar').innerHTML = list.map(s => `<span>${map[s.status]||s.status}: <b style="color:#f7941e; margin-left:5px;">${s.count}</b></span>`).join(' <span style="color:#ddd; margin:0 10px;">|</span> ');
}
// ==================== 7. 公告管理 (原系统配置) ====================
// 删除 saveSystemSettings 函数

async function loadAnnouncements() {
    const res = await fetch('/api/admin/announcements');
    const list = await res.json();
    document.getElementById('announcementList').innerHTML = list.map(a => `
        <li style="margin-bottom:10px; padding:10px; background:#fffaf0; border:1px solid #f0e6d8; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:bold; color:#664b2e;">${a.title}</span>
            <span>
                <span style="font-size:12px; color:#999; margin-right:15px;">${new Date(a.createdAt).toLocaleDateString()}</span>
                <button onclick="deleteAnn(${a.id})" style="color:#ff6b6b; border:none; background:none; cursor:pointer; font-size:16px;"><i class="fas fa-trash-alt"></i></button>
            </span>
        </li>
    `).join('');
}

async function publishAnnouncement() {
    const title = document.getElementById('annTitle').value;
    const content = document.getElementById('annContent').value;
    if(!title) return alert('标题不能为空');

    await fetch('/api/admin/announcement/publish', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({title, content})
    });
    alert('公告发布成功');
    document.getElementById('annTitle').value = '';
    document.getElementById('annContent').value = '';
    loadAnnouncements();
}

async function deleteAnn(id) {
    if(!confirm('删除此公告？')) return;
    await fetch('/api/admin/announcement/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
    });
    loadAnnouncements();
}