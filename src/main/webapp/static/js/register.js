// 确保脚本加载成功的调试日志
console.log('✅ register.js 已成功加载，开始初始化.');
// 在文件顶部添加
const contextPath = window.location.pathname.split('/')[1] || '';
const baseUrl = contextPath ? `/${contextPath}` : '';

// 修改默认头像路径
const defaultAvatar = baseUrl + '/static/image/default_avatar.jpg';

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM 已加载完成，开始获取元素.');

    // 获取DOM元素
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const genderRadios = document.getElementsByName('gender');
    const preferenceCheckboxes = document.getElementsByName('preference');
    const avatar = document.getElementById('avatar');
    const avatarPreview = document.getElementById('avatarPreview');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');

    // 调试信息
    console.log('📌 元素获取状态：', {
        username: !!username,
        password: !!password,
        confirmPassword: !!confirmPassword,
        phone: !!phone,
        email: !!email,
        address: !!address,
        genderRadios: genderRadios.length > 0,
        preferenceCheckboxes: preferenceCheckboxes.length > 0,
        avatarPreview: !!avatarPreview,
        avatar: !!avatar,
        submitBtn: !!submitBtn,
        resetBtn: !!resetBtn
    });

    // 更可靠的上下文路径获取方式
    const contextPath = window.location.pathname.split('/')[1] || '';
    const baseUrl = contextPath ? `/${contextPath}` : '';

    // 使用 baseUrl 统一拼接 URL
    const uploadUrl = baseUrl + '/api/upload-avatar';
    const registerUrl = baseUrl + '/api/register';

    console.log('🔗 构建的URL:', { uploadUrl, registerUrl, contextPath, baseUrl });

    // 头像预览功能
    let currentAvatarFileName = null; // 存储当前头像文件名

    // 设置默认头像
    if (avatarPreview) {
        avatarPreview.src = defaultAvatar;
        console.log('✅ 默认头像已设置:', defaultAvatar);
    } else {
        console.error('❌ 未找到头像预览元素 avatarPreview');
    }

    /**
     * 头像上传：按 Content-Type 分流，避免把 HTML 当 JSON 解析
     */
    async function uploadAvatarFile(file) {
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            console.log('📤 准备上传到:', uploadUrl);

            const response = await fetch(uploadUrl, {
                method: 'POST',
                body: formData
            });

            console.log('📥 响应状态:', response.status, response.statusText);

            // 检查响应类型
            const contentType = response.headers.get('content-type') || '';
            console.log('📄 响应类型:', contentType);

            let payload;
            if (contentType.includes('application/json')) {
                payload = await response.json();
            } else {
                const text = await response.text();
                console.log('❌ 非JSON响应:', text.substring(0, 500));
                return {
                    success: false,
                    message: `服务器返回错误: ${response.status} ${response.statusText}`
                };
            }

            if (response.ok) {
                if (typeof payload === 'object' && payload.fileName) {
                    console.log('✅ 头像上传成功:', payload);
                    return { success: true, data: payload };
                }
                return { success: false, message: '后端返回数据格式错误' };
            } else {
                const message = payload.message || `上传失败: ${response.status}`;
                console.error('❌ 头像上传失败:', message);
                return { success: false, message };
            }
        } catch (error) {
            console.error('❌ 网络请求异常:', error);
            return { success: false, message: '网络请求失败: ' + error.message };
        }
    }

    // 头像上传事件监听
    if (avatar) {
        avatar.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                // 验证文件类型
                if (!file.type.startsWith('image/')) {
                    alert('❌ 请选择图片文件！');
                    avatar.value = '';
                    return;
                }

                // 验证文件大小（限制为2MB）
                if (file.size > 2 * 1024 * 1024) {
                    alert('❌ 图片大小不能超过2MB！');
                    avatar.value = '';
                    return;
                }

                // 显示预览
                const reader = new FileReader();
                reader.onload = function(event) {
                    if (avatarPreview) {
                        avatarPreview.src = event.target.result;
                        console.log('🖼 头像预览已更新');
                    }
                };
                reader.readAsDataURL(file);

                // 调后端生成文件名
                try {
                    console.log('📤 开始生成头像文件名...');
                    const uploadResult = await uploadAvatarFile(file);

                    if (uploadResult.success) {
                        currentAvatarFileName = uploadResult.data.fileName;
                        console.log('✅ 头像文件名生成成功:', currentAvatarFileName);
                        alert('✅ 头像已处理完成，文件名将在注册时保存到数据库');
                    } else {
                        alert('❌ 头像处理失败: ' + uploadResult.message);
                        avatar.value = '';
                        if (avatarPreview) {
                            avatarPreview.src = defaultAvatar;
                        }
                        currentAvatarFileName = null;
                    }
                } catch (error) {
                    console.error('❌ 头像处理过程出错:', error);
                    alert('头像处理失败，请重试');
                    avatar.value = '';
                    if (avatarPreview) {
                        avatarPreview.src = defaultAvatar;
                    }
                    currentAvatarFileName = null;
                }
            } else {
                if (avatarPreview) {
                    avatarPreview.src = defaultAvatar;
                }
                currentAvatarFileName = null;
            }
        });
    } else {
        console.error('❌ 未找到头像上传元素 avatar');
    }

    // 注册按钮点击事件
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            try {
                console.log('📥 点击了注册按钮，开始验证表单.');

                // 表单验证
                if (!username || !username.value.trim()) {
                    alert('❌ 美食昵称不能为空！');
                    if (username) username.focus();
                    return;
                }
                if (!password || !password.value.trim()) {
                    alert('❌ 登录密码不能为空！');
                    if (password) password.focus();
                    return;
                }
                if (password.value.length < 6) {
                    alert('❌ 密码长度不能少于6位！');
                    if (password) password.focus();
                    return;
                }
                if (!confirmPassword || !confirmPassword.value.trim()) {
                    alert('❌ 确认密码不能为空！');
                    if (confirmPassword) confirmPassword.focus();
                    return;
                }
                if (password.value !== confirmPassword.value) {
                    alert('❌ 两次输入的密码不一致！');
                    if (confirmPassword) confirmPassword.focus();
                    return;
                }
                if (!phone || !phone.value.trim()) {
                    alert('❌ 联系电话不能为空！');
                    if (phone) phone.focus();
                    return;
                }
                if (!email || !email.value.trim()) {
                    alert('❌ 电子邮箱不能为空！');
                    if (email) email.focus();
                    return;
                }
                const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailReg.test(email.value.trim())) {
                    alert('❌ 请输入有效的电子邮箱地址！');
                    if (email) email.focus();
                    return;
                }
                const phoneReg = /^1[3-9]\d{9}$/;
                if (!phoneReg.test(phone.value.trim())) {
                    alert('❌ 请输入有效的11位手机号！');
                    if (phone) phone.focus();
                    return;
                }
                if (!address || !address.value.trim()) {
                    alert('❌ 食材配送地址不能为空！');
                    if (address) address.focus();
                    return;
                }

                // 验证性别选择
                let genderSelected = false;
                for (let radio of genderRadios) {
                    if (radio.checked) { genderSelected = true; break; }
                }
                if (!genderSelected) {
                    alert('❌ 请选择您的性别！');
                    return;
                }

                // 验证美食偏好选择
                let preferenceSelected = false;
                for (let checkbox of preferenceCheckboxes) {
                    if (checkbox.checked) { preferenceSelected = true; break; }
                }
                if (!preferenceSelected) {
                    alert('❌ 请至少选择一种美食偏好！');
                    return;
                }

                // 收集表单数据
                console.log('✅ 表单验证通过，开始收集数据.');
                const selectedPreferences = [];
                for (let checkbox of preferenceCheckboxes) {
                    if (checkbox.checked) selectedPreferences.push(checkbox.value);
                }
                let selectedGender = '';
                for (let radio of genderRadios) {
                    if (radio.checked) { selectedGender = radio.value; break; }
                }

                // 构建用户数据，使用生成的头像文件名
                const userData = {
                    username: username.value.trim(),
                    password: password.value.trim(),
                    gender: selectedGender,
                    styles: selectedPreferences,
                    phone: phone.value.trim(),
                    email: email.value.trim(),
                    address: address.value.trim(),
                    avatarFileName: currentAvatarFileName || 'default_avatar.jpg'
                };

                console.log('📤 准备发送的注册数据:', userData);
                console.log('🔗 发送到:', registerUrl);

                // 发送注册请求（与后端 /register 对齐）
                const response = await fetch(registerUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });


                console.log('📥 注册响应状态:', response.status, response.statusText);

                const data = await response.json();
                console.log('📥 后端返回数据：', data);

                if (!response.ok) {
                    throw new Error(data.message || '注册失败，请检查输入');
                }

                alert('🎉 ' + data.message);
                window.location.href = baseUrl + '/login.html';
            } catch (error) {
                console.error('❌ 注册过程出错：', error);
                alert('注册失败：' + error.message);
            }
        });
    } else {
        console.error('❌ 未找到注册按钮元素 submitBtn');
    }

    // 重置按钮功能
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (username) username.value = '';
            if (password) password.value = '';
            if (confirmPassword) confirmPassword.value = '';
            if (phone) phone.value = '';
            if (email) email.value = '';
            if (address) address.value = '';
            if (avatar) avatar.value = '';
            if (avatarPreview) avatarPreview.src = defaultAvatar;
            currentAvatarFileName = null;

            // 重置单选按钮
            for (let radio of genderRadios) { radio.checked = false; }
            // 重置复选框
            for (let checkbox of preferenceCheckboxes) { checkbox.checked = false; }

            if (username) username.focus();
            console.log('🔄 表单已重置');
        });
    } else {
        console.error('❌ 未找到重置按钮元素 resetBtn');
    }

    console.log('✅ 初始化完成，等待用户操作.');
});