import connection from "./connection.database";

/**
 * Updates a file's visibility to public in the database.
 *
 * This function sets the `isPublic` field to `TRUE` for a file
 * in the `main.files` table, identified by its filename and owner ID.
 *
 * @param {string} filename - The name of the file to be updated.
 * @param {number} id - The ID of the owner of the file.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if the update was successful,
 *          or `false` if an error occurred.
 *
 * @throws Logs an error message to the console if the database query fails.
 */
export async function addSharedFile(filename: string, id: number): Promise<boolean> {
    try {
        await connection.query("UPDATE `main`.`files` SET `isPublic` = TRUE WHERE (`filename` = ? AND `ownerId` = ?);", [filename, id]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
