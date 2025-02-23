import { NextFunction, Request, Response } from "express";
import publicConfig from "../public.config";

/**
 * Middleware function to check if the user can access secured routes.
 *
 * This function checks if the request session contains a user with a valid email.
 * If the user is authenticated, the request is passed to the next middleware or route handler.
 * Otherwise, the response is redirected to the home page with a 401 Unauthorized status.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 *
 * @returns {void}
 */
export function canAccessSecuredRoutes(req: Request, res: Response, next: NextFunction): void {
    if (typeof req.session?.user?.email === "string") return next();

    return res.status(401).redirect("/");
}

/**
 * Middleware function to check if the user has access to secured API endpoints.
 *
 * This function checks if the request session contains a user with a valid email.
 * If the user is authenticated, the request is passed to the next middleware or route handler.
 * Otherwise, a 401 Unauthorized response is returned.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @returns {void | Response} void or a 401 Unauthorized response.
 */
export function canAccessSecuredApi(req: Request, res: Response, next: NextFunction): void | Response {
    if (typeof req.session?.user?.email === "string") return next();

    return res.status(401).end();
}

/**
 * Middleware function to check if the user can access admin routes.
 *
 * This function checks if the user's email stored in the session matches the
 * configured contact email. If the email matches, the request is allowed to proceed
 * to the next middleware or route handler. Otherwise, the user is redirected to the
 * home page with a 401 Unauthorized status.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 *
 * @returns {void}
 */
export function canAccessAdminRoutes(req: Request, res: Response, next: NextFunction): void {
    if (typeof req.session?.user?.email === "string" && req.session.user.email === publicConfig.CONTACT_EMAIL) return next();

    return res.status(401).redirect("/");
}

/**
 * Middleware to check if the user can access the admin API.
 *
 * This function checks if the user's email stored in the session matches the
 * configured contact email. If it does, the request is allowed to proceed to
 * the next middleware or route handler. Otherwise, a 401 Unauthorized response
 * is sent.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 *
 * @returns {void} void or a 401 Unauthorized response.
 */
export function canAccessAdminApi(req: Request, res: Response, next: NextFunction): void | Response {
    if (typeof req.session?.user?.email === "string" && req.session.user.email === publicConfig.CONTACT_EMAIL) return next();

    return res.status(401).end();
}
