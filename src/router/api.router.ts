import { Router } from "express";
import publicApiRouter from "./public.api.router";

// Router Serves under /api
const router = Router();

router.use("/public", publicApiRouter);

export default router;
