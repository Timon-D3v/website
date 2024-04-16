import mysql from "mysql2";
import dotenv from "dotenv";



dotenv.config();



const database = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PW,
    database: process.env.MYSQL_DB
}).promise();



export async function getSettings (username) {
    const query = "select * from `my_database`.`settings` where `username` = ?";
    const [result] = await database.query(query, [username.toString()])
    .catch(async () => {
        await createSettingsDB(username);
        const [new_result] = await database.query(query, [username.toString()]);
        return new_result;
    });
    return result;
};

export async function toggleDarkmode (username) {
    const [current] = await getSettings(username);
    if (current.darkmode == "0") {
        var query = "UPDATE `my_database`.`settings` SET `darkmode` = '1' WHERE (`username` = ?);";
    } else {
        var query = "UPDATE `my_database`.`settings` SET `darkmode` = '0' WHERE (`username` = ?);";
    };
    const result = await database.query(query, [username]);
    return result;
};

export async function createSettingsDB (username) {
    const query = "INSERT INTO `my_database`.`settings` (`username`, `darkmode`) VALUES (?, '0')";
    const [result] = await database.query(query, [username.toString()]);
    return result;
};