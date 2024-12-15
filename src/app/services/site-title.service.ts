import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class SiteTitleService {
    constructor(@Inject(PLATFORM_ID) private platformId: any) {}

    getTitleFromRoute(route: string): string {
        return route + " | Timon.dev";
    }

    setTitleForRoute(route: string): void {
        const title = this.getTitleFromRoute(route);

        if (isPlatformBrowser(this.platformId)) {
            document.title = title;
            document.querySelector("meta[property='og:title']")?.setAttribute("content", title);
            document.querySelector("meta[property='og:url']")?.setAttribute("content", window.location.origin + route);
            console.log("Title set to:", title);
        } else {
            console.error("Cannot set title on server-side rendering");
        }
    }
}
