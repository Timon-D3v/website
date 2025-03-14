import { Router, json, urlencoded } from "express";
import publicApiRouter from "./public.api.router";
import privateApiRouter from "./private.api.router";
import { canAccessSecuredApi } from "../shared/auth.middleware";

// Router Serves under /api
const router = Router();

router.use(json());
router.use(urlencoded({ extended: true }));

router.use("/public", publicApiRouter);
router.use("/private", canAccessSecuredApi, privateApiRouter);

export default router;
