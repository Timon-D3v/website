import connection from "./connection.database";
import { DatabaseChunk } from "../@types/metaData.type";
import { FieldPacket, RowDataPacket } from "mysql2";

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