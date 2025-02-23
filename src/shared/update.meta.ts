import fs from "fs/promises";
import { MetaFile } from "../@types/metaData.type";

/**
 * Updates the metadata for a given ID by writing the provided data to a JSON file.
 *
 * @param {number} id - The unique identifier for the metadata.
 * @param {MetaFile} data - The metadata to be written to the file.
 * @returns {Promise<void>} A promise that resolves when the file has been written.
 */
export async function updateMetaDataForId(id: number, data: MetaFile): Promise<void> {
    await fs.writeFile(`./uploads/meta/ID_${id}.json`, JSON.stringify(data, null, 4), "utf-8");
}
