const url = window.location.origin;

let col = [];

for (let i = 0; i < 25; i++) {
    col.push(getComputedStyle(document.querySelector(":root")).getPropertyValue("--const" + (i + 1)));
};

var constants = {
    "url": url,
    "device": getDevice(),
    "postmail": {
        "subject_text": " über Timon.dev Website Formular:",
        "header": " schreibt am ",
        "abs": "\n==========================================\n\n",
        "footer1": " hat diese E-Mail hinterlegt: ",
        "footer2": "Dies ist eine automatisch verschickte E-Mail über eine API von postmail.invotes.com\nProgrammiert und aufesetzt von Timon Fiedler.\nTimon Fiedler ist nicht verantwortlich für eventuellen Spam oder andere Fehler, die durch den Endnutzer entstehen.",
        "data": {
            "access_token": "72q03rx7katuj10jvr81adch"
        }
    },
    "style_url": {
        "index": url + "/root/stylesheet%20files/style_",
        "login": url + "/root/stylesheet%20files/login_",
        "profile": url + "/root/stylesheet%20files/extras/profile_",
        "messager": url + "/projects/messager/stylesheet%20files/style_"
    },
    "css_var": {
        "lightArray": col,
        "darkArray": [col[24 - 1], col[25 - 1], col[23 - 1], col[22 - 1], col[12 - 1], col[12 - 1], col[10 - 1], col[9 - 1], col[8 - 1], col[7 - 1], col[6 - 1], col[5 - 1], col[14 - 1], col[13 - 1], col[21 - 1], col[20 - 1], col[19 - 1], col[18 - 1], col[17 - 1], col[16 - 1], col[15 - 1], col[4 - 1], col[3 - 1], col[1 - 1], col[2 - 1]]
    },
    "settings": {
        "darkmode": document.getElementById("settings_darkmode").content
    }
};