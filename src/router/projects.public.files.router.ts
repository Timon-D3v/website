import { Request, Response, Router } from "express";
import { promises as fs } from "fs";
import path from "path";

// Router Serves under /files/public/projects
const router = Router();

router.get("/:name", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const filePath = path.join("uploads/projects", name);
        await fs.access(filePath);

        res.sendFile(name, { root: "uploads/projects" });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.status(404).end();
    }
});

export default router;
