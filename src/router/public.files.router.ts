import { Router } from "express";
import publicPictureFilesRouter from "./pictures.public.files.router";
import publicProjectsFileRouter from "./projects.public.files.router";
import publicSharedFilesRouter from "./shared.public.files.router";

// Router Serves under /files/public
const router = Router();

router.use("/pictures", publicPictureFilesRouter);
router.use("/projects", publicProjectsFileRouter);
router.use("/file", publicSharedFilesRouter);

export default router;
