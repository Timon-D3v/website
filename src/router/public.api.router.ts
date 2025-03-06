import { Router, Request, Response } from "express";
import publicAuthApiRouter from "./auth.public.api.router";
import incrementHomeCounter from "../shared/increment.homeCounter.database";
import getCurrentHomeCounter from "../shared/get.homeCounter.database";
import { validateData } from "../shared/validate-inputs.email";
import { ContactEmail } from "../shared/template.email";
import { sendMail } from "../shared/send.email";
import publicConfig from "../public.config";
import { EmailResponse } from "../@types/emailResponse.type";
import getAllProjects from "../shared/get.allProjects.database";
import { getMetaFileWithId } from "../shared/get.meta";

// Router Serves under /api/public
const router = Router();

router.use("/auth", publicAuthApiRouter);

router.get("/getCurrentHomeCounter", async (_req: Request, res: Response): Promise<void> => {
    const result = await getCurrentHomeCounter();
    res.json({
        count: typeof result === "number" ? result : 0,
        message: typeof result === "number" ? "Retrieved Home Counter" : "Failed to Retrieve Home Counter",
        error: typeof result !== "number",
    });
});

router.post("/incrementHomeCounter", async (_req: Request, res: Response): Promise<void> => {
    const response = await incrementHomeCounter();
    res.json({
        message: response === "Success" ? "Incremented Home Counter" : "Failed to Increment Home Counter",
        error: response !== "Success",
    });
});

router.post("/submitContactForm", async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, familyName, email, message } = req.body;

        if (!name && !familyName && !email && !message) throw new Error("Bad Request.");

        if (typeof name !== "string" || typeof familyName !== "string" || typeof email !== "string" || typeof message !== "string") throw new Error("Bad Request.");

        const validation = validateData(name.trim(), familyName.trim(), email.trim(), message.trim());

        if (!validation[0]) throw new Error(validation[2].message);

        const { template } = new ContactEmail(name, familyName, email, message);

        const response: EmailResponse = await sendMail(
            [
                {
                    Email: publicConfig.EMAIL,
                },
                {
                    Email: publicConfig.CONTACT_EMAIL,
                },
            ],
            publicConfig.EMAIL,
            `${name} ${familyName}`,
            publicConfig.TEMPLATES.EMAIL.TITLE,
            template.TEXT,
            template.HTML,
        );

        if (!response.success) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        if (typeof response.data !== "string" && response.data.response.status !== 200) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        res.json({
            message: "Ihre Nachricht wurde erfolgreich versendet.",
            error: false,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
            error: true,
        });
    }
});

router.get("/getAllProjects", async (_req: Request, res: Response): Promise<void> => {
    try {
        const projects = await getAllProjects();

        if (projects instanceof Error) throw projects;

        if (projects.length === 0) throw new Error("No Projects Found.");

        res.json({
            projects: JSON.stringify(projects),
            message: "Retrieved Projects",
            error: false,
        });
    } catch (error) {
        console.error(error);
        res.json({
            projects: JSON.stringify([]),
            message: "Failed to Retrieve Projects",
            error: true,
        });
    }
});

router.get("/getUsernameWithId", async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.query["id"]);

        if (typeof id !== "number" || isNaN(id)) {
            res.json({
                username: "-- Fehler --",
                api: {
                    message: "Keine oder ungültige ID erhalten.",
                    error: true,
                },
            });
            return;
        }

        const meta = await getMetaFileWithId(id);

        if (meta instanceof Error) {
            res.json({
                username: "-- Fehler --",
                api: {
                    message: "Kein Benutzer mit dieser ID.",
                    error: true,
                },
            });
            return;
        }

        res.json({
            username: meta.name + " " + meta.familyName,
            api: {
                message: "Retrieved Username",
                error: false,
            },
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            username: "-- Fehler --",
            api: {
                message: "Ein Unbekannter Fehler ist aufgetreten.",
                error: true,
            },
        });
    }
});

export default router;
