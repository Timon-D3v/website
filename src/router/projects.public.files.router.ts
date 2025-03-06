import { Request, Response, Router } from "express";
import CONFIG from "../config";
import fs from "fs/promises";
import path from "path";

// Router Serves under /files/public/projects
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const filePath = path.join(CONFIG.UPLOAD_PATH, "/projects", name);
        await fs.access(filePath);

        res.sendFile(name, {
            root: path.join(CONFIG.UPLOAD_PATH, "/projects"),
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
