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
 * Merges file chunks into a single file and updates metadata.
 *
 * @param {string} chunkId - The unique identifier for the chunks.
 * @param {number} totalChunks - The total number of chunks to merge.
 * @param {MetaDataUpload} publicMetaData - The metadata associated with the upload.
 * @param {Account} user - The user account performing the upload.
 * @returns {Promise<ApiResponse>} - The result of the merge operation.
 *
 * @throws {Error} - If the metadata file cannot be accessed or read.
 * @throws {Error} - If a chunk cannot be processed.
 * @throws {Error} - If the specified path does not exist in the metadata.
 * @throws {Error} - If there is an error saving the updated metadata.
 */
export async function mergeChunks(chunkId: string, totalChunks: number, publicMetaData: MetaDataUpload, user: Account): Promise<ApiResponse> {
    if (!await hasMetaData(user.id)) return {
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
    const filename = `file_${random}${fileExtension === publicMetaData.originalName ? "" : "." + fileExtension}`

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

        if (!result) return {
            error: true,
            message: "Die Datei konnte nicht in der Datenbank gespeichert werden.",
        };

        for (let i = 0; i < chunkArray.length; i++) {
            const worked = await updateFile(filename, chunkArray[i].chunk);

            if (!worked) return {
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
