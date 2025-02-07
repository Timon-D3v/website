import { Router } from "express";
import singleUploadRouter from "./single.upload.router";
import multipleUploadRouter from "./multiple.upload.router";

// Router Serves under /api/private/upload
const router = Router();

router.use("/single", singleUploadRouter);
router.use("/multiple", multipleUploadRouter);

export default router;
