// 表单验证和提交功能
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

// 表单验证函数
function validateForm() {
    let isValid = true;
    const errorMessages = [];
    

    
    // 验证注册码（必填且长度固定为8位）
    if (!regCodeInput.value.trim()) {
        isValid = false;
        errorMessages.push('注册码不能为空');
    } else if (regCodeInput.value.trim().length !== 8) {
        isValid = false;
        errorMessages.push('注册码必须为8位');
    }
    
    // 验证密码
    if (!passwordInput.value) {
        isValid = false;
        errorMessages.push('登录密码不能为空');
    } else if (passwordInput.value.length < 6) {
        isValid = false;
        errorMessages.push('密码长度至少为6个字符');
    }
    
    // 验证确认密码
    if (passwordInput.value !== confirmPasswordInput.value) {
        isValid = false;
        errorMessages.push('两次输入的密码不一致');
    }
    
    // 验证姓名
    if (!nameInput.value.trim()) {
        isValid = false;
        errorMessages.push('管理员姓名不能为空');
    }
    
    // 验证电话
    if (!phoneInput.value.trim()) {
        isValid = false;
        errorMessages.push('联系电话不能为空');
    } else {
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            isValid = false;
            errorMessages.push('请输入正确的手机号码');
        }
    }
    
    // 验证邮箱
    if (!emailInput.value.trim()) {
        isValid = false;
        errorMessages.push('邮箱不能为空');
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            errorMessages.push('请输入正确的邮箱地址');
        }
    }
    
    // 如果有错误，显示错误信息
    if (errorMessages.length > 0) {
        alert(errorMessages.join('\n'));
    }
    
    return isValid;
}

// 提交表单
submitBtn.addEventListener('click', function() {
    // 执行表单验证
    if (validateForm()) {
        // 收集表单数据
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            password: passwordInput.value,
            regCode: regCodeInput.value.trim()
        };
        
        // 模拟表单提交（实际项目中应该发送到后端API）
        console.log('管理员注册信息:', formData);
        
        // 这里可以添加AJAX请求来提交数据到后端
        // 例如：
        /*
        fetch('/api/admin/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('注册成功！');
                window.location.href = 'login.html';
            } else {
                alert('注册失败：' + data.message);
            }
        })
        .catch(error => {
            console.error('注册失败:', error);
            alert('网络错误，请稍后重试');
        });
        */
        
        // 模拟成功注册
        alert('注册成功！');
        window.location.href = 'login.html';
    }
});

// 重置表单
resetBtn.addEventListener('click', function() {
    registerForm.reset();
    // 重置头像预览
    avatarPreview.src = 'static/image/default_avatar.jpg';
});

// 实时表单验证示例

// 邮箱实时验证
emailInput.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.trim().length > 0 && !emailRegex.test(this.value.trim())) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '';
    }
});

passwordInput.addEventListener('input', function() {
    if (this.value.length > 0 && this.value.length < 6) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '';
    }
    
    // 检查密码是否一致
    if (confirmPasswordInput.value && this.value !== confirmPasswordInput.value) {
        confirmPasswordInput.style.borderColor = '#dc3545';
    } else {
        confirmPasswordInput.style.borderColor = '';
    }
});

confirmPasswordInput.addEventListener('input', function() {
    if (passwordInput.value && this.value !== passwordInput.value) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '';
    }
});

regCodeInput.addEventListener('input', function() {
    if (this.value.trim().length > 0 && this.value.trim().length !== 8) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '';
    }
});

phoneInput.addEventListener('input', function() {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (this.value.trim().length > 0 && !phoneRegex.test(this.value.trim())) {
        this.style.borderColor = '#dc3545';
    } else {
        this.style.borderColor = '';
    }
});