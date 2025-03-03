import { Request, Response, Router } from "express";
import fs from "fs/promises";
import path from "path";
import { getMetaFileWithId } from "../shared/get.meta";

// Router Serves under /files/private/file
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const filePath = path.join("uploads/files", name);
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
                    // The code below is commented because when multiple files are opened at the same time, the metadata is updated simultaneously
                    // which causes the metadata to be overwritten and the timesOpened and lastOpened values to be incorrect or even break the entire file.
                    // The times opened and last opened values are not that important anyways so this is not that bad but a litte unsatisfying.

                    // meta.fileSystem[key].files[i].timesOpened++;
                    // meta.fileSystem[key].files[i].lastOpened = Date.now();

                    // try {
                    //     await updateMetaDataForId(Number(req.session.user?.id), meta);
                    // } catch (error) {
                    //     if (error instanceof Error) {
                    //         console.error(error.message);
                    //     }

                    //     res.status(500).end();
                    //     return;
                    // }

                    res.sendFile(name, { root: "uploads/files" });
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
