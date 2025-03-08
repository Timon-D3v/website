import connection from "./connection.database";

/**
 * Deletes a shared file by marking it as deleted in the database.
 *
 * @param {string} filename - The name of the file to be marked as deleted.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the file was successfully marked as deleted, or `false` if an error occurred.
 */
export async function deleteSharedFile(filename: string): Promise<boolean> {
    try {
        await connection.query("UPDATE `main`.`shared_files` SET `deleted` = ? WHERE (`filename` = ?);", [true, filename]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
