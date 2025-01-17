import { isPlatformBrowser } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class AuthService {
    constructor() {}

    platformId = inject(PLATFORM_ID);

    /**
     * Retrieves the authentication token from the local storage if the code is running in a browser environment.
     *
     * @returns {string} The authentication token if it exists in local storage, otherwise an empty string.
     */
    getLocalStorage(): string {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem("authToken");
            return token ? token : "";
        }

        return "";
    }

    /**
     * Checks if the user is logged in by verifying the presence of a value in local storage.
     *
     * @remarks
     * This method is not a secure way to check if a user is logged in. It is intended only for controlling visual elements.
     * Server-side routes should be protected to ensure security.
     *
     * @returns {boolean} Returns `true` if a value is found in local storage, otherwise `false`.
     */
    isLoggedIn(): boolean {
        // This is not a secure way to check if a user is logged in.
        // Routes are protected on the server side, this is only for visual elements.
        return this.getLocalStorage() !== "";
    }
}
