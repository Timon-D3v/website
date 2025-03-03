import { MetaFile } from "../@types/metaData.type";
import getAccount from "./get.account.database";
import fs from "fs/promises";
import path from "path";
import CONFIG from "../config";

/**
 * Adds a new meta file for the given email.
 *
 * This function retrieves the account information associated with the provided email,
 * constructs a meta file object, and writes it to the file system in JSON format.
 *
 * @param {string} email - The email address associated with the account.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the operation was successful.
 *
 * @throws Will log an error message and return false if the account retrieval fails or if there is an error writing the file.
 */
export async function addNewMetaFile(email: string): Promise<boolean> {
    const account = await getAccount(email);

    if (account instanceof Error) {
        console.error(account.message);
        return false;
    }

    const filename = `ID_${account.id}.json`;
    const metaPath = path.join(CONFIG.UPLOAD_PATH, "/meta");
    const meta: MetaFile = {
        id: account.id,
        email: account.email,
        name: account.name,
        familyName: account.family_name,
        picture: account.picture,
        fileSystem: {
            root: {
                name: "Dateien",
                files: [],
                folders: [],
            },
        },
    };

    try {
        await fs.writeFile(path.join(metaPath, filename), JSON.stringify(meta, null, 4));
    } catch (error) {
        console.error(error);
        return false;
    }

    return true;
}
