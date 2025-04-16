import connection from "./connection.database";

export async function cleanUpChunks(chunkId: string): Promise<void> {
    try {
        await connection.query("DELETE FROM `main`.`file_chunks` WHERE (`chunkId` = ?);", [chunkId]);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}