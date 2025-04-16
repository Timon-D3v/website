import { Request, Response, Router } from "express";
import multerInstance from "../shared/multer";
import { saveSingeFile } from "../shared/save.files";
import { Account } from "../@types/auth.type";
import { MetaDataUpload } from "../@types/metaData.type";
import { mergeChunks } from "../shared/merge.chunks.files";
import { saveFileChunk } from "../shared/chunk.save.files.database";

// Router Serves under /api/private/upload/single
const router = Router();

router.post("/small", multerInstance.single("file"), async (req: Request, res: Response): Promise<any> => {
    if (typeof req.file === "undefined") {
        return res.json({
            error: true,
            message: "Du hast keine Datei hochgeladen.",
        });
    }

    if (typeof req.body.meta === "undefined" || req.body.meta === "" || req.body.meta === null) {
        return res.json({
            error: true,
            message: "Du hast keine Metadaten mitgeschickt.",
        });
    }

    const meta: MetaDataUpload = JSON.parse(req.body.meta);

    if (typeof meta.size !== "number" || meta.size < 1 || typeof meta.type !== "string" || meta.type === "" || typeof meta.lastModified !== "number" || meta.lastModified < 0 || typeof meta.originalName !== "string" || meta.originalName === "" || typeof meta.uploadedAt !== "number" || meta.uploadedAt < 0 || typeof meta.currentPath !== "string" || meta.currentPath === "") {
        return res.json({
            error: true,
            message: "Die Metadaten sind nicht vollständig.",
        });
    }

    const result = await saveSingeFile(meta, req.file, req.session.user as Account);

    res.json(result);
});

router.post("/big", multerInstance.single("chunk"), async (req: Request, res: Response): Promise<void> => {
    try {
        const chunkId = req.body.chunkId;
        const chunkIndex = parseInt(req.body.chunkIndex);
        const totalChunks = parseInt(req.body.totalChunks);
        const meta: MetaDataUpload = JSON.parse(req.body.meta);

        if (typeof req.file === "undefined") {
            res.json({
                error: true,
                message: "Du hast keine Datei hochgeladen.",
            });
            return;
        }

        if (typeof meta.size !== "number" || meta.size < 1 || typeof meta.type !== "string" || meta.type === "" || typeof meta.lastModified !== "number" || meta.lastModified < 0 || typeof meta.originalName !== "string" || meta.originalName === "" || typeof meta.uploadedAt !== "number" || meta.uploadedAt < 0 || typeof meta.currentPath !== "string" || meta.currentPath === "") {
            res.json({
                error: true,
                message: "Die Metadaten sind nicht vollständig.",
            });
            return;
        }

        if (isNaN(totalChunks) || isNaN(chunkIndex) || typeof chunkId !== "string" || chunkId === "" || typeof chunkIndex !== "number" || chunkIndex < 0 || typeof totalChunks !== "number" || totalChunks < 1) {
            res.json({
                error: true,
                message: "Einige Daten sind nicht vollständig.",
            });
            return;
        }

        const result = await saveFileChunk(req.session.user?.id as number, chunkId, chunkIndex, totalChunks, req.file.buffer);

        if (!result) {
            res.json({
                error: true,
                message: "Die Datei konnte nicht in der Datenbank gespeichert werden.",
            });
            return;
        }

        if (chunkIndex < totalChunks - 1) {
            res.json({
                error: false,
                message: "Chunk erfolgreich hochgeladen.",
            });
            return;
        }

        // If this is the last chunk, we can merge the chunks

        const mergeResult = await mergeChunks(chunkId, totalChunks, meta, req.session.user as Account);

        res.json(mergeResult);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            error: true,
            message: "Ein unbekannter Fehler ist aufgetreten.",
        });
    }
});

export default router;
