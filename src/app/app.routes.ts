import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadComponent: async () => {
            const component = await import("./home/home.component");
            return component.HomeComponent;
        },
    }
];
