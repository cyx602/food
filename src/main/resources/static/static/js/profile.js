const ALL_CUISINES = [
    { id: 'chinese', name: '中餐', icon: 'fas fa-utensils' },
    { id: 'western', name: '西餐', icon: 'fas fa-pizza-slice' },
    { id: 'japanese', name: '日料', icon: 'fas fa-fish' },
    { id: 'korean', name: '韩式', icon: 'fas fa-pepper-hot' },
    { id: 'thai', name: '泰式', icon: 'fas fa-leaf' },
    { id: 'dessert', name: '甜点', icon: 'fas fa-ice-cream' }
];

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function getAddressKey() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) return null;
    return 'userAddresses_' + user.username;
}

function checkLoginStatus() {
    const user = sessionStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');

    // 顶部导航栏处理
    if (user && authSection) {
        authSection.style.display = 'none'; // 隐藏登录注册按钮，显示头像在 index.js 中处理
    }

    if (user) {
        loadProfile();
    } else {
        // --- 核心修改：渲染锁屏样式 ---
        document.getElementById('profileContent').innerHTML = `
                <div class="lock-container">
                    <i class="fas fa-lock lock-icon"></i>
                    <div class="lock-text">请先登录以查看个人中心</div>
                    <a href="login.html" class="lock-btn">立即登录</a>
                </div>
            `;
    }
}

async function loadProfile() {
    try {
        const res = await fetch('/api/current-user');
        if(res.status === 401) {
            sessionStorage.removeItem('currentUser');
            checkLoginStatus(); // 重新触发锁屏
            return;
        }
        const user = await res.json();

        // 更新缓存
        const sessionUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        user.role = user.role || sessionUser.role;
        sessionStorage.setItem('currentUser', JSON.stringify(user));

        renderProfile(user); // 关键调用
    } catch(e) { console.error(e); }
}

function renderOrderPagination(total) {
    const container = document.getElementById('orderPagination');
    const totalPages = Math.ceil(total / orderPageSize);
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const createBtn = (text, page, disabled, active) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        if(disabled) btn.disabled = true;
        if(active) btn.className = 'active';
        btn.onclick = () => { if(!disabled && !active) { currentOrderPage = page; loadOrders(); } };
        return btn;
    };

    container.appendChild(createBtn('首页', 1, currentOrderPage === 1, false));
    container.appendChild(createBtn('上一页', currentOrderPage - 1, currentOrderPage === 1, false));

    const delta = 1; const range = []; const rangeWithDots = []; let l;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentOrderPage - delta && i <= currentOrderPage + delta)) range.push(i);
    }
    for (let i of range) {
        if (l) {
            if (i - l === 2) rangeWithDots.push(l + 1);
            else if (i - l !== 1) rangeWithDots.push('...');
        }
        rangeWithDots.push(i); l = i;
    }

    rangeWithDots.forEach(item => {
        if (item === '...') {
            const span = document.createElement('span');
            span.className = 'page-ellipsis';
            span.innerText = '...';
            container.appendChild(span);
        } else {
            container.appendChild(createBtn(item, item, false, item === currentOrderPage));
        }
    });

    container.appendChild(createBtn('下一页', currentOrderPage + 1, currentOrderPage === totalPages, false));
    container.appendChild(createBtn('末页', totalPages, currentOrderPage === totalPages, false));
}

function switchTab(tabName, element) {
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    if(element) element.classList.add('active');

    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(tabName + 'Section').classList.add('active');

    if(tabName === 'address') {
        loadAddresses();
    }
}

function renderPreferences(userStyles) {
    if(!userStyles || userStyles.length === 0) return '<p style="color:#999; grid-column:1/-1; text-align:center;">暂无偏好</p>';
    return ALL_CUISINES.map(c => {
        const isActive = userStyles.includes(c.id);
        return `<div class="preference-card ${isActive ? 'active' : ''}"><div class="preference-icon"><i class="${c.icon}"></i></div><div class="preference-name">${c.name}</div></div>`;
    }).join('');
}

// --- 收货地址相关逻辑 ---
let currentAddressPage = 1;
const addressPageSize = 3;

