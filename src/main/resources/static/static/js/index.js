document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});


// 页面加载完成后获取公告
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus(); 
    loadLatestAnnouncement(); 
});

async function loadLatestAnnouncement() {
   
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

            
            sessionStorage.setItem('hasSeenAnnouncement', 'true');
        }
    } catch (e) {
        console.error("获取公告失败", e);
    }
}
