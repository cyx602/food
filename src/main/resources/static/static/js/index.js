// 检测用户登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 这里可以通过检查 session 或 cookie 来判断用户是否已登录
    // 由于这是一个演示项目，我们可以通过检查 localStorage 来模拟
    // 在实际应用中，应该通过服务器端 session 检查
    
    // 模拟检查用户是否登录
    const isLoggedIn = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    
    if (isLoggedIn) {
        // 如果用户已登录，移除登录/注册链接和注册按钮
        const authSection = document.getElementById('authSection');
        const registerButton = document.getElementById('registerButton');
        
        if (authSection) {
            authSection.style.display = 'none';
        }
        
        if (registerButton) {
            registerButton.style.display = 'none';
        }
    }

    function checkLoginStatus() {
        const userJson = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
        const authSection = document.getElementById('authSection');

        if (userJson && authSection) {
            const user = JSON.parse(userJson);
            const avatarPath = user.avatarFileName ? 'static/upload/' + user.avatarFileName : 'static/image/default_avatar.jpg';

            // 替换为头像
            authSection.innerHTML = `
            <a href="profile.html" style="display:flex; align-items:center; padding: 5px;">
                <img src="${avatarPath}" alt="${user.username}" 
                     style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" 
                     onerror="this.src='static/image/default_avatar.jpg'">
            </a>
        `;
            // 清除可能存在的背景色
            authSection.style.backgroundColor = 'transparent';

            // 如果首页有注册按钮，也隐藏它
            const registerButton = document.getElementById('registerButton');
            if (registerButton) {
                registerButton.style.display = 'none';
            }
        }
    }
});