function loadAddresses() {
    const key = getAddressKey();
    if (!key) return;

    let list = JSON.parse(localStorage.getItem(key) || '[]');

    // 3. 修复：如果地址为空，自动同步注册时的地址
    if (list.length === 0) {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user && user.address) {
            const defaultAddr = {
                id: Date.now(),
                name: '注册地址',
                recipient: user.username,
                phone: user.phone || '',
                detail: user.address,
                isDefault: true
            };
            list.push(defaultAddr);
            localStorage.setItem(key, JSON.stringify(list));
        }
    }

    const container = document.getElementById('addressList');

    if (list.length === 0) {
        container.innerHTML = '<p style="color:#999;text-align:center; padding: 30px;">暂无收货地址</p>';
        document.getElementById('addressPagination').innerHTML = '';
        return;
    }

    const total = list.length;
    const totalPages = Math.ceil(total / addressPageSize);
    if (currentAddressPage > totalPages) currentAddressPage = 1;

    const start = (currentAddressPage - 1) * addressPageSize;
    const end = start + addressPageSize;
    const pageList = list.slice(start, end);

    container.innerHTML = pageList.map(addr => `
            <div class="address-item ${addr.isDefault ? 'default' : ''}">
                <div class="address-top-row"><span class="address-tag">${addr.name} ${addr.isDefault ? '(默认)' : ''}</span></div>
                <div class="address-text-group"><div class="address-row"><span>${addr.recipient}</span><span>${addr.phone}</span></div><div>${addr.detail || addr.address || ''}</div></div>
                <div class="address-actions">
                    <button class="addr-btn edit" onclick="editAddress(${addr.id})">修改</button>
                    <button class="addr-btn del" onclick="deleteAddress(${addr.id})">删除</button>
                    ${!addr.isDefault ? `<button class="addr-btn def" onclick="setDefaultAddress(${addr.id})">设为默认</button>` : ''}
                </div>
            </div>`).join('');

    renderAddressPagination(totalPages);
}

function renderAddressPagination(totalPages) {
    const container = document.getElementById('addressPagination');
    container.innerHTML = '';
    if (totalPages <= 1) return;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentAddressPage === 1;
    prevBtn.onclick = () => { if(currentAddressPage > 1) { currentAddressPage--; loadAddresses(); } };
    container.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = i === currentAddressPage ? 'active' : '';
        btn.textContent = i;
        btn.onclick = () => { currentAddressPage = i; loadAddresses(); };
        container.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentAddressPage === totalPages;
    nextBtn.onclick = () => { if(currentAddressPage < totalPages) { currentAddressPage++; loadAddresses(); } };
    container.appendChild(nextBtn);
}

// 地址增删改查函数 (保持之前逻辑，略)
function openAddressModal() {
    document.getElementById('addressForm').reset();
    document.getElementById('addrId').value='';
    document.getElementById('addrModalTitle').innerText = '新增地址';
    document.getElementById('addressModal').style.display='flex';
}
function editAddress(id) {
    const key = getAddressKey();
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const addr = list.find(a => a.id === id);
    if(!addr) return;
    document.getElementById('addrId').value = addr.id;
    document.getElementById('addrName').value = addr.name;
    document.getElementById('addrRecipient').value = addr.recipient;
    document.getElementById('addrPhone').value = addr.phone;
    document.getElementById('addrDetail').value = addr.detail || addr.address || '';
    document.getElementById('addrModalTitle').innerText = '修改地址';
    document.getElementById('addressModal').style.display='flex';
}
function closeAddressModal() { document.getElementById('addressModal').style.display='none'; }
function saveAddress(e) {
    e.preventDefault();
    const key = getAddressKey();
    if (!key) return;
    const idInput = document.getElementById('addrId').value;
    const list = JSON.parse(localStorage.getItem(key) || '[]');
    const newAddrData = {
        name: document.getElementById('addrName').value,
        recipient: document.getElementById('addrRecipient').value,
        phone: document.getElementById('addrPhone').value,
        detail: document.getElementById('addrDetail').value
    };
    if (idInput) {
        const index = list.findIndex(a => a.id == idInput);
        if(index !== -1) list[index] = { ...list[index], ...newAddrData };
    } else {
        const newAddr = { id: Date.now(), ...newAddrData, isDefault: list.length === 0 };
        list.push(newAddr);
    }
    localStorage.setItem(key, JSON.stringify(list));
    closeAddressModal();
    loadAddresses();
    showToast('地址保存成功');
}
function deleteAddress(id) {
    showConfirm('确定删除该地址吗？', function() {
        const key = getAddressKey();
        let list = JSON.parse(localStorage.getItem(key)||'[]');
        list = list.filter(a=>a.id!==id);
        localStorage.setItem(key, JSON.stringify(list));
        loadAddresses();
        showToast('地址已删除');
    });
}

