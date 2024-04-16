const closer = document.querySelector(".edit_wrapper"),
    edit = document.querySelector(".edit"),
    pref_btn = document.getElementById("pref_btn"),
    pw = document.getElementById("password_span"),
    dl_btn = document.getElementById("pref_btn_dl");
let open_edit = true,
    pref_toggler = false,
    dl_toggler = constants.settings.darkmode;



document.querySelector(".m_edit").addEventListener("click", () => {
    closer.style.display = "block";
});

closer.addEventListener("click", () => {
    setTimeout(() => {
        if (open_edit) {
            closer.style.display = "none";
        };
    }, 100);
});

edit.addEventListener("click", () => {
    open_edit = false;
    setTimeout(() => {open_edit = true;}, 400);
});

pref_btn.addEventListener("click", () => {
    if (pref_toggler) {
        let a = "";
        for (let i = 0; i < constants.password.length; i++) {
            a += "*"
        };
        pw.innerHTML = a;
    } else {
        pw.innerHTML = constants.password;
    };
    pref_toggler = !pref_toggler;
});

dl_btn.addEventListener("click", () => {
    if (dl_toggler == (true || "1" || "true")) {
        fetch(constants.url + "/post/settings/light", {
            method: "POST"
        });
        setLightMode();
    } else {
        fetch(constants.url + "/post/settings/dark", {
            method: "POST"
        });
        setDarkMode();
    };
    dl_toggler = !dl_toggler;
});