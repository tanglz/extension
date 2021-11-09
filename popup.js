let url_container = document.getElementById("detect_url");
let link = "";
chrome.storage.sync.get("current_url", ({ current_url }) => {
  link = current_url
  url_container.innerHTML = current_url;
});
let action_container = document.getElementById("report_action");
let error_type=1
let server_hostname = '127.0.0.1'
let api_url_1 = 'https://'+server_hostname +'/verify/add?error_type=1&url=';
let api_url_2 = 'https://'+server_hostname+'/verify/add?error_type=2&url=';

chrome.storage.sync.get("data", ({ data }) => {
  if(data && data.success){
    console.log(data)
    verify_html="";
    if(!data.phishing){
      // verify_html="<div class='legitimate'>We did not find any fraudulent elements on this page.</div>";
      action_text="Report this site as suspicious >>";
      // card_container.classList.add('bg-success');
      // card_container.classList.remove('bg-danger');
      url_container.style.color='green';
      url_container.classList.add('yes');
      url_container.classList.remove('no');
      url_container.classList.remove('warn');
      action_container.href=api_url_1 +link
    }
    if(data.phishing){
      // verify_html="<div class='phishing'>Attackers may trick you into doing something dangerous like installing software or revealing your personal information (for example, passwords, phone numbers, or credit cards).</div>";
      action_text="False Alarm >>";
      error_type=2
      if(data.risk >0.99){
        url_container.style.color='red';
        url_container.classList.add('no');
      }else{
        url_container.style.color='orangered';
        url_container.classList.add('warn');
      }
      url_container.classList.remove('yes');
      action_container.href=api_url_2+link
    }
    document.getElementById("netloc-country").innerText = data.net_info.country;
    document.getElementById("netloc-domain").innerText = data.net_info.domain;
    document.getElementById("netloc-years").innerText = data.net_info.years;
    document.getElementById("netloc-org").innerText = data.net_info.org;
    const logos = data.logos
    if(logos&&logos.length>=1){
      document.getElementById("netloc-logo").innerText = logos[0];
    }
    action_container.innerText = action_text;
    const risk = data.risk
    let risk_text = "LOW"
    let text_color = "green"
    if(risk>=0.99){
        risk_text = "HIGH"
        text_color = "red"
    }
    if(risk<0.99 && risk>=0.85){
        risk_text = "MEDIUM"
        text_color = "orangered"
    }
    document.getElementById("phishing-level").innerText = risk_text
    document.getElementById("phishing-level").style.color = text_color
    document.getElementById("risk-more").href = 'http://'+server_hostname+'/url/net_loc?url='+link
  }

});
