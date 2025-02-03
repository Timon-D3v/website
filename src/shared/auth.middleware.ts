import { NextFunction, Request, Response } from "express";
import publicConfig from "../public.config";

export function canAccessSecuredRoutes(req: Request, res: Response, next: NextFunction) {
    if (typeof req.session?.user?.email === "string") return next();

    return res.status(401).redirect("/");
}

export function canAccessAdminRoutes(req: Request, res: Response, next: NextFunction) {
    if (typeof req.session?.user?.email === "string" && req.session.user.email === publicConfig.CONTACT_EMAIL) return next();

    return res.status(401).redirect("/");
}
