import { Request, Response, Router } from "express";
import { getMetaFileWithId } from "../shared/get.meta";
import CONFIG from "../config";
import fs from "fs/promises";
import path from "path";

// Router Serves under /files/private/file
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const filePath = path.join(CONFIG.UPLOAD_PATH, "/files", name);
        await fs.access(filePath);

        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            console.error(meta.message);

            res.status(500).end();
            return;
        }

        for (const key in meta.fileSystem) {
            for (let i = 0; i < meta.fileSystem[key].files.length; i++) {
                if (meta.fileSystem[key].files[i].fileName === name) {
                    res.sendFile(name, {
                        root: path.join(CONFIG.UPLOAD_PATH, "/files")
                    });
                    return;
                }
            }
        }

        throw new Error("File not found in metadata.");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
