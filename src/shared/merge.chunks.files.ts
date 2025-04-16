import { randomString } from "timonjs";
import { hasMetaData } from "./has.meta.database";
import { getMetaFileWithId } from "./get.meta.database";
import { updateMetaDataForId } from "./update.meta.database";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";
import { ApiResponse } from "../@types/apiResponse.type";
import { Account } from "../@types/auth.type";
import { getAllChunks } from "./get.chunks.database";
import { saveFile } from "./save.files.database";
import { cleanUpChunks } from "./cleanup.chunks.database";
import { updateFile } from "./update.files.database";

/**
 * Merges file chunks into a single file, updates metadata, and cleans up temporary chunks.
 *
 * @param {string} chunkId - The unique identifier for the chunks to be merged.
 * @param {number} totalChunks - The total number of chunks to be merged.
 * @param {MetaDataUpload} publicMetaData - Metadata about the file being uploaded, including its original name, type, size, and path.
 * @param {Account} user - The account of the user performing the upload.
 *
 * @returns {Promise<ApiResponse>} - A promise that resolves to an `ApiResponse` indicating success or failure of the operation.
 *
 * @throws Will return an error response if:
 * - The user's metadata cannot be found or loaded.
 * - The chunks cannot be retrieved.
 * - The file cannot be saved or updated in the database.
 * - The specified path does not exist in the user's metadata.
 * - An error occurs while saving the updated metadata.
 *
 * The function performs the following steps:
 * 1. Validates the existence of the user's metadata.
 * 2. Generates a unique filename for the merged file.
 * 3. Retrieves all chunks associated with the given `chunkId`.
 * 4. Saves the merged file to the database and appends each chunk to it.
 * 5. Updates the user's metadata with the new file information.
 * 6. Cleans up the temporary chunks after successful merging.
 */
export async function mergeChunks(chunkId: string, totalChunks: number, publicMetaData: MetaDataUpload, user: Account): Promise<ApiResponse> {
    if (!(await hasMetaData(user.id)))
        return {
            error: true,
            message: "Deine Metadaten wurden nicht gefunden.",
        };

    const metaData = await getMetaFileWithId(user.id);

    if (metaData instanceof Error) {
        return {
            error: true,
            message: "Deine Metadaten konnten nicht geladen werden.",
        };
    }

    const random = randomString(64);
    const fileExtension = publicMetaData.originalName.split(".").pop();
    const filename = `file_${random}${fileExtension === publicMetaData.originalName ? "" : "." + fileExtension}`;

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

    const chunkArray = await getAllChunks(chunkId);

    if (chunkArray instanceof Error) {
        return {
            error: true,
            message: "Die Chunks konnten nicht geladen werden.",
        };
    }

    try {
        const result = await saveFile(filename, user.id, publicMetaData.type, Buffer.alloc(0), publicMetaData.originalName);

        if (!result)
            return {
                error: true,
                message: "Die Datei konnte nicht in der Datenbank gespeichert werden.",
            };

        for (let i = 0; i < totalChunks; i++) {
            const worked = await updateFile(filename, chunkArray[i].chunk);

            if (!worked)
                return {
                    error: true,
                    message: "Die Datei konnte nicht vollständig gespeichert werden.",
                };
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            error: true,
            message: "Die Datei konnte nicht gespeichert werden.",
        };
    }

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

    await cleanUpChunks(chunkId);

    return {
        error: false,
        message: "Die Datei wurde erfolgreich gespeichert.",
    };
}