function setDefaultAddress(id) { const key = getAddressKey(); let list = JSON.parse(localStorage.getItem(key)||'[]'); list.forEach(a=>a.isDefault=(a.id===id)); localStorage.setItem(key, JSON.stringify(list)); loadAddresses(); }

async function logout() {
    showConfirm('确定要退出登录吗？', async function() {
        await fetch('/api/logout');
        sessionStorage.clear();
        window.location.href='login.html';
    });
}

async function deleteAccount() {
    showConfirm('确定要注销账号吗？此操作不可逆！', async function() {
        await fetch('/api/user/delete', {method:'POST'});
        sessionStorage.clear();
        window.location.href='index.html';
    });
}

// --- 修改资料 (含头像上传) ---
function openEditProfile() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!user) return;

    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editEmail').value = user.email || '';

    // 头像回显
    const avatarPath = user.avatarFileName ? 'static/upload/'+user.avatarFileName : 'static/image/default_avatar.jpg';
    document.getElementById('editAvatarPreview').src = avatarPath;

    const genderRadios = document.getElementsByName('editGender');
    for(let r of genderRadios) {
        r.checked = (r.value === user.gender);
    }

    const prefContainer = document.getElementById('editPreferencesList');
    const userStyles = user.styles || [];

    prefContainer.innerHTML = ALL_CUISINES.map(c => {
        const isChecked = userStyles.includes(c.id) ? 'checked' : '';
        return `<label class="checkbox-label"><input type="checkbox" name="editStyles" value="${c.id}" ${isChecked}>${c.name}</label>`;
    }).join('');

    document.getElementById('profileEditModal').style.display='flex';
}

