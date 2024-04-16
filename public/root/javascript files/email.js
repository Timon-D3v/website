const form = document.getElementById("contact_form"),
    submit = document.getElementById("contact_submit"),
    user = document.getElementById("contact_user"),
    email = document.getElementById("contact_email"),
    text = document.getElementById("contact_text");
                   
function postmailSend () {
    document.getElementById("contact_submit_p").innerHTML = "Senden...";
    submit.disabled = true;

    let request = new XMLHttpRequest();

    let requestDate = Date();
    requestDate = requestDate.slice(0, 4) + 
                    requestDate.slice(8, 10) + 
                    ". " + requestDate.slice(4, 7) + 
                    " " + requestDate.slice(11, 15) + 
                    " - " + requestDate.slice(16, 24); 

    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            mailSentSuccessfully();
        } else if (request.readyState == 4) {
            mailSentError(request.response);
        };
    };


    let subject = user.value + constants.postmail.subject_text;
    let message = user.value + constants.postmail.header 
                + requestDate + constants.postmail.abs + text.value 
                + constants.postmail.abs + user.value +
                constants.postmail.footer1 + email.value + 
                constants.postmail.abs + constants.postmail.footer2;

    constants.postmail.data['subject'] = subject;
    constants.postmail.data['text'] = message;

    let paramameters = toParams(constants.postmail.data);
                    
    request.open("POST", "https://postmail.invotes.com/send", true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    
    request.send(paramameters);

    document.getElementById("contact_submit_p").innerHTML = "Sent!";
                    
    return false;
};
                    
function toParams (postmailData) {
    let form_data = [];
    for (let key in postmailData) {
        form_data.push(encodeURIComponent(key) + "=" + encodeURIComponent(postmailData[key]));
    };
                    
    return form_data.join("&");
}

function mailSentSuccessfully () {
    console.log("Email sent successfully.");
    alert("Email sent successfully.");
};

function mailSentError (error) {
    console.error("Something went wrong while sending your E-Mail...\nFurther information: ", error);
    alert("Something went wrong while sending your E-Mail...\nFurther information: ", error)
};

submit.addEventListener("click", event => {
    event.preventDefault();
    postmailSend();
    return false;
});