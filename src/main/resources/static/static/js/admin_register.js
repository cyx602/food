// 获取表单元素
const registerForm = document.getElementById('adminRegisterForm');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const regCodeInput = document.getElementById('regCode');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatarPreview');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

// 头像预览功能
if (avatarInput) {
    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// 表单验证函数
function validateForm() {
    const errorMessages = [];

    // 验证注册码（必填，模拟校验，实际应后端校验）
    if (!regCodeInput.value.trim()) {
        errorMessages.push('注册码不能为空');
    } else if (regCodeInput.value.trim() !== '88888888') { // 模拟：假设注册码是8个8
        // 这里仅做前端格式提示，实际由后端校验
        // errorMessages.push('注册码无效');
    }

    // 验证密码
    if (!passwordInput.value) {
        errorMessages.push('登录密码不能为空');
    } else if (passwordInput.value.length < 6) {
        errorMessages.push('密码长度至少为6个字符');
    }

    // 验证确认密码
    if (passwordInput.value !== confirmPasswordInput.value) {
        errorMessages.push('两次输入的密码不一致');
    }

    // 验证姓名
    if (!nameInput.value.trim()) {
        errorMessages.push('管理员姓名不能为空');
    }

    // 验证电话
    if (!phoneInput.value.trim()) {
        errorMessages.push('联系电话不能为空');
    } else {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            errorMessages.push('请输入正确的手机号码');
        }
    }

    // 验证邮箱
    if (!emailInput.value.trim()) {
        errorMessages.push('邮箱不能为空');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            errorMessages.push('请输入正确的邮箱地址');
        }
    }

    // 如果有错误，显示错误信息
    if (errorMessages.length > 0) {
        alert(errorMessages.join('\n'));
        return false;
    }

    return true;
}

// 提交表单
if (submitBtn) {
    submitBtn.addEventListener('click', function() {
        if (validateForm()) {
            // 简单模拟注册成功，实际应调用 fetch('/api/admin/register', ...)
            // 注意：目前后端还没有专门的管理员注册接口，如果需要入库，需扩展 UserMapper 和 Controller
            // 这里仅做前端演示
            alert('管理员注册申请已提交！请等待超级管理员审核。');
            window.location.href = 'login.html';
        }
    });
}

// 重置表单
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        if(registerForm) registerForm.reset();
        if(avatarPreview) avatarPreview.src = 'static/image/default_avatar.jpg';
    });
}

// 检查登录状态 (显示头像)
document.addEventListener('DOMContentLoaded', function() {
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
});