// 头像预览
function previewEditAvatar(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('editAvatarPreview').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function renderProfile(user) {
    const container = document.getElementById('profileContent');
    const avatarPath = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';

    // 处理美食偏好显示
    const stylesHtml = renderPreferences(user.styles);

    container.innerHTML = `
            <div class="profile-layout">
                <div class="profile-sidebar common-card-style">
                    <div class="profile-avatar">
                        <img src="${avatarPath}" class="avatar-image" onerror="this.src='static/image/default_avatar.jpg'">
                        <h3 style="color:#664b2e; margin:10px 0;">${user.username}</h3>
                        <div style="font-size:12px; color:#888;">加入时间: ${new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>

                    <div class="profile-menu">
                        <div class="menu-item active" onclick="switchTab('info', this)"><i class="fas fa-id-card"></i> 个人资料</div>
                        <div class="menu-item" onclick="switchTab('address', this)"><i class="fas fa-map-marker-alt"></i> 收货地址</div>
                        <div class="menu-item" onclick="switchTab('order', this)"><i class="fas fa-shopping-bag"></i> 我的订单</div>
                    </div>

                    <div class="sidebar-actions">
                        <button class="logout-btn-side" onclick="logout()">退出登录</button>
                        <button class="delete-account-btn" onclick="deleteAccount()">注销账号</button>
                    </div>
                </div>

                <div class="profile-content common-card-style">
                    <div id="infoSection" class="content-section active">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                            <h2 class="section-title" style="margin-bottom:0; border:none;">个人资料</h2>
                            <button onclick="openEditProfile()" class="btn btn-primary btn-sm"><i class="fas fa-edit"></i> 编辑资料</button>
                        </div>
                        <div class="section-divider" style="margin-top:0;"></div>

                        <div class="info-grid">
                            <div class="info-item"><div class="info-label">用户名</div><div class="info-value">${user.username}</div></div>
                            <div class="info-item"><div class="info-label">性别</div><div class="info-value">${user.gender === 'male' ? '男' : (user.gender === 'female' ? '女' : '保密')}</div></div>
                            <div class="info-item"><div class="info-label">手机号</div><div class="info-value">${user.phone || '未填写'}</div></div>
                            <div class="info-item"><div class="info-label">邮箱</div><div class="info-value">${user.email || '未填写'}</div></div>
                        </div>

                        <div class="info-item" style="margin-top:30px; margin-bottom:20px;">
                            <h2 class="section-title" style="margin-bottom:20px; border:none;">美食偏好</h2>
                            <div class="section-divider" style="margin-top:0; margin-bottom:20px;"></div>
                            <div class="preferences-grid" style="grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));">
                                ${stylesHtml}
                            </div>
                        </div>
                    </div>

                    <div id="addressSection" class="content-section">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                            <h2 class="section-title" style="margin-bottom:0; border:none;">收货地址管理</h2>
                            <button onclick="openAddressModal()" class="btn btn-primary btn-sm"><i class="fas fa-plus"></i> 新增地址</button>
                        </div>
                        <div class="section-divider" style="margin-top:0;"></div>
                        <div id="addressList" class="address-list"></div>
                        <div id="addressPagination" class="pagination"></div>
                    </div>

                    <div id="orderSection" class="content-section">
                        <h2 class="section-title">我的订单</h2>
                        <div style="display:flex; margin-bottom:20px;">
                            <input type="text" id="orderSearchInput" placeholder="搜索订单号..." style="padding:8px; border:1px solid #d9b38c; border-radius:4px 0 0 4px; border-right:none; outline:none;">
                            <button onclick="searchOrders()" style="padding:8px 15px; background:#f7941e; color:white; border:none; border-radius:0 4px 4px 0; cursor:pointer;"><i class="fas fa-search"></i></button>
                        </div>
                        <div id="ordersList"></div>
                        <div id="orderPagination" class="pagination"></div>
                    </div>
                </div>
            </div>
        `;

    // 初始加载子模块数据
    loadOrders();
}

async function saveProfileChanges(e) {
    e.preventDefault();

    // 1. 获取表单数据
    const username = document.getElementById('editUsername').value.trim();
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    let gender = '';
    const genderRadios = document.getElementsByName('editGender');
    for(let r of genderRadios) { if(r.checked) gender = r.value; }
    const selectedStyles = [];
    const styleBoxes = document.getElementsByName('editStyles');
    for(let box of styleBoxes) { if(box.checked) selectedStyles.push(box.value); }

    const payload = { username, phone, email, gender, styles: selectedStyles };

    // 2. 如果有新头像，先上传
    const fileInput = document.getElementById('editAvatarInput');
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('avatar', fileInput.files[0]);
        try {
            const uploadRes = await fetch('/api/upload-avatar', { method: 'POST', body: formData });
            const uploadData = await uploadRes.json();
            if (uploadData.success) {
                payload.avatarFileName = uploadData.fileName; // 将新文件名加入 payload
            } else {
                alert('头像上传失败: ' + uploadData.message);
                return;
            }
        } catch (err) {
            console.error("头像上传异常", err);
            alert('头像上传网络错误');
            return;
        }
    }

    // 3. 提交资料更新
    try {
        const res = await fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if(data.success) {
            showToast('个人信息修改成功');
            document.getElementById('profileEditModal').style.display='none';
            loadProfile(); // 刷新页面数据
        } else {
            alert(data.message || '修改失败');
        }
    } catch(err) {
        console.error(err);
        alert('网络错误');
    }
}

// ... 订单相关代码 (保持不变) ...
let currentOrderPage = 1;
const orderPageSize = 5;
let currentOrderKeyword = '';
let currentOrderData = [];
let activeOrderId = null;

function searchOrders() {
    currentOrderKeyword = document.getElementById('orderSearchInput').value.trim();
    currentOrderPage = 1;
    loadOrders();
}

