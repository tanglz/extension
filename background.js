let color = '#c1913e';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
});
let current_url = "";
let verify_result = 1;
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    current_url = tab.url;
    let is_system_page = current_url.startsWith("chrome-extension") || current_url.startsWith("https://meet.google.com") || current_url.startsWith("chrome://newtab");
    if (is_system_page) {
        return;
    }
    chrome.storage.sync.set({current_url});
    console.log(changeInfo)
    if (changeInfo.status != 'complete') {
        return;
    }
    const parameter = {url: current_url};
    fetch('http://127.0.0.1:5000/predict/ml', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameter),
    })
        .then(response => response.json())
        .then(data => {
            if (data.result) {
                verify_result = -1
                chrome.storage.sync.set({verify_result});
            } else {
                verify_result = 1
                chrome.storage.sync.set({verify_result});
            }
            chrome.tabs.sendMessage(tabId, {
                message: 'result',
                url: tab.url,
                result: verify_result
            });
        });
});

