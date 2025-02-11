import multer from "multer";
import { randomString } from "timonjs";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/projects");
    },
    filename: (req, file, cb) => {
        cb(null, `file_${randomString(64)}.${file.originalname.split(".").pop()}`);
    },
});

const multerProjectsInstance = multer({
    storage,
});

export default multerProjectsInstance;
