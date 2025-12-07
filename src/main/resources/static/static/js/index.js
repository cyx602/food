document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});


// 页面加载完成后获取公告
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); // 原有逻辑
    loadLatestAnnouncement(); // 新增逻辑
});

async function loadLatestAnnouncement() {
    // 修改点：检查 sessionStorage，如果本次会话已经看过公告，就不再显示
    if (sessionStorage.getItem('hasSeenAnnouncement')) {
        return;
    }

    try {
        const res = await fetch('/api/common/latest-announcement?t=' + new Date().getTime());
        const json = await res.json();

        if (json.success && json.data) {
            const ann = json.data;
            document.getElementById('announcementTitle').innerText = ann.title;
            document.getElementById('announcementContent').innerText = ann.content;

            // 显示弹窗
            document.getElementById('announcementModal').style.display = 'flex';

            // 修改点：标记为已读，下次返回首页不再显示
            sessionStorage.setItem('hasSeenAnnouncement', 'true');
        }
    } catch (e) {
        console.error("获取公告失败", e);
    }
}
