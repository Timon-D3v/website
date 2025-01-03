import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { notAuthGuard } from "./guards/not-auth.guard";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadComponent: async () => {
            const component = await import("./home/home.component");
            return component.HomeComponent;
        },
    },
    {
        path: "contact",
        loadComponent: async () => {
            const component = await import("./contact/contact.component");
            return component.ContactComponent;
        },
    },
    {
        path: "admin",
        loadComponent: async () => {
            const component = await import("./admin/admin.component");
            return component.AdminComponent;
        },
        canActivate: [authGuard],
    },
    {
        path: "login",
        loadComponent: async () => {
            const component = await import("./auth/login/login.component");
            return component.LoginComponent;
        },
        canActivate: [notAuthGuard],
    },
    {
        path: "imprint",
        loadComponent: async () => {
            const component = await import("./imprint/imprint.component");
            return component.ImprintComponent;
        },
    },
    {
        path: "privacy",
        loadComponent: async () => {
            const component = await import("./privacy/privacy.component");
            return component.PrivacyComponent;
        },
    },
];
