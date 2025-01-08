import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import publicConfig from "../../public.config";

@Injectable({
    providedIn: "root",
})
export class SiteTitleService {
    platformId = inject(PLATFORM_ID);

    /**
     * Retrieves the title for a given route from the public configuration.
     *
     * @param {string} route - The route for which to get the title.
     * @returns {string} The title associated with the route, appended with " | Timon.dev".
     *                   If no title is found, returns "Timon.dev".
     * @throws {Error} If the title for the route is not found or is an empty string.
     */
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

    /**
     * Sets the document title and Open Graph meta tags based on the provided route.
     * 
     * @param {string} route - The route for which the title should be set.
     * 
     * This method updates the document's title and the Open Graph meta tags for 'og:title' and 'og:url'.
     * It only performs these updates if the code is running in a browser environment.
     * 
     * The title is retrieved using the `getTitleFromRoute` method.
     * 
     * @returns {void}
     */
    setTitleForRoute(route: string): void {
        const title = this.getTitleFromRoute(route);

        if (!isPlatformBrowser(this.platformId)) return;

        document.title = title;
        document.querySelector("meta[property='og:title']")?.setAttribute("content", title);
        document.querySelector("meta[property='og:url']")?.setAttribute("content", window.location.origin + route);
        console.log("Title set to:", title);
    }
}
