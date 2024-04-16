function logout (event) {
    event.preventDefault();
    fetch(constants.url + "/post/logout", {method: "POST"})
    .then(location.reload());
};

function scrollToQuery (query, event) {
    event.preventDefault();
    document.querySelector(query)
    .scrollIntoView({behavior: "smooth", block: "center"});
};

function scrollToXY (x, y, event) {
    event.preventDefault();
    scrollTo({
        top: x,
        left: y,
        behavior: "smooth"
    });
};

function getDevice () {
    const agent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(agent)) {
        return "tablet";
    } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(agent)) {
        return "mobile";
    } else {
        return "desktop";
    };
};