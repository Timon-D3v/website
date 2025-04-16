import { DatabaseFile } from "../@types/metaData.type";
import connection from "./connection.database";
import { FieldPacket, RowDataPacket } from "mysql2";

export async function getFile(filename: string, id: number): Promise<DatabaseFile | Error> {
    try {
        const [rows, field]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`files` WHERE (`filename` = ? AND `ownerId` = ?)", [filename, id]);

        if (rows?.length !== 1) throw new Error("File not found or multiple files found with the same name.");

        return rows[0] as DatabaseFile;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}