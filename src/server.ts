import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from "@angular/ssr/node";
import express from "express";
import session from "express-session";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import CONFIG from "./config";
import apiRouter from "./router/api.router";
import filesRouter from "./router/files.router";

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
app.use("/api", apiRouter);
app.use("/files", filesRouter);

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
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
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
