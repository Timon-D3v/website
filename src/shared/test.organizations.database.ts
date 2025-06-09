import { FieldPacket, RowDataPacket } from "mysql2";
import connection from "./connection.database";

/**
 * Inserts a test record into the specified organization's database table and retrieves all records from it.
 *
 * @param {string} organizationName - The name of the organization's table to operate on.
 *
 * @returns {Promise<RowDataPacket[]>} - A promise that resolves to an array of RowDataPacket objects representing the rows in the organization's table.
 *
 * @throws {Error} - Logs an error and returns an empty array if the operation fails.
 */
export async function testOrganizationsDatabase(organizationName: string): Promise<RowDataPacket[]> {
    try {
        const testBlob = Buffer.from("Test data for organization database");
        const testMimetype = "text/plain";

        await connection.query("INSERT INTO `cdn`.`" + organizationName + "` (`mimetype`, `file`) VALUES (?, ?);", [testMimetype, testBlob]);

        const [rows, fields]: [RowDataPacket[], FieldPacket[]] = await connection.query("SELECT * FROM `cdn`.`" + organizationName + "`;");

        return rows;
    } catch (error) {
        console.error("Error creating organizations database:", error);

        return [];
    }
}
