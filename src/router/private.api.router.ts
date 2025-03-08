import { Request, Response, Router } from "express";
import uploadRouter from "./upload.router";
import adminRouter from "./admin.router";
import { canAccessAdminApi } from "../shared/auth.middleware";
import { getMetaFileWithId } from "../shared/get.meta";
import { randomString } from "timonjs";
import { MetaFolder } from "../@types/metaData.type";
import { updateMetaDataForId } from "../shared/update.meta";
import { deleteFile } from "../shared/delete.files";
import { checkIfUserOwnsFile } from "../shared/check-if-user-owns-file.meta";
import { addSharedFile } from "../shared/add.shared.database";
import { deleteSharedFile } from "../shared/delete.shared.database";
import getSharedFiles from "../shared/get.shared.database";
import { SharedFileEntry } from "../@types/sharedFiles.type";

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
                message: "Der angegebene Pfad existiert nicht.",
            });
            return;
        }

        const nameAlreadyExists = meta.fileSystem[path].folders.some((folder) => meta.fileSystem[folder].name === name);

        if (nameAlreadyExists) {
            res.json({
                error: true,
                message: "Es existiert bereits ein Ordner mit diesem Namen.",
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
            message: "Der Ordner wurde erfolgreich erstellt.",
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

router.post("/renameFile", async (req: Request, res: Response): Promise<void> => {
    try {
        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            res.json({
                api: {
                    error: true,
                    message: meta.message,
                },
                name: "",
            });
            return;
        }

        const { path, name, newName } = req.body;

        if (typeof path !== "string" || path === "" || typeof name !== "string" || name === "" || typeof newName !== "string" || newName === "") {
            res.json({
                api: {
                    error: true,
                    message: "Der Pfad, Name oder der neue Name fehlt.",
                },
                name,
            });
            return;
        }

        if (typeof meta.fileSystem[path] === "undefined") {
            res.json({
                api: {
                    error: true,
                    message: "Dieser Pfad existiert nicht.",
                },
                name,
            });
            return;
        }

        let fileIndex = -1;

        for (let i = 0; i < meta.fileSystem[path].files.length; i++) {
            if (meta.fileSystem[path].files[i].originalName === name) {
                fileIndex = i;
                break;
            }
        }

        if (fileIndex === -1) {
            res.json({
                api: {
                    error: true,
                    message: "Diese Datei existiert nicht.",
                },
                name,
            });
            return;
        }

        const fileExtension = meta.fileSystem[path].files[fileIndex].originalName.split(".").pop();

        if (fileExtension === null) {
            res.json({
                api: {
                    error: true,
                    message: "Die Dateiendung konnte nicht ermittelt werden.",
                },
                name,
            });
            return;
        }

        if (newName.endsWith("." + fileExtension)) {
            meta.fileSystem[path].files[fileIndex].originalName = newName;
        } else {
            meta.fileSystem[path].files[fileIndex].originalName = newName + "." + fileExtension;
        }

        await updateMetaDataForId(Number(req.session.user?.id), meta);

        res.json({
            api: {
                error: false,
                message: "Die Datei wurde erfolgreich umbenannt.",
            },
            name: meta.fileSystem[path].files[fileIndex].originalName,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            api: {
                error: true,
                message: "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.",
            },
            name: "",
        });
    }
});

router.post("/incrementOpenedCounter", async (req: Request, res: Response): Promise<void> => {
    try {
        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            res.json({
                error: true,
                message: meta.message,
            });
            return;
        }

        const { path, filename } = req.body;

        if (typeof path !== "string" || path === "" || typeof filename !== "string" || filename === "") {
            res.json({
                error: true,
                message: "Der Pfad oder Dateiname fehlt.",
            });
            return;
        }

        if (typeof meta.fileSystem[path] === "undefined") {
            res.json({
                error: true,
                message: "Dieser Pfad existiert nicht.",
            });
            return;
        }

        for (let i = 0; i < meta.fileSystem[path].files.length; i++) {
            if (meta.fileSystem[path].files[i].fileName === filename) {
                meta.fileSystem[path].files[i].lastOpened = Date.now();
                meta.fileSystem[path].files[i].timesOpened++;

                await updateMetaDataForId(Number(req.session.user?.id), meta);

                res.json({
                    error: false,
                    message: "Metadaten erfolgreich aktualisiert.",
                });

                return;
            }
        }

        res.json({
            error: true,
            message: "Datei konnte nicht gefunden werden.",
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

router.post("/deleteFile", async (req: Request, res: Response): Promise<void> => {
    try {
        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            res.json({
                error: true,
                message: meta.message,
            });
            return;
        }

        const { path, filename } = req.body;

        if (typeof path !== "string" || path === "" || typeof filename !== "string" || filename === "") {
            res.json({
                error: true,
                message: "Der Pfad oder Dateiname fehlt.",
            });
            return;
        }

        if (typeof meta.fileSystem[path] === "undefined") {
            res.json({
                error: true,
                message: "Dieser Pfad existiert nicht.",
            });
            return;
        }

        for (let i = 0; i < meta.fileSystem[path].files.length; i++) {
            if (meta.fileSystem[path].files[i].fileName === filename) {
                const result = await deleteFile(filename);

                if (!result) {
                    res.json({
                        error: true,
                        message: "Die Datei konnte nicht gelöscht werden.",
                    });
                    return;
                }

                meta.fileSystem[path].files.splice(i, 1);

                await updateMetaDataForId(Number(req.session.user?.id), meta);

                await deleteSharedFile(filename);

                res.json({
                    error: false,
                    message: "Die Datei wurde erfolgreich gelöscht.",
                });

                return;
            }
        }

        res.json({
            error: true,
            message: "Die Datei konnte nicht gefunden werden.",
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

router.post("/shareFile", async (req: Request, res: Response): Promise<void> => {
    try {
        const { filename } = req.body;

        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) {
            res.json({
                error: true,
                message: meta.message,
            });
            return;
        }

        if (!checkIfUserOwnsFile(filename, meta.fileSystem)) {
            res.json({
                error: true,
                message: "Diese Datei existiert nicht, oder du hast keine Berechtigung auf den Zugriff dieser Datei.",
            });
            return;
        }

        const allSharedFiles = await getSharedFiles();

        if (allSharedFiles instanceof Error) {
            res.json({
                error: true,
                message: allSharedFiles.message,
            });
            return;
        }

        const alreadyShared = allSharedFiles.some((file: SharedFileEntry): boolean => file.filename === filename);

        if (alreadyShared) {
            res.json({
                error: false,
                message: "Diese Datei wurde bereits geteilt.",
            });
            return;
        }

        const result = await addSharedFile(filename);

        if (!result) {
            res.json({
                error: true,
                message: "Die Datei konnte nicht geteilt werden, weil keine Verbindung zur Datenbank möglich war.",
            });
            return;
        }

        res.json({
            error: false,
            message: "Die Datei wurde erfolgreich geteilt.",
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
