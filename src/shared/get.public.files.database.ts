import { DatabaseFile } from "../@types/metaData.type";
import connection from "./connection.database";
import { FieldPacket, RowDataPacket } from "mysql2";

/**
 * Retrieves a public file from the database by its filename.
 *
 * @param {string} filename - The name of the file to retrieve.
 *
 * @returns {Promise<DatabaseFile | Error>} - A promise that resolves to the `DatabaseFile` object if found,
 * or an `Error` if the file is not found or multiple files with the same name exist.
 *
 * @throws Will throw an error if the database query fails.
 */
export async function getPublicFile(filename: string): Promise<DatabaseFile | Error> {
    try {
        const [rows, field]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`files` WHERE (`filename` = ? AND `isPublic` = TRUE)", [filename]);

        if (rows?.length !== 1) throw new Error("File not found or multiple files found with the same name.");

        return rows[0] as DatabaseFile;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
