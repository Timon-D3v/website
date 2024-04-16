const link_profile = document.getElementById("extra_styles");



function ExtraStyleDecider (device) {
    switch (device) {
        case "desktop":
            if (link_profile.href != constants.style_url.profile + "desktop.min.css" && window.innerWidth > 615) {
                link_profile.href = constants.style_url.profile + "desktop.min.css";
            } else if (link_profile.href != constants.style_url.profile + "mobile.min.css" && window.innerWidth < 616) {
                link_profile.href = constants.style_url.profile + "mobile.min.css";
            };
            break;
        case "mobile":
            if (link_profile.href != constants.style_url.profile + "mobile.min.css" && window.innerWidth < 615) {
                link_profile.href = constants.style_url.profile + "mobile.min.css";
            } else if (link_profile.href != constants.style_url.profile + "tab.min.css" && window.innerWidth > 616) {
                link_profile.href = constants.style_url.profile + "tab.min.css";
            };
            break;
        case "tablet":
            if (link_profile.href != constants.style_url.profile + "tab.min.css" && window.innerWidth > 400) {
                link_profile.href = constants.style_url.profile + "tab.min.css";
            } else if (link_profile.href != constants.style_url.profile + "mobile.min.css" && window.innerWidth < 401) {
                link_profile.href = constants.style_url.profile + "mobile.min.css";
            };
            break;
    };
};



ExtraStyleDecider(constants.device);

window.addEventListener("resize", () => {
    styleDecider(constants.device);
});