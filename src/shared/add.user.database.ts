import connection from "./connection.database";

/**
 * Adds a new user to the database.
 *
 * @param {string} email - The email address of the user.
 * @param {string} name - The first name of the user.
 * @param {string} familyName - The family name of the user.
 * @param {string} passwordHash - The hashed password of the user.
 * @param {string} pictureUrl - The URL of the user's profile picture.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the user was added successfully, or `false` if there was an error.
 */
export async function addUser(email: string, name: string, familyName: string, passwordHash: string, pictureUrl: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`user` (`email`, `password`, `name`, `family_name`, `picture`) VALUES (?, ?, ?, ?, ?);", [email, passwordHash, name, familyName, pictureUrl]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
