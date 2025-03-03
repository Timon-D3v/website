import fs from "fs/promises";
import path from "path";
import CONFIG from "../config";
import { updateMetaDataForId } from "./update.meta";
import { Account } from "../@types/auth.type";
import { ApiResponse } from "../@types/apiResponse.type";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";

/**
 * Saves a single file's metadata and updates the user's metadata file.
 *
 * @param {MetaDataUpload} publicMetaData - The metadata of the file to be uploaded.
 * @param {Express.Multer.File} file - The file object provided by Multer.
 * @param {Account} user - The account of the user uploading the file.
 * @returns {Promise<ApiResponse>} A promise that resolves to an ApiResponse indicating success or failure.
 *
 * @throws Will return an error response if the user's metadata file is not found.
 * @throws Will return an error response if the specified path does not exist in the metadata.
 * @throws Will return an error response if there is an error saving the metadata.
 */
export async function saveSingeFile(publicMetaData: MetaDataUpload, file: Express.Multer.File, user: Account): Promise<ApiResponse> {
    try {
        await fs.access(path.join(CONFIG.UPLOAD_PATH, `/meta/ID_${user.id}.json`));
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            error: true,
            message: "Deine Metadaten wurden nicht gefunden.",
        };
    }

    const metaFile = await fs.readFile(path.join(CONFIG.UPLOAD_PATH, `/meta/ID_${user.id}.json`), "utf-8");
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
