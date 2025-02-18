import multer from "multer";
import { randomString } from "timonjs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/files");
    },
    filename: (req, file, cb) => {
        cb(null, `file_${randomString(64)}.${file.originalname.split(".").pop()}`);
    },
});

const chunkStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/chunks");
    },
    filename: (req, file, cb) => {
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
