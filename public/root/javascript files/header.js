const menu = document.getElementById("profile_menu");
let toggler = false;


document.querySelector(".profile").addEventListener("click", () => {
    if (toggler) {
        menu.style.display = "none";
        toggler = false;
    } else {
        menu.style.display = "flex";
        toggler = true;
    };
});