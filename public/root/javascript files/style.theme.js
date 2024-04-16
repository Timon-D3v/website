const paths = [
    // [id, path, file_extention]
    ["hero_to_main_svg", "/images/svg/hero_to_main_", ".svg"],
    ["main_to_footer_svg", "/images/svg/main_to_footer_", ".svg"],
    ["hero_img", "/images/common/hero_", ".jpg"],
    ["about_to_main_svg", "/images/svg/about_to_main_", ".svg"],
    ["main_to_about_svg", "/images/svg/main_to_about_", ".svg"]
];

function setLightMode () {
    for (let i = 0; i < 25; i++) {
        document.querySelector(":root").style.setProperty("--x" + (i + 1), constants.css_var.lightArray[i]);
    };
    paths.forEach((element, i) => {
        document.getElementById(paths[i][0]).src = paths[i][1] + "light" + paths[i][2];
    });
};

function setDarkMode () {
    for (let i = 0; i < 25; i++) {
        document.querySelector(":root").style.setProperty("--x" + (i + 1), constants.css_var.darkArray[i]);
    };
    paths.forEach((element, i) => {
        document.getElementById(paths[i][0]).src = paths[i][1] + "dark" + paths[i][2];
    });
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