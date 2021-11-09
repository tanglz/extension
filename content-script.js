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
const progressBar ='<div class="progress"><div class="progress-bar progress-bar-striped bg-warning" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div>';

let num_input=0
let num_button=0
let text ="";
let title = "";
let link ="";
chrome.storage.sync.get("current_url", ({ current_url }) => {
  link = current_url
});
$( document ).ready(function() {
    console.log( "ready!" );
    title = $('title').text();
    console.log(title);
    let cloneBody = $('body').clone().find('script').remove().end();
    bb = cloneBody.find('style').remove().end();
    text = bb.text()
    placeholders=[]
    $('input').each(function(index){
        type = $(this).attr('type');
        console.log(type);
        valid_input_types = ['text','number','password','search','email'];
        valid_button_types = ['submit','button'];
        if($.inArray(type, valid_input_types)>-1){
            num_input=num_input+1;
        }
        if($.inArray(type, valid_button_types)>-1){
            num_button=num_button+1;
        }
        placeholder = $(this).attr('placeholder');
        placeholders.push(placeholder);
    });
    $('button').each(function(index){
        num_button=num_button+1;
    });
    $('textarea').each(function(index){
        num_input=num_input+1;
    });
    page_description=title;
    text = $.trim(text);

    if(text.length>0 && text.length<200){
       sub_text = text;
    }else if(text.length>=200){
       sub_text = text.substring(0,199);
    }
    page_description=title+' '+sub_text;
    console.log('text:'+page_description)
    html2canvas($('body')[0]).then(canvas => {
        var dataURL = canvas.toDataURL("image/png");
        $.ajax({
          type: "POST",
          url: "https://127.0.0.1:5000/screenshot",
          data: {
             imgBase64: dataURL,
             name:link,
             description: page_description
          }
        }).done(function(o) {
          console.log('saved');
        });
    });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "check"){
        console.log('ready 2!')
        api_url = 'https://127.0.0.1:5000/predict/ai';
        fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({url: request.currentUrl,'num_input':num_input,'num_button':num_button,'title':title}),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            chrome.storage.sync.set({'data': data});
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
        });
    }
  }
);










