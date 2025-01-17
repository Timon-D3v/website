import { Router } from "express";
import publicPictureFilesRouter from "./pictures.public.files.router";

// Router Serves under /files/public
const router = Router();

router.use("/pictures", publicPictureFilesRouter);

export default router;
