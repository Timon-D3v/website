import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class SiteTitleService {
    platformId = inject(PLATFORM_ID);

    getTitleFromRoute(route: string): string {
        try {
            const title = publicConfig.SITEMAP[route];

            if (!title || title === "") throw new Error("No title found for route.");

            return title + " | Timon.dev";
        } catch (error) {
            console.error("Error getting title from route:", error);
            return "Timon.dev";
        }
    }

    setTitleForRoute(route: string): void {
        const title = this.getTitleFromRoute(route);

        if (!isPlatformBrowser(this.platformId)) return;

        document.title = title;
        document.querySelector("meta[property='og:title']")?.setAttribute("content", title);
        document.querySelector("meta[property='og:url']")?.setAttribute("content", window.location.origin + route);
        console.log("Title set to:", title);
    }
}
