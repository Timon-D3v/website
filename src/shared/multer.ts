import { Request } from "express";
import multer from "multer";
import { randomString } from "timonjs";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, "./uploads/files");
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, `file_${randomString(64)}.${file.originalname.split(".").pop()}`);
    },
});

const chunkStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, "./uploads/chunks");
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void => {
        cb(null, req.body.chunkId + "_" + req.body.chunkIndex + ".chunk");
    },
});

const multerInstance = multer({
    storage,
});

const multerChunkInstance = multer({
    storage: chunkStorage,
});

export default multerInstance;

export { multerInstance, multerChunkInstance };
