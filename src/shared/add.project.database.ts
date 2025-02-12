import connection from "./connection.database";

export default async function addProject(title: string, description: string, url: string, imageUrl: string, portraitImageUrl: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`projects` (`title`, `description`, `url`, `image_url`, `portrait_image_url`) VALUES (?, ?, ?, ?, ?);", [title, description, url, imageUrl, portraitImageUrl]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
