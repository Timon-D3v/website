import { Router } from "express";
import publicFilesRouter from "./public.files.router";

// Router Serves under /files
const router = Router();

router.use("/public", publicFilesRouter);

export default router;
