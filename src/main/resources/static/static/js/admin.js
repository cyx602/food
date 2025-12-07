let currentOrderStatus = '';

document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
    setupMenuTabs();
    updateAdminInfo();
    const userMenuBtn = document.querySelector('.menu-item[data-target="users"]');
    if (userMenuBtn) {
        userMenuBtn.click();
    }
});

// 1. 权限检查与界面渲染 (已修改：匹配个人中心风格)
function checkAdminAuth() {
    const userJson = sessionStorage.getItem('currentUser');
    const container = document.querySelector('.admin-container');

    // 定义统一锁屏 HTML (与my_recipes.html保持一致，移除flex居中，添加标题)
    const getLockHtml = (msg, btnText, btnLink) => `
        <div style="width: 100%;">
            <h1 class="page-title">后台管理</h1>
            <div class="lock-container">
                <i class="fas fa-lock lock-icon"></i>
                <div class="lock-text">${msg}</div>
                <a href="${btnLink}" class="lock-btn">${btnText}</a>
            </div>
        </div>
    `;

    // 情况 A: 未登录
    if (!userJson) {
        if(container) container.innerHTML = getLockHtml('请登录管理员账号以访问后台', '立即登录', 'login.html');
        return;
    }

    // 情况 B: 权限不足
    const user = JSON.parse(userJson);
    if (user.username !== 'admin' && user.role !== 'admin') {
        if(container) {
            container.innerHTML = getLockHtml('当前账号无权访问后台', '切换账号', 'login.html');
        }
    }
}

function updateAdminInfo() {
    const userJson = sessionStorage.getItem('currentUser');
    if (userJson) {
        const user = JSON.parse(userJson);
        const adminNameEl = document.getElementById('adminUserName');
        if(adminNameEl) {
            adminNameEl.innerHTML = `管理员: <b>${user.username}</b>`;
        }
    }
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'login.html';
}

async function handleResponse(res) {
    if (res.status === 401 || res.status === 403) {
        // 修改：使用 Toast 提示
        if(window.showToast) window.showToast('登录已过期或权限不足，请重新登录', 'error');
        else alert('登录已过期或权限不足，请重新登录');

        setTimeout(() => window.location.href = 'login.html', 1500);
        throw new Error('Unauthorized');
    }
    if (!res.ok) {
        throw new Error('Network response was not ok');
    }
    return await res.json();
}

function setupMenuTabs() {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            document.getElementById('pageTitle').innerText = item.innerText.trim();

            if (targetId === 'users') loadUserList(1);
            if (targetId === 'recipes') loadRecipeList(1);
            if (targetId === 'ingredients') loadIngredientList(1);
            if (targetId === 'cuisines') loadCuisineList(1);
            if (targetId === 'orders') { loadOrderList(1); loadOrderStats(); }
            if (targetId === 'settings') loadAnnouncements();
        });
    });
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) event.target.style.display = "none";
    }
}

