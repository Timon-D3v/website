import fs from "fs/promises";
import path from "path";
import CONFIG from "../config";

export async function deleteFile(filename: string, filepath: string = "/files"): Promise<boolean> {
    try {
        await fs.unlink(path.join(CONFIG.UPLOAD_PATH, filepath, filename));

        return true;
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}
