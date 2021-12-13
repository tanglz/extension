async function storeCurrentTabUrl() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  currentUrl = tab.url;
  chrome.storage.sync.get("exclude_url_list", ({ exclude_url_list }) => {
      console.log("test");
      console.log(exclude_url_list);
      if(exclude_url_list && exclude_url_list.includes(currentUrl)){
          console.log('exclude');
          return;
      }else{
          console.log('start......')
          chrome.storage.sync.set({'current_url': currentUrl});
          chrome.tabs.sendMessage(tab.id, {
                message: 'check',
                currentUrl: currentUrl,
                tabId: tab.id
          });
          return tab.url;
      }
  });

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
        api_url = "https://www.api.hawk-eyes.ca/predict/ai";
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

