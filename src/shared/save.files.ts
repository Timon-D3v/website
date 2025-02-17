import { Account } from "../@types/auth.type";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";
import fs from "fs/promises";
import { updateMetaDataForId } from "./update.meta";
import { ApiResponse } from "../@types/apiResponse.type";

export async function saveSingeFile(publicMetaData: MetaDataUpload, file: Express.Multer.File, user: Account): Promise<ApiResponse> {
    try {
        await fs.access(`./uploads/meta/ID_${user.id}.json`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            error: true,
            message: "Deine Metadaten wurden nicht gefunden.",
        };
    }

    const metaFile = await fs.readFile(`./uploads/meta/ID_${user.id}.json`, "utf-8");
    const metaData = JSON.parse(metaFile);

    const meta: MetaData = {
        userId: user.id,
        fileName: file.filename,
        originalName: publicMetaData.originalName,
        type: publicMetaData.type,
        size: publicMetaData.size,
        lastModified: publicMetaData.lastModified,
        uploadedAt: publicMetaData.uploadedAt,
        timesOpened: 0,
        timesDownloaded: 0,
        lastDownloaded: 0,
        lastOpened: 0,
        path: publicMetaData.currentPath,
        url: publicMetaData.currentPath + "/" + publicMetaData.originalName,
    };

    try {
        metaData.fileSystem[publicMetaData.currentPath].files.push(meta);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            error: true,
            message: "Der angegebene Pfad existiert nicht.",
        };
    }

    try {
        updateMetaDataForId(user.id, metaData);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            error: true,
            message: "Beim Speichern der Metadaten ist ein Fehler aufgetreten.",
        };
    }

    return {
        error: false,
        message: "Die Datei wurde erfolgreich gespeichert.",
    };
}
