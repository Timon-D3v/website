import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from "@angular/ssr/node";
import express from "express";
import session from "express-session";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import CONFIG from "./config";
import rootRouter from "./router/root.router";
import apiRouter from "./router/api.router";
import filesRouter from "./router/files.router";
import publicConfig from "./public.config";
import { canAccessAdminRoutes, canAccessSecuredRoutes } from "./shared/auth.middleware";

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, "../browser");

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /public
 */
app.use(
    express.static(browserDistFolder, {
        maxAge: "1y",
        index: false,
        redirect: false,
    }),
);

/**
 * Use express-session for session management
 */
app.use(
    session({
        secret: CONFIG.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: false,
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        },
    }),
);

/**
 * Use routers for request handling
 */
app.use("/", rootRouter);
app.use("/api", apiRouter);
app.use("/files", filesRouter);

/**
 * Secure routes that not everyone should have access
 */
for (const route of publicConfig.SECURED_ROUTES) {
    app.use(route, canAccessSecuredRoutes);
}
for (const route of publicConfig.ADMIN_ROUTES) {
    app.use(route, canAccessAdminRoutes);
}

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use("/**", (req, res, next) => {
    angularApp
        .handle(req)
        .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
        .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable.
 */
if (isMainModule(import.meta.url)) {
    app.listen(CONFIG.PORT, () => {
        console.log(`\x1b[34m%s\x1b[0m`, `Node Express server listening on http://localhost:${CONFIG.PORT}`);
    });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
