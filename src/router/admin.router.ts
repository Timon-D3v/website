import { Request, Response, Router } from "express";
import multerInstance from "../shared/multer";
import { ProjectFilesUpload } from "../@types/project.type";
import { addProject } from "../shared/add.project.database";
import { addApiKey } from "../shared/add.apiKey.database";
import { getAllUsers } from "../shared/get.allUsers.database";
import { getAllApiKeys } from "../shared/get.allApiKeys.database";
import { randomString } from "timonjs";
import bcrypt from "bcryptjs";
import { addUser } from "../shared/add.user.database";
import { PasswordEmail } from "../shared/template.email";
import { sendMail } from "../shared/send.email";
import publicConfig from "../public.config";
import { addNewMetaFile } from "../shared/add.meta.database";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { saveFile } from "../shared/save.files.database";
import { createOrganizationsDatabase } from "../shared/create.organizations.database";
import { testOrganizationsDatabase } from "../shared/test.organizations.database";

// Router Serves under /api/private/admin
const router = Router();

let lastDirectory = process.cwd();

router.post("/uploadProject", multerInstance.fields([{ name: "image" }, { name: "portraitImage" }]), async (req: Request, res: Response) => {
    try {
        const { title, description, url } = req.body;
        const files = req.files as ProjectFilesUpload;

        const image = files.image[0];
        const portraitImage = files.portraitImage[0];

        const random = randomString(64);
        const imageFileExtension = image.originalname.split(".").pop();
        const imageName = `file_${random}_1${imageFileExtension === image.originalname ? "" : "." + imageFileExtension}`;
        const portraitImageFileExtension = portraitImage.originalname.split(".").pop();
        const portraitImageName = `file_${random}_2${portraitImageFileExtension === portraitImage.originalname ? "" : "." + portraitImageFileExtension}`;

        const valid = await addProject(title, description, url, "/files/public/file/" + imageName, "/files/public/file/" + portraitImageName);

        if (!valid) throw new Error("Beim Hochladen des Projekts ist ein Fehler aufgetreten.");

        await saveFile(imageName, req.session.user?.id as number, image.mimetype, image.buffer, image.originalname, true);
        await saveFile(portraitImageName, req.session.user?.id as number, portraitImage.mimetype, portraitImage.buffer, portraitImage.originalname, true);

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

router.post("/addUser", async (req: Request, res: Response) => {
    try {
        const { email, name, familyName } = req.body;

        const allUsers = await getAllUsers();

        if (allUsers instanceof Error) throw new Error("Beim Abrufen der Benutzer ist ein Fehler aufgetreten.");

        const userExists = allUsers.some((user) => user.email === email);

        if (userExists) throw new Error(`Der Benutzer mit E-Mail ${email} existiert bereits.`);

        const generatedPassword = randomString(15);
        const hash = await bcrypt.hash(generatedPassword, 10);

        const valid = await addUser(email, name, familyName, hash, "/files/public/file/DEFAULT.jpg");

        if (!valid) throw new Error("Das Hinzufügen des Benutzers zur Datenbank hat nicht geklappt.");

        const { template } = new PasswordEmail(name, familyName, generatedPassword);

        const mailRequest = await sendMail(email, publicConfig.EMAIL, publicConfig.NAME, "Dein Passwort für timondev.com", template.TEXT, template.HTML, [], "new_password");

        if (!mailRequest.success) throw new Error(`Das Senden der E-Mail ist fehlgeschlagen. Bitte teile es dem Benutzer manuell zu. Das Passwort lautet: ${generatedPassword}`);

        const metaFileGenerated = await addNewMetaFile(email);

        if (!metaFileGenerated) throw new Error("Das Erstellen der Meta-Datei ist fehlgeschlagen. Bitte teile es dem Benutzer manuell zu.");

        res.json({
            error: false,
            message: `Der Benutzer ${name} ${familyName} (${email}) wurde erfolgreich hinzugefügt.`,
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

router.post("/generateApiKey", async (req: Request, res: Response) => {
    try {
        const { organizationName } = req.body;

        if (!organizationName || typeof organizationName !== "string" || organizationName === "") {
            res.status(400).json({
                error: true,
                message: "Der Organisationsname ist nicht gültig.",
            });
            return;
        }

        const allKeys = await getAllApiKeys();

        if (allKeys instanceof Error) throw new Error("Beim Abrufen der Organisationsnamen ist ein Fehler aufgetreten.");

        const userExists = allKeys.some((user) => user.name === organizationName);

        if (userExists) throw new Error(`Die Organisation mit Namen ${organizationName} existiert bereits.`);

        // Create the organizations database
        const created = await createOrganizationsDatabase(organizationName);

        if (!created) throw new Error("Das Erstellen der Organisationsdatenbank ist fehlgeschlagen.");

        // Test the connection to the database
        const testResult = await testOrganizationsDatabase(organizationName);

        if (testResult.length === 0) throw new Error("Die Organisationsdatenbank konnte nicht erstellt werden oder ist leer. Wahrscheinlich ist der Name ungültig.");

        // Generate the API key
        const key = crypto.randomBytes(64).toString("hex");

        const valid = await addApiKey(organizationName, key);

        if (!valid) throw new Error("Das Hinzufügen der Organisation zur Datenbank hat nicht geklappt.");

        res.json({
            error: false,
            message: key,
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

router.post("/execute", (req: Request, res: Response): void => {
    try {
        const { command } = req.body;

        if (typeof command !== "string" || command === "") {
            res.json({
                status: 400,
                error: true,
                result: "Command is not a string or empty.",
            });
            return;
        }

        let cwd = lastDirectory;

        exec(command, { cwd }, (error, stdout, stderr): void => {
            if (error !== null) {
                res.json({
                    status: 400,
                    error: true,
                    result: error?.message,
                });
                return;
            }

            if (typeof stderr === "string" && stderr !== "") {
                res.json({
                    status: 500,
                    error: true,
                    result: stderr,
                });
                return;
            }

            if (command.startsWith("cd ")) {
                const directory = command.split(" ")[1];
                const newPath = path.resolve(cwd, directory);

                if (fs.existsSync(newPath) && fs.lstatSync(newPath).isDirectory()) {
                    lastDirectory = newPath;
                }
            }

            res.json({
                status: 200,
                error: false,
                result: stdout,
            });
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            status: 500,
            error: true,
            result: error instanceof Error ? error.message : "An unknown error occurred.",
        });
    }
});

router.get("/executeDirectory", (req: Request, res: Response): void => {
    res.json({
        cwd: lastDirectory,
    });
});

export default router;
