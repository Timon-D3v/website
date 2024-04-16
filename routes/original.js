import express from "express";

const router = express.Router();



router.get("/projects/original", (req, res) => {
    res.render("./projects/original/index.ejs");
});

router.get("/projects/original/erfolge", (req, res) => {
    res.render("./projects/original/Erfolge.ejs");
});

router.get("/projects/original/level", (req, res) => {
    res.render("./projects/original/Level.ejs")
    req.session.current_url = req.url;
});

router.get("/projects/original/level1", (req, res) => {
    res.render("./projects/original/Level1.ejs");
});

router.get("/projects/original/level2", (req, res) => {
    res.render("./projects/original/Level2.ejs");
});

router.get("/projects/original/level3", (req, res) => {
    res.render("./projects/original/Level3.ejs");
});

router.get("/projects/original/level_no_more", (req, res) => {
    res.render("./projects/original/Level_nomore.ejs");
});

router.get("/projects/original/settings", (req, res) => {
    res.render("./projects/original/Settings.ejs");
});

export default router;