import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";

export default async function getCurrentHomeCounter() {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT `count` FROM `main`.`home_counter` WHERE (`id` = '1');");
        return Number(rows[0]["count"]);
    } catch (error) {
        console.error(error);
        return error;
    }
}
