import express from "express";

const router = express.Router();



router.get("", (req, res) => {
    res.render("original/index.ejs");
});

router.get("/erfolge", (req, res) => {
    res.render("original/Erfolge.ejs");
});

router.get("/level", (req, res) => {
    res.render("original/Level.ejs")
    req.session.current_url = req.url;
});

router.get("/level1", (req, res) => {
    res.render("original/Level1.ejs");
});

router.get("/level2", (req, res) => {
    res.render("original/Level2.ejs");
});

router.get("/level3", (req, res) => {
    res.render("original/Level3.ejs");
});

router.get("/level_no_more", (req, res) => {
    res.render("original/Level_nomore.ejs");
});

router.get("/settings", (req, res) => {
    res.render("original/Settings.ejs");
});

router.get("/preview", (req, res) => {
    res.render("original/preview.ejs");
});

export default router;