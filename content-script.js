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
        if (request.message === 'result') {
            console.log("request_url:"+request.url); // new url is now in content scripts!
            let verify_result = request.result;
            if (verify_result == -1) {
                console.log("phishing")
                const URL = "http://127.0.0.1:5000/verify/add?error_type=2&url=" +request.url
                document.body.innerHTML += alarmModal;
                document.getElementById("external_url").href=URL;
                // document.getElementById("phishing_url").innerText = request.url;
                // chrome.storage.sync.get("color", (data) => {
                //     let currentColor = data.color;
                //     // document.getElementsByClassName("container").style.background_color = currentColor
                // });
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





