document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    // 获取缓存的用户信息
    const userJson = sessionStorage.getItem('currentUser');
    const authSection = document.getElementById('authSection');
    const registerButton = document.getElementById('registerButton'); // Banner上的注册按钮

    if (!authSection) return;

    if (userJson) {
        // --- 状态：已登录 ---
        try {
            const user = JSON.parse(userJson);

            // 处理头像路径
            const avatarPath = user.avatarFileName ?
                'static/upload/' + user.avatarFileName :
                'static/image/default_avatar.jpg';

            // 替换为头像和个人中心链接
            authSection.innerHTML = `
                <a href="profile.html" style="display:flex; align-items:center; padding: 5px; height: 100%;">
                    <img src="${avatarPath}" alt="${user.username}"
                         style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"
                         onerror="this.src='static/image/default_avatar.jpg'">
                </a>
            `;

            // 移除可能存在的背景色（如果有）
            authSection.style.backgroundColor = 'transparent';

            // 确保显示
            authSection.style.display = 'block';

            // 隐藏首页 Banner 上的注册按钮
            if (registerButton) registerButton.style.display = 'none';

        } catch (e) {
            console.error('用户信息解析失败', e);
            // 出错时回退到未登录状态
            showNotLoggedIn(authSection, registerButton);
        }
    } else {
        // --- 状态：未登录 ---
        showNotLoggedIn(authSection, registerButton);
    }
}

function showNotLoggedIn(authSection, registerButton) {
    // 恢复默认的登录/注册链接
    authSection.innerHTML = '<a href="register.html">登录/注册</a>';
    authSection.style.display = 'block';

    // 显示 Banner 上的注册按钮
    if (registerButton) registerButton.style.display = 'inline-block';
}