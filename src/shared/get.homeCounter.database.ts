import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";

/**
 * Retrieves the current value of the home counter from the database.
 *
 * @returns {Promise<number | Error>} A promise that resolves to the current home counter value as a number,
 * or an Error object if the query fails.
 *
 * @throws {Error} If there is an issue with the database query, the error is caught and logged,
 * and the error object is returned.
 */
export default async function getCurrentHomeCounter(): Promise<number | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT `count` FROM `main`.`home_counter` WHERE (`id` = '1');");
        return Number(rows[0]["count"]);
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
