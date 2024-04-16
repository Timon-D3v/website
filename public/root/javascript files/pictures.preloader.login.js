window.onload = function () {
    let preloaded = document.getElementById("bg");
    let img = new Image(100, 100);
    img.src = constants.url + "/images/common/login.jpg";
    img.onload = function () {
        preloaded.src = this.src;
    };
};