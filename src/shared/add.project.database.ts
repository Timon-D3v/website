import { RowDataPacket, FieldPacket } from "mysql2";
import connection from "./connection.database";

export default async function addProject(title: string, description: string, url: string, imageUrl: string, portraitImageUrl: string): Promise<boolean> {
    try {
        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("INSERT INTO `main`.`projects` (`title`, `description`, `url`, `image_url`, `portrait_image_url`) VALUES (?, ?, ?, ?, ?);", [title, description, url, imageUrl, portraitImageUrl]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
