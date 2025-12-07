// 确保脚本加载成功的调试日志
console.log('✅ register.js 加载成功');

document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取基础路径，兼容不同的部署上下文
    const pathName = window.location.pathname;
    // 如果项目部署在根目录，contextPath 为空；如果在子目录（如 /food），则提取之
    const contextPath = pathName.substring(0, pathName.indexOf('/', 1));
    const baseUrl = contextPath === '/static' || contextPath.endsWith('.html') ? '' : contextPath;

    // 构建接口地址
    const uploadUrl = `${baseUrl}/api/upload-avatar`;
    const registerUrl = `${baseUrl}/api/register`;
    const defaultAvatar = 'static/image/default_avatar.jpg';

    console.log('🔗 API Base URL:', baseUrl);

    // 2. 获取 DOM 元素
    const elements = {
        username: document.getElementById('username'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword'),
        phone: document.getElementById('phone'),
        email: document.getElementById('email'),
        address: document.getElementById('address'),
        genderRadios: document.getElementsByName('gender'),
        preferenceCheckboxes: document.getElementsByName('preference'),
        avatarInput: document.getElementById('avatar'),
        avatarPreview: document.getElementById('avatarPreview'),
        submitBtn: document.getElementById('submitBtn'),
        resetBtn: document.getElementById('resetBtn')
    };

    let currentAvatarFileName = 'default_avatar.jpg'; // 默认头像

    // 3. 头像上传处理
    if (elements.avatarInput) {
        elements.avatarInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // 预览
            const reader = new FileReader();
            reader.onload = (event) => {
                if (elements.avatarPreview) elements.avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);

            // 上传
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                // 显示上传中状态（可选）
                // elements.avatarPreview.style.opacity = 0.5;

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    body: formData
                });

                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();

                if (data.success) {
                    currentAvatarFileName = data.fileName;
                    console.log('✅ 头像上传成功:', currentAvatarFileName);
                } else {
                    alert('头像上传失败: ' + (data.message || '未知错误'));
                    // 回退到默认
                    currentAvatarFileName = 'default_avatar.jpg';
                }
            } catch (error) {
                console.error('❌ 上传异常:', error);
                alert('网络错误，头像上传失败');
            } finally {
                // elements.avatarPreview.style.opacity = 1;
            }
        });
    }

    // 4. 注册提交
    if (elements.submitBtn) {
        elements.submitBtn.addEventListener('click', async function() {

            // 1. 严格校验密码一致性
            const pwd = elements.password.value;
            const confirmPwd = elements.confirmPassword.value;

            if (!pwd) return showToast('请输入密码', 'error');
            if (pwd !== confirmPwd) {
                showToast('两次输入的密码不一致', 'error');
                return;
            }

            // 核心需求：两次密码必须一样
            if (pwd !== confirmPwd) {
                alert('❌ 两次输入的密码不一致，请重新输入！');
                // 清空确认密码框并聚焦
                elements.confirmPassword.value = '';
                elements.confirmPassword.focus();
                return;
            }

            const email = elements.email.value.trim();
            if (!email) return alert('请输入注册邮箱');
            // 简单的邮箱格式正则
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return alert('请输入有效的邮箱地址');
            }

            // --- 表单验证 ---
            if (!elements.username.value.trim()) return alert('请输入昵称');
            if (!elements.password.value) return alert('请输入密码');
            if (elements.password.value !== elements.confirmPassword.value) return alert('两次密码不一致');

            // 获取性别
            let gender = '';
            for (const radio of elements.genderRadios) {
                if (radio.checked) { gender = radio.value; break; }
            }
            if (!gender) return alert('请选择性别');

            // 获取偏好
            const styles = [];
            for (const box of elements.preferenceCheckboxes) {
                if (box.checked) styles.push(box.value);
            }
            if (styles.length === 0) return alert('请至少选择一项美食偏好');

            // --- 提交数据 ---
            const userData = {
                username: elements.username.value.trim(),
                password: elements.password.value,
                gender: gender,
                styles: styles,
                phone: elements.phone.value.trim(),
                email: elements.email.value.trim(),
                address: elements.address.value.trim(),
                avatarFileName: currentAvatarFileName
            };

            try {
                const res = await fetch(registerUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData)
                });

                const data = await res.json();
                if (data.success) {
                    showToast('注册成功！快去登录吧');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    showToast('注册失败: ' + data.message, 'error');
                }
            } catch (e) {
                showToast('系统繁忙，请稍后重试', 'error');
            }
        });
    }

    // 5. 重置功能
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', () => {
            document.querySelector('form').reset();
            if (elements.avatarPreview) elements.avatarPreview.src = defaultAvatar;
            currentAvatarFileName = 'default_avatar.jpg';
        });
    }

    // 注册页密码切换通用函数
    function setupPasswordToggle(inputId, iconId) {
        const input = document.getElementById(inputId);
        const icon = document.getElementById(iconId);
        if(input && icon) {
            icon.addEventListener('click', function() {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
                this.classList.toggle('fa-eye');
            });
        }
    }

    setupPasswordToggle('password', 'toggleRegPassword');
    setupPasswordToggle('confirmPassword', 'toggleConfirmPassword');
});