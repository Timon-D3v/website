import { NextFunction, Request, Response, Router } from "express";
import config from "../config";
import getAccount from "../shared/get.account.database";
import { Account } from "../@types/auth.type";

// Router Serves under /
const router = Router();

router.get("/**", async (req: Request, res: Response, next: NextFunction) => {
    if (config.AUTO_LOGIN) {
        req.session.user = (await getAccount(config.AUTO_LOGIN_EMAIL)) as Account;
        req.session.resetMaxAge();
    }
    next();
});

export default router;
