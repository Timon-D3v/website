import connection from "./connection.database";

/**
 * Adds a new project to the database.
 *
 * @param {string} title - The title of the project.
 * @param {string} description - The description of the project.
 * @param {string} url - The URL of the project.
 * @param {string} imageUrl - The URL of the project's image.
 * @param {string} portraitImageUrl - The URL of the project's portrait image.
 * @returns {Promise<boolean>} - A promise that resolves to true if the project was added successfully, or false if there was an error.
 */
export async function addProject(title: string, description: string, url: string, imageUrl: string, portraitImageUrl: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`projects` (`title`, `description`, `url`, `image_url`, `portrait_image_url`) VALUES (?, ?, ?, ?, ?);", [title, description, url, imageUrl, portraitImageUrl]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
