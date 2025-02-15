import { Request, Response, Router } from "express";
import { getMetaFileWithId } from "../shared/get.meta";

// Router Serves under /files/private
const router = Router();

router.get("/getAllRoutes", async (req: Request, res: Response): Promise<void> => {
    try {
        const meta = await getMetaFileWithId(Number(req.session.user?.id));

        if (meta instanceof Error) throw new Error("Beim Abrufen der Metadaten ist ein Fehler aufgetreten.");

        res.json({
            fileSystem: meta.fileSystem,
            error: false,
            message: "Success",
        });
    } catch (error) {
        res.json({
            FileSystem: {},
            error: true,
            message: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten.",
        });
    }
});

export default router;
