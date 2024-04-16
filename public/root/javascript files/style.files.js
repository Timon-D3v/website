const link = document.getElementById("stylesheet");



function styleDecider (device) {
    switch (device) {
        case "desktop":
            if (link.href != constants.style_url.index + "desktop.min.css" && window.innerWidth > 615) {
                link.href = constants.style_url.index + "desktop.min.css";
            } else if (link.href != constants.style_url.index + "mobile.min.css" && window.innerWidth < 616) {
                link.href = constants.style_url.index + "mobile.min.css";
            };
            break;
        case "mobile":
            if (link.href != constants.style_url.index + "mobile.min.css" && window.innerWidth < 615) {
                link.href = constants.style_url.index + "mobile.min.css";
            } else if (link.href != constants.style_url.index + "tab.min.css" && window.innerWidth > 616) {
                link.href = constants.style_url.index + "tab.min.css";
            };
            break;
        case "tablet":
            if (link.href != constants.style_url.index + "tab.min.css" && window.innerWidth > 400) {
                link.href = constants.style_url.index + "tab.min.css";
            } else if (link.href != constants.style_url.index + "mobile.min.css" && window.innerWidth < 401) {
                link.href = constants.style_url.index + "mobile.min.css";
            };
            break;
    };
};



styleDecider(constants.device);

window.addEventListener("resize", () => {
    styleDecider(constants.device);
});