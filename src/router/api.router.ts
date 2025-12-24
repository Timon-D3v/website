import { Router, json, urlencoded } from "express";
import rateLimit from "express-rate-limit";
import publicApiRouter from "./public.api.router";
import privateApiRouter from "./private.api.router";
import { canAccessSecuredApi } from "../shared/auth.middleware";

// Router Serves under /api
const router = Router();

/**
 * Allow an average max of 5 requests per second per minute.
 * This has the same effect as a rate limit of 5 requests per second but is
 * a little more flexible if requests stack while the site loads.
 */
router.use(
    rateLimit({
        limit: 5 * 60,
        windowMs: 1000 * 60,
    }),
);

router.use(json());
router.use(urlencoded({ extended: true }));

router.use("/public", publicApiRouter);
router.use("/private", canAccessSecuredApi, privateApiRouter);

export default router;
