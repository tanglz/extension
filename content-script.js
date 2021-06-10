
const warningMessage=
    "<div class=\"container\">\n" +
    "  <!-- Content here -->\n" +
    "  <div class=\"bar\">\n" +
    "\n" +
    "  </div>\n" +
    "  <div class=\"info\">\n" +
    "        <div class=\"tt\">\n" +
    "            <p>DECEPTIVE SITE AHEAD</p>\n" +
    "        </div>\n" +
    "        <div class=\"detail\">\n" +
    "            <p>The website <span id=\"phishing_url\"></span> may be trying to trick you into doing something dangerous like installing software or revealing your personal information.</p>\n" +
    "        </div>\n" +
    "<!--        <div class=\"action\">-->\n" +
    "<!--            <button class=\"view\">View Details</button>-->\n" +
    "<!--            <button class=\"back\">Back to Safety</button>-->\n" +
    "<!--        </div>-->\n" +
    "  </div>\n" +
    "  <div class=\"bt\">\n" +
    "\n" +
    "  </div>\n" +
    "</div>";
let verify_result=1;
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        if (request.message === 'verify') {
            console.log("request_url:"+request.url); // new url is now in content scripts!
            let id = chrome.runtime.id;
            console.log("id:"+ id);
            //test ajax
            $.ajax({
              method: "POST",
              url: "http://127.0.0.1:5000/check_bl",
              data: { url: request.url }
            }).done(function( msg ) {
                console.log(msg);
                if(msg.success&&msg.result){
                    console.log("phishing website");
                    document.body.innerHTML=warningMessage;
                    document.getElementById("phishing_url").innerText= request.url;
                    verify_result=-1
                    chrome.storage.sync.set({verify_result});
                    chrome.storage.sync.get("color", (data) => {
                        let currentColor = data.color;
                         document.getElementsByClassName("container").style.background_color = currentColor
                    });
                }else{
                    console.log("legitimate")
                    verify_result=1
                    chrome.storage.sync.set({verify_result});
                }
            });
        }
    }
);





