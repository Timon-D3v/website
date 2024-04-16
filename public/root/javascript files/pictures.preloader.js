window.onload = function () {
    let preloaded = document.getElementById("hero_img");
    let img = new Image(100, 100);
    img.src = constants.url + "/images/common/hero_light.jpg";
    img.onload = function () {
        preloaded.src = this.src;
    };
};