function loadOrders() {
    const container = document.getElementById('ordersList');
    container.innerHTML = '<p style="text-align:center; color:#999; padding:20px;">正在获取订单信息...</p>';

    let url = `/api/order/list?page=${currentOrderPage}&size=${orderPageSize}`;
    if (currentOrderKeyword) url += `&keyword=${encodeURIComponent(currentOrderKeyword)}`;

    fetch(url)
        .then(r => r.json())
        .then(data => {
            const list = data.rows || [];
            const total = data.total || 0;
            currentOrderData = list;

            if (list.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:40px; color:#999;">暂无订单</div>`;
                document.getElementById('orderPagination').innerHTML = '';
                return;
            }

            const statusMap = {
                'PENDING': { text: '待发货', color: '#f7941e', icon: 'fa-clock' },
                'SHIPPED': { text: '已发货', color: '#2196F3', icon: 'fa-shipping-fast' },
                'COMPLETED': { text: '已完成', color: '#8cc63f', icon: 'fa-check-circle' },
                'CANCELLED': { text: '已取消', color: '#999', icon: 'fa-times-circle' }
            };

            container.innerHTML = list.map((o, index) => {
                const statusInfo = statusMap[o.status] || { text: o.status, color: '#666', icon: 'fa-info-circle' };
                const dateStr = new Date(o.createdAt).toLocaleString();
                const itemCount = o.items ? o.items.length : 0;

                return `
                        <div class="order-card" onclick="showOrderDetail(${index})">
                            <div class="order-header">
                                <div>
                                    <span class="order-no">${o.orderNo}</span>
                                    <span class="order-time">${dateStr}</span>
                                </div>
                                <span style="color: ${statusInfo.color}; font-weight: bold; font-size: 14px; display: flex; align-items: center; gap: 5px;">
                                    <i class="fas ${statusInfo.icon}"></i> ${statusInfo.text}
                                </span>
                            </div>
                            <div class="order-body">
                                <div>
                                    <div class="order-summary">共 <span style="color:#f7941e;font-weight:bold;">${itemCount}</span> 件商品</div>
                                    <div style="font-size:12px; color:#999; margin-top:5px;">点击查看商品详情 ></div>
                                </div>
                                <div class="order-total">¥${o.totalAmount.toFixed(2)}</div>
                            </div>
                        </div>
                    `;
            }).join('');

            renderOrderPagination(total);
        })
        .catch(e => {
            console.error("加载订单失败", e);
            container.innerHTML = '<p style="color:red; text-align:center;">加载失败</p>';
        });
}

function showOrderDetail(index) {
    const order = currentOrderData[index];
    if(!order) return;
    activeOrderId = order.id;
    document.getElementById('modalOrderNo').innerText = order.orderNo;
    document.getElementById('modalOrderTime').innerText = new Date(order.createdAt).toLocaleString();
    document.getElementById('modalReceiver').innerText = order.receiverName || '';
    document.getElementById('modalPhone').innerText = order.receiverPhone || '';
    document.getElementById('modalAddress').innerText = order.receiverAddress || '';
    document.getElementById('editReceiverName').value = order.receiverName || '';
    document.getElementById('editReceiverPhone').value = order.receiverPhone || '';
    document.getElementById('editReceiverAddress').value = order.receiverAddress || '';
    document.getElementById('modalTotalAmount').innerText = '¥' + order.totalAmount.toFixed(2);
    document.getElementById('modalTotalCount').innerText = order.items ? order.items.length : 0;

    const itemsContainer = document.getElementById('modalItemsList');
    if (order.items && order.items.length > 0) {
        itemsContainer.innerHTML = order.items.map(item => `
                <div class="detail-item">
                    <div>
                        <div class="detail-name">${item.name}</div>
                        <div class="detail-meta">单价: ¥${item.price}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="color:#666;">x ${item.quantity}</div>
                        <div class="detail-price">¥${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                </div>
            `).join('');
    } else {
        itemsContainer.innerHTML = '<p style="text-align:center; color:#999;">暂无商品明细</p>';
    }
    cancelEditingAddress();
    const btnEdit = document.getElementById('btnStartEdit');
    if (order.status === 'PENDING') {
        btnEdit.style.display = 'inline-block';
    } else {
        btnEdit.style.display = 'none';
    }
    document.getElementById('orderDetailModal').style.display = 'flex';
}

