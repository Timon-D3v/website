import { Router, Request, Response } from "express";
import _session from "express-session";
import bcrypt from "bcryptjs";
import getAccount from "../shared/get.account.database";
import { Account } from "../@types/auth.type";

// Router Serves under /api/public/auth
const router = Router();

declare module "express-session" {
    interface SessionData {
        user?: Account;
    }
}

router.post("/login", async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email && !password) throw new Error("Bad Request.");

        if (typeof email !== "string" || typeof password !== "string") throw new Error("Bad Request.");

        const account = await getAccount(email);

        if (account instanceof Error) throw new Error("Momentan ist keine Verbindung zur Datenbank möglich. Bitte versuchen Sie es später erneut.");

        if (!account) throw new Error("Dieser E-Mail-Adresse ist kein Account zugeschrieben. Bitte überprüfen Sie Ihre Eingabe.");

        const compare = await bcrypt.compare(password, account.password);

        if (!compare) throw new Error("Das eingegebene Passwort ist falsch. Bitte versuchen Sie es erneut.");

        req.session.user = account as Account;
        req.session.resetMaxAge();

        res.json({
            message: "Login Successful.",
            token: req.sessionID,
            error: false,
            valid: true,
        });
    } catch (error) {
        console.error(error);
        res.json({
            message: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
            token: "",
            error: true,
            valid: false,
        });
    }
});

router.post("/isLoggedIn", (req: Request, res: Response): void => {
    try {
        const token = req.body.token;

        if (typeof token === "undefined") throw new Error("Bad Request.");

        const email = req.session?.user?.email;

        res.json({
            message: typeof email === "string" ? "Session Valid." : "Session Invalid.",
            token: req.sessionID,
            error: false,
            valid: typeof email === "string",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }

        res.json({
            message: "Ein unbekannter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
            token: "",
            error: true,
            valid: false,
        });
    }
});

export default router;
