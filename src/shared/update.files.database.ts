import connection from "./connection.database";

export async function updateFile(filename: string, data: Buffer): Promise<boolean> {
    try {
        await connection.query("UPDATE `main`.`files` SET `data` = CONCAT(`data`, ?) WHERE `filename` = ?", [data, filename]);

        return true
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        return false;
    }
}