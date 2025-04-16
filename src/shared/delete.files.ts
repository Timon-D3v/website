import connection from "./connection.database";

/**
 * Deletes a file record from the database based on the provided filename and owner ID.
 *
 * @param {string} filename - The name of the file to be deleted.
 * @param {number} id - The ID of the owner associated with the file.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the file was successfully deleted,
 *          or `false` if an error occurred during the deletion process.
 *
 * @throws Will log an error message to the console if the deletion fails.
 */
export async function deleteFile(filename: string, id: number): Promise<boolean> {
    try {
        await connection.query("DELETE FROM `main`.`files` WHERE (`filename` = ? AND `ownerId` = ?);", [filename, id]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
