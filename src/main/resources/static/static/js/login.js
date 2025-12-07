document.addEventListener('DOMContentLoaded', function () {
    // 1. 获取页面元素
    const form = document.getElementById('loginForm');
    const loginEmailInput = document.getElementById('loginEmail');
    const loginPasswordInput = document.getElementById('loginPassword');
    const rememberMe = document.getElementById('rememberMe');
    const loginBtn = document.getElementById('loginBtn');
    const loginResetBtn = document.getElementById('loginResetBtn');
    const toggleLoginPwdBtn = document.getElementById('toggleLoginPassword');

    // --- 新增：协议弹窗相关元素 ---
    const agreementModal = document.getElementById('agreementModal');
    const agreementTitle = document.getElementById('agreementTitle');
    const agreementContent = document.getElementById('agreementContent');
    const closeAgreementBtn = document.getElementById('closeAgreementModal');
    const confirmAgreementBtn = document.getElementById('confirmAgreementBtn');
    const userAgreementBtn = document.getElementById('userAgreementBtn');
    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn');

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
                localStorage.setItem('saved_email', email);
                localStorage.setItem('saved_password', password);
            } else {
                localStorage.removeItem('saved_email');
                localStorage.removeItem('saved_password');
            }

            loginBtn.disabled = true;
            loginBtn.textContent = '登录中...';

            try {
                // 构建登录请求 URL (兼容子目录部署)
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
        });
    }

    // --- 新增：协议弹窗逻辑 ---

    // 打开弹窗并加载文件内容
    function openAgreement(type) {
        if (!agreementModal) return;

        let title = '';
        let fileName = '';

        if (type === 'user') {
            title = '美食天地用户协议';
            fileName = 'user_agreement.txt';
        } else if (type === 'privacy') {
            title = '美食天地隐私政策';
            fileName = 'privacy_policy.txt';
        }

        // 设置标题并显示加载中
        if (agreementTitle) agreementTitle.innerText = title;
        if (agreementContent) agreementContent.innerText = '正在加载内容...';
        agreementModal.style.display = 'flex';

        // 使用 fetch 请求静态文件内容
        // 这里假设 docs 文件夹位于 static/docs/ 下，浏览器访问路径为 /docs/xxx.txt
        fetch(`docs/${fileName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('无法加载协议文件');
                }
                return response.text();
            })
            .then(text => {
                if (agreementContent) agreementContent.innerText = text;
            })
            .catch(error => {
                console.error('加载失败:', error);
                if (agreementContent) agreementContent.innerText = '内容加载失败，请联系管理员。';
            });
    }

    // 绑定点击事件
    if (userAgreementBtn) {
        userAgreementBtn.addEventListener('click', function() { openAgreement('user'); });
    }
    if (privacyPolicyBtn) {
        privacyPolicyBtn.addEventListener('click', function() { openAgreement('privacy'); });
    }

    // 关闭弹窗函数
    function closeAgreement() {
        if (agreementModal) agreementModal.style.display = 'none';
    }

    if (closeAgreementBtn) closeAgreementBtn.addEventListener('click', closeAgreement);
    if (confirmAgreementBtn) confirmAgreementBtn.addEventListener('click', closeAgreement);

    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === agreementModal) {
            closeAgreement();
        }
    });
});