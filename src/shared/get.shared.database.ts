import { RowDataPacket, FieldPacket } from "mysql2";
import { SharedFileEntry } from "../@types/sharedFiles.type";
import connection from "./connection.database";

export default async function getSharedFiles(): Promise<SharedFileEntry[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`shared_files`;");

        return rows as SharedFileEntry[];
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
