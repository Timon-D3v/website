import { Router } from "express";
import singleUploadRouter from "./single.upload.router";

// Router Serves under /api/private/upload
const router = Router();

router.use("/single", singleUploadRouter);

export default router;
