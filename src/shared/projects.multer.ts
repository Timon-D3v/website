import multer from "multer";
import path from "path";
import CONFIG from "../config";
import { randomString } from "timonjs";
import { Request } from "express";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, path.join(CONFIG.UPLOAD_PATH, "/projects"));
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        const random = randomString(64);
        const fileExtension = file.originalname.split(".").pop();

        cb(null, `file_${random}${fileExtension === file.originalname ? "" : "." + fileExtension}`);
    },
});

const multerProjectsInstance = multer({
    storage,
});

export default multerProjectsInstance;
