
function getCurrentPageName() {
    const path = window.location.pathname;
    
    if (path === '/' || path === '') return 'index.html';
    return path.substring(path.lastIndexOf('/') + 1);
}

// 检查登录状态并更新导航栏
function checkLoginStatus() {
    const userJson = sessionStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');
    const registerButton = document.getElementById('registerButton'); // 首页 Banner 上的按钮

    if (!authSection) return;

    if (userJson) {
        // --- 已登录 ---
        try {
            const user = JSON.parse(userJson);
            // 处理头像路径（兼容相对路径）
            const avatarPath = user.avatarFileName ?
                (user.avatarFileName.startsWith('http') ? user.avatarFileName : 'static/upload/' + user.avatarFileName) :
                'static/image/default_avatar.jpg';

            authSection.innerHTML = `
                <a href="profile.html" style="display:flex; align-items:center; padding: 5px; height: 100%;">
                    <img src="${avatarPath}" alt="${user.username}"
                         style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                         onerror="this.src='static/image/default_avatar.jpg'">
                </a>
            `;
            authSection.style.backgroundColor = 'transparent';

            // 如果是首页，隐藏 Banner 上的注册按钮
            if (registerButton) registerButton.style.display = 'none';

        } catch (e) {
            console.error('用户信息解析失败', e);
            sessionStorage.removeItem('currentUser');
        }
    } else {
        // --- 未登录 ---
        authSection.innerHTML = '<a href="register.html">登录/注册</a>';
        // 如果是首页，显示 Banner 上的注册按钮
        if (registerButton) registerButton.style.display = 'inline-block';
    }
}


function renderNavbar() {
    if (document.querySelector('.navbar')) return;

    const currentPage = getCurrentPageName();

    // 定义导航菜单
    const navItems = [
        { name: '首页', link: 'index.html' },
        { name: '菜系分类', link: 'cuisine.html' },
        { name: '菜品推荐', link: 'recommendation.html' },
        { name: '食材商城', link: 'market.html' },
        { name: '我的食谱', link: 'my_recipes.html' },
        { name: '个人中心', link: 'profile.html' },
        { name: '后台管理', link: 'admin.html' }
    ];

    // 生成菜单项 HTML
    const navLinksHtml = navItems.map(item => {
        const isActive = (currentPage === item.link) || (currentPage === '' && item.link === 'index.html');
        const activeStyle = isActive ? 'style="background-color: rgba(255,255,255,0.2);"' : '';
        return `<li><a href="${item.link}" ${activeStyle}>${item.name}</a></li>`;
    }).join('');

    const headerHtml = `
    <nav class="navbar">
        <div class="nav-title">
            <i class="fas fa-utensils"></i>
            <span>美食天地</span>
        </div>
        <div class="nav-center">
            <ul class="nav-links">
                ${navLinksHtml}
                <li id="authSection"><a href="register.html">登录/注册</a></li>
            </ul>
        </div>
    </nav>
    `;

    // 插入到 body 最前面
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
}



function injectGlobalModals() {
    // 防止重复注入
    if (document.getElementById('globalToast')) return;

    const modalHtml = `
        <div id="globalToast" class="custom-toast">
            <i id="toastIcon" class="fas fa-check-circle"></i>
            <span id="toastMessage">操作成功</span>
        </div>

        <div id="globalConfirmOverlay" class="custom-confirm-overlay">
            <div class="custom-confirm-box">
                <div class="confirm-title"><i class="fas fa-question-circle" style="color:#f7941e;"></i> 提示</div>
                <div id="confirmMessage" class="confirm-text">确定要执行此操作吗？</div>
                <div class="confirm-actions">
                    <button class="confirm-btn confirm-btn-cancel" onclick="closeGlobalConfirm()">取消</button>
                    <button id="globalConfirmBtn" class="confirm-btn confirm-btn-ok">确定</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 显示 Toast
let toastTimeout;
window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('globalToast');
    const icon = document.getElementById('toastIcon');
    const text = document.getElementById('toastMessage');
    if (!toast) return;

    text.innerText = msg;
    if (type === 'error') {
        icon.className = 'fas fa-times-circle toast-icon-error';
    } else {
        icon.className = 'fas fa-check-circle toast-icon-success';
    }
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
};

// 显示 Confirm
window.showConfirm = function(msg, onConfirm) {
    const overlay = document.getElementById('globalConfirmOverlay');
    const msgDiv = document.getElementById('confirmMessage');
    const okBtn = document.getElementById('globalConfirmBtn');
    if (!overlay) return;

    msgDiv.innerText = msg;
    overlay.style.display = 'flex';

    // 克隆按钮以移除旧事件
    const newBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newBtn, okBtn);

    newBtn.addEventListener('click', function() {
        closeGlobalConfirm();
        if (onConfirm) onConfirm();
    });
};

window.closeGlobalConfirm = function() {
    const overlay = document.getElementById('globalConfirmOverlay');
    if (overlay) overlay.style.display = 'none';
};

// 点击遮罩层关闭
window.addEventListener('click', function(e) {
    const overlay = document.getElementById('globalConfirmOverlay');
    if (e.target === overlay) {
        closeGlobalConfirm();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // 1. 先注入 HTML 结构
    renderNavbar();     
    injectGlobalModals(); 

    // 2. 执行逻辑
    checkLoginStatus();  
});