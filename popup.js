let url_container = document.getElementById("detect_url");
let link = "";
const api_host="https://www.api.thehawkeyes.com/";
chrome.storage.sync.get("current_url", ({ current_url }) => {
    link = current_url
    url_container.innerHTML = current_url;
    //whois
    let net_info;
    api_url = api_host+'/net/info';
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'url': link}),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("netloc-country").innerText = data.net_info.country;
        document.getElementById("netloc-domain").innerText = data.net_info.domain;
        document.getElementById("netloc-years").innerText = data.net_info.years;
        document.getElementById("netloc-org").innerText = data.net_info.org;
    });
});
let action_container = document.getElementById("report_action");
let error_type=1
let api_url_1 = api_host +'/verify/add?error_type=1&url=';
let api_url_2 = api_host +'/verify/add?error_type=2&url=';

chrome.storage.sync.get("data", ({ data }) => {
  if(data && data.success){
    verify_html="";
    let risk_text = "LOW"
    let text_color = "green"
    if(!data.phishing){
        url_container.style.color='green';
        url_container.classList.add('yes');
        url_container.classList.remove('no');
        if(data.source == 'local'){
          action_text="";
          action_container.href=""
        }else{
          action_text="Report this site as suspicious >>";
          action_container.href=api_url_1 +link
        }
    }else{
      action_text="False Alarm >>";
      error_type=2
      url_container.style.color='red';
      url_container.classList.add('no');
      url_container.classList.remove('yes');
      action_container.href=api_url_2+link
      risk_text = "HIGH"
      text_color = "red"
    }
    action_container.innerText = action_text;
    document.getElementById("phishing-level").innerText = risk_text
    document.getElementById("phishing-level").style.color = text_color
    document.getElementById("risk-more").href = api_host+'/url/net_loc?url='+link
  }
});
