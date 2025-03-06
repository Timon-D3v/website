import { Request, Response, Router } from "express";
import CONFIG from "../config";
import fs from "fs/promises";
import path from "path";

// Router Serves under /files/public/pictures
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const filePath = path.join(CONFIG.UPLOAD_PATH, "/profile", name);
        await fs.access(filePath);

        res.sendFile(name, {
            root: path.join(CONFIG.UPLOAD_PATH, "/profile"),
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
