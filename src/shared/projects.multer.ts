import { Request } from "express";
import multer from "multer";
import { randomString } from "timonjs";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, "./uploads/projects");
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, `file_${randomString(64)}.${file.originalname.split(".").pop()}`);
    },
});

const multerProjectsInstance = multer({
    storage,
});

export default multerProjectsInstance;
