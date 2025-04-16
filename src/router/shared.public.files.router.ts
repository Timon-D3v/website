import { Request, Response, Router } from "express";
import { Readable } from "stream";
import { getPublicFile } from "../shared/get.public.files.database";

// Router Serves under /files/public/files
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await getPublicFile(req.params["name"]);

        if (result instanceof Error) throw result;

        res.set({
            "Content-Type": result.mimetype,
            "Content-Disposition": `inline; filename="${result.originalName}"`,
            "Content-Length": result.data.length,
        });

        const stream = Readable.from(result.data);

        stream.pipe(res);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
