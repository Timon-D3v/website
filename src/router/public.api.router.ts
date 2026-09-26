import { Router, Request, Response } from "express";
import publicAuthApiRouter from "./auth.public.api.router";
import incrementHomeCounter from "../shared/increment.homeCounter.database";
import getCurrentHomeCounter from "../shared/get.homeCounter.database";
import { validateData } from "../shared/validate-inputs.email";
import { ContactEmail, ContactVerificationEmail } from "../shared/template.email";
import { sendMail } from "../shared/send.email";
import publicConfig from "../public.config";
import { EmailResponse } from "../@types/emailResponse.type";
import getAllProjects from "../shared/get.allProjects.database";
import { getMetaFileWithId } from "../shared/get.meta.database";
import { ContactConfirmRequest } from "../@types/contactValidation.type";
import { getSecureMFACode, getSecureHexString } from "../shared/secure.utils";

// Router Serves under /api/public
const router = Router();

router.use("/auth", publicAuthApiRouter);

const GLOBAL_contactConfirmRequests: ContactConfirmRequest[] = [];
const GLOBAL_clearOutdatedRequestsInterval = setInterval(
    (): void => {
        for (let i = 0; i < GLOBAL_contactConfirmRequests.length; i++) {
            if (Date.now() - GLOBAL_contactConfirmRequests[0].timestamp > 60 * 60 * 1000) {
                GLOBAL_contactConfirmRequests.shift();
            }
        }
    },
    60 * 60 * 1000,
); // Every Hour

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

        // Set up a confirm request

        const code = getSecureMFACode();
        const token = getSecureHexString(64);

        GLOBAL_contactConfirmRequests.push({
            token,
            verificationCode: code,
            timestamp: Date.now(),
            payload: {
                name: name.trim(),
                familyName: familyName.trim(),
                email: email.trim(),
                message: message.trim(),
            },
        });

        const { template } = new ContactVerificationEmail(name.trim(), familyName.trim(), code);

        const response: EmailResponse = await sendMail(email.trim(), publicConfig.EMAIL, "Timon.dev", "Bestätigung deiner Kontaktanfrage", template.TEXT, template.HTML);

        if (!response.success) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        if (typeof response.data !== "string" && response.data.rejected.length > 0) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        if (!response.success || (typeof response.data !== "string" && response.data.rejected.length > 0)) {
            // Remove the request if the email could not be sent
            const requestIndex = GLOBAL_contactConfirmRequests.findIndex((request) => request.token === token);

            if (requestIndex !== -1) {
                GLOBAL_contactConfirmRequests.splice(requestIndex, 1);
            }

            throw new Error("Bestätigungsmail konnte nicht gesendet werden.");
        }

        res.json({
            message: "Bestätigungscode wurde an deine E-Mail-Adresse gesendet. Bitte überprüfe dein Postfach.",
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

router.post("/confirmContactRequest", async (req: Request, res: Response): Promise<void> => {
    try {
        const { token, verificationCode } = req.body;

        if (typeof token !== "string" || token.trim() === "" || !/^[a-z0-9]{64}$/.test(token.toLowerCase())) {
            throw new Error("Invalid or missing parameter 'token'.");
        }

        if (typeof verificationCode !== "string" || verificationCode.trim() === "" || !/^[a-z0-9]{10}$/.test(verificationCode.toLowerCase())) {
            throw new Error("Invalid or missing parameter 'verificationCode'.");
        }

        const contactRequest = GLOBAL_contactConfirmRequests.find((request) => request.token === token);

        if (!contactRequest) {
            throw new Error("Dieser Bestätigungscode ist ungültig oder abgelaufen.");
        }

        if (contactRequest.verificationCode !== verificationCode) {
            throw new Error("Dieser Bestätigungscode ist ungültig.");
        }

        // Request is confirmed, send the message

        const { template } = new ContactEmail(contactRequest.payload.name, contactRequest.payload.familyName, contactRequest.payload.email, contactRequest.payload.message);

        const response: EmailResponse = await sendMail(
            [publicConfig.EMAIL, publicConfig.CONTACT_EMAIL],
            publicConfig.EMAIL,
            `${contactRequest.payload.name} ${contactRequest.payload.familyName}`,
            publicConfig.TEMPLATES.EMAIL.TITLE,
            template.TEXT,
            template.HTML,
        );

        if (!response.success) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        if (typeof response.data !== "string" && response.data.rejected.length > 0) throw new Error("Die Nachricht konnte nicht verschickt werden. Bitte versuchen Sie es erneut.");

        res.json({
            error: false,
            message: "Success",
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
