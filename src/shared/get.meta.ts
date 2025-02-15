import fs from "fs/promises";
import { MetaFile } from "../@types/metaData.type";

export async function getMetaFileWithId(id: number): Promise<MetaFile | Error> {
    if (isNaN(id)) return new Error("Invalid ID");

    try {
        const filename = `ID_${id}.json`;
        const path = "./uploads/meta/";

        const fileContent = await fs.readFile(path + filename, "utf-8");

        return JSON.parse(fileContent) as MetaFile;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return error as Error;
    }
}
