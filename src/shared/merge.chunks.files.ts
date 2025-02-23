import fs from "fs/promises";
import path from "path";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";
import { ApiResponse } from "../@types/apiResponse.type";
import { Account } from "../@types/auth.type";
import { randomString } from "timonjs";
import { updateMetaDataForId } from "./update.meta";

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
        fileName: `merged_file_${randomString(64)}.${publicMetaData.originalName.split(".").pop()}`,
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

    const finalPath = path.join("./uploads/files", meta.fileName);
    const writeStream = await fs.open(finalPath, "w");

    try {
        for (let i = 0; i < totalChunks; i++) {
            const chunkFile = path.join("./uploads/chunks", `${chunkId}_${i}.chunk`);

            // Ensure chunk exists before processing
            try {
                const data = await fs.readFile(chunkFile);
                await writeStream.writeFile(data);
                await fs.unlink(chunkFile); // Delete chunk after writing
            } catch (error) {
                if (error instanceof Error) {
                    console.error(`Error processing chunk ${i}:`, error.message);
                }

                return {
                    error: true,
                    message: "Ein Chunk konnte nicht verarbeitet werden. Bitte versuche es erneut.",
                };
            }
        }
    } finally {
        await writeStream.close();
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

    return {
        error: false,
        message: "Die Datei wurde erfolgreich gespeichert.",
    };
}
