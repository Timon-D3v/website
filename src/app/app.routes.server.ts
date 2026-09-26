import { RenderMode, ServerRoute } from "@angular/ssr";

export const serverRoutes: ServerRoute[] = [
    
    {
        path: "",
        renderMode: RenderMode.Client,
    },
    {
        path: "contact",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "admin",
        renderMode: RenderMode.Client,
    },
    {
        path: "login",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "logout",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "imprint",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "privacy",
        renderMode: RenderMode.Prerender,
    },
    {
        path: "settings",
        renderMode: RenderMode.Client,
    },
    {
        path: "files",
        renderMode: RenderMode.Client,
    },
    {
        path: "**",
        renderMode: RenderMode.Server,
    },
];
