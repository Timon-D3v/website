import connection from "./connection.database";
import { MetaFile } from "../@types/metaData.type";

/**
 * Updates the metadata for a specific user ID in the database.
 *
 * This function executes an SQL query to update the `fileSystem` field
 * in the `metadata` table for the given user ID. The `fileSystem` data
 * is serialized into a JSON string before being stored in the database.
 *
 * @param {number} id - The unique identifier of the user whose metadata is being updated.
 * @param {MetaFile} data - An object containing the metadata to be updated. The `fileSystem`
 *                          property of this object will be stored in the database.
 * 
 * @returns {Promise<void>} A promise that resolves when the update operation is complete.
 */
export async function updateMetaDataForId(id: number, data: MetaFile): Promise<void> {
    await connection.query("UPDATE `main`.`metadata` SET `fileSystem` = ? WHERE (`userId` = ?);", [JSON.stringify(data.fileSystem), id]);
}
