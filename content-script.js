const alarmModal="<div id=\"alarmModal\" class=\"alarm-modal\">\n" +
    "\n" +
    "  <!-- Modal content -->\n" +
    "  <div class=\"alarm-modal-content\">\n" +
    "    <span class=\"alarm-close\" id=\"alarm-close-btn\">&times;</span>\n" +
    "    <p style='text-align: center'>Attackers may trick you into doing something dangerous like installing software or revealing your personal information (for example, passwords, phone numbers, or credit cards).</p>\n" +
    "<p class='p-btn'><button class='btn-default'><a target='_blank' id='external_url' href=''> False Alarm >> </a></button></p>\n" +
    "  </div>\n" +
    "\n" +
    "</div>";

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // listen for messages sent from background.js
        api_url = 'http://192.168.0.118:5000/verify/add?error_type=2&url=';
        if (request.message === 'result') {
            console.log("request_url:"+request.url); // new url is now in content scripts!
            let data = request.result;
            if (data.phishing) {
                console.log("phishing")
                const URL = api_url +request.url
                document.body.innerHTML += alarmModal;
                document.getElementById("external_url").href=URL;
                // Get the modal
                const modal = document.getElementById("alarmModal");
                // Get the <span> element that closes the modal
                const closeBtn = document.getElementById("alarm-close-btn");
                // When the user clicks on <span> (x), close the modal
                closeBtn.addEventListener('click',function (event){
                    modal.style.display = "none";
                });
            }
        }
    }
);





