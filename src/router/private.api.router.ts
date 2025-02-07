import { Router } from "express";
import uploadRouter from "./upload.router";

// Router Serves under /api/private
const router = Router();

router.use("/upload", uploadRouter);

export default router;
