import connection from "./connection.database";



export default async function incrementHomeCounter() {
    try {
        await connection.query("UPDATE `main`.`home_counter` SET `count` = `count` + '1' WHERE (`id` = '1');");
        return "Success";
    } catch (error) {
        console.error(error);
        return error;
    }
}