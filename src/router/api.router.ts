import { Router, json, urlencoded } from "express";
import publicApiRouter from "./public.api.router";

// Router Serves under /api
const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.use("/public", publicApiRouter);

export default router;
