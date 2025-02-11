import { Router } from "express";
import publicPictureFilesRouter from "./pictures.public.files.router";
import publicProjectsFileRouter from "./projects.public.files.router";

// Router Serves under /files/public
const router = Router();

router.use("/pictures", publicPictureFilesRouter);
router.use("/projects", publicProjectsFileRouter);

export default router;