function startEditingAddress() {
    document.querySelectorAll('.display-text').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'inline-block');
    document.getElementById('btnStartEdit').style.display = 'none';
    document.getElementById('btnSaveAddress').style.display = 'inline-block';
    document.getElementById('btnCancelEdit').style.display = 'inline-block';
}

function cancelEditingAddress() {
    document.querySelectorAll('.display-text').forEach(el => el.style.display = 'inline');
    document.querySelectorAll('.edit-input').forEach(el => el.style.display = 'none');
    document.getElementById('btnSaveAddress').style.display = 'none';
    document.getElementById('btnCancelEdit').style.display = 'none';
    const order = currentOrderData.find(o => o.id === activeOrderId);
    if(order && order.status === 'PENDING') {
        document.getElementById('btnStartEdit').style.display = 'inline-block';
    }
}

async function saveOrderAddress() {
    const name = document.getElementById('editReceiverName').value.trim();
    const phone = document.getElementById('editReceiverPhone').value.trim();
    const addr = document.getElementById('editReceiverAddress').value.trim();
    if(!name || !phone || !addr) return showToast('收货信息不能为空', 'error');
    try {
        const res = await fetch('/api/order/update-address', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: activeOrderId,
                receiverName: name,
                receiverPhone: phone,
                receiverAddress: addr
            })
        });
        const data = await res.json();
        if(data.success) {
            showToast('地址修改成功');
            closeOrderModal();
            loadOrders();
        } else {
            showToast(data.message, 'error');
        }
    } catch(e) { showToast('网络错误', 'error'); }
}

async function deleteCurrentOrder() {
    showConfirm('确定要删除该订单吗？删除后不可恢复。', async function() {
        try {
            const res = await fetch('/api/order/delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ id: activeOrderId })
            });
            const data = await res.json();
            if(data.success) {
                showToast('订单已删除');
                closeOrderModal();
                loadOrders();
            } else {
                showToast(data.message || '删除失败', 'error');
            }
        } catch(e) { showToast('操作失败', 'error'); }
    });
}

function closeOrderModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
    activeOrderId = null;
}

// --- 修改后：处理页面上所有模态框的点击外部关闭事件 ---
window.onclick = function(event) {
    // 1. 订单详情弹窗
    const orderModal = document.getElementById('orderDetailModal');
    if (event.target == orderModal) {
        closeOrderModal();
    }

    // 2. 地址编辑/新增弹窗
    const addressModal = document.getElementById('addressModal');
    if (event.target == addressModal) {
        closeAddressModal();
    }

    // 3. 个人信息修改弹窗
    const profileModal = document.getElementById('profileEditModal');
    if (event.target == profileModal) {
        profileModal.style.display = 'none';
    }
}
function renderOrderPagination(total) {
    const container = document.getElementById('orderPagination');
    const totalPages = Math.ceil(total / orderPageSize);
    container.innerHTML = '';
    if (totalPages <= 0) return;
    const firstBtn = document.createElement('button');
    firstBtn.textContent = '首页';
    firstBtn.disabled = currentOrderPage === 1;
    firstBtn.onclick = () => { currentOrderPage = 1; loadOrders(); };
    container.appendChild(firstBtn);
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '上一页';
    prevBtn.disabled = currentOrderPage === 1;
    prevBtn.onclick = () => { if(currentOrderPage > 1) { currentOrderPage--; loadOrders(); } };
    container.appendChild(prevBtn);
    let startPage = Math.max(1, currentOrderPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);
    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = i === currentOrderPage ? 'active' : '';
        btn.textContent = i;
        btn.onclick = () => { currentOrderPage = i; loadOrders(); };
        container.appendChild(btn);
    }
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '下一页';
    nextBtn.disabled = currentOrderPage === totalPages;
    nextBtn.onclick = () => { if(currentOrderPage < totalPages) { currentOrderPage++; loadOrders(); } };
    container.appendChild(nextBtn);
    const lastBtn = document.createElement('button');
    lastBtn.textContent = '末页';
    lastBtn.disabled = currentOrderPage === totalPages;
    lastBtn.onclick = () => { currentOrderPage = totalPages; loadOrders(); };
    container.appendChild(lastBtn);
}