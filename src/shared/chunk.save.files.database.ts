import connection from "./connection.database";

export async function saveFileChunk(id: number, chunkId: string, chunkIndex: number, totalChunks: number, data: Buffer): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`file_chunks` (`ownerId`, `chunkId`, `chunkIndex`, `totalChunks`, `chunk`) VALUES (?, ?, ?, ?, ?)", [id, chunkId, chunkIndex, totalChunks, data]);

        return true
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}