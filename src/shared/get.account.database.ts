import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { Account } from "../@types/auth.type";

/**
 * Retrieves an account from the database based on the provided email.
 *
 * @param {string} email - The email address of the account to retrieve.
 * @returns {Promise<Account | Error>} A promise that resolves to the account if found, or an error if the operation fails.
 */
export default async function getAccount(email: string): Promise<Account | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`user` WHERE email = ?;", [email]);
        return rows[0] as Account;
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
