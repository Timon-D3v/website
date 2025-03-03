import fs from "fs/promises";
import path from "path";
import CONFIG from "../config";
import { MetaFile } from "../@types/metaData.type";

/**
 * Retrieves a meta file with the specified ID.
 *
 * @param {number} id - The ID of the meta file to retrieve.
 * @returns {Promise<MetaFile | Error>} A promise that resolves to the meta file if found, or an error if the ID is invalid or the file cannot be read.
 *
 * @throws Will throw an error if the file cannot be read or parsed.
 */
export async function getMetaFileWithId(id: number): Promise<MetaFile | Error> {
    if (isNaN(id)) return new Error("Invalid ID");

    try {
        const filename = `ID_${id}.json`;
        const filePath = path.join(CONFIG.UPLOAD_PATH, "/meta");

        const fileContent = await fs.readFile(path.join(filePath, filename), "utf-8");

        return JSON.parse(fileContent) as MetaFile;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
