addEventListener("DOMContentLoaded", async (event) => {
    event.preventDefault();
    result = await fetch(constants.url + "/post/profile_picture", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({
            username: constants.username
        })
    })
    .catch(error => console.error("Error: ", error));
    result = await result.json();
    picture = JSON.stringify(result.picture).slice(1, -1);
    document.getElementById("profile_picture").src = picture;
    document.getElementById("profile_picture_mobile").src = picture;
    constants.profile_picture = picture;
});