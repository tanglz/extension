let url_container = document.getElementById("phishing_url");
chrome.storage.sync.get("current_url", ({ current_url }) => {
  url_container.innerHTML = current_url;
});