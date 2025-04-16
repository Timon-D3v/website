import connection from "./connection.database";

/**
 * Saves a file to the database.
 *
 * @param {string} filename - The name of the file to be saved.
 * @param {number} id - The ID of the owner of the file.
 * @param {string} mimetype - The MIME type of the file.
 * @param {Buffer} data - The binary data of the file as a Buffer.
 * @param {string} originalName - The original name of the file.
 * @param {boolean} [isPublic = false] - Optional. Indicates whether the file is public. Defaults to `false`.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the file was successfully saved, or `false` if an error occurred.
 *
 * @throws Logs an error message to the console if an error occurs during the database query.
 */
export async function saveFile(filename: string, id: number, mimetype: string, data: Buffer, originalName: string, isPublic: boolean = false): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`files` (`filename`, `ownerId`, `isPublic`, `data`, `mimetype`, `originalName`) VALUES (?, ?, ?, ?, ?, ?)", [filename, id, isPublic, data, mimetype, originalName]);

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
