import { Router } from "express";
import publicFilesRouter from "./public.files.router";
import privateFilesRouter from "./private.files.router";
import { canAccessSecuredApi } from "../shared/auth.middleware";

// Router Serves under /files
const router = Router();

router.use("/public", publicFilesRouter);
router.use("/private", canAccessSecuredApi, privateFilesRouter);

export default router;
