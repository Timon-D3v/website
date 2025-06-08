import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { ApiKeyEntry } from "../@types/apiKeys.type";

/**
 * Retrieves all api keys from the database.
 *
 * @returns {Promise<ApiKeyEntry[] | Error>} - A promise that resolves to an array of api key objects if successful,
 * or an Error object if an error occurs.
 *
 * @throws {Error} If there is an issue with the database query.
 */
export async function getAllApiKeys(): Promise<ApiKeyEntry[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `cdn`.`user`;");
        return rows as ApiKeyEntry[];
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
