import connection from "./connection.database";

export async function saveFile(filename: string, id: number, mimetype: string, data: Buffer, originalName: string, isPublic: boolean = false): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`files` (`filename`, `ownerId`, `isPublic`, `data`, `mimetype`, `originalName`) VALUES (?, ?, ?, ?, ?, ?)", [filename, id, isPublic, data, mimetype, originalName]);

        return true
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}