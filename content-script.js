const alarmModal="<div id=\"alarmModal\" class=\"alarm-modal phishing-alarm\">\n" +
    "\n" +
    "  <!-- Modal content -->\n" +
    "  <div class=\"alarm-modal-content\">\n" +
    "    <span class=\"alarm-close phishing-alarm-close-btn\">&times;</span>\n" +
    "    <p class='alarm-text-desc'>Attackers may trick you into doing something dangerous like installing software or revealing your personal information (for example, passwords, phone numbers, or credit cards).</p>\n" +
    "<p class='p-btn'><button type='button' class='btn btn-outline-danger report' id ='report-phishing-false-alarm'> Report False Alarm >> </button> <button type='button' class='phishing-alarm-close-btn btn btn-outline-dark cls'>Close</button></p>\n" +
    "  </div>\n" +
    "\n" +
    "</div>";
const progressBar ='<div class="progress"><div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>';
let num_input=0
let num_button=0
let text ="";
let title = "";
let link ="";
chrome.storage.sync.get("current_url", ({ current_url }) => {
  link = current_url
});
function closeAction(){
      // Get the modal
      const modal = document.getElementById("alarmModal");
      modal.style.display = "none";
      modal.remove();
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "check"){
        $( document ).ready(function() {
            favicon_link = $("[rel~='icon']").attr('href');
            title = $('title').text();
            let cloneBody = $('body').clone().find('script').remove().end();
            bb = cloneBody.find('style').remove().end();
            text = bb.text()
            placeholders=[]
            inputs = []
            buttons=[]
            $('input').each(function(index){
                type = $(this).attr('type');
                valid_input_types = ['text','number','password','search','email','tel'];
                valid_button_types = ['submit','button']
                if($.inArray(type, valid_input_types)>-1){
                    val = $(this).attr('value');
                    placeholder = $(this).attr('placeholder');
                    desc = val || placeholder;
                    if(desc==''|| typeof desc === "undefined"){
                        prev = $(this).prev()[0];
                        next = $(this).next()[0];
                        if($.isEmptyObject(prev)){
                            if($.isEmptyObject(next)){
                                // other structures
                            }else{
                                desc = $(next).text();
                            }
                        }else{
                            desc = $(prev).text();
                        }
                    }
                    input = {'type':type,'desc': desc};
                    inputs.push(input);
                    num_input=num_input+1;
                }
                if($.inArray(type, valid_button_types)>-1){
                    button = {'type':type,'desc': $(this).attr('value')};
                    buttons.push(button)
                }
            });

            $('button').each(function(index){
                btn={'type':'button','desc': $(this).text()}
                buttons.push(btn)
                num_button=num_button+1;
            });
            $('textarea').each(function(index){
                num_input=num_input+1;
            });
            page_description=title;
            text = $.trim(text);
            chrome.runtime.sendMessage({
                message: 'DOM',
                currentUrl: request.currentUrl,
                num_input: num_input,
                num_button:num_button,
                title:title,
                inputs:inputs,
                buttons: buttons
            }, function(response) {
              if (response.phishing) {
                    chrome.storage.sync.get("exclude_url_list", ({ exclude_url_list }) => {
                        console.log(exclude_url_list);
                        if(exclude_url_list && exclude_url_list.includes(request.currentUrl)){
                            return;
                        }else{
                            const URL = "https://www.api.hawk-eyes.ca/verify/add?error_type=2&url=" +request.currentUrl
                            var elemDiv = document.createElement('div');
                            elemDiv.innerHTML = alarmModal;
                            document.body.appendChild(elemDiv);
                            // Get the <span> element that closes the modal
                            const closeBtns = document.getElementsByClassName("phishing-alarm-close-btn");
                            // When the user clicks on <span> (x), close the modal
                            if(exclude_url_list){
                                exclude_url_list.push(link);
                            }else{
                                exclude_url_list = [link];
                            }
                            for (var i = 0; i < closeBtns.length; i++) {
                                closeBtns[i].addEventListener('click', function(event){
                                    closeAction();
                                    chrome.storage.sync.set({"exclude_url_list":exclude_url_list});
                                });
                            }
                            const reportBtn = document.getElementById("report-phishing-false-alarm");
                            reportBtn.addEventListener('click',function (event){
                                closeAction();
                                chrome.storage.sync.set({"exclude_url_list":exclude_url_list});
                                window.open(URL, '_blank').focus();
                            });
                        }
                    });
              }
            });
        });
    }
  }
);













