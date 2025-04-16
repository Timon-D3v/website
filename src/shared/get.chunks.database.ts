import connection from "./connection.database";
import { DatabaseChunk } from "../@types/metaData.type";
import { FieldPacket, RowDataPacket } from "mysql2";

/**
 * Retrieves all chunks from the database associated with the specified chunk ID.
 *
 * The function queries the `file_chunks` table in the `main` database to fetch
 * all rows where the `chunkId` matches the provided parameter. The results are
 * ordered by the `chunkIndex` in ascending order.
 *
 * @param {string} chunkId - The unique identifier of the chunk to retrieve.
 *
 * @returns {Promise<DatabaseChunk[] | Error>} - A promise that resolves to an array of `DatabaseChunk` objects if the query
 *          is successful, or an `Error` object if an error occurs.
 *
 * @throws Logs the error message to the console if an exception is caught during the query.
 */
export async function getAllChunks(chunkId: string): Promise<DatabaseChunk[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`file_chunks` WHERE `chunkId` = ? ORDER BY `chunkIndex` ASC;", [chunkId]);

        return rows as DatabaseChunk[];
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