// 通用分页渲染函数
function renderPagination(containerId, currentPage, total, pageSize, loadFunc) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const totalPages = Math.ceil(total / pageSize);
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const createBtn = (text, page, disabled, active) => {
        const btn = document.createElement('button');
        btn.className = `page-btn ${text.length > 2 ? 'text-btn' : ''} ${active ? 'active' : ''}`;
        btn.innerHTML = text;
        if (disabled) btn.disabled = true;
        btn.onclick = () => {
            if (!disabled && !active) {
                loadFunc(page);
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

// 2. 用户管理
async function loadUserList(page = 1) {
    const tbody = document.getElementById('userTableBody');
    const keyword = document.getElementById('userSearch').value.trim();

    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">加载中...</td></tr>';
    try {
        const res = await fetch(`/api/admin/users?page=${page}&size=10&keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const users = data.rows || [];

        tbody.innerHTML = users.map(u => {
            const status = (u.status === undefined || u.status === null) ? 1 : u.status;
            return `
            <tr>
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email || '-'}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                <td><span class="status-badge ${status === 1 ? 'status-normal' : 'status-banned'}">${status === 1 ? '正常' : '禁用'}</span></td>
                <td>
                    ${u.username !== 'admin' ?
                `<button class="btn btn-sm ${status===1?'status-banned':'status-normal'}" style="border:none; cursor:pointer;" onclick="toggleUserStatus(${u.id}, ${status})">${status===1?'禁用':'解封'}</button>` :
                '<span style="color:#ccc">不可操作</span>'}
                </td>
            </tr>
        `}).join('');
        renderPagination('userPagination', page, data.total, 10, loadUserList);
    } catch(e) { tbody.innerHTML = '<tr><td colspan="6">加载失败</td></tr>'; }
}

function toggleUserStatus(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const actionText = newStatus === 1 ? '解封' : '禁用';

    // 修改：使用 showConfirm
    window.showConfirm(`确定要${actionText}该用户吗？`, async function() {
        try {
            await fetch('/api/admin/user/status', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id, status: newStatus}) });
            window.showToast('操作成功');
            loadUserList(1);
        } catch(e) {
            window.showToast('操作失败', 'error');
        }
    });
}

// 3. 食谱管理
async function loadRecipeList(page = 1) {
    const tbody = document.getElementById('recipeTableBody');
    const keyword = document.getElementById('recipeSearch').value.trim();

    try {
        const res = await fetch(`/api/admin/recipes?page=${page}&size=10&keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const list = data.rows || [];

        tbody.innerHTML = list.map(r => {
            let statusBadge = '<span class="status-badge status-pending">待审核</span>';
            let auditBtns = `
                <button onclick="auditRecipe(${r.id}, 1)" style="color:green; border:none; background:none; cursor:pointer; margin-right:5px;">通过</button>
                <button onclick="auditRecipe(${r.id}, 2)" style="color:red; border:none; background:none; cursor:pointer;">拒绝</button>
            `;

            if (r.status === 1) {
                statusBadge = '<span class="status-badge status-approved">已通过</span>';
                auditBtns = '';
            } else if (r.status === 2) {
                statusBadge = '<span class="status-badge status-rejected">已拒绝</span>';
                auditBtns = `<button onclick="auditRecipe(${r.id}, 1)" style="color:green; border:none; background:none; cursor:pointer;">重新通过</button>`;
            }

            return `
            <tr>
                <td>${r.id}</td>
                <td>${r.title}</td>
                <td>${r.authorName || '未知'}</td>
                <td>${statusBadge}</td>
                <td><input type="checkbox" ${r.isRecommended ? 'checked' : ''} onchange="toggleRecommend(${r.id}, this.checked)"></td>
                <td>
                    ${auditBtns}
                    <button onclick="adminDeleteRecipe(${r.id})" style="color:#666; border:none; background:none; cursor:pointer; margin-left:5px;"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `}).join('');
        renderPagination('recipePagination', page, data.total, 10, loadRecipeList);
    } catch(e) {}
}

function auditRecipe(id, status) {
    const action = status === 1 ? '通过' : '拒绝';

    // 修改：使用 showConfirm
    window.showConfirm(`确定${action}该食谱吗？`, async function() {
        const res = await fetch('/api/admin/recipe/audit', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, status})
        });
        if((await res.json()).success) {
            window.showToast('操作成功');
            loadRecipeList(1);
        } else {
            window.showToast('操作失败', 'error');
        }
    });
}

async function toggleRecommend(id, isRecommended) {
    await fetch('/api/admin/recipe/recommend', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id, isRecommended}) });
    window.showToast(isRecommended ? '已推荐' : '已取消推荐');
}

