import connection from "./connection.database";
import { FieldPacket, RowDataPacket } from "mysql2";

/**
 * Checks if metadata exists for a given user ID in the database.
 *
 * @param {number} id - The ID of the user to check for metadata.
 * 
 * @returns {Promise<boolean>} - A promise that resolves to `true` if metadata exists for the user, otherwise `false`.
 *
 * @throws Will log an error message to the console if a database query error occurs.
 */
export async function hasMetaData(id: number): Promise<boolean> {
    try {
        const [rows, field]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`metadata` WHERE userId = ?;", [id]);

        return rows?.length > 0;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}