import { Router } from "express";
import publicSharedFilesRouter from "./shared.public.files.router";

// Router Serves under /files/public
const router = Router();

router.use("/file", publicSharedFilesRouter);

export default router;
