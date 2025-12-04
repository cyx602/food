// 登录功能
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 这里使用简单的登录验证，实际项目中应该连接后端API
    if (username === 'admin' && password === 'admin123') {
        // 登录成功
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminMain').style.display = 'block';
        
        // 保存登录状态到sessionStorage
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // 隐藏错误信息
        document.getElementById('loginError').style.display = 'none';
    } else {
        // 登录失败
        document.getElementById('loginError').style.display = 'block';
    }
});

// 侧边栏菜单切换
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        // 移除所有active类
        document.querySelectorAll('.menu-item').forEach(menu => {
            menu.classList.remove('active');
        });
        
        // 添加当前active类
        this.classList.add('active');
        
        // 更新标题
        const title = this.querySelector('span').textContent;
        document.querySelector('.content-title').textContent = title;
        
        // 隐藏所有内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 显示对应内容
        const target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
        
        // 添加内容切换动画效果
        const activeContent = document.getElementById(target);
        activeContent.style.opacity = '0';
        setTimeout(() => {
            activeContent.style.transition = 'opacity 0.3s ease';
            activeContent.style.opacity = '1';
        }, 50);
    });
});

// 添加统计卡片的数字增长动画效果
function animateNumber(element, target, duration = 1000) {
    let start = 0;
    const increment = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) { element.textContent = target.toLocaleString(); clearInterval(timer); }
        else { element.textContent = start.toLocaleString(); }
    }, 16);
}
// 页面加载完成后执行动画
// src/main/resources/static/static/js/admin.js

document.addEventListener('DOMContentLoaded', function() {
    // 权限检查
    const userJson = sessionStorage.getItem('currentUser');

    if (!userJson) {
        alert('请先登录');
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(userJson);

    // 简单权限验证：只有用户名为 admin 才允许访问
    if (user.username !== 'admin') {
        alert('权限不足：您不是管理员');
        window.location.href = 'index.html';
        return;
    }

    // 如果是管理员，显示内容
    document.getElementById('adminMain').style.display = 'block';

    // 动画效果
    animateNumber(document.querySelector('.stats-grid .stat-info h3:nth-child(1)'), 1284);
});

// 退出登录
document.getElementById('logoutBtn').addEventListener('click', function() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

// 侧边栏菜单切换 (保持不变)
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.menu-item').forEach(menu => menu.classList.remove('active'));
        this.classList.add('active');
        const title = this.querySelector('span').textContent;
        document.querySelector('.content-title').textContent = title;
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const target = this.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
});


// 退出登录
document.getElementById('logoutBtn').addEventListener('click', function() {
    // 清除登录状态
    sessionStorage.removeItem('adminLoggedIn');
    
    // 显示登录页面
    document.getElementById('adminMain').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    
    // 重置表单
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
});