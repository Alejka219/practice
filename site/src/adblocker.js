const originalFetch = window.fetch;
window.fetch = function(url, options) {
    const blockedDomains = [
        'doubleclick.net',
        'googleadservices.com',
        'googlesyndication.com',
        'adservice.com',
        'adnxs.com',
        'criteo.com'
    ];
    
    if (blockedDomains.some(domain => url.toString().includes(domain))) {
        console.log('[AdBlocker] Заблокирован запрос к:', url);
        return Promise.reject(new Error('Запрос заблокирован AdBlocker'));
    }
    
    return originalFetch(url, options);
};

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                if (node.tagName === 'IFRAME' && node.src && 
                    (node.src.includes('ad') || node.src.includes('banner'))) {
                    console.log('[AdBlocker] Удалён рекламный iframe:', node.src);
                    node.remove();
                }
                if (node.classList && 
                    (node.classList.contains('ad') || 
                     node.classList.contains('ads') ||
                     node.id === 'ad' ||
                     node.id === 'banner')) {
                    console.log('[AdBlocker] Удалён элемент с классом ad/ads');
                    node.remove();
                }
            }
        });
    });
});

if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
} else {
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

console.log('[AdBlocker] Загружен и активен');