import { MetaData, MetaFileSystem } from "../@types/metaData.type";

/**
 * Checks if a user owns a file within a given file system.
 *
 * @param {string} filename - The name of the file to check for ownership.
 * @param {MetaFileSystem} fileSystem - The file system metadata object to search within.
 * @param {string} folder - The folder to start the search from. Defaults to "root".
 * @returns {boolean} A boolean indicating whether the user owns the file.
 *
 * @throws Will log an error message if an error or type error occurs during the search.
 */
export function checkIfUserOwnsFile(filename: string, fileSystem: MetaFileSystem, folder: string = "root"): boolean {
    try {
        const found = fileSystem?.[folder].files.find((file: MetaData): boolean => file.fileName === filename);

        if (found) {
            return true;
        }

        for (const subFolder of fileSystem?.[folder].folders) {
            if (checkIfUserOwnsFile(filename, fileSystem, subFolder)) {
                return true;
            }
        }

        return false;
    } catch (error) {
        if (error instanceof Error || error instanceof TypeError) {
            console.error(error.message);
        }

        return false;
    }
}