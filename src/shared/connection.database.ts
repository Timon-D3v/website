import mysql from "mysql2";
import CONFIG from "../config";



export default mysql.createPool({
    host: CONFIG.MYSQL_HOST,
    user: CONFIG.MYSQL_USER,
    password: CONFIG.MYSQL_PW,
    database: CONFIG.MYSQL_DB,
    port: Number(CONFIG.MYSQL_PORT)
}).promise();