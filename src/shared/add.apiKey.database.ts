import connection from "./connection.database";

/**
 * Adds a new api key to the database.
 *
 * @param {string} organizationName - The name of the organization.
 * @param {string} key - The cryptographic key.
 *
 * @returns {Promise<boolean>} - A promise that resolves to true if the api key was added successfully, or false if there was an error.
 */
export async function addApiKey(organizationName: string, key: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `cdn`.`user` (`name`, `key`) VALUES (?, ?);", [organizationName, key]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
