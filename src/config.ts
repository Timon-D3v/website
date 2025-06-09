import dotenv from "dotenv";
import process from "process";

dotenv.config();

export default {
    ENV: process.env["ENV"] as "dev" | "prod",
    PORT: Number(process.env["PORT"]),
    HOST: process.env["HOST"] as string,
    SESSION_SECRET: process.env["SESSION_SECRET"] as string,
    MYSQL_HOST: process.env["MYSQL_HOST"],
    MYSQL_USER: process.env["MYSQL_USER"],
    MYSQL_PW: process.env["MYSQL_PW"],
    MYSQL_DB: process.env["MYSQL_DB"],
    MYSQL_PORT: Number(process.env["MYSQL_PORT"]),
    MAILJET_PUBLIC_KEY: process.env["MAILJET_PUBLIC_KEY"],
    MAILJET_PRIVATE_KEY: process.env["MAILJET_PRIVATE_KEY"],
    IMAGEKIT_PUBLIC_KEY: process.env["IMAGEKIT_PUBLIC_KEY"],
    IMAGEKIT_PRIVATE_KEY: process.env["IMAGEKIT_PRIVATE_KEY"],
    ORIGIN: process.env["ORIGIN"],
    UPLOAD_PATH: process.env["UPLOAD_PATH"] as string,
    AUTO_LOGIN: process.env["AUTO_LOGIN"] === "true",
    AUTO_LOGIN_EMAIL: process.env["AUTO_LOGIN_EMAIL"] as string,
    DELIVAPI_API_KEY: process.env["DELIVAPI_API_KEY"] as string,
};
