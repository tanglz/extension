async function storeCurrentTabUrl() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  currentUrl = tab.url;
  chrome.storage.sync.set({'current_url': currentUrl});
  chrome.storage.sync.set({'data': {}});
  chrome.tabs.sendMessage(tab.id, {
        message: 'check',
        currentUrl: currentUrl,
        tabId: tab.id
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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "DOM"){
        api_url = "https://www.api.thehawkeyes.com/predict/ai";
        fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'url': request.currentUrl,'num_input':request.num_input,'num_button':request.num_button,'title':request.title, 'inputs':request.inputs,'buttons':request.buttons}),
        })
        .then(response => response.json())
        .then(data => {
            chrome.storage.sync.set({'data': data});
            sendResponse(data);
        });
    }
    return true;
  }
);

