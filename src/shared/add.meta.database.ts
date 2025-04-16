import getAccount from "./get.account.database";
import connection from "./connection.database";

/**
 * Adds a new metadata file entry for a user in the database.
 *
 * This function retrieves the account associated with the provided email
 * and inserts a new metadata entry into the database. The metadata includes
 * a root folder structure with no files or subfolders.
 *
 * @param {string} email - The email address of the user for whom the metadata file is being added.
 * 
 * @returns {Promise<boolean>} A promise that resolves to `true` if the operation is successful, or `false` if an error occurs.
 *
 * @throws Will log an error message to the console if the account retrieval fails
 *         or if the database query encounters an issue.
 */
export async function addNewMetaFile(email: string): Promise<boolean> {
    const account = await getAccount(email);

    if (account instanceof Error) {
        console.error(account.message);
        return false;
    }

    try {
        await connection.query("INSERT INTO `main`.`metadata` (`userId`, `fileSystem`) VALUES (?, ?);", [account.id, JSON.stringify({
            root: {
                name: "Dateien",
                files: [],
                folders: [],
            },
        })]);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }

    return true;
}
