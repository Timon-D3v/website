import { Request, Response, Router } from "express";
import uploadRouter from "./upload.router";
import adminRouter from "./admin.router";
import { canAccessAdminApi } from "../shared/auth.middleware";
import { getMetaFileWithId } from "../shared/get.meta";
import { randomString } from "timonjs";
import { MetaFolder } from "../@types/metaData.type";
import { updateMetaDataForId } from "../shared/update.meta";

// Router Serves under /api/private
const router = Router();

router.use("/upload", uploadRouter);
router.use("/admin", canAccessAdminApi, adminRouter);

router.post("/createFolder", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, path } = req.body;

        if (typeof name !== "string" || name === "" || typeof path !== "string" || path === "") {
            res.json({
                error: true,
                message: "Der Name oder Pfad fehlt.",
            });
            return;
        }

        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            res.json({
                error: true,
                message: meta.message,
            });
            return;
        }

        if (typeof meta.fileSystem?.[path] === "undefined") {
            res.json({
                error: true,
                message: "Der Pfad existiert nicht.",
            });
            return;
        }

        const nameAlreadyExists = meta.fileSystem[path].folders.some((folder) => meta.fileSystem[folder].name === name);

        if (nameAlreadyExists) {
            res.json({
                error: true,
                message: "Ein Ordner mit diesem Namen existiert bereits.",
            });
            return;
        }

        let generatedId = "";

        while (generatedId === "" || typeof meta.fileSystem[path + "/" + generatedId] !== "undefined") {
            generatedId = randomString(8);
        }

        const fullpath = path + "/" + generatedId;

        meta.fileSystem[fullpath] = {
            name,
            files: [],
            folders: [],
        } as MetaFolder;

        meta.fileSystem[path].folders.push(fullpath);

        await updateMetaDataForId(Number(req.session.user?.id), meta);

        res.json({
            error: false,
            message: "Ordner wurde erfolgreich erstellt.",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            error: true,
            message: "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.",
        });
    }
});

export default router;
