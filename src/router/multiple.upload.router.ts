import { Request, Response, Router } from "express";

// Router Serves under /api/private/upload/multiple
const router = Router();

router.post("/", (req: Request, res: Response) => {
    res.send("Upload Multiple Files");
});

export default router;
