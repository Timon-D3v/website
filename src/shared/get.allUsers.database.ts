import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { Account } from "../@types/auth.type";

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<Account[] | Error>} A promise that resolves to an array of Account objects if the query is successful,
 * or an Error object if the query fails.
 *
 * @throws {Error} If there is an issue with the database query, the error is caught and logged, and the error object is returned.
 */
export async function getAllUsers(): Promise<Account[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`user`;");
        return rows as Account[];
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