function adminDeleteRecipe(id) {
    // 修改：使用 showConfirm
    window.showConfirm('确定要强制删除该食谱吗？此操作不可恢复。', async function() {
        const res = await fetch('/api/admin/recipe/delete', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        if((await res.json()).success) {
            window.showToast('删除成功');
            loadRecipeList(1);
        } else {
            window.showToast('删除失败', 'error');
        }
    });
}

// 4. 订单管理
async function loadOrderList(page = 1) {
    const tbody = document.getElementById('orderTableBody');
    const keyword = document.getElementById('orderSearch').value.trim();

    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">加载中...</td></tr>';

    try {
        let url = `/api/admin/orders?page=${page}&size=10&keyword=${encodeURIComponent(keyword)}`;
        if (currentOrderStatus) {
            url += `&status=${currentOrderStatus}`;
        }

        const res = await fetch(url);
        const data = await handleResponse(res);
        const list = data.rows || [];
        const total = data.total || 0;

        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">暂无相关订单</td></tr>';
        } else {
            const statusMap = {
                'PENDING': '<span class="status-badge status-pending">待发货</span>',
                'SHIPPED': '<span class="status-badge status-approved" style="background:#e3f2fd;color:#0d47a1;">已发货</span>',
                'COMPLETED': '<span class="status-badge status-approved">已完成</span>',
                'CANCELLED': '<span class="status-badge status-rejected" style="background:#eee;color:#999;">已取消</span>'
            };

            tbody.innerHTML = list.map(o => `
                <tr>
                    <td>${o.orderNo || o.id}</td>
                    <td>${o.userName || '未知用户'}</td>
                    <td style="color:#f7941e; font-weight:bold;">¥${(o.totalAmount || 0).toFixed(2)}</td>
                    <td>
                        <select onchange="updateOrderStatus(${o.id}, this.value)" style="padding:4px; border-radius:4px; border:1px solid #ddd;">
                            <option value="PENDING" ${o.status==='PENDING'?'selected':''}>待发货</option>
                            <option value="SHIPPED" ${o.status==='SHIPPED'?'selected':''}>已发货</option>
                            <option value="COMPLETED" ${o.status==='COMPLETED'?'selected':''}>已完成</option>
                            <option value="CANCELLED" ${o.status==='CANCELLED'?'selected':''}>已取消</option>
                        </select>
                    </td>
                    <td>${o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                </tr>
            `).join('');
        }
        renderPagination('orderPagination', page, total, 10, loadOrderList);
    } catch(e) {
        console.error(e);
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">加载失败</td></tr>';
    }
}

async function updateOrderStatus(id, status) {
    await fetch('/api/admin/order/status', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id, status}) });
    window.showToast('订单状态已更新');
    loadOrderStats(); // 假设这个函数存在（原代码有调用）
}

// 为了代码完整性，补充原代码中引用但未定义的 loadOrderStats (虽然原问题没贴，但避免报错)
function loadOrderStats() {
    // 实际项目中这里应请求后端统计接口
}

