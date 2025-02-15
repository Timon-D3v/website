import getAccount from "./get.account.database";
import fs from "fs/promises";

export async function addNewMetaFile(email: string): Promise<boolean> {
    const account = await getAccount(email);

    if (account instanceof Error) {
        console.error(account.message);
        return false;
    }

    const filename = `ID_${account.id}.json`;
    const path = "./uploads/meta/";
    const meta = {
        id: account.id,
        email: account.email,
        name: account.name,
        familyName: account.family_name,
        picture: account.picture,
        fileSystem: {
            root: {
                name: "Dateien",
                files: [],
            },
        },
    };

    try {
        await fs.writeFile(path + filename, JSON.stringify(meta, null, 4));
    } catch (error) {
        console.error(error);
        return false;
    }

    return true;
}
