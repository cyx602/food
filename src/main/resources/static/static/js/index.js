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
});