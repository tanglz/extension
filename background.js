async function storeCurrentTabUrl() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  currentUrl = tab.url;
  chrome.storage.sync.set({'current_url': currentUrl});
  chrome.tabs.sendMessage(tab.id, {
        message: 'check',
        currentUrl: currentUrl,
        result: tab.id
  });
  return tab.url;
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status == 'complete') {
        storeCurrentTabUrl();
    }
});
chrome.tabs.onActivated.addListener(function (activeInfo) {
    storeCurrentTabUrl();
});

