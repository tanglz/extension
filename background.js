let color = '#c1913e';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({color});
});
let current_url="";
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    current_url = tab.url;
    chrome.tabs.sendMessage( tabId, {
        message: 'verify',
        url : tab.url
    });
    chrome.storage.sync.set({current_url});
});

