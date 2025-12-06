// background.js - 负责管理图标状态

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 接收到 content.js 发来的报警信号
    if (request.action === "update_badge" && sender.tab) {
        // 设置红色背景
        browser.browserAction.setBadgeBackgroundColor({
            tabId: sender.tab.id,
            color: "#FF0000"
        });
        // 设置文本为 "!"
        browser.browserAction.setBadgeText({
            tabId: sender.tab.id,
            text: "!"
        });
    }
});

// MV2: 使用 webRequest 来修改请求头
browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        if (details.type === "xmlhttprequest") {
            let headers = details.requestHeaders;
            // 设置 Referer
            let refererIndex = headers.findIndex(h => h.name.toLowerCase() === 'referer');
            if (refererIndex !== -1) {
                headers[refererIndex].value = "Referer-modified-value";
            } else {
                headers.push({name: "Referer", value: "Referer-modified-value"});
            }
            // 移除 Origin
            headers = headers.filter(h => h.name.toLowerCase() !== 'origin');
            return {requestHeaders: headers};
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);