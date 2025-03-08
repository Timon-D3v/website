import connection from "./connection.database";

/**
 * Adds a shared file entry to the database.
 *
 * @param {string} filename - The name of the file to be added.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the file was successfully added, or `false` if an error occurred.
 */
export async function addSharedFile(filename: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`shared_files` (`filename`, `deleted`) VALUES (?, ?);", [filename, false]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
