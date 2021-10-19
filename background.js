const a =1;
function fun_action(tabId) {
    let current_url = "";
    chrome.storage.sync.set({'data': {}});
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        console.log(tabs);
        if (!tabs || tabs.length < 1) {
            return;
        }
        current_url = tabs[0].url;
        console.log(current_url)
        if (!current_url) {
            return;
        }
        chrome.storage.sync.set({current_url});
        const parameter = {url: current_url};
        fetch('http://35.224.126.121:5000/predict/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parameter),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                chrome.storage.sync.set({'data': data});
                chrome.tabs.sendMessage(tabId, {
                    message: 'result',
                    url: current_url,
                    result: data
                });
            });
    });
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    console.log(changeInfo);
    if (changeInfo.status == 'complete') {
        fun_action(tabId);
    }
});
chrome.tabs.onActivated.addListener(function (activeInfo) {
    console.log(activeInfo)
    console.log(activeInfo.tabId);
    fun_action(activeInfo.tabId);
});

