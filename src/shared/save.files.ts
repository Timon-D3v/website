import { Account } from "../@types/auth.type";
import { MetaData, MetaDataUpload } from "../@types/metaData.type";
import fs from "fs/promises";

export async function saveSingeFile(publicMetaData: MetaDataUpload, file: Express.Multer.File, user: Account): Promise<{ valid: boolean; message: string }> {
    try {
        await fs.access(`./uploads/meta/ID_${user.id}.json`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            valid: false,
            message: "User Meta File not found",
        };
    }

    const metaFile = await fs.readFile(`./uploads/meta/ID_${user.id}.json`, "utf-8");
    const metaData = JSON.parse(metaFile);

    const meta: MetaData = {
        userId: user.id,
        fileName: file.filename,
        originalName: publicMetaData.originalName,
        type: publicMetaData.type,
        size: publicMetaData.size,
        lastModified: publicMetaData.lastModified,
        uploadedAt: publicMetaData.uploadedAt,
        timesOpened: 0,
        timesDownloaded: 0,
        lastDownloaded: 0,
        lastOpened: 0,
        path: publicMetaData.currentPath,
        url: publicMetaData.currentPath + "/" + publicMetaData.originalName,
    };

    try {
        metaData.fileSystem[publicMetaData.currentPath].files.push(meta);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            valid: false,
            message: "Path not found",
        };
    }

    try {
        await fs.writeFile(`./uploads/meta/ID_${user.id}.json`, JSON.stringify(metaData, null, 4), "utf-8");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return {
            valid: false,
            message: "Error saving file",
        };
    }

    return {
        valid: true,
        message: "File saved",
    };
}
