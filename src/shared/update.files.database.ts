import connection from "./connection.database";

/**
 * Updates the file record in the database by appending the provided data to the existing data
 * for the specified filename.
 *
 * @param {string} filename - The name of the file to update in the database.
 * @param {Buffer} data - The buffer containing the data to append to the file's existing data.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the update was successful, or `false` if an error occurred.
 *
 * @throws Logs an error message to the console if the database query fails.
 */
export async function updateFile(filename: string, data: Buffer): Promise<boolean> {
    try {
        await connection.query("UPDATE `main`.`files` SET `data` = CONCAT(`data`, ?) WHERE `filename` = ?", [data, filename]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
