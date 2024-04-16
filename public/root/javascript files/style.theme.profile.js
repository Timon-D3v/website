const paths = [
    // [id, path, file_extention]
    ["main_to_footer_svg", "/images/svg/main_to_footer_", ".svg"]
];

function setLightMode () {
    for (let i = 0; i < 25; i++) {
        document.querySelector(":root").style.setProperty("--x" + (i + 1), constants.css_var.lightArray[i]);
    };
    paths.forEach((element, i) => {
        document.getElementById(paths[i][0]).src = paths[i][1] + "light" + paths[i][2];
    });
    document.querySelector(".m_edit").style.setProperty("--filter", "var(--filter_light)");
};

function setDarkMode () {
    for (let i = 0; i < 25; i++) {
        document.querySelector(":root").style.setProperty("--x" + (i + 1), constants.css_var.darkArray[i]);
    };
    paths.forEach((element, i) => {
        document.getElementById(paths[i][0]).src = paths[i][1] + "dark" + paths[i][2];
    });
    document.querySelector(".m_edit").style.setProperty("--filter", "var(--filter_dark)");
};

document.getElementById("bb8_toggler").addEventListener("click", () => {
    if (document.getElementById("bb8_toggler").checked) {
        setTimeout(() => {
            setDarkMode();
        }, 500);
    } else {
        setTimeout(() => {
            setLightMode();
        }, 500);
    };
});