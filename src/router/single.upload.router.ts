import { Request, Response, Router } from "express";
import multerInstance from "../shared/multer";
import { saveSingeFile } from "../shared/save.files";
import { Account } from "../@types/auth.type";
import { MetaDataUpload } from "../@types/metaData.type";

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

router.post("/big", (req: Request, res: Response) => {
    res.send("Upload Single Big File");
});

export default router;
