import { Router } from "express";
import uploadRouter from "./upload.router";
import adminRouter from "./admin.router";
import { canAccessAdminApi } from "../shared/auth.middleware";

// Router Serves under /api/private
const router = Router();

router.use("/upload", uploadRouter);
router.use("/admin", canAccessAdminApi, adminRouter);

export default router;
