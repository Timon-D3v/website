import connection from "./connection.database";
import { MetaFile } from "../@types/metaData.type";
import { FieldPacket, RowDataPacket } from "mysql2";

/**
 * Retrieves metadata for a user with the specified ID from the database.
 *
 * @param {number} id - The ID of the user whose metadata is to be retrieved.
 *
 * @returns {Promise<MetaFile | Error>} A promise that resolves to a `MetaFile` object if the user is found,
 *          or an `Error` object if the ID is invalid or the query fails.
 *
 * @throws Will log an error message to the console if a database query error occurs.
 *
 * @remarks
 * - The function checks if the provided ID is a valid number before querying the database.
 * - The query joins the `user` and `metadata` tables to fetch user details along with metadata.
 * - If the query is successful, the first row of the result is returned as a `MetaFile`.
 * - If an error occurs during the query, it is returned as an `Error` object.
 */
export async function getMetaFileWithId(id: number): Promise<MetaFile | Error> {
    if (isNaN(id)) return new Error("Invalid ID");

    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT `user`.`id`, `user`.`email`, `user`.`name`, `user`.`family_name` AS familyName, `user`.picture, `meta`.`fileSystem` FROM `main`.`user` AS `user` JOIN `main`.`metadata` AS `meta` ON `user`.`id` = `meta`.`userId` WHERE `user`.`id` = ?;", [id]);

        if (rows.length === 0) return new Error("User not found");

        if (typeof rows[0]["fileSystem"] === "string") {
            rows[0]["fileSystem"] = JSON.parse(rows[0]["fileSystem"]);
        }

        return rows[0] as MetaFile;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
