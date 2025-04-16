import { DatabaseFile } from "../@types/metaData.type";
import connection from "./connection.database";
import { FieldPacket, RowDataPacket } from "mysql2";

/**
 * Retrieves a file from the database based on the provided filename and owner ID.
 *
 * @param {string} filename - The name of the file to retrieve.
 * @param {number} id - The ID of the owner associated with the file.
 *
 * @returns {Promise<DatabaseFile | Error>} - A promise that resolves to a `DatabaseFile` object if the file is found,
 *          or an `Error` if the file is not found or if multiple files with the same name exist.
 *
 * @throws Will throw an error if the database query fails.
 */
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
