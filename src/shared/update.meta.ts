import fs from "fs/promises";
import { MetaFile } from "../@types/metaData.type";

export async function updateMetaDataForId(id: number, data: MetaFile): Promise<void> {
    await fs.writeFile(`./uploads/meta/ID_${id}.json`, JSON.stringify(data, null, 4), "utf-8");
}
