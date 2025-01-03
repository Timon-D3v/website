import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { Project } from "../@types/project.type";

export default async function getAllProjects(): Promise<Project[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`projects`;");
        return rows as Project[];
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
