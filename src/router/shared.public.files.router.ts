import { Request, Response, Router } from "express";
import CONFIG from "../config";
import path from "path";
import getSharedFiles from "../shared/get.shared.database";
import { SharedFileEntry } from "../@types/sharedFiles.type";

// Router Serves under /files/public/files
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const sharedFiles = await getSharedFiles();

        if (sharedFiles instanceof Error) {
            res.status(500).end();
        }

        for (const file of sharedFiles as SharedFileEntry[]) {
            if (file.filename === name) {
                if (file.deleted) {
                    res.status(410).end();

                    return;
                }

                res.sendFile(name, {
                    root: path.join(CONFIG.UPLOAD_PATH, "/files"),
                });

                return;
            }
        }

        res.status(404).end();
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
