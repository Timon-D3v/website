import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";
import { Project } from "../@types/project.type";

/**
 * Retrieves all projects from the database.
 *
 * @returns {Promise<Project[] | Error>} A promise that resolves to an array of Project objects if successful,
 * or an Error object if an error occurs.
 *
 * @throws {Error} If there is an issue with the database query.
 */
export default async function getAllProjects(): Promise<Project[] | Error> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `main`.`projects`;");
        return rows as Project[];
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
