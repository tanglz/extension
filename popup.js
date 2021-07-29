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
let link = "";
chrome.storage.sync.get("current_url", ({ current_url }) => {
  link = current_url
  url_container.innerHTML = current_url;
});
let result_container = document.getElementById("verify_result");
let action_container = document.getElementById("report_action");
let error_type=1
chrome.storage.sync.get("verify_result", ({ verify_result }) => {
  console.log(verify_result)
  verify_html="";
  if(verify_result==1){
    verify_html="<div class='legitimate'>We did not find any fraudulent elements on this page.</div>";
    action_text="Report this site as suspicious >>";
    // card_container.classList.add('bg-success');
    // card_container.classList.remove('bg-danger');
    url_container.style.color='green';
    url_container.classList.add('yes');
    url_container.classList.remove('no');
    action_container.href='http://127.0.0.1:5000/verify/add?error_type=1&url='+link
  }
  if(verify_result==-1){
    verify_html="<div class='phishing'>Attackers may trick you into doing something dangerous like installing software or revealing your personal information (for example, passwords, phone numbers, or credit cards).</div>";
    action_text="False Alarm >>";
    error_type=2
    url_container.style.color='red';
    url_container.classList.add('no');
    url_container.classList.remove('yes');
    action_container.href='http://127.0.0.1:5000/verify/add?error_type=2&url='+link
  }
  result_container.innerHTML = verify_html;
  action_container.innerText = action_text;
});
