import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { Account } from "../@types/auth.type";

export async function getAllUsers(): Promise<Account[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`user`;");
        return rows as Account[];
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
