import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import publicConfig from "../../public.config";
import { FileService } from "./file.service";

@Injectable({
    providedIn: "root",
})
export class SiteTitleService {
    private platformId = inject(PLATFORM_ID);
    private fileService = inject(FileService);

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
            let title = "";

            title = publicConfig.SITEMAP[route];

            if (typeof title === "undefined") title = "";

            title = this.getSiteTitleForFolder(title);

            if (!title || title === "") throw new Error("No title found for route.");

            return title + " | Timon.dev";
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error getting title from route:", error.message);
            }

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

    /**
     * Retrieves the site title for a given folder based on the provided title and route.
     *
     * @param {string} title - The current title of the site.
     * @returns {string} The site title for the folder, or the provided title if certain conditions are met.
     *
     * The function performs the following steps:
     * 1. If the title is not empty and does not match the public configuration sitemap entry for "/files", it returns the title.
     * 2. If the platform is not a browser, it returns the title.
     * 3. It retrieves the "path" search parameter from the current window location.
     * 4. It fetches the file system using the file service.
     * 5. If the file system is null, it returns the title.
     * 6. It retrieves the folder from the file system using the path.
     * 7. If the folder is undefined, it returns the title.
     * 8. Finally, it returns the name of the folder.
     */
    getSiteTitleForFolder(title: string): string {
        if (title !== "" && title !== publicConfig.SITEMAP["/files"]) return title;

        if (!isPlatformBrowser(this.platformId)) return title;

        const searchParams = new URLSearchParams(window.location.search);
        const path = searchParams.get("path") as string;
        const fileSystem = this.fileService.fileSystem();

        if (fileSystem === null) return title;

        const folder = fileSystem[path];

        if (folder === undefined) return title;

        return folder.name;
    }
}
