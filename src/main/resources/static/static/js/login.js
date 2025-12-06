// static/js/login.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const loginResetBtn = document.getElementById('loginResetBtn');

    const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1));
    const loginUrl = baseUrl + '/api/login';
    console.log('🔗 登录接口地址:', loginUrl);

    const savedEmail = localStorage.getItem('saved_email');
    const savedPass = localStorage.getItem('saved_password'); // 注意：实际生产环境不建议明文存密码
    if (savedEmail && savedPass) {
        loginEmail.value = savedEmail;
        loginPassword.value = savedPass;
        rememberMe.checked = true;
    }

    function setSubmitting(submitting) {
        loginBtn.disabled = submitting;
        loginBtn.textContent = submitting ? '登录中...' : '登录';
    }

    // 密码可见性切换
    const toggleLoginPwdBtn = document.getElementById('toggleLoginPassword');
    const loginPwdInput = document.getElementById('loginPassword');

    if(toggleLoginPwdBtn && loginPwdInput) {
        toggleLoginPwdBtn.addEventListener('click', function() {
            // 切换 type 属性
            const type = loginPwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPwdInput.setAttribute('type', type);

            // 切换图标: password(隐藏) -> eye-slash, text(显示) -> eye
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    }

    // 表单提交事件
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email) return alert('邮箱不能为空！');
        if (!password) return alert('密码不能为空！');

        // --- 核心修改：记住我逻辑 ---
        if (rememberMe.checked) {
            localStorage.setItem('saved_email', email);
            localStorage.setItem('saved_password', password);
        } else {
            localStorage.removeItem('saved_email');
            localStorage.removeItem('saved_password');
        }

        loginBtn.disabled = true;
        loginBtn.textContent = '登录中...';

        try {
            // 发送 email 而不是 username
            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, password: password })
            });

            const data = await res.json();

            if (data.success) {
                // ... (原有 Session 存储逻辑不变)
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

    // 重置按钮逻辑保持不变
    loginResetBtn.addEventListener('click', function () {
        if (loginUsername) loginUsername.value = '';
        if (loginPassword) loginPassword.value = '';
        if (rememberMe) rememberMe.checked = false;
        loginUsername?.focus();
    });
});
