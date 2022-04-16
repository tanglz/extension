async function storeCurrentTabUrl() {
    chrome.storage.sync.set({'data': {}});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          currentUrl = tabs[0].url;
          if(!currentUrl.startsWith('http')){
            return;
          }
          chrome.storage.sync.set({'current_url': currentUrl});
          chrome.tabs.sendMessage(tabs[0].id,
          {
            message: 'check',
            currentUrl: currentUrl,
            tabId: tabs[0].id
          },
          function(response) {
            console.log(response);
            parameters=response
            api_url = "https://www.api.thehawkeyes.com/predict/ai";
            fetch(api_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'url': parameters.currentUrl,'num_input':parameters.num_input,'num_button':parameters.num_button,'title':parameters.title, 'inputs':parameters.inputs,'buttons':parameters.buttons,'w_doc':parameters.w_doc,
                    'h_doc':parameters.h_doc,
                    'tag_input_list':parameters.tag_input_list,
                    'tag_button_list': parameters.tag_button_list, 'version':'1.0.1'}),
            })
            .then(response => response.json())
            .then(data => {
                chrome.storage.sync.set({'data': data});
            });
          });
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

