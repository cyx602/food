document.addEventListener('DOMContentLoaded', function () {
    // 1. 获取页面元素
    const form = document.getElementById('loginForm');
    // 注意：HTML里定义的是 id="loginEmail"，所以这里要用 loginEmail
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const loginResetBtn = document.getElementById('loginResetBtn');
    const toggleLoginPwdBtn = document.getElementById('toggleLoginPassword');

    // 2. 页面加载时回显数据
    const savedEmail = localStorage.getItem('saved_email');
    const savedPass = localStorage.getItem('saved_password');

    if (savedEmail && savedPass) {
        if(loginEmailInput) loginEmailInput.value = savedEmail;
        if(loginPasswordInput) loginPasswordInput.value = savedPass;
        if(rememberMe) rememberMe.checked = true;
    }

    // 3. 密码可见性切换
    if(toggleLoginPwdBtn && loginPasswordInput) {
        toggleLoginPwdBtn.addEventListener('click', function() {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    }

    // 4. 表单提交逻辑
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = loginEmailInput.value.trim();
            const password = loginPasswordInput.value.trim();

            if (!email) return alert('邮箱不能为空！');
            if (!password) return alert('密码不能为空！');

            // --- 记住我逻辑核心部分 ---
            if (rememberMe.checked) {
                // 勾选 -> 保存
                localStorage.setItem('saved_email', email);
                localStorage.setItem('saved_password', password);
            } else {
                // 未勾选 -> 清除 (这样下次就不会自动显示了)
                localStorage.removeItem('saved_email');
                localStorage.removeItem('saved_password');
            }
            // -----------------------

            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';

            try {
                // 构建登录请求 URL
                const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
                const loginUrl = (baseUrl === window.location.origin ? '' : baseUrl) + '/api/login';

                const res = await fetch(loginUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, password: password })
                });

                const data = await res.json();

                if (data.success) {
                    const userObj = {
                        username: data.username,
                        avatarFileName: data.avatarFileName,
                        role: data.role
                    };
                    sessionStorage.setItem('currentUser', JSON.stringify(userObj));

                    if (data.username === 'admin' || data.role === 'admin') {
                        sessionStorage.setItem('adminLoggedIn', 'true');
                        window.location.href = 'admin.html';
                    } else {
                        sessionStorage.removeItem('adminLoggedIn');
                        window.location.href = 'index.html';
                    }
                } else {
                    alert(data.message || '登录失败');
                }
            } catch (err) {
                console.error(err);
                alert('网络错误');
            } finally {
                loginBtn.disabled = false;
                loginBtn.textContent = '登录';
            }
        });
    }

    // 5. 重置按钮
    if (loginResetBtn) {
        loginResetBtn.addEventListener('click', function () {
            if (loginEmailInput) loginEmailInput.value = '';
            if (loginPasswordInput) loginPasswordInput.value = '';
            if (rememberMe) rememberMe.checked = false;
            // 清除本地存储的意图 (可选，看是否希望重置时也清除缓存)
            // localStorage.removeItem('saved_email');
            // localStorage.removeItem('saved_password');
        });
    }
});