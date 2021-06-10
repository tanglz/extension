// https://developer.chrome.com/docs/extensions/mv3/hosting/
// Initialize butotn with users's prefered color
// let changeColor = document.getElementById("changeColor");

// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// The body of this function will be execuetd as a content script inside the
// current page
// function setPageBackgroundColor() {
//   chrome.storage.sync.get("color", ({ color }) => {
//     document.body.style.backgroundColor = color;
//   });
// }
let url_container = document.getElementById("detect_url");
chrome.storage.sync.get("current_url", ({ current_url }) => {
  url_container.innerHTML = current_url;
});
let result_container = document.getElementById("verify_result");
chrome.storage.sync.get("verify_result", ({ verify_result }) => {
  verify_html="";
  if(verify_result==1){
    verify_html="<div class='legitimate'>This is a legitimate website.</div>";
  }
  if(verify_result==-1){
    verify_html="<div class='phishing'>This is a phishing website.</div>";
  }
  result_container.innerHTML = verify_html;
});