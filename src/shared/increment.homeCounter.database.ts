import connection from "./connection.database";

/**
 * Increments the home counter in the database.
 *
 * This function updates the `count` field of the `home_counter` table by incrementing it by 1
 * for the row where the `id` is 1.
 *
 * @returns {Promise<"Success" | Error>} - A promise that resolves to "Success" if the update is successful,
 * or an Error object if an error occurs during the update.
 *
 * @throws {Error} If there is an issue with the database query, the error is caught and logged,
 * and the error object is returned.
 */
export default async function incrementHomeCounter(): Promise<"Success" | Error> {
    try {
        await connection.query("UPDATE `main`.`home_counter` SET `count` = `count` + '1' WHERE (`id` = '1');");
        return "Success";
    } catch (error) {
        console.error(error);
        return error as Error;
    }
}