// 5. 菜系 & 食材 & 公告
async function loadIngredientList(page = 1) {
    const tbody = document.getElementById('ingredientTableBody');
    const keyword = document.getElementById('ingredientSearch').value.trim();

    try {
        const res = await fetch(`/api/admin/ingredients?page=${page}&size=10&keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const list = data.rows || [];
        tbody.innerHTML = list.map(i => `
            <tr>
                <td><img src="${i.image}" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" onerror="this.src='static/image/default_food.jpg'"></td>
                <td>${i.name}</td>
                <td>${i.categoryId}</td>
                <td>¥${i.price} / ${i.unit}</td>
                <td>${i.stock}</td>
                <td>
                    <button onclick='editIngredient(${JSON.stringify(i).replace(/'/g, "&#39;")})' style="color:#007bff; border:none; background:none; cursor:pointer;">编辑</button>
                    <button onclick="deleteIngredient(${i.id})" style="color:#dc3545; border:none; background:none; cursor:pointer; margin-left:5px;">删除</button>
                </td>
            </tr>
        `).join('');
        renderPagination('ingredientPagination', page, data.total, 10, loadIngredientList);
    } catch(e) {}
}

async function loadCuisineList(page = 1) {
    const tbody = document.getElementById('cuisineTableBody');
    const keyword = document.getElementById('cuisineSearch').value.trim();

    try {
        const res = await fetch(`/api/admin/cuisines?page=${page}&size=10&keyword=${encodeURIComponent(keyword)}`);
        const data = await res.json();
        const list = data.rows || [];
        tbody.innerHTML = list.map(c => `
            <tr>
                <td>${c.name}</td>
                <td>${c.code}</td>
                <td>${c.description || '-'}</td>
                <td>
                    <button onclick='editCuisine(${JSON.stringify(c).replace(/'/g, "&#39;")})' style="color:#007bff; border:none; background:none; cursor:pointer;">编辑</button>
                    <button onclick="deleteCuisine(${c.id})" style="color:#dc3545; border:none; background:none; cursor:pointer; margin-left:5px;">删除</button>
                </td>
            </tr>
        `).join('');
        renderPagination('cuisinePagination', page, data.total, 10, loadCuisineList);
    } catch(e) {}
}

async function loadAnnouncements() {
    try {
        const res = await fetch('/api/admin/announcements?t=' + new Date().getTime());
        if (!res.ok) throw new Error("加载失败");
        const list = await res.json();
        const container = document.getElementById('announcementList');
        if (list.length === 0) {
            container.innerHTML = '<li style="padding:10px;text-align:center;color:#999;">暂无公告</li>';
            return;
        }
        container.innerHTML = list.map(a => `
            <li style="margin-bottom:10px; padding:10px; background:#fffaf0; border:1px solid #f0e6d8; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:bold; color:#664b2e;">${a.title}</span>
                <span>
                    <span style="font-size:12px; color:#999; margin-right:15px;">
                        ${new Date(a.createdAt).toLocaleDateString()}
                    </span>
                    <button onclick="deleteAnnouncement(${a.id})" style="color:#ff6b6b; border:none; background:none; cursor:pointer; font-size:16px;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </span>
            </li>
        `).join('');
    } catch (e) {
        console.error("加载公告出错:", e);
        document.getElementById('announcementList').innerHTML = '<li style="color:red;text-align:center;">加载失败</li>';
    }
}

function filterOrders(status, btn) {
    currentOrderStatus = status === 'ALL' ? '' : status;
    document.querySelectorAll('.filter-group .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadOrderList(1);
}

// ---------------- 底部增删改辅助函数 (全部替换为自定义弹窗) ----------------

function openIngredientModal() {
    document.getElementById('ingredientForm').reset();
    document.getElementById('ingId').value = '';
    document.getElementById('ingredientModal').style.display = 'flex';
}

function editIngredient(i) {
    document.getElementById('ingId').value = i.id;
    document.getElementById('ingName').value = i.name;
    document.getElementById('ingCategory').value = i.categoryId;
    document.getElementById('ingPrice').value = i.price;
    document.getElementById('ingUnit').value = i.unit;
    document.getElementById('ingStock').value = i.stock;
    document.getElementById('ingImage').value = i.image;
    document.getElementById('ingredientModal').style.display = 'flex';
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
    await fetch('/api/admin/ingredient/save', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    document.getElementById('ingredientModal').style.display = 'none';
    window.showToast('食材保存成功');
    loadIngredientList(1);
}

function deleteIngredient(id) {
    window.showConfirm('确定要删除该食材吗？', async function() {
        await fetch('/api/admin/ingredient/delete', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        window.showToast('删除成功');
        loadIngredientList(1);
    });
}

function openCuisineModal() {
    document.getElementById('cuisineForm').reset();
    document.getElementById('cuiId').value='';
    document.getElementById('cuisineModal').style.display='flex';
}

function editCuisine(c) {
    document.getElementById('cuiId').value=c.id;
    document.getElementById('cuiName').value=c.name;
    document.getElementById('cuiCode').value=c.code;
    document.getElementById('cuiDesc').value=c.description;
    document.getElementById('cuisineModal').style.display='flex';
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
    window.showToast('菜系保存成功');
    loadCuisineList(1);
}

function deleteCuisine(id) {
    window.showConfirm('确定要删除该菜系吗？', async function() {
        await fetch('/api/admin/cuisine/delete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
        window.showToast('删除成功');
        loadCuisineList(1);
    });
}

async function publishAnnouncement() {
    const title = document.getElementById('annTitle').value;
    const content = document.getElementById('annContent').value;
    if(!title) return window.showToast('标题不能为空', 'error');
    try {
        const res = await fetch('/api/admin/announcement/publish', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title, content})
        });
        if (res.ok) {
            window.showToast('公告发布成功');
            document.getElementById('annTitle').value = '';
            document.getElementById('annContent').value = '';
            loadAnnouncements();
        } else {
            window.showToast('发布失败，请检查后台日志', 'error');
        }
    } catch (e) {
        console.error(e);
        window.showToast('网络请求出错', 'error');
    }
}

function deleteAnnouncement(id) {
    window.showConfirm('确定要删除这条公告吗？', async function() {
        await fetch('/api/admin/announcement/delete', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id}) });
        window.showToast('删除成功');
        loadAnnouncements();
    });
}