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

    function setSubmitting(submitting) {
        loginBtn.disabled = submitting;
        loginBtn.textContent = submitting ? '登录中...' : '登录';
    }

    // 表单提交事件
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = loginUsername.value.trim();
        const password = loginPassword.value.trim();

        if (!username) {
            alert('美食昵称不能为空！');
            loginUsername.focus();
            return;
        }
        if (!password) {
            alert('登录密码不能为空！');
            loginPassword.focus();
            return;
        }
        if (password.length < 6) {
            alert('密码长度不能少于6位！');
            loginPassword.focus();
            return;
        }

        setSubmitting(true);
        try {
            // ✅ 修改为 JSON 格式（与后端保持一致）
            const bodyData = {
                username: username,
                password: password
            };

            const res = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(bodyData),
                credentials: 'same-origin'
            });

            const data = await res.json().catch(() => null);

            if (res.ok && data && data.success) {
                // 保存用户登录状态
                const userObj = {
                    username: data.username,
                    avatarFileName: data.avatarFileName,
                    role: data.role // 存储角色
                };
                sessionStorage.setItem('currentUser', JSON.stringify(userObj));


                // 【新增】如果是管理员，设置额外标记
                if (data.username === 'admin') {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                } else {
                    sessionStorage.removeItem('adminLoggedIn');
                }

                alert(`欢迎回来，${username}！`);

                // 如果是管理员，直接跳后台，否则跳首页
                if (data.username === 'admin' || data.role === 'admin') {
                    sessionStorage.setItem('adminLoggedIn', 'true'); // 兼容旧逻辑
                    window.location.href = baseUrl + '/admin.html';
                } else {
                    sessionStorage.removeItem('adminLoggedIn');
                    window.location.href = baseUrl + '/index.html';
                }
            } else {
                const message =
                    (data && (data.message || data.error)) ||
                    (res.status === 401 ? '用户名或密码错误' : '登录失败，请稍后重试');
                alert(message);
            }
        } catch (err) {
            console.error(err);
            alert('网络异常，请检查你的网络后重试');
        } finally {
            setSubmitting(false);
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
