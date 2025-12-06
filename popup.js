if (typeof browser === "undefined") {
    var browser = chrome;
}

function queryTabs(options) {
    return new Promise((resolve, reject) => {
        browser.tabs.query(options, (tabs) => {
            if (browser.runtime.lastError) {
                reject(new Error(browser.runtime.lastError.message));
            } else {
                resolve(tabs);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const el = {
        passiveBadge: document.getElementById('passive-badge'),
        passiveList: document.getElementById('passive-list'),
        btnFinger: document.getElementById('btnFingerprint'),
        fingerResult: document.getElementById('fingerprint-result'),
        activeList: document.getElementById('active-list'),
        btnExploit: document.getElementById('btnExploit'),
        cmdInput: document.getElementById('cmdInput'),
        exploitStatus: document.getElementById('exploit-status'),
        exploitResult: document.getElementById('exploit-result'),
        rceOutput: document.getElementById('rce-output')
    };

    try {
        const tabs = await queryTabs({active: true, currentWindow: true});
        const tabId = tabs[0].id;
        
        // --- 初始化：被动扫描 ---
        try {
            const res = await browser.tabs.sendMessage(tabId, {action: "get_passive"});
            if(res.isRSC) {
                el.passiveBadge.innerText = "DETECTED";
                el.passiveBadge.className = "badge red";
            } else {
                el.passiveBadge.innerText = "SAFE";
                el.passiveBadge.className = "badge green";
            }
            
            el.passiveList.innerHTML = "";
            if(res.details.length === 0) el.passiveList.innerHTML = "<li>No patterns found</li>";
            res.details.forEach(d => {
                const li = document.createElement('li');
                li.innerText = d;
                li.style.color = "#c0392b";
                el.passiveList.appendChild(li);
            });
        } catch (e) {
            el.passiveBadge.innerText = "ERROR";
            el.passiveList.innerHTML = "<li>Please refresh page</li>";
        }

        // --- 交互：主动指纹 ---
        el.btnFinger.addEventListener('click', async () => {
            el.btnFinger.disabled = true;
            el.btnFinger.innerText = "Probing...";
            el.fingerResult.style.display = 'none';

            try {
                const res = await browser.tabs.sendMessage(tabId, {action: "run_fingerprint"});
                el.btnFinger.disabled = false;
                el.btnFinger.innerText = "Start Fingerprint Probe";
                el.fingerResult.style.display = 'block';
                el.activeList.innerHTML = "";

                if(res && res.detected) {
                    res.details.forEach(d => {
                        const li = document.createElement('li');
                        li.innerText = d;
                        li.style.color = "#d35400";
                        li.style.fontWeight = "bold";
                        el.activeList.appendChild(li);
                    });
                } else {
                    el.activeList.innerHTML = "<li style='color:#27ae60'>No Active RSC Response</li>";
                }
            } catch (e) {
                el.btnFinger.disabled = false;
                el.btnFinger.innerText = "Start Fingerprint Probe";
                el.fingerResult.style.display = 'block';
                el.activeList.innerHTML = "<li style='color:#e74c3c'>Error: No response from content script</li>";
            }
        });

        // --- 交互：RCE 利用 ---
        el.btnExploit.addEventListener('click', async () => {
            const cmd = el.cmdInput.value || "whoami";
            el.btnExploit.disabled = true;
            el.exploitStatus.style.display = 'block';
            el.exploitResult.style.display = 'none';
            el.rceOutput.className = 'console-out'; // 重置样式

            try {
                const res = await browser.tabs.sendMessage(tabId, {action: "run_exploit", cmd: cmd});
                el.btnExploit.disabled = false;
                el.exploitStatus.style.display = 'none';
                el.exploitResult.style.display = 'block';

                if(res && res.success) {
                    el.rceOutput.style.color = "#00cec9"; // 青色成功色
                    el.rceOutput.innerText = `[+] Command: ${cmd}\n[+] Output:\n${res.output}`;
                    // 成功后强制图标报警
                    await browser.runtime.sendMessage({ action: "update_badge" });
                } else {
                    el.rceOutput.style.color = "#e74c3c"; // 红色失败色
                    el.rceOutput.innerText = `[-] ${res ? res.msg : "Unknown Error"}`;
                }
            } catch (e) {
                el.btnExploit.disabled = false;
                el.exploitStatus.style.display = 'none';
                el.exploitResult.style.display = 'block';
                el.rceOutput.style.color = "#e74c3c";
                el.rceOutput.innerText = `[-] Error: No response from content script`;
            }
        });
    } catch (e) {
        console.error("Failed to get active tab:", e);
        // Perhaps show error in UI
    }
});