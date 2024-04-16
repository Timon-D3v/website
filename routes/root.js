import express from "express";
import * as database from "../backend/root/database.js";
import * as db_settings from "../backend/root/database.settings.js";



const router = express.Router();



router.get("/", async (req, res) => {
    res.render("./index.ejs", {
        user: req.session.user,
        meta: undefined
    });
});

router.get("/login", async (req, res) => {
    res.render("./login.ejs", {error: "NONE"});
});

router.get("/sign%20up", async (req, res) => {
    res.render("./sign_up.ejs", {error: "NONE"});
});

router.get("/profile", async (req, res) => {
    if (req.session.user) {
        const pb = await database.getProfilePicture(req.session.user.username);
        res.render("./profile.ejs", {
            user: req.session.user,
            profile_picture: pb,
            meta: undefined
        });
    } else {
        res.redirect("/login");
    };
});

router.get("*", (req, res) => {
    res.render("./errors/error404.ejs", {requested: req.url});
});





router.post("/post/login", async (req, res) => {
    let errorMSG;
    const username = req.body.username;
    const password = req.body.password;
    const valid_login = await database.validateLogin(username, password)
    .catch(error => {
        console.error("An Error occured: " + error);
        errorMSG = "No connection to database established.";
    });
    if (valid_login == "Successfully logged in with username!") {
        req.session.username = username;
        const user = await database.getAccount(username);
        const settings = await db_settings.getSettings(username);
        delete user[0].profile_picture;
        req.session.user = user[0];
        if (typeof settings[0] == "undefined") {
            await db_settings.createSettingsDB(username);
            const settings = await db_settings.getSettings(username);
            req.session.user.settings = settings[0];
        } else {
            req.session.user.settings = settings[0];
        };
        res.redirect("/");
    } else if (valid_login == "Successfully logged in with email!") {
        const real_username = await database.getUsername(username);
        req.session.username = real_username[0].username;
        const settings = await db_settings.getSettings(req.session.username);
        delete real_username[0].profile_picture;
        req.session.user = real_username[0];
        if (typeof settings[0] == "undefined") {
            await db_settings.createSettingsDB(req.session.username);
            const settings = await db_settings.getSettings(req.session.username);
            req.session.user.settings = settings[0];
        } else {
            req.session.user.settings = settings[0];
        };
        res.redirect("/");
    } else {
        if (errorMSG == undefined) {
            errorMSG = "Wrong credentials";
        };
        res.render("./errors/loginFailed.ejs", {error: errorMSG, username: username});
    };
});

router.post("/post/createAccount", async (req, res) => {
    let errorMSG;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone_number = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profile_picture = req.body.file_c;
    const status = await database.createAccount(username, first_name, last_name, password, email, phone_number, profile_picture)
    .catch(error => {
        console.error("An Error occured: " + error);
        errorMSG = "No connection to database established.";
    });
    if (status == "Account created") {
        req.session.username = username;
        const user = await database.getAccount(username);
        delete user[0].profile_picture;
        req.session.user = user[0];
        await db_settings.createSettingsDB(username);
        const settings = await db_settings.getSettings(username);
        req.session.user.settings = settings[0];
        res.redirect("/");
    } else {
        if (errorMSG == undefined) {
            res.render("./errors/accountCreated.ejs", {error: status});
        } else {
            res.render("./errors/accountCreated.ejs", {error: errorMSG});
        };
    };
});

router.post("/post/profile_picture", async (req, res) => {
    const username = req.body.username;
    const response = await database.getProfilePicture(username);
    res.send({picture: response});
});

router.post("/post/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
});

router.post("/post/profile/edit", async (req, res) => {
    let errorMSG;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const phone_number = req.body.phone;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profile_picture = req.body.file_c;
    const this_username = req.session.user.username;
    let id = await database.getAccount(this_username);
    id = id[0].id;
    const status = await database.editCredentials(username, first_name, last_name, password, email, phone_number, profile_picture, this_username)
    .catch(error => {
        console.error("An Error occured: " + error);
        errorMSG = "No connection to database established.";
    });
    if (status == "Changed!") {
        const user = await database.getUsernameWithId(id);
        delete user[0].profile_picture;
        req.session.user = user[0];
        const settings = await db_settings.getSettings(user[0].username);
        req.session.user.settings = settings[0];
        res.redirect("/profile");
    } else {
        if (errorMSG == undefined) {
            res.render("./errors/change_profile.ejs", {error: status});
        } else {
            res.render("./errors/change_profile.ejs", {error: errorMSG});
        };
    };
});

router.post("/post/settings/light", async (req, res) => {
    await db_settings.toggleDarkmode(req.session.user.username);
    req.session.user.settings.darkmode = false;
    res.redirect("/profile");
});

router.post("/post/settings/dark", async (req, res) => {
    await db_settings.toggleDarkmode(req.session.user.username);
    req.session.user.settings.darkmode = true;
    res.redirect("/profile");
});



export default router;