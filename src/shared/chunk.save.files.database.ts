import connection from "./connection.database";

/**
 * Saves a file chunk to the database.
 *
 * @param {number} id - The ID of the owner of the file chunk.
 * @param {string} chunkId - A unique identifier for the file chunk.
 * @param {number} chunkIndex - The index of the chunk in the sequence of chunks.
 * @param {number} totalChunks - The total number of chunks for the file.
 * @param {Buffer} data - The binary data of the file chunk.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the chunk was saved successfully, or `false` if an error occurred.
 */
export async function saveFileChunk(id: number, chunkId: string, chunkIndex: number, totalChunks: number, data: Buffer): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`file_chunks` (`ownerId`, `chunkId`, `chunkIndex`, `totalChunks`, `chunk`) VALUES (?, ?, ?, ?, ?)", [id, chunkId, chunkIndex, totalChunks, data]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
