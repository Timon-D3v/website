import { Router, Request, Response } from "express";
import incrementHomeCounter from "../shared/increment.homeCounter.database";
import getCurrentHomeCounter from "../shared/get.homeCounter.database";

// Router Serves under /api/public
const router = Router();

router.get("/getCurrentHomeCounter", async (_req: Request, res: Response) => {
    const result = await getCurrentHomeCounter();
    res.json({
        count: typeof result === "number" ? result : 0,
        message: typeof result === "number" ? "Retrieved Home Counter" : "Failed to Retrieve Home Counter",
        error: typeof result !== "number",
    });
});

router.post("/incrementHomeCounter", async (_req: Request, res: Response) => {
    const response = await incrementHomeCounter();
    res.json({
        message: response === "Success" ? "Incremented Home Counter" : "Failed to Increment Home Counter",
        error: response !== "Success",
    });
});

export default router;
