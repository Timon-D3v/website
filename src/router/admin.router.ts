import { Request, Response, Router } from "express";
import multerProjectsInstance from "../shared/projects.multer";
import { ProjectFilesUpload } from "../@types/project.type";
import addProject from "../shared/add.project.database";

// Router Serves under /api/private/admin
const router = Router();

router.post("/uploadProject", multerProjectsInstance.fields([{ name: "image" }, { name: "portraitImage" }]), async (req: Request, res: Response) => {
    try {
        const { title, description, url } = req.body;
        const files = req.files as ProjectFilesUpload;

        const image = files.image[0];
        const portraitImage = files.portraitImage[0];

        const imageUrl = "/files/public/projects/" + image.filename;
        const portraitImageUrl = "/files/public/projects/" + portraitImage.filename;

        const valid = await addProject(title, description, url, imageUrl, portraitImageUrl);

        if (!valid) throw new Error("Beim Hochladen des Projekts ist ein Fehler aufgetreten.");

        res.json({
            error: false,
            message: "Das Projekt wurde erfolgreich hochgeladen.",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(500).json({
            error: true,
            message: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.",
        });
    }
});

export default router;
