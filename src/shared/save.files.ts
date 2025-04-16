import { hasMetaData } from "./has.meta.database";
import { getMetaFileWithId } from "./get.meta.database";
import { updateMetaDataForId } from "./update.meta.database";
import { Account } from "../@types/auth.type";
import { ApiResponse } from "../@types/apiResponse.type";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";
import { saveFile } from "./save.files.database";
import { randomString } from "timonjs";

/**
 * Saves a single file to the database and updates the user's metadata.
 *
 * @param {MetaDataUpload} publicMetaData - Metadata about the file being uploaded, including its type, size, and path.
 * @param {Express.Multer.File} file - The file object provided by Multer, containing the file's buffer and original name.
 * @param {Account} user - The account of the user uploading the file.
 *
 * @returns {Promise<ApiResponse>} - A promise that resolves to an `ApiResponse` object indicating success or failure.
 *
 * @throws Will return an error response if:
 * - The user's metadata cannot be found.
 * - The user's metadata cannot be loaded.
 * - The file cannot be saved in the database.
 * - The specified path in the metadata does not exist.
 * - An error occurs while saving the updated metadata.
 */
export async function saveSingeFile(publicMetaData: MetaDataUpload, file: Express.Multer.File, user: Account): Promise<ApiResponse> {
    if (!(await hasMetaData(user.id)))
        return {
            error: true,
            message: "Deine Metadaten wurden nicht gefunden.",
        };

    const metaData = await getMetaFileWithId(user.id);

    if (metaData instanceof Error)
        return {
            error: true,
            message: "Deine Metadaten konnten nicht geladen werden.",
        };

    const random = randomString(64);
    const fileExtension = file.originalname.split(".").pop();
    const filename = `file_${random}${fileExtension === file.originalname ? "" : "." + fileExtension}`;

    const result = await saveFile(filename, user.id, publicMetaData.type, file.buffer, file.originalname);

    if (!result)
        return {
            error: true,
            message: "Die Datei konnte nicht in der Datenbank gespeichert werden.",
        };

    const meta: MetaData = {
        userId: user.id,
        fileName: filename,
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
