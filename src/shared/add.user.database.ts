import connection from "./connection.database";

export async function addUser(email: string, name: string, familyName: string, passwordHash: string, pictureUrl: string): Promise<boolean> {
    try {
        await connection.query("INSERT INTO `main`.`user` (`email`, `password`, `name`, `family_name`, `picture`) VALUES (?, ?, ?, ?, ?);", [email, passwordHash, name, familyName, pictureUrl]);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
