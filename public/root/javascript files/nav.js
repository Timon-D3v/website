const opener = document.getElementById("open_h_menu"),
    nav_full = document.querySelector("nav"),
    nav = document.querySelector(".nav"),
    close = document.getElementById("close_h_menu");
let toggler1 = false,
    toggler2 = false,
    toggler3 = false;



gsap.set("nav", {opacity: 0});
switch (constants.device) {
    case "desktop":
        gsap.set(".nav", {xPercent: 100});
        opener.addEventListener("click", toggleNavD);
        close.addEventListener("click", toggleNavD);
        break;
    case "tablet":
        gsap.set(".nav", {yPercent: -100});
        opener.addEventListener("click", toggleNavT);
        break;
    case "mobile":
        gsap.set(".nav", {yPercent: 100});
        opener.addEventListener("click", toggleNavM);
        break;
};



function toggleNavD () {
    if (toggler1) {
        gsap.to(".nav", {xPercent: 100, duration: 0.6});
        gsap.to("nav", {opacity: 0, delay: 0.3, duration: 0.3});
    } else {
        gsap.to(".nav", {xPercent: 0, duration: 0.6});
        gsap.to("nav", {opacity: 1, delay: 0.3, duration: 0.3});
    };
    toggler1 = !toggler1;
};

function toggleNavT () {
    if (toggler2) {
        gsap.to(".nav", {yPercent: -100, duration: 0.6});
        gsap.to("nav", {opacity: 0, delay: 0.3, duration: 0.3});
    } else {
        gsap.to(".nav", {yPercent: 0, duration: 0.6});
        gsap.to("nav", {opacity: 1, delay: 0.3, duration: 0.3});
    };
    toggler2 = !toggler2;
};

function toggleNavM () {
    if (toggler3) {
        gsap.to(".nav", {yPercent: 100, duration: 0.6});
        gsap.to("nav", {opacity: 0, delay: 0.3, duration: 0.3});
    } else {
        gsap.to(".nav", {yPercent: 0, duration: 0.6});
        gsap.to("nav", {opacity: 1, delay: 0.3, duration: 0.3});
    };
    toggler3 = !toggler3;
};