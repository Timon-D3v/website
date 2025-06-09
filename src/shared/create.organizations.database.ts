import connection from "./connection.database";

/**
 * Creates a new table for the specified organization in the `cdn` database.
 * The table is named after the given `organizationName` and is structured to store files,
 * including their MIME type and binary data.
 *
 * @param {string} organizationName - The name of the organization for which the table will be created.
 *
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the table was created successfully, or `false` if an error occurred.
 *
 * @remarks
 * - The table will only be created if it does not already exist.
 * - Logs an error to the console if the creation fails.
 */
export async function createOrganizationsDatabase(organizationName: string): Promise<boolean> {
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS \`cdn\`.\`${organizationName}\` (
                \`id\` INT NOT NULL AUTO_INCREMENT,
                \`mimetype\` VARCHAR(64) NOT NULL,
                \`file\` LONGBLOB NOT NULL,
                PRIMARY KEY (\`id\`),
                UNIQUE INDEX \`id${organizationName}_UNIQUE\` (\`id\` ASC) VISIBLE
            ) COMMENT = 'This table holds all files for the organization ${organizationName}';`);

        return true;
    } catch (error) {
        console.error("Error creating organizations database:", error);
        return false;
    }
}
