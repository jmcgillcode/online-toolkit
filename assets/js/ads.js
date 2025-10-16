// ==========================================
// Google AdSense 广告配置
// ==========================================

// 广告配置 - 请替换为你的实际 AdSense 信息
const ADS_CONFIG = {
    // 你的 AdSense 发布者 ID (如: ca-pub-1234567890123456)
    publisherId: 'ca-pub-YOUR_PUBLISHER_ID',

    // 广告单元 ID
    slots: {
        topBanner: 'YOUR_AD_SLOT_ID_1',        // 顶部横幅 (728x90)
        middleRectangle: 'YOUR_AD_SLOT_ID_2',   // 中间矩形 (336x280)
        bottomBanner: 'YOUR_AD_SLOT_ID_3',      // 底部横幅 (970x250)
        sidebar: 'YOUR_AD_SLOT_ID_4',           // 侧边栏 (300x600)
        responsive: 'YOUR_AD_SLOT_ID_5'         // 响应式广告
    }
};

// 广告尺寸配置
const AD_SIZES = {
    topBanner: {
        desktop: '728x90',
        mobile: '320x50'
    },
    middleRectangle: {
        desktop: '336x280',
        mobile: '300x250'
    },
    bottomBanner: {
        desktop: '970x250',
        mobile: '320x50'
    },
    sidebar: {
        desktop: '300x600',
        mobile: '300x250'
    }
};

// 检测设备类型
function isMobile() {
    return window.innerWidth <= 768;
}

// 创建广告单元
function createAdUnit(slotId, size, isResponsive = false) {
    const adContainer = document.createElement('div');
    adContainer.className = 'ad-container';
    adContainer.style.cssText = `
        margin: 20px auto;
        text-align: center;
        clear: both;
    `;

    if (isResponsive) {
        adContainer.innerHTML = `
            <!-- 响应式广告 -->
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="${ADS_CONFIG.publisherId}"
                 data-ad-slot="${slotId}"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        `;
    } else {
        const [width, height] = size.split('x');
        adContainer.innerHTML = `
            <ins class="adsbygoogle"
                 style="display:inline-block;width:${width}px;height:${height}px"
                 data-ad-client="${ADS_CONFIG.publisherId}"
                 data-ad-slot="${slotId}"></ins>
        `;
    }

    return adContainer;
}

// 初始化广告
function initializeAds() {
    // 只有在配置了正确的发布者 ID 时才加载广告
    if (ADS_CONFIG.publisherId === 'ca-pub-YOUR_PUBLISHER_ID') {
        console.log('⚠️ 请配置正确的 AdSense 发布者 ID');
        return;
    }

    // 加载 AdSense 脚本
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CONFIG.publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    console.log('✅ Google AdSense 已初始化');
}

// 推送广告
function pushAd() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
        console.error('广告加载失败:', error);
    }
}

// 在页面加载后初始化广告
document.addEventListener('DOMContentLoaded', function() {
    initializeAds();

    // 等待 AdSense 脚本加载后推送所有广告
    setTimeout(() => {
        const ads = document.querySelectorAll('.adsbygoogle');
        ads.forEach(() => pushAd());
    }, 1000);
});

// 导出配置供其他脚本使用
window.AdsConfig = ADS_CONFIG;
window.createAdUnit = createAdUnit;
window.pushAd = pushAd;

console.log('✅ 广告配置已加载');