// src/main/resources/static/static/js/common_modal.js

// 1. 初始化：页面加载时自动注入弹窗的 HTML 结构
document.addEventListener('DOMContentLoaded', function() {
    const modalHtml = `
        <div id="globalToast" class="custom-toast">
            <i id="toastIcon" class="fas fa-check-circle"></i>
            <span id="toastMessage">操作成功</span>
        </div>

        <div id="globalConfirmOverlay" class="custom-confirm-overlay">
            <div class="custom-confirm-box">
                <div class="confirm-title"><i class="fas fa-question-circle" style="color:#f7941e;"></i> 提示</div>
                <div id="confirmMessage" class="confirm-text">确定要执行此操作吗？</div>
                <div class="confirm-actions">
                    <button class="confirm-btn confirm-btn-cancel" onclick="closeGlobalConfirm()">取消</button>
                    <button id="globalConfirmBtn" class="confirm-btn confirm-btn-ok">确定</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
});

// ================= 全局函数 =================

let toastTimeout;

/**
 * 显示自动消失的提示框 (Toast)
 * @param {string} msg 提示文字
 * @param {string} type 'success' (默认) 或 'error'
 */
window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('globalToast');
    const icon = document.getElementById('toastIcon');
    const text = document.getElementById('toastMessage');

    if (!toast) return; // 防止页面未加载完调用报错

    text.innerText = msg;

    // 切换图标
    if (type === 'error') {
        icon.className = 'fas fa-times-circle toast-icon-error';
    } else {
        icon.className = 'fas fa-check-circle toast-icon-success';
    }

    // 显示
    toast.classList.add('show');

    // 清除上一次的定时器，防止快速点击时闪烁
    if (toastTimeout) clearTimeout(toastTimeout);

    // 1.5秒后自动消失
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 1500);
};

/**
 * 显示确认框 (Confirm)
 * @param {string} msg 提示文字
 * @param {function} onConfirm 点击确定后的回调函数
 */
window.showConfirm = function(msg, onConfirm) {
    const overlay = document.getElementById('globalConfirmOverlay');
    const msgDiv = document.getElementById('confirmMessage');
    const okBtn = document.getElementById('globalConfirmBtn');

    if (!overlay) return;

    msgDiv.innerText = msg;
    overlay.style.display = 'flex'; // Flex布局实现居中

    // 重新绑定点击事件（先克隆节点以移除旧事件监听器）
    const newBtn = okBtn.cloneNode(true);
    okBtn.parentNode.replaceChild(newBtn, okBtn);

    newBtn.addEventListener('click', function() {
        closeGlobalConfirm();
        if (onConfirm) onConfirm();
    });
};

window.closeGlobalConfirm = function() {
    const overlay = document.getElementById('globalConfirmOverlay');
    if (overlay) overlay.style.display = 'none';
};

// 点击遮罩层关闭确认框
window.addEventListener('click', function(e) {
    const overlay = document.getElementById('globalConfirmOverlay');
    if (e.target === overlay) {
        closeGlobalConfirm();
    }
});