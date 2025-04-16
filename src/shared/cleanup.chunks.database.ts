import connection from "./connection.database";

/**
 * Deletes a file chunk from the database based on the provided chunk ID.
 *
 * @param {string} chunkId - The unique identifier of the chunk to be deleted.
 *
 * @returns {Promise<void>} - A promise that resolves when the chunk is successfully deleted.
 *
 * @throws Logs an error message to the console if the database query fails.
 */
export async function cleanUpChunks(chunkId: string): Promise<void> {
    try {
        await connection.query("DELETE FROM `main`.`file_chunks` WHERE (`chunkId` = ?);", [chunkId]);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}
