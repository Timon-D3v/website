import dotenv from "dotenv";

dotenv.config();

export default {
    ENV: process.env["ENV"],
    PORT: process.env["PORT"],
    SESSION_SECRET: process.env["SESSION_SECRET"],
    MYSQL_HOST: process.env["MYSQL_HOST"],
    MYSQL_USER: process.env["MYSQL_USER"],
    MYSQL_PW: process.env["MYSQL_PW"],
    MYSQL_DB: process.env["MYSQL_DB"],
    MYSQL_PORT: process.env["MYSQL_PORT"],
    MAILJET_PUBLIC_KEY: process.env["MAILJET_PUBLIC_KEY"],
    MAILJET_PRIVATE_KEY: process.env["MAILJET_PRIVATE_KEY"],
    IMAGEKIT_PUBLIC_KEY: process.env["IMAGEKIT_PUBLIC_KEY"],
    IMAGEKIT_PRIVATE_KEY: process.env["IMAGEKIT_PRIVATE_KEY"],
    ORIGIN: process.env["ORIGIN"],